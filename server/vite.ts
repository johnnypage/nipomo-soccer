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

      const origin = `${req.protocol}://${req.get("host")}`;
      const ogImage = `https://nipomosc.org/og-hero.jpg`;

      const pageOg: Record<string, { title: string; description: string; type?: string }> = {
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
      if (matched) {
        const [, meta] = matched;
        const ogTags = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${origin}${url}" />
    <meta property="og:type" content="${meta.type || "website"}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${ogImage}" />`;
        template = template.replace("</head>", `${ogTags}\n  </head>`);
        template = template.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
      } else {
        template = template.replace(
          /content="\/og-hero\.jpg"/g,
          `content="${ogImage}"`
        );
        template = template.replace("</head>", `    <meta property="og:url" content="${origin}${url}" />\n  </head>`);
      }

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
