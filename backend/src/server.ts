import express, { Request, Response, NextFunction } from "express";
import { marked } from "marked";
import path from "path";
import fs from "fs";
import cors from "cors";

export const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
const allowedOrigins = [
  "https://pensionbee-challenge.vercel.app",
  "http://localhost:5173", // Vite's default port
  "http://localhost:3000", // Common React port
];

app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Set default content and template paths
app.locals.contentDir = path.join(__dirname, "content");
app.locals.templatePath = path.join(__dirname, "template.html");

// Configure marked to use synchronous rendering
marked.setOptions({ async: false });

// Helper function to recursively find all routes with index.md
function getRoutes(dir: string, basePath = ""): string[] {
  let routes: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subdir = path.join(dir, entry.name);
      const indexPath = path.join(subdir, "index.md");
      const routePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      if (fs.existsSync(indexPath)) {
        routes.push(routePath);
      }
      // Recurse into subdirectories
      routes = routes.concat(getRoutes(subdir, routePath));
    }
  }
  return routes;
}

app.get("/navigation", (req, res) => {
  try {
    const routes = getRoutes(app.locals.contentDir);
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: "Failed to read navigation" });
  }
});

// Middleware to handle markdown content
app.get("*", (req, res, next) => {
  try {
    const requestedPath = req.path === "/" ? "" : req.path;
    const contentPath = path.join(
      app.locals.contentDir,
      requestedPath,
      "index.md"
    );

    // Check if the markdown file exists
    if (fs.existsSync(contentPath)) {
      const markdownContent = fs.readFileSync(contentPath, "utf-8");
      const htmlContent = marked.parse(markdownContent) as string;
      let template;
      try {
        template = fs.readFileSync(app.locals.templatePath, "utf-8");
      } catch (error) {
        res.status(500).send("Internal Server Error: Template file not found");
        return;
      }
      const finalHtml = template.replace("{{content}}", htmlContent);
      res.status(200).send(finalHtml);
    } else {
      // Check if it's a directory that might contain an index.md
      const dirPath = path.join(app.locals.contentDir, requestedPath);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const indexPath = path.join(dirPath, "index.md");
        if (fs.existsSync(indexPath)) {
          const markdownContent = fs.readFileSync(indexPath, "utf-8");
          const htmlContent = marked.parse(markdownContent) as string;
          let template;
          try {
            template = fs.readFileSync(app.locals.templatePath, "utf-8");
          } catch (error) {
            res
              .status(500)
              .send("Internal Server Error: Template file not found");
            return;
          }
          const finalHtml = template.replace("{{content}}", htmlContent);
          res.status(200).send(finalHtml);
          return;
        }
      }
      // If no markdown content found, pass to next middleware
      next();
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../public")));

// Catch-all: return 404 for any remaining requests
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Only start listening if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
