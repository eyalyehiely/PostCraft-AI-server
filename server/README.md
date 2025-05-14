# PostCraft AI

An AI-powered content creation platform that helps you generate engaging social media posts.

## Features

- **AI-Powered Content Generation**: Leverage OpenAI's advanced models to create compelling social media posts
- **Real-Time Collaboration**: Share and collaborate on content with your team

- **Content Templates**: Pre-built templates for various content types and industries
- **Analytics Dashboard**: Track performance and engagement metrics

- **Publish Posts**: Publisable generic pages.


## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB for data persistence
- **Caching**: Redis for session management and caching
- **Frontend**: Next.js with TypeScript
- **UI Components**: shadcn/ui for modern, accessible components
- **AI Integration**: OpenAI API for content generation
- **Authentication**: Clerk-based authentication

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- OpenAI API account
- Clerk account for authentication

## Installation

### Backend Setup

1. Clone the backend repository:
```bash
git clone https://github.com/eyalyehiely/PostCraft-AI-server.git
cd PostCraft-AI-server/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/postcraft
REDIS_URL=redis://localhost:6379

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key
CLERK_WEBHOOK_SIGNING_SECRET=whsec_your-webhook-secret

# Server Configuration
PORT=3001
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Clone the frontend repository:
```bash
git clone https://github.com/eyalyehiely/PostCraft-AI-client.git
cd PostCraft-AI-client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
NEXT_PUBLIC_API_URL=http://localhost:3001
CLERK_SECRET_KEY=sk_test_your-secret-key
```

4. Start the frontend development server:
```bash
npm run dev
```

## Usage

1. Start MongoDB and Redis services
2. Run the backend server (default: http://localhost:3001)
3. Run the frontend application (default: http://localhost:3000)
4. Open your browser and navigate to the frontend URL

## API Documentation

The backend provides RESTful APIs for:
- User authentication and management
- Content generation using OpenAI
- Post scheduling and management
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.