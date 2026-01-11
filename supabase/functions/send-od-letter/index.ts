import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ODLetterRequest {
  name: string;
  email: string;
  college: string;
  year: string;
  event: string;
  eventDate: string;
}

const generateODLetterHTML = (data: ODLetterRequest): string => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `
    <div style="font-family: 'Times New Roman', Times, serif; font-size: 14px; line-height: 1.6; color: #000; background: #fff; padding: 40px; max-width: 700px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 24px; margin: 0; color: #1a365d;">DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING</h1>
        <h2 style="font-size: 18px; margin: 5px 0; font-weight: normal;">IMPULSE 2026 - National Level Technical Symposium</h2>
        <p style="margin: 5px 0; font-size: 12px;">February 6, 2026</p>
      </div>
      
      <div style="text-align: right; margin-bottom: 30px;">
        <p style="margin: 5px 0;">Date: ${currentDate}</p>
        <p style="margin: 5px 0;">Ref: IMPULSE/OD/${Date.now().toString().slice(-6)}</p>
      </div>
      
      <p><strong>To,</strong></p>
      <p style="margin-bottom: 20px;">The Principal / Head of the Department,<br>${data.college}</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-weight: bold; text-decoration: underline; margin: 0;">Subject: On-Duty Letter for Participation in IMPULSE 2026</p>
      </div>
      
      <div style="text-align: justify;">
        <p>Respected Sir/Madam,</p>
        
        <p style="text-indent: 50px;">This is to certify that the following student from your esteemed institution has registered and participated in <strong>IMPULSE 2026</strong>, a National Level Technical Symposium organized by the Department of Electrical and Electronics Engineering on <strong>${data.eventDate}</strong>.</p>
        
        <div style="margin: 20px 0 20px 50px;">
          <p style="margin: 5px 0;"><strong>Student Details:</strong></p>
          <p style="margin: 5px 0;">Name: ${data.name}</p>
          <p style="margin: 5px 0;">Year of Study: ${data.year}</p>
          <p style="margin: 5px 0;">Event Participated: ${data.event}</p>
          <p style="margin: 5px 0;">College: ${data.college}</p>
        </div>
        
        <p style="text-indent: 50px;">We kindly request you to grant the necessary On-Duty permission to the above-mentioned student for attending this symposium. The student's participation and presence has been verified and confirmed.</p>
        
        <p style="text-indent: 50px;">We appreciate your cooperation and support in encouraging students to participate in such technical events that enhance their knowledge and skills.</p>
        
        <p>Thanking you,</p>
      </div>
      
      <div style="margin-top: 60px; text-align: right;">
        <p style="margin: 5px 0;">Yours faithfully,</p>
        <br><br>
        <p style="margin: 5px 0;"><strong>Event Coordinator</strong></p>
        <p style="margin: 5px 0;">IMPULSE 2026</p>
        <p style="margin: 5px 0;">Department of EEE</p>
      </div>
      
      <div style="margin-top: 30px;">
        <p style="font-style: italic; font-size: 12px;">(This is a computer-generated letter and is valid without signature)</p>
      </div>
    </div>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    const data: ODLetterRequest = await req.json();
    const odLetterHTML = generateODLetterHTML(data);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 700px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00d4ff; margin: 0;">⚡ IMPULSE 2026</h1>
            <p style="color: #888;">On-Duty Letter</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 20px;">
            <p style="color: #e0e0e0; margin: 0 0 15px 0;">Dear ${data.name},</p>
            <p style="color: #e0e0e0; margin: 0 0 15px 0;">
              Please find your On-Duty (OD) letter below for your participation in <strong style="color: #00d4ff;">${data.event}</strong> at IMPULSE 2026.
            </p>
            <p style="color: #888; margin: 0; font-size: 14px;">
              You can print this email and submit it to your college administration for OD approval.
            </p>
          </div>
          
          <div style="background: #fff; border-radius: 8px; overflow: hidden;">
            ${odLetterHTML}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 12px;">
              © 2026 IMPULSE - EEE Department Symposium
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Sending OD letter to:", data.email);

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "IMPULSE 2026", email: "jaisonbinufrankj.eee2023@citchennai.net" },
        to: [{ email: data.email, name: data.name }],
        subject: `OD Letter - ${data.event} | IMPULSE 2026`,
        htmlContent: emailHtml,
      }),
    });

    const responseData = await res.json();
    console.log("Brevo API response:", JSON.stringify(responseData));

    if (!res.ok) {
      console.error("Brevo API error:", responseData);
      throw new Error(responseData.message || `Brevo API error: ${res.status}`);
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending OD letter email:", error);
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
