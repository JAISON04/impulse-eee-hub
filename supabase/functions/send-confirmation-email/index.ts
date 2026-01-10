mport { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  name: string;
  email: string;
  event: string;
  college: string;
  year: string;
  amount: number;
  transactionId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, event, college, year, amount, transactionId }: ConfirmationEmailRequest = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #ff00ff); padding: 15px 30px; border-radius: 50px;">
              <h1 style="margin: 0; color: #0a0a0f; font-size: 28px; font-weight: bold;">⚡ IMPULSE 2025</h1>
            </div>
            <p style="color: #888; margin-top: 15px; font-size: 14px;">EEE Department Symposium</p>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 0, 255, 0.1)); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #00d4ff; margin: 0 0 15px 0; font-size: 24px;">🎉 Registration Successful!</h2>
            <p style="color: #e0e0e0; margin: 0; line-height: 1.6;">
              Dear <strong style="color: #00d4ff;">${name}</strong>,<br><br>
              Your registration for <strong style="color: #ff00ff;">${event}</strong> has been confirmed. We're excited to have you join us!
            </p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #00d4ff; margin: 0 0 20px 0; font-size: 18px;">📋 Registration Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Event</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold;">${event}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Name</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">College</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${college}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Year</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${year}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.1);">Amount Paid</td>
                <td style="padding: 12px 0; color: #00ff88; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888;">Transaction ID</td>
                <td style="padding: 12px 0; color: #e0e0e0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 212, 255, 0.1)); border: 1px solid rgba(255, 0, 255, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: center;">
            <h3 style="color: #ff00ff; margin: 0 0 10px 0;">📅 February 6, 2025</h3>
            <p style="color: #e0e0e0; margin: 0;">Department of Electrical and Electronics Engineering</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #666; font-size: 12px; margin: 0;">
              For any queries, contact us at impulse2025@eee.edu<br><br>
              © 2025 IMPULSE - EEE Department Symposium
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IMPULSE 2025 <impulse2025@resend.dev>",
        to: [email],
        subject: `Registration Confirmed - ${event} | IMPULSE 2025`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    console.log("Confirmation email sent:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
