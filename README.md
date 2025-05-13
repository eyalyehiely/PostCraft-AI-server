# PostCraft AI

A Node.js Express application for PostCraft AI.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
```

3. Start the development server:

```bash
npm run dev
```

The server will start on http://localhost:3000

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reloading

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint
