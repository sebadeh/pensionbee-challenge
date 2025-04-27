import express from "express";
import request from "supertest";
import path from "path";
import fs from "fs";
import { marked } from "marked";
import { app } from "../server";

// Set test environment
process.env.NODE_ENV = "test";

// Create a temporary test content directory
const TEST_CONTENT_DIR = path.join(__dirname, "test-content");
const TEST_TEMPLATE_PATH = path.join(__dirname, "test-template.html");

// Override the content directory path for testing
app.locals.contentDir = TEST_CONTENT_DIR;
app.locals.templatePath = TEST_TEMPLATE_PATH;

// Setup test content before all tests
beforeAll(() => {
  // Create test content directory
  if (!fs.existsSync(TEST_CONTENT_DIR)) {
    fs.mkdirSync(TEST_CONTENT_DIR);
  }

  // Create a test template
  const template = "<html><body>{{content}}</body></html>";
  fs.writeFileSync(TEST_TEMPLATE_PATH, template);

  // Create test content
  const validContent = "# Test Content\nThis is a test page.";
  const validDir = path.join(TEST_CONTENT_DIR, "valid-page");
  fs.mkdirSync(validDir);
  fs.writeFileSync(path.join(validDir, "index.md"), validContent);

  // Create nested content
  const nestedContent = "# Nested Content\nThis is a nested page.";
  const nestedDir = path.join(TEST_CONTENT_DIR, "valid-page", "nested");
  fs.mkdirSync(nestedDir);
  fs.writeFileSync(path.join(nestedDir, "index.md"), nestedContent);

  // Create root content
  const rootContent = "# Root Content\nThis is the root page.";
  fs.writeFileSync(path.join(TEST_CONTENT_DIR, "index.md"), rootContent);
});

// Cleanup after all tests
afterAll(() => {
  // Remove test content directory
  if (fs.existsSync(TEST_CONTENT_DIR)) {
    fs.rmSync(TEST_CONTENT_DIR, { recursive: true });
  }
  // Remove test template
  if (fs.existsSync(TEST_TEMPLATE_PATH)) {
    fs.unlinkSync(TEST_TEMPLATE_PATH);
  }
});

describe("Server Tests", () => {
  test("valid URL returns 200 status code", async () => {
    const response = await request(app).get("/valid-page");
    expect(response.status).toBe(200);
  });

  test("valid URL returns HTML with markdown content", async () => {
    const response = await request(app).get("/valid-page");
    const expectedHtml = marked("# Test Content\nThis is a test page.");
    expect(response.text).toContain(expectedHtml);
  });

  test("invalid URL returns 404 status code", async () => {
    const response = await request(app).get("/non-existent-page");
    expect(response.status).toBe(404);
  });

  test("root path returns 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  test("root path returns root content", async () => {
    const response = await request(app).get("/");
    const expectedHtml = marked("# Root Content\nThis is the root page.");
    expect(response.text).toContain(expectedHtml);
  });

  test("nested content path returns 200 status code", async () => {
    const response = await request(app).get("/valid-page/nested");
    expect(response.status).toBe(200);
  });

  test("nested content path returns correct content", async () => {
    const response = await request(app).get("/valid-page/nested");
    const expectedHtml = marked("# Nested Content\nThis is a nested page.");
    expect(response.text).toContain(expectedHtml);
  });

  test("navigation endpoint returns valid routes", async () => {
    const response = await request(app).get("/navigation");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining(["valid-page", "valid-page/nested"])
    );
  });

  test("template is correctly applied", async () => {
    const response = await request(app).get("/valid-page");
    expect(response.text).toContain("<html>");
    expect(response.text).toContain("<body>");
    expect(response.text).toContain("</body>");
    expect(response.text).toContain("</html>");
  });

  test("error handling for invalid template", async () => {
    // Temporarily remove the template file
    const originalTemplate = fs.readFileSync(TEST_TEMPLATE_PATH);
    fs.unlinkSync(TEST_TEMPLATE_PATH);

    const response = await request(app).get("/valid-page");
    expect(response.status).toBe(500);

    // Restore the template file
    fs.writeFileSync(TEST_TEMPLATE_PATH, originalTemplate);
  });
});
