
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailLog {
  id: string;
  recipient_email: string;
  email_type: string;
  status: string;
  error_message?: string;
  booking_id?: string;
  created_at: string;
}

export const EmailActivityMonitor = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmailLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading email logs:', error);
        toast.error('Chyba pri načítavaní email logov');
        return;
      }

      setEmailLogs(data || []);
    } catch (error) {
      console.error('Error loading email logs:', error);
      toast.error('Chyba pri načítavaní email logov');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmailLogs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Odoslaný</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Neúspešný</Badge>;
      case 'pending':
        return <Badge variant="secondary">Čaká</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEmailTypeLabel = (type: string) => {
    switch (type) {
      case 'booking_confirmation':
        return 'Potvrdenie rezervácie';
      case 'admin_notification':
        return 'Admin notifikácia';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <CardTitle>Sledovanie emailov</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadEmailLogs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Obnoviť
          </Button>
        </div>
        <CardDescription>
          História odoslaných emailov cez Resend
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Načítavam email logy...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dátum</TableHead>
                  <TableHead>Príjemca</TableHead>
                  <TableHead>Typ emailu</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead>Rezervácia ID</TableHead>
                  <TableHead>Chyba</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.created_at).toLocaleString('sk-SK')}
                    </TableCell>
                    <TableCell>{log.recipient_email}</TableCell>
                    <TableCell>{getEmailTypeLabel(log.email_type)}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      {log.booking_id ? (
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {log.booking_id.slice(0, 8)}...
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {log.error_message ? (
                        <span className="text-red-600 text-xs" title={log.error_message}>
                          {log.error_message.length > 50 
                            ? `${log.error_message.substring(0, 50)}...` 
                            : log.error_message
                          }
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {emailLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      Žiadne email logy
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
