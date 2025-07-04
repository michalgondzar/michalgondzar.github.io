
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Settings, Send, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmailTemplate {
  subject: string;
  content: string;
}

interface EmailSettings {
  senderEmail: string;
  senderName: string;
  adminEmail: string;
  adminNotificationsEnabled: boolean;
  confirmationTemplate: EmailTemplate;
  adminNotificationTemplate: EmailTemplate;
}

const EmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings>({
    senderEmail: "onboarding@resend.dev",
    senderName: "Apartmán Tília",
    adminEmail: "",
    adminNotificationsEnabled: true,
    confirmationTemplate: {
      subject: "Potvrdenie rezervácie - Apartmán Tília",
      content: `Dobrý den {name},

ďakujeme Vám za rezerváciu v našom apartmáne Tília.

Vaša rezervácia bola úspešne prijatá s nasledovnými údajmi:
- Dátum príchodu: {dateFrom}
- Dátum odchodu: {dateTo}
- Počet hostí: {guests}
- Typ pobytu: {stayType}

V prípade akýchkoľvek otázok nás neváhajte kontaktovať.

Tešíme sa na Vašu návštevu!`
    },
    adminNotificationTemplate: {
      subject: "Nová rezervácia - Apartmán Tília",
      content: `Nová rezervácia bola vytvorená:

Údaje hosťa:
- Meno: {name}
- Email: {email}

Údaje rezervácie:
- Dátum príchodu: {dateFrom}
- Dátum odchodu: {dateTo}
- Počet hostí: {guests}
- Typ pobytu: {stayType}
{coupon}

Prosím potvrďte rezerváciu v admin paneli.`
    }
  });

  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('emailSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
      // Continue with default settings if localStorage is corrupted
    }
  }, []);

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('emailSettings', JSON.stringify(settings));
      toast.success("Emailové nastavenia boli uložené");
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error("Chyba pri ukladaní nastavení");
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error("Zadajte email adresu pre test");
      return;
    }

    setIsLoading(true);
    try {
      const testBookingData = {
        name: "Test Užívateľ",
        email: testEmail,
        dateFrom: "2024-07-01",
        dateTo: "2024-07-05",
        guests: 2,
        stayType: "Manželský pobyt"
      };

      console.log('Sending test email...', { testBookingData, settings });

      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          bookingData: testBookingData,
          emailTemplate: settings.confirmationTemplate,
          senderEmail: settings.senderEmail
        }
      });

      if (error) {
        console.error('Test email error:', error);
        throw error;
      }

      console.log('Test email sent successfully:', data);
      toast.success("Testovací email bol odoslaný");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Chyba pri odosielaní testovacieho emailu: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (field: keyof EmailSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (template: 'confirmationTemplate' | 'adminNotificationTemplate', field: keyof EmailTemplate, value: string) => {
    setSettings(prev => ({
      ...prev,
      [template]: {
        ...prev[template],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Emailové nastavenia
          </CardTitle>
          <CardDescription>
            Nastavte emailové šablóny a odosielateľa pre automatické potvrdenia rezervácií
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sender" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sender">Odosielateľ</TabsTrigger>
              <TabsTrigger value="admin">Admin notifikácie</TabsTrigger>
              <TabsTrigger value="template">Šablóna</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
            </TabsList>

            <TabsContent value="sender" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senderEmail">Email odosielateľa</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={settings.senderEmail}
                    onChange={(e) => handleSettingsChange('senderEmail', e.target.value)}
                    placeholder="onboarding@resend.dev"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Použite onboarding@resend.dev alebo vlastnú validovanú doménu
                  </p>
                </div>
                <div>
                  <Label htmlFor="senderName">Meno odosielateľa</Label>
                  <Input
                    id="senderName"
                    value={settings.senderName}
                    onChange={(e) => handleSettingsChange('senderName', e.target.value)}
                    placeholder="Apartmán Tília"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Admin notifikácie</h3>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="adminNotificationsEnabled"
                  checked={settings.adminNotificationsEnabled}
                  onChange={(e) => handleSettingsChange('adminNotificationsEnabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="adminNotificationsEnabled">Povoliť admin notifikácie</Label>
              </div>

              <div>
                <Label htmlFor="adminEmail">Admin email adresa</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleSettingsChange('adminEmail', e.target.value)}
                  placeholder="admin@vasadomena.sk"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Na túto adresu budú chodiť notifikácie o nových rezerváciách
                </p>
              </div>

              <div>
                <Label htmlFor="adminSubject">Predmet admin notifikácie</Label>
                <Input
                  id="adminSubject"
                  value={settings.adminNotificationTemplate.subject}
                  onChange={(e) => handleTemplateChange('adminNotificationTemplate', 'subject', e.target.value)}
                  placeholder="Nová rezervácia"
                />
              </div>

              <div>
                <Label htmlFor="adminContent">Obsah admin notifikácie</Label>
                <Textarea
                  id="adminContent"
                  rows={8}
                  value={settings.adminNotificationTemplate.content}
                  onChange={(e) => handleTemplateChange('adminNotificationTemplate', 'content', e.target.value)}
                  placeholder="Obsah notifikácie pre admina..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Môžete použiť premenné: {"{name}"}, {"{email}"}, {"{dateFrom}"}, {"{dateTo}"}, {"{guests}"}, {"{stayType}"}, {"{coupon}"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="template" className="space-y-4">
              <div>
                <Label htmlFor="subject">Predmet emailu</Label>
                <Input
                  id="subject"
                  value={settings.confirmationTemplate.subject}
                  onChange={(e) => handleTemplateChange('confirmationTemplate', 'subject', e.target.value)}
                  placeholder="Potvrdenie rezervácie"
                />
              </div>
              <div>
                <Label htmlFor="content">Obsah emailu</Label>
                <Textarea
                  id="content"
                  rows={12}
                  value={settings.confirmationTemplate.content}
                  onChange={(e) => handleTemplateChange('confirmationTemplate', 'content', e.target.value)}
                  placeholder="Obsah potvrdzovacieho emailu..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Môžete použiť nasledovné premenné: {"{name}"}, {"{dateFrom}"}, {"{dateTo}"}, {"{guests}"}, {"{stayType}"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Testovací email</Label>
                <div className="flex gap-2">
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                  <Button onClick={handleSendTestEmail} disabled={isLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "Odosielam..." : "Odoslať test"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Odošle testovací email s ukážkovými údajmi rezervácie
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Uložiť nastavenia
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettings;
