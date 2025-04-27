# Static Content Challenge

## The Challenge

Build a server that can serve content from a folder of markdown files. The server should:

1. Return HTML content generated from markdown files
2. Handle valid URLs and return appropriate content
3. Return 404 for invalid URLs
4. Include navigation functionality
5. Be well-tested with at least three key test cases

## My Solution

### Architecture Overview

The solution is built using a modern tech stack:

- **Backend**: Node.js with Express

  - Serves markdown content via REST API
  - Converts markdown to HTML
  - Handles routing and error cases
  - Includes comprehensive test coverage

- **Frontend**: React with TypeScript
  - Single Page Application (SPA)
  - Dynamic content loading
  - Clean and responsive UI
  - Client-side routing
  - Loading states and error handling

### Key Features

1. **Dynamic Navigation**

   - Automatically generated from content structure
   - Nested content support
   - Active page highlighting

2. **Content Rendering**

   - Markdown to HTML conversion
   - Clean and responsive layout
   - Loading skeletons for better UX
   - Error handling with user-friendly messages

3. **Error Handling**

   - Custom 404 page for not found content
   - Graceful error handling
   - User-friendly error messages

4. **Testing**
   - Comprehensive test suite
   - Coverage for all key functionality
   - Edge case handling

### Technical Highlights

- TypeScript for type safety
- React Router for client-side routing
- Marked library for markdown processing
- Jest for testing
- CSS modules for styling
- Mobile-responsive design

### Bonus Features

1. **Enhanced UX**

   - Loading states with skeleton loaders
   - Smooth transitions
   - Responsive design

2. **Developer Experience**

   - Clean code architecture
   - Comprehensive documentation
   - Easy to extend

3. **Production Ready**
   - Error boundary implementation
   - Performance optimizations
   - Clean and maintainable code
