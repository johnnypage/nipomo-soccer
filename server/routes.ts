import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_DC = MAILCHIMP_API_KEY?.split("-")[1] || "us1";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, program, message } = req.body;

      if (!name || !email || !phone || !program || !message) {
        return res.status(400).json({ error: "All fields are required" });
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

  app.post("/api/subscribe", async (req, res) => {
    try {
      if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
        console.error("Mailchimp configuration missing: API_KEY or AUDIENCE_ID not set");
        return res.status(500).json({ error: "Email subscription is not configured" });
      }

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const url = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.title === "Member Exists") {
          return res.status(400).json({ error: "You're already subscribed!" });
        }
        if (response.status === 400 || response.status === 422) {
          return res.status(400).json({ error: data.detail || "Invalid email address" });
        }
        console.error("Mailchimp API error:", data);
        return res.status(500).json({ error: "Failed to subscribe. Please try again later." });
      }

      res.json({ success: true, message: "Successfully subscribed!" });
    } catch (error: any) {
      console.error("Mailchimp error:", error);
      res.status(500).json({ error: "Failed to subscribe. Please try again later." });
    }
  });

  return httpServer;
}
