# Static Content challenge

**NB: Please do not fork this repository, to avoid your solution being visible from this repository's GitHub page. Please clone this repository and submit your solution as a separate repository.**

Business Scenario: Acme Co's marketing department want a simple content management system and you've been tasked with building the MVP.

The challenge here is to create a full-stack JavaScript application that returns webpages at URLs that match the paths of the folders and sub-folders in the `content` folder. The content of these pages should come from a combination of the template HTML file and a markdown file containing the content.

For example, for a folder called `about-page`, a request to `/about-page` would return a HTML page created from the `template.html` template and the `about-page/index.md` content file. The `template.html` file contains a `{{content}}` placeholder that would be replaced by the content for each page. A request to `/blog/june/company-update` would return a HTML page using the content file at `blog/june/company-update/index.md`.

As a modern full-stack JavaScript app MVP, the application should use an effective mix of technologies, although there is a requirement to use React on the front-end to fit in with Acme Co's other websites.

Acme's marketing department should be able to add extra folders to the `content` folder and the application should work with those without any requiring any code changes.

This repository contains a `template.html` template file and a sample `content` folder with sub-folders containing `index.md` markdown files (or other sub-folders).

Your application may make use of open-source code libraries and other third-party tools. It is entirely up to you how the application performs the challenge. As the use of LLMs is widespread in software engineering, you are permitted to use AI as you wish.

## Project Structure

```
.
├── backend/              # Backend server code
│   ├── src/             # Source files
│   │   ├── server.ts    # Express server implementation
│   │   └── content/     # Content directory
│   └── package.json     # Backend dependencies
├── frontend/            # Frontend React application
│   ├── src/            # Source files
│   └── package.json    # Frontend dependencies
└── README.md           # Project documentation
```

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sebadeh/pensionbee-challenge.git
   cd static-content-challenge-2025
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Development

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Testing

The application includes comprehensive tests that verify:

- Requests to valid URLs return a 200 HTTP status code
- Requests to valid URLs return HTML generated from markdown files
- Requests to invalid URLs return a 404 HTTP status code
- Root path ("/") handling
- Nested content paths
- Template rendering
- Error handling
- Navigation functionality

To run the tests:

```bash
cd backend
npm run test
```

## API Documentation

### Endpoints

- `GET /`: Returns the root page content
- `GET /navigation`: Returns a JSON array of all available content paths
- `GET /:path`: Returns the content for the specified path
  - Returns 200 if content exists
  - Returns 404 if content doesn't exist
  - Returns 500 for server errors

### Content Structure

- Content is stored in markdown files (`index.md`) within folders
- Each folder represents a URL path
- The template.html file provides the base HTML structure
- Content is rendered using the marked library

## Deployment

The application can be deployed to any cloud platform that supports Node.js applications.
Currently live at: https://pensionbee-challenge.vercel.app/
