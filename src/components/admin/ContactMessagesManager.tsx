
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Clock, User, MessageSquare, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

export const ContactMessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading contact messages:', error);
        toast.error("Chyba pri načítavaní správ");
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error loading contact messages:', error);
      toast.error("Chyba pri načítavaní správ");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking message as read:', error);
        toast.error("Chyba pri označovaní správy ako prečítanej");
      } else {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        ));
        toast.success("Správa označená ako prečítaná");
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error("Chyba pri označovaní správy ako prečítanej");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('sk-SK', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const unreadCount = messages.filter(msg => !msg.read).length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="text-gray-500">Načítavam správy...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Kontaktné správy
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} nových
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Zatiaľ nemáte žiadne kontaktné správy.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stav</TableHead>
                    <TableHead>Odosielateľ</TableHead>
                    <TableHead>Predmet</TableHead>
                    <TableHead>Dátum</TableHead>
                    <TableHead>Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow 
                      key={message.id}
                      className={!message.read ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        {message.read ? (
                          <Badge variant="secondary">Prečítané</Badge>
                        ) : (
                          <Badge variant="destructive">Nové</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {message.subject}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(message.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              console.log('Button clicked, message:', message);
                              setSelectedMessage(message);
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
                          >
                            Zobraziť
                          </Button>
                          {!message.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(message.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail správy */}
      {selectedMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Detail správy</span>
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
              >
                Zavrieť
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Meno:</span>
                <span>{selectedMessage.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="text-booking-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Predmet:</span>
                <span>{selectedMessage.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Dátum:</span>
                <span>{formatDate(selectedMessage.created_at)}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Správa:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <div>
                {selectedMessage.read ? (
                  <Badge variant="secondary">Prečítané</Badge>
                ) : (
                  <Badge variant="destructive">Nové</Badge>
                )}
              </div>
              {!selectedMessage.read && (
                <Button
                  onClick={() => markAsRead(selectedMessage.id)}
                  className="bg-booking-primary hover:bg-booking-secondary"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Označiť ako prečítané
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
