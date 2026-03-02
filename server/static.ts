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

  app.use(express.static(distPath));

  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    const url = req.originalUrl;

    if (url.startsWith("/about/compare")) {
      let html = fs.readFileSync(indexPath, "utf-8");
      const ogTags = `
    <title>Nipomo SC vs. AYSO — What's the Difference? | Nipomo Soccer Club</title>
    <meta name="description" content="The same people who ran AYSO Nipomo built something better. Learn why we made the switch, what's different, and what it means for your family." />
    <meta property="og:title" content="Nipomo SC vs. AYSO — What's the Difference? | Nipomo Soccer Club" />
    <meta property="og:description" content="The same people who ran AYSO Nipomo built something better. Learn why we made the switch, what's different, and what it means for your family." />
    <meta property="og:image" content="${req.protocol}://${req.get("host")}/nsc-logo-og.png" />
    <meta property="og:url" content="${req.protocol}://${req.get("host")}${url}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Nipomo SC vs. AYSO — What's the Difference? | Nipomo Soccer Club" />
    <meta name="twitter:description" content="The same people who ran AYSO Nipomo built something better. Learn why we made the switch, what's different, and what it means for your family." />
    <meta name="twitter:image" content="${req.protocol}://${req.get("host")}/nsc-logo-og.png" />`;
      html = html.replace("</head>", `${ogTags}\n  </head>`);
      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>Nipomo SC vs. AYSO — What's the Difference? | Nipomo Soccer Club</title>`
      );
      return res.status(200).set({ "Content-Type": "text/html" }).end(html);
    }

    res.sendFile(indexPath);
  });
}
