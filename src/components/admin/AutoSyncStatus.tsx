
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

const AutoSyncStatus = () => {
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    // Load last sync time from localStorage
    const saved = localStorage.getItem('lastAutoSync');
    if (saved) {
      setLastSync(saved);
    }
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Automatická synchronizácia
        </CardTitle>
        <CardDescription>
          Kalendár sa automaticky synchronizuje každý deň o 23:00
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Aktívna
            </Badge>
            <span className="text-sm text-gray-600">Denne o 23:00</span>
          </div>
          
          {lastSync && (
            <div className="text-sm text-gray-500">
              Posledná sync: {new Date(lastSync).toLocaleDateString('sk-SK')} {new Date(lastSync).toLocaleTimeString('sk-SK')}
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Automatická synchronizácia používa rovnaký iCal URL ako manuálna synchronizácia.
            Ak chcete zmeniť URL, použite manuálnu synchronizáciu nižšie.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoSyncStatus;
