import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Hashed assets (/assets/*) are content-addressed -- safe to cache for 1 year
  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
    }),
  );

  // Everything else (favicon, og image, fonts in /public root, etc.) -- moderate cache
  // index: false prevents express.static from auto-serving index.html for "/"
  // so our catch-all below can set proper no-store headers on it
  app.use(express.static(distPath, { maxAge: "1h", index: false }));

  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    const url = req.originalUrl;
    const origin = `${req.protocol}://${req.get("host")}`;
    const ogImage = `https://nipomosc.org/og-share.jpg`;

    const pageOg: Record<string, { title: string; description: string; type?: string; image?: string }> = {
      "/fall": {
        title: "Fall Soccer Registration Is Open | Nipomo Soccer",
        description: "Recreational soccer for ages 2 through high school. Saturday games in Nipomo, paid referees, balanced teams, and a season that runs August through November. Register today.",
        image: "https://nipomosc.org/og-fall.jpg",
      },
      "/futbol": {
        title: "Inscripci\u00f3n Abierta: F\u00fatbol de Oto\u00f1o | Nipomo Soccer",
        description: "F\u00fatbol recreativo para ni\u00f1os de 2 a\u00f1os hasta high school. Partidos los s\u00e1bados en Nipomo, \u00e1rbitros pagados y una temporada de agosto a noviembre. Inscr\u00edbete hoy.",
        image: "https://nipomosc.org/og-futbol.jpg",
      },
      "/about/compare": {
        title: "Nipomo SC vs. AYSO -- What's the Difference? | Nipomo Soccer",
        description: "The same people who ran AYSO Nipomo built something better. Learn why we made the switch, what's different, and what it means for your family.",
        type: "article",
      },
      "/rise": {
        title: "RISE Spring Development League | Nipomo Soccer",
        description: "A 6-week spring program for grades 1-8. Build confidence, sharpen technical skills, and get meaningful touches on the ball. Tuesdays and Thursdays starting April 13.",
      },
      "/reign": {
        title: "REIGN Competitive Program | Nipomo Soccer",
        description: "The competitive program of Nipomo Soccer. A complete pathway for skilled and committed young athletes to pursue advanced soccer without leaving town.",
      },
    };

    const matched = Object.entries(pageOg).find(([p]) => url.startsWith(p));
    let html = fs.readFileSync(indexPath, "utf-8");

    if (matched) {
      const [, meta] = matched;
      // Strip the static OG/twitter/description tags from index.html so
      // crawlers see exactly one set (duplicates make iMessage stack images
      // and Facebook pick the wrong title).
      html = html.replace(
        /^\s*<meta (?:property="og:|name="twitter:|name="description")[^>]*\/>\r?\n/gm,
        "",
      );
      const ogTags = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.image || ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${origin}${url}" />
    <meta property="og:type" content="${meta.type || "website"}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image || ogImage}" />`;
      html = html.replace("</head>", `${ogTags}\n  </head>`);
      html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
    } else {
      html = html.replace(/content="https:\/\/nipomosc\.org\/og-(?:hero|share)\.jpg"/g, `content="${ogImage}"`);
      html = html.replace("</head>", `    <meta property="og:url" content="${origin}${url}" />\n  </head>`);
    }

    res
      .status(200)
      .set({
        "Content-Type": "text/html",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      })
      .end(html);
  });
}
