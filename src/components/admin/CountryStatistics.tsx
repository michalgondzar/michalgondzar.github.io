
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Users } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CountryStats {
  country: string;
  visits: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export const CountryStatistics = () => {
  const [countryStats, setCountryStats] = useState<CountryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountryStatistics = async () => {
      try {
        // Získanie štatistík krajín
        const { data: visits, error } = await supabase
          .from('page_visits')
          .select('country')
          .not('country', 'is', null);

        if (error) {
          console.error('Error fetching country statistics:', error);
          return;
        }

        // Spočítanie návštev podľa krajín
        const countryCount: { [key: string]: number } = {};
        visits?.forEach((visit) => {
          if (visit.country) {
            countryCount[visit.country] = (countryCount[visit.country] || 0) + 1;
          }
        });

        // Konverzia na pole a zoradenie
        const totalVisits = Object.values(countryCount).reduce((sum, count) => sum + count, 0);
        const stats = Object.entries(countryCount)
          .map(([country, visits]) => ({
            country,
            visits,
            percentage: Math.round((visits / totalVisits) * 100)
          }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 10); // Top 10 krajín

        setCountryStats(stats);
      } catch (error) {
        console.error('Error fetching country statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryStatistics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartConfig = {
    visits: {
      label: "Návštevy",
      color: "#2563eb",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Štatistiky krajín</h3>
        <p className="text-gray-600">Top 10 krajín podľa počtu návštev</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Návštevy podľa krajín
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryStats}>
                  <XAxis 
                    dataKey="country" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visits" fill="var(--color-visits)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Rozdelenie návštev
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryStats.slice(0, 7)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ country, percentage }) => `${country} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="visits"
                  >
                    {countryStats.slice(0, 7).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">{data.country}</p>
                            <p className="text-sm text-gray-600">
                              {data.visits} návštev ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabuľka krajín */}
      <Card>
        <CardHeader>
          <CardTitle>Detailný prehľad krajín</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {countryStats.map((stat, index) => (
              <div key={stat.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{stat.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{stat.percentage}%</span>
                  <span className="font-bold text-blue-600">{stat.visits}</span>
                </div>
              </div>
            ))}
            {countryStats.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Zatiaľ nie sú dostupné údaje o krajinách
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
