# Projeti 2025.1

## Todo List

- [ ] Support image/audio generation
- [X] Break down [use-markdown-processor](src/hooks/use-markdown-processor.tsx) into smaller pieces
- [ ] Save chats in localStorage
- [ ] Step-by-step chat feedback (reasoning, tool calling, status, etc.)
- [ ] Better [empty-message](src/components/empty-message.tsx) copy
- [x] Reduce bundle size
- [ ] Features are not working in prod (bug)
- [ ] Mobile PWA
- [ ] Allow for taking pictures
- [X] File preview in chat
- [ ] Authentication (Cookies with JWT)
- [X] AI tooling setup
- [X] Desmos api integration
- [ ] Geogebra api integration
- [ ] Symbolab api integration
- [ ] Performance review

## Out-of-scope todos

- [ ] AI Gateway setup
- [ ] Database setup
- [ ] Caching setup
- [ ] Blob storage
- [ ] Plans page
- [ ] Efi api integration
- [ ] Welcome tutorial
- [ ] More AI models
- [ ] Better UX/UI
- [ ] Realtime 1:1 tutor
- [ ] E:E tests

## Prerequisites

- [Node.js](https://nodejs.org/) v20.x or later
- [pnpm](https://pnpm.io/) package manager

## Installation Steps

1. **Clone the Repository**  
   Open your terminal and run:
   ```bash
   git clone https://github.com/Quinntas/projeti-2025-1
   cd projeti-2025-1
   ```

2. **Install Dependencies**  
   Once inside your project folder, install the dependencies using pnpm:
   ```bash
   pnpm install
   ```

## Running the Project

- **Development Mode**:  
  To start the project in development mode, run:
  ```bash
  pnpm run dev
  ```

- **Production Build**:  
  To build the project for production, run:
  ```bash
  pnpm run build
  
  pnpm run start
  ```
