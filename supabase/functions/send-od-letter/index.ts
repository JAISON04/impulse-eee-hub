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
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `
<div style="font-family: 'Times New Roman', Times, serif; font-size:14px; line-height:1.6; color:#000; background:#fff; padding:40px; max-width:700px; margin:0 auto;">
  <div style="text-align:center; border-bottom:3px double #000; padding-bottom:20px; margin-bottom:30px;">
    <h1 style="font-size:24px; margin:0; color:#1a365d;">DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING</h1>
    <h2 style="font-size:18px; margin:5px 0; font-weight:normal;">IMPULSE 2025 - National Level Technical Symposium</h2>
    <p style="margin:5px 0; font-size:12px;">February 6, 2025</p>
  </div>

  <div style="text-align:right; margin-bottom:30px;">
    <p>Date: ${currentDate}</p>
    <p>Ref: IMPULSE/OD/${Date.now().toString().slice(-6)}</p>
  </div>

  <p><strong>To,</strong></p>
  <p>The Principal / Head of the Department,<br>${data.college}</p>

  <p style="text-align:center; font-weight:bold; text-decoration:underline; margin:30px 0;">
    Subject: On-Duty Letter for Participation in IMPULSE 2025
  </p>

  <p>Respected Sir/Madam,</p>

  <p style="text-indent:50px;">
    This is to certify that <strong>${data.name}</strong>, studying <strong>${data.year}</strong>,
    has participated in <strong>${data.event}</strong> during <strong>IMPULSE 2025</strong>,
    conducted on <strong>${data.eventDate}</strong>.
  </p>

  <div style="margin-left:50px;">
    <p>Name: ${data.name}</p>
    <p>Year: ${data.year}</p>
    <p>Event: ${data.event}</p>
    <p>College: ${data.college}</p>
  </div>

  <p style="text-indent:50px;">
    We kindly request you to grant On-Duty permission for the above student.
  </p>

  <p>Thanking you,</p>

  <div style="text-align:right; margin-top:60px;">
    <p>Yours faithfully,</p>
    <p><strong>Event Coordinator</strong></p>
    <p>IMPULSE 2025</p>
    <p>Department of EEE</p>
  </div>

  <p style="font-size:12px; font-style:italic;">
    (This is a computer-generated letter and does not require a signature)
  </p>
</div>
`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ODLetterRequest = await req.json();
    const odLetterHTML = generateODLetterHTML(data);

    const emailHtml = `
<!DOCTYPE html>
<html>
<body style="background:#0a0a0f; font-family:Segoe UI,Tahoma,Verdana,sans-serif; padding:30px;">
  <div style="max-width:700px; margin:auto;">
    <h2 style="color:#00d4ff;">⚡ IMPULSE 2025 – On Duty Letter</h2>
    <p style="color:#e0e0e0;">
      Dear ${data.name},<br><br>
      Please find your OD letter below. You may print and submit it to your college.
    </p>
    <div style="background:#fff; border-radius:8px; padding:10px;">
      ${odLetterHTML}
    </div>
    <p style="text-align:center; color:#666; font-size:12px; margin-top:20px;">
      © 2025 IMPULSE – EEE Department Symposium
    </p>
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
            email: data.email,
            name: data.name,
          },
        ],
        subject: `OD Letter – ${data.event} | IMPULSE 2025`,
        htmlContent: emailHtml,
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to send OD letter");
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
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
