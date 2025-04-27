"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const marked_1 = require("marked");
const server_1 = require("../server");
// Set test environment
process.env.NODE_ENV = "test";
// Create a temporary test content directory
const TEST_CONTENT_DIR = path_1.default.join(__dirname, "test-content");
const TEST_TEMPLATE_PATH = path_1.default.join(__dirname, "test-template.html");
// Override the content directory path for testing
server_1.app.locals.contentDir = TEST_CONTENT_DIR;
server_1.app.locals.templatePath = TEST_TEMPLATE_PATH;
// Setup test content before all tests
beforeAll(() => {
    // Create test content directory
    if (!fs_1.default.existsSync(TEST_CONTENT_DIR)) {
        fs_1.default.mkdirSync(TEST_CONTENT_DIR);
    }
    // Create a test template
    const template = "<html><body>{{content}}</body></html>";
    fs_1.default.writeFileSync(TEST_TEMPLATE_PATH, template);
    // Create test content
    const validContent = "# Test Content\nThis is a test page.";
    const validDir = path_1.default.join(TEST_CONTENT_DIR, "valid-page");
    fs_1.default.mkdirSync(validDir);
    fs_1.default.writeFileSync(path_1.default.join(validDir, "index.md"), validContent);
    // Create nested content
    const nestedContent = "# Nested Content\nThis is a nested page.";
    const nestedDir = path_1.default.join(TEST_CONTENT_DIR, "valid-page", "nested");
    fs_1.default.mkdirSync(nestedDir);
    fs_1.default.writeFileSync(path_1.default.join(nestedDir, "index.md"), nestedContent);
    // Create root content
    const rootContent = "# Root Content\nThis is the root page.";
    fs_1.default.writeFileSync(path_1.default.join(TEST_CONTENT_DIR, "index.md"), rootContent);
});
// Cleanup after all tests
afterAll(() => {
    // Remove test content directory
    if (fs_1.default.existsSync(TEST_CONTENT_DIR)) {
        fs_1.default.rmSync(TEST_CONTENT_DIR, { recursive: true });
    }
    // Remove test template
    if (fs_1.default.existsSync(TEST_TEMPLATE_PATH)) {
        fs_1.default.unlinkSync(TEST_TEMPLATE_PATH);
    }
});
describe("Server Tests", () => {
    test("valid URL returns 200 status code", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/valid-page");
        expect(response.status).toBe(200);
    });
    test("valid URL returns HTML with markdown content", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/valid-page");
        const expectedHtml = (0, marked_1.marked)("# Test Content\nThis is a test page.");
        expect(response.text).toContain(expectedHtml);
    });
    test("invalid URL returns 404 status code", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/non-existent-page");
        expect(response.status).toBe(404);
    });
    test("root path returns 200 status code", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/");
        expect(response.status).toBe(200);
    });
    test("root path returns root content", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/");
        const expectedHtml = (0, marked_1.marked)("# Root Content\nThis is the root page.");
        expect(response.text).toContain(expectedHtml);
    });
    test("nested content path returns 200 status code", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/valid-page/nested");
        expect(response.status).toBe(200);
    });
    test("nested content path returns correct content", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/valid-page/nested");
        const expectedHtml = (0, marked_1.marked)("# Nested Content\nThis is a nested page.");
        expect(response.text).toContain(expectedHtml);
    });
    test("navigation endpoint returns valid routes", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/navigation");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining(["valid-page", "valid-page/nested"]));
    });
    test("template is correctly applied", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/valid-page");
        expect(response.text).toContain("<html>");
        expect(response.text).toContain("<body>");
        expect(response.text).toContain("</body>");
        expect(response.text).toContain("</html>");
    });
    test("error handling for invalid template", async () => {
        // Temporarily remove the template file
        const originalTemplate = fs_1.default.readFileSync(TEST_TEMPLATE_PATH);
        fs_1.default.unlinkSync(TEST_TEMPLATE_PATH);
        const response = await (0, supertest_1.default)(server_1.app).get("/valid-page");
        expect(response.status).toBe(500);
        // Restore the template file
        fs_1.default.writeFileSync(TEST_TEMPLATE_PATH, originalTemplate);
    });
});
