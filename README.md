# AI-First Dating App

A proof-of-concept dating app that uses AI for matching, chat suggestions, and content moderation. Built with React Native, Express, and local AI models.

## Features

- AI-powered user trait analysis and matching
- Daily "Top 3" compatible matches with diversity penalty
- AI Wingman for first-message suggestions
- Real-time chat with sentiment analysis
- Content moderation using local AI models
- Vector similarity search for matching

## Tech Stack

- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Express (TypeScript)
- **Database**: PostgreSQL with pgvector
- **AI Models**: Local Ollama (llama2)
- **Real-time**: Socket.IO
- **Auth**: JWT

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Yarn
- Ollama (for local AI models)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd dating-app
```

2. Install frontend dependencies:

```bash
yarn install
```

3. Start the development environment:

```bash
docker compose up -d
```

4. Initialize the database:

```bash
cd backend
yarn prisma:migrate
```

5. Start the frontend development server:

```bash
yarn start
```

## Development

### Backend

The backend is built with Express and TypeScript. Key features:

- User authentication and profile management
- AI-powered matching algorithm
- Real-time chat with Socket.IO
- Content moderation and sentiment analysis

To run the backend in development mode:

```bash
cd backend
yarn dev
```

### Frontend

The frontend is built with React Native and Expo. Key features:

- Modern, responsive UI
- Real-time chat interface
- Profile management
- Match discovery

To run the frontend in development mode:

```bash
yarn start
```

## AI Features

### Matching Algorithm

The app uses vector embeddings of user traits to find compatible matches. The algorithm:

1. Generates embeddings from user traits using Ollama
2. Calculates cosine similarity between users
3. Applies a diversity penalty to ensure varied matches
4. Returns the top 3 matches daily

### Chat Features

- AI-powered first message suggestions
- Real-time sentiment analysis
- Content moderation using local AI models
- Chat suggestions based on context

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
