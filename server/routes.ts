import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, program, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }

      const programLabels: Record<string, string> = {
        roots: "Roots (U4 and up)",
        rise: "Rise (U8 and up)",
        reign: "Reign (U8 and up)",
        coaching: "Coaching",
        sponsor: "Sponsorship",
        general: "General Inquiry",
      };

      const programLabel = program ? programLabels[program] || program : "Not specified";

      const msg = {
        to: "admin@nipomosc.org",
        from: "admin@nipomosc.org",
        replyTo: email,
        subject: `New Contact Form Submission - ${programLabel}`,
        text: `
New contact form submission from Nipomo Soccer Club website:

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Program Interest: ${programLabel}

Message:
${message}
        `.trim(),
        html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Phone:</strong> ${phone || "Not provided"}</p>
<p><strong>Program Interest:</strong> ${programLabel}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, "<br>")}</p>
        `.trim(),
      };

      await sgMail.send(msg);
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("SendGrid error:", error?.response?.body || error);
      
      // Check for common SendGrid errors
      const errorMessage = error?.response?.body?.errors?.[0]?.message || 
                          error?.message || 
                          "Failed to send email";
      
      res.status(500).json({ error: errorMessage });
    }
  });

  return httpServer;
}
