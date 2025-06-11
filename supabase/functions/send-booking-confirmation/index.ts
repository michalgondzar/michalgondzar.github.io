
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingData: {
    name: string;
    email: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    stayType: string;
    coupon?: string;
  };
  emailTemplate: {
    subject: string;
    content: string;
  };
  senderEmail: string;
  adminNotificationSettings?: {
    adminEmail: string;
    adminTemplate: {
      subject: string;
      content: string;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      bookingData, 
      emailTemplate, 
      senderEmail, 
      adminNotificationSettings 
    }: BookingConfirmationRequest = await req.json();

    // Replace placeholders in customer email content
    let customerEmailContent = emailTemplate.content
      .replace(/\{name\}/g, bookingData.name)
      .replace(/\{dateFrom\}/g, bookingData.dateFrom)
      .replace(/\{dateTo\}/g, bookingData.dateTo)
      .replace(/\{guests\}/g, bookingData.guests.toString())
      .replace(/\{stayType\}/g, bookingData.stayType);

    if (bookingData.coupon) {
      customerEmailContent = customerEmailContent.replace(/\{coupon\}/g, bookingData.coupon);
    }

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: senderEmail || "Apartmán Tília <onboarding@resend.dev>",
      to: [bookingData.email],
      subject: emailTemplate.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Potvrdenie rezervácie - Apartmán Tília
          </h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${customerEmailContent.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 30px; padding: 15px; background-color: #e0f2fe; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #0f172a;">Detaily rezervácie:</h3>
            <p style="margin: 5px 0;"><strong>Meno:</strong> ${bookingData.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${bookingData.email}</p>
            <p style="margin: 5px 0;"><strong>Dátum príchodu:</strong> ${bookingData.dateFrom}</p>
            <p style="margin: 5px 0;"><strong>Dátum odchodu:</strong> ${bookingData.dateTo}</p>
            <p style="margin: 5px 0;"><strong>Počet hostí:</strong> ${bookingData.guests}</p>
            <p style="margin: 5px 0;"><strong>Typ pobytu:</strong> ${bookingData.stayType}</p>
            ${bookingData.coupon ? `<p style="margin: 5px 0;"><strong>Zľavový kupón:</strong> ${bookingData.coupon}</p>` : ''}
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            S pozdravom,<br>
            Tím Apartmán Tília
          </p>
        </div>
      `,
    });

    console.log("Customer confirmation email sent successfully:", customerEmailResponse);

    let adminEmailResponse = null;

    // Send admin notification if configured
    if (adminNotificationSettings && adminNotificationSettings.adminEmail) {
      let adminEmailContent = adminNotificationSettings.adminTemplate.content
        .replace(/\{name\}/g, bookingData.name)
        .replace(/\{email\}/g, bookingData.email)
        .replace(/\{dateFrom\}/g, bookingData.dateFrom)
        .replace(/\{dateTo\}/g, bookingData.dateTo)
        .replace(/\{guests\}/g, bookingData.guests.toString())
        .replace(/\{stayType\}/g, bookingData.stayType);

      if (bookingData.coupon) {
        adminEmailContent = adminEmailContent.replace(/\{coupon\}/g, `\n- Zľavový kupón: ${bookingData.coupon}`);
      } else {
        adminEmailContent = adminEmailContent.replace(/\{coupon\}/g, '');
      }

      adminEmailResponse = await resend.emails.send({
        from: senderEmail || "Apartmán Tília <onboarding@resend.dev>",
        to: [adminNotificationSettings.adminEmail],
        subject: adminNotificationSettings.adminTemplate.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
              🔔 Nová rezervácia - Apartmán Tília
            </h2>
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              ${adminEmailContent.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Kompletné detaily:</h3>
              <p style="margin: 5px 0;"><strong>Meno hosťa:</strong> ${bookingData.name}</p>
              <p style="margin: 5px 0;"><strong>Email hosťa:</strong> ${bookingData.email}</p>
              <p style="margin: 5px 0;"><strong>Dátum príchodu:</strong> ${bookingData.dateFrom}</p>
              <p style="margin: 5px 0;"><strong>Dátum odchodu:</strong> ${bookingData.dateTo}</p>
              <p style="margin: 5px 0;"><strong>Počet hostí:</strong> ${bookingData.guests}</p>
              <p style="margin: 5px 0;"><strong>Typ pobytu:</strong> ${bookingData.stayType}</p>
              ${bookingData.coupon ? `<p style="margin: 5px 0;"><strong>Zľavový kupón:</strong> <span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${bookingData.coupon}</span></p>` : ''}
            </div>
            <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 5px;">
              <p style="margin: 0; color: #1e40af; font-weight: bold;">
                ⚡ Akcia požadovaná: Prosím potvrďte túto rezerváciu v admin paneli.
              </p>
            </div>
          </div>
        `,
      });

      console.log("Admin notification email sent successfully:", adminEmailResponse);
    }

    return new Response(JSON.stringify({ 
      customerEmail: customerEmailResponse,
      adminEmail: adminEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
