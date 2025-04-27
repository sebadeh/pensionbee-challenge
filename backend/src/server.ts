import express from "express";
import { marked } from "marked";
import path from "path";
import fs from "fs";

export const app = express();
const PORT = process.env.PORT || 3001;

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
app.get("*", (req, res) => {
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
      // If no content found, return 404
      res.status(404).send("Page not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Only start listening if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
