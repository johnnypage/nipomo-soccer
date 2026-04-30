import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import sgMail from "@sendgrid/mail";
import { db } from "./db";
import { contactSubmissions, tournamentInterests, coachApplications, insertTournamentInterestSchema, insertCoachApplicationSchema } from "@shared/schema";
import { registerShopRoutes } from "./shopRoutes";
import { registerCoachRoutes } from "./coachRoutes";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_DC = MAILCHIMP_API_KEY?.split("-")[1] || "us1";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerShopRoutes(app);
  registerCoachRoutes(app);

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, program, message } = req.body;

      if (!name || !email || !phone || !program || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Save to database first (this ensures we never lose a submission)
      await db.insert(contactSubmissions).values({
        name,
        email,
        phone,
        program,
        message,
      });

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

      // Try to send email, but don't fail if it doesn't work
      try {
        await sgMail.send(msg);
      } catch (emailError: any) {
        console.error("SendGrid error (submission saved to database):", emailError?.response?.body || emailError);
      }

      res.json({ success: true, message: "Message received successfully" });
    } catch (error: any) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to submit message. Please try again." });
    }
  });

  app.post("/api/tournament-interest", async (req, res) => {
    try {
      const parseResult = insertTournamentInterestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ error: "All required fields must be filled" });
      }

      const { clubName, contactName, email, phone, divisions, teamCount, notes } = parseResult.data;

      await db.insert(tournamentInterests).values({
        clubName,
        contactName,
        email,
        phone,
        divisions,
        teamCount,
        notes: notes || null,
      });

      const msg = {
        to: "admin@nipomosc.org",
        from: "admin@nipomosc.org",
        replyTo: email,
        subject: `Reign Winter Classic - Team Interest from ${clubName}`,
        text: `
New tournament interest submission for Reign Winter Classic:

Club Name: ${clubName}
Contact Name: ${contactName}
Email: ${email}
Phone: ${phone}
Divisions Interested: ${divisions}
Number of Teams: ${teamCount}
${notes ? `\nAdditional Notes:\n${notes}` : ""}
        `.trim(),
        html: `
<h2>Reign Winter Classic - Team Interest</h2>
<p><strong>Club Name:</strong> ${clubName}</p>
<p><strong>Contact Name:</strong> ${contactName}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Divisions Interested:</strong> ${divisions}</p>
<p><strong>Number of Teams:</strong> ${teamCount}</p>
${notes ? `<h3>Additional Notes:</h3><p>${notes.replace(/\n/g, "<br>")}</p>` : ""}
        `.trim(),
      };

      try {
        await sgMail.send(msg);
      } catch (emailError: any) {
        console.error("SendGrid error (submission saved to database):", emailError?.response?.body || emailError);
      }

      res.json({ success: true, message: "Team interest submitted successfully" });
    } catch (error: any) {
      console.error("Tournament interest error:", error);
      res.status(500).json({ error: "Failed to submit interest. Please try again." });
    }
  });

  app.post("/api/coach-application", async (req, res) => {
    try {
      const parseResult = insertCoachApplicationSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({ error: "Please fill in all required fields" });
      }

      const data = parseResult.data;

      await db.insert(coachApplications).values(data);

      const msg = {
        to: ["admin@nipomosc.org"],
        from: "admin@nipomosc.org",
        replyTo: data.email,
        subject: `New Coaching Application - ${data.name}`,
        text: `
New coaching application from Nipomo Soccer Club website:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
City: ${data.city || "Not provided"}

Coaching Experience: ${data.coachingExperience}
Preferred Role: ${data.coachingRole || "Not specified"}

Programs Interested: ${data.programs}
Age Groups: ${data.ageGroups}

Children in Nipomo SC: ${data.hasChildren || "Not specified"}
Children Ages: ${data.childrenAges || "N/A"}

Additional Notes:
${data.additionalNotes || "None"}

Background Check Consent: ${data.backgroundCheckConsent ? "Yes" : "No"}
Show on Coaching Board: ${data.showOnBoard ? "Yes" : "No"}
        `.trim(),
        html: `
<h2>New Coaching Application</h2>
<table style="border-collapse:collapse; width:100%; max-width:600px;">
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Name</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.name}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email</strong></td><td style="padding:8px; border-bottom:1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.phone}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>City</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.city || "Not provided"}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Coaching Experience</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.coachingExperience}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Preferred Role</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.coachingRole || "Not specified"}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Programs</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.programs}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Age Groups</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.ageGroups}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Children in NSC</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.hasChildren || "Not specified"}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Children Ages</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.childrenAges || "N/A"}</td></tr>
</table>
${data.additionalNotes ? `<h3>Additional Notes:</h3><p>${data.additionalNotes.replace(/\n/g, "<br>")}</p>` : ""}
<p><strong>Background Check Consent:</strong> ${data.backgroundCheckConsent ? "Yes" : "No"}</p>
<p><strong>Show on Coaching Board:</strong> ${data.showOnBoard ? "Yes" : "No"}</p>
        `.trim(),
      };

      try {
        await sgMail.send(msg);
      } catch (emailError: any) {
        console.error("SendGrid error (application saved to database):", emailError?.response?.body || emailError);
      }

      res.json({ success: true, message: "Application submitted successfully" });
    } catch (error: any) {
      console.error("Coach application error:", error);
      res.status(500).json({ error: "Failed to submit application. Please try again." });
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
