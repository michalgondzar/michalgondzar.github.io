
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Calendar, Globe, Users, Bot, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { CountryStatistics } from './CountryStatistics';
import { isBot, getBotType, getVisitorType } from '@/utils/botDetection';

type PageVisit = Tables<'page_visits'>;
type VisitCounter = Tables<'visit_counters'>;

interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  thisWeekVisits: number;
  thisMonthVisits: number;
  botVisits: number;
  humanVisits: number;
  adminVisits: number;
}

export const VisitStatistics = () => {
  const [visitStats, setVisitStats] = useState<VisitStats>({
    totalVisits: 0,
    todayVisits: 0,
    thisWeekVisits: 0,
    thisMonthVisits: 0,
    botVisits: 0,
    humanVisits: 0,
    adminVisits: 0
  });
  const [recentVisits, setRecentVisits] = useState<PageVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Získanie celkového počtu návštev
        const { data: counterData } = await supabase
          .from('visit_counters')
          .select('*')
          .single();

        // Výpočet dátumov
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        // Získanie návštev za posledné obdobia
        const { data: todayData } = await supabase
          .from('page_visits')
          .select('*')
          .gte('visited_at', today.toISOString());

        const { data: weekData } = await supabase
          .from('page_visits')
          .select('*')
          .gte('visited_at', weekAgo.toISOString());

        const { data: monthData } = await supabase
          .from('page_visits')
          .select('*')
          .gte('visited_at', monthAgo.toISOString());

        // Získanie posledných 50 návštev pre lepší prehľad
        const { data: recentData } = await supabase
          .from('page_visits')
          .select('*')
          .order('visited_at', { ascending: false })
          .limit(50);

        // Spočítanie admin, bot vs human návštev
        const allVisits = recentData || [];
        const adminVisitsCount = allVisits.filter(visit => visit.is_admin === true).length;
        const botVisitsCount = allVisits.filter(visit => !visit.is_admin && isBot(visit.user_agent)).length;
        const humanVisitsCount = allVisits.length - adminVisitsCount - botVisitsCount;

        setVisitStats({
          totalVisits: counterData?.total_visits || 0,
          todayVisits: todayData?.length || 0,
          thisWeekVisits: weekData?.length || 0,
          thisMonthVisits: monthData?.length || 0,
          botVisits: botVisitsCount,
          humanVisits: humanVisitsCount,
          adminVisits: adminVisitsCount
        });

        setRecentVisits(recentData || []);
      } catch (error) {
        console.error('Error fetching visit statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Štatistiky návštevnosti</h2>
        <p className="text-gray-600">Prehľad návštev vašej stránky</p>
      </div>

      {/* Karty so štatistikami */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Celkovo návštev</p>
                <p className="text-2xl font-bold">{visitStats.totalVisits.toLocaleString()}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dnes</p>
                <p className="text-2xl font-bold">{visitStats.todayVisits}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tento týždeň</p>
                <p className="text-2xl font-bold">{visitStats.thisWeekVisits}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tento mesiac</p>
                <p className="text-2xl font-bold">{visitStats.thisMonthVisits}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ľudské návštevy</p>
                <p className="text-2xl font-bold text-green-600">{visitStats.humanVisits}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin návštevy</p>
                <p className="text-2xl font-bold text-blue-600">{visitStats.adminVisits}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bot návštevy</p>
                <p className="text-2xl font-bold text-red-600">{visitStats.botVisits}</p>
              </div>
              <Bot className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taby pre rôzne typy štatistík */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Posledné návštevy</TabsTrigger>
          <TabsTrigger value="countries">Krajiny</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Posledné návštevy</CardTitle>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Ľudské návštevy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Admin návštevy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span>Bot návštevy</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dátum a čas</TableHead>
                    <TableHead>Stránka</TableHead>
                    <TableHead>Krajina</TableHead>
                    <TableHead>Typ návštevníka</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentVisits.map((visit) => {
                    const visitorType = getVisitorType(visit.user_agent, visit.is_admin || false);
                    const botType = getBotType(visit.user_agent);
                    
                    const getRowClassName = () => {
                      switch (visitorType) {
                        case 'admin': return 'bg-blue-50 hover:bg-blue-100';
                        case 'bot': return 'bg-red-50 hover:bg-red-100';
                        default: return 'bg-green-50 hover:bg-green-100';
                      }
                    };
                    
                    return (
                      <TableRow 
                        key={visit.id}
                        className={getRowClassName()}
                      >
                        <TableCell>
                          {format(new Date(visit.visited_at), 'dd.MM.yyyy HH:mm', { locale: sk })}
                        </TableCell>
                        <TableCell>{visit.page_url}</TableCell>
                        <TableCell>
                          {visit.country || 'Neznáma'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {visitorType === 'admin' ? (
                              <>
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-700 font-medium">Admin</span>
                              </>
                            ) : visitorType === 'bot' ? (
                              <>
                                <Bot className="h-4 w-4 text-red-600" />
                                <span className="text-red-700 font-medium">
                                  {botType || 'Bot'}
                                </span>
                              </>
                            ) : (
                              <>
                                <Users className="h-4 w-4 text-green-600" />
                                <span className="text-green-700 font-medium">Človek</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {visit.referrer || 'Priama návšteva'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {visit.user_agent?.substring(0, 50)}...
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="countries" className="mt-6">
          <CountryStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
