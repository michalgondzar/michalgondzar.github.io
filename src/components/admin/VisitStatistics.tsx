
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Calendar, Globe, Users } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

type PageVisit = Tables<'page_visits'>;
type VisitCounter = Tables<'visit_counters'>;

interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  thisWeekVisits: number;
  thisMonthVisits: number;
}

export const VisitStatistics = () => {
  const [visitStats, setVisitStats] = useState<VisitStats>({
    totalVisits: 0,
    todayVisits: 0,
    thisWeekVisits: 0,
    thisMonthVisits: 0
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

        // Získanie posledných 20 návštev
        const { data: recentData } = await supabase
          .from('page_visits')
          .select('*')
          .order('visited_at', { ascending: false })
          .limit(20);

        setVisitStats({
          totalVisits: counterData?.total_visits || 0,
          todayVisits: todayData?.length || 0,
          thisWeekVisits: weekData?.length || 0,
          thisMonthVisits: monthData?.length || 0
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Tabuľka posledných návštev */}
      <Card>
        <CardHeader>
          <CardTitle>Posledné návštevy</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dátum a čas</TableHead>
                <TableHead>Stránka</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>
                    {format(new Date(visit.visited_at), 'dd.MM.yyyy HH:mm', { locale: sk })}
                  </TableCell>
                  <TableCell>{visit.page_url}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {visit.referrer || 'Priama návšteva'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {visit.user_agent?.substring(0, 50)}...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
