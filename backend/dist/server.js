"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const marked_1 = require("marked");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Serve static files from the React app
exports.app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Set default content and template paths
exports.app.locals.contentDir = path_1.default.join(__dirname, "content");
exports.app.locals.templatePath = path_1.default.join(__dirname, "template.html");
// Configure marked to use synchronous rendering
marked_1.marked.setOptions({ async: false });
// Helper function to recursively find all routes with index.md
function getRoutes(dir, basePath = "") {
    let routes = [];
    const entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const subdir = path_1.default.join(dir, entry.name);
            const indexPath = path_1.default.join(subdir, "index.md");
            const routePath = basePath ? `${basePath}/${entry.name}` : entry.name;
            if (fs_1.default.existsSync(indexPath)) {
                routes.push(routePath);
            }
            // Recurse into subdirectories
            routes = routes.concat(getRoutes(subdir, routePath));
        }
    }
    return routes;
}
exports.app.get("/navigation", (req, res) => {
    try {
        const routes = getRoutes(exports.app.locals.contentDir);
        res.json(routes);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to read navigation" });
    }
});
// Middleware to handle markdown content
exports.app.get("*", (req, res) => {
    try {
        const requestedPath = req.path === "/" ? "" : req.path;
        const contentPath = path_1.default.join(exports.app.locals.contentDir, requestedPath, "index.md");
        // Check if the markdown file exists
        if (fs_1.default.existsSync(contentPath)) {
            const markdownContent = fs_1.default.readFileSync(contentPath, "utf-8");
            const htmlContent = marked_1.marked.parse(markdownContent);
            let template;
            try {
                template = fs_1.default.readFileSync(exports.app.locals.templatePath, "utf-8");
            }
            catch (error) {
                res.status(500).send("Internal Server Error: Template file not found");
                return;
            }
            const finalHtml = template.replace("{{content}}", htmlContent);
            res.status(200).send(finalHtml);
        }
        else {
            // Check if it's a directory that might contain an index.md
            const dirPath = path_1.default.join(exports.app.locals.contentDir, requestedPath);
            if (fs_1.default.existsSync(dirPath) && fs_1.default.statSync(dirPath).isDirectory()) {
                const indexPath = path_1.default.join(dirPath, "index.md");
                if (fs_1.default.existsSync(indexPath)) {
                    const markdownContent = fs_1.default.readFileSync(indexPath, "utf-8");
                    const htmlContent = marked_1.marked.parse(markdownContent);
                    let template;
                    try {
                        template = fs_1.default.readFileSync(exports.app.locals.templatePath, "utf-8");
                    }
                    catch (error) {
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
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
// Only start listening if not in test environment
if (process.env.NODE_ENV !== "test") {
    exports.app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
