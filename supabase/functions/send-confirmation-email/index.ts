import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

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
    const {
      name,
      email,
      event,
      college,
      year,
      amount,
      transactionId,
    }: ConfirmationEmailRequest = await req.json();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="text-align:center;margin-bottom:40px;">
<div style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#ff00ff);padding:15px 30px;border-radius:50px;">
<h1 style="margin:0;color:#0a0a0f;font-size:28px;font-weight:bold;">⚡ IMPULSE 2025</h1>
</div>
<p style="color:#888;margin-top:15px;font-size:14px;">EEE Department Symposium</p>
</div>

<div style="background:linear-gradient(135deg,rgba(0,212,255,.1),rgba(255,0,255,.1));border:1px solid rgba(0,212,255,.3);border-radius:16px;padding:30px;margin-bottom:30px;">
<h2 style="color:#00d4ff;margin:0 0 15px;font-size:24px;">🎉 Registration Successful!</h2>
<p style="color:#e0e0e0;line-height:1.6;">
Dear <strong style="color:#00d4ff;">${name}</strong>,<br><br>
Your registration for <strong style="color:#ff00ff;">${event}</strong> has been confirmed.
</p>
</div>

<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:25px;margin-bottom:30px;">
<h3 style="color:#00d4ff;margin-bottom:20px;">📋 Registration Details</h3>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="color:#888;">College</td><td style="color:#e0e0e0;text-align:right;">${college}</td></tr>
<tr><td style="color:#888;">Year</td><td style="color:#e0e0e0;text-align:right;">${year}</td></tr>
<tr><td style="color:#888;">Amount Paid</td><td style="color:#00ff88;text-align:right;">₹${amount}</td></tr>
<tr><td style="color:#888;">Transaction ID</td><td style="color:#e0e0e0;text-align:right;font-family:monospace;">${transactionId}</td></tr>
</table>
</div>

<div style="text-align:center;color:#666;font-size:12px;">
© 2025 IMPULSE – EEE Department Symposium
</div>
</div>
</body>
</html>
`;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "IMPULSE 2025",
          email: "impulse2025@gmail.com", // MUST be verified in Brevo
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        subject: `🎉 ${event} Registration Confirmed | IMPULSE 2025`,
        htmlContent: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
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
