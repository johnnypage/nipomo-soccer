import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      if (url.startsWith("/about/compare")) {
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
        template = template.replace("</head>", `${ogTags}\n  </head>`);
        template = template.replace(
          /<title>.*?<\/title>/,
          `<title>Nipomo SC vs. AYSO — What's the Difference? | Nipomo Soccer Club</title>`
        );
      }

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
