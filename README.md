# AI-First Dating App

A modern dating application that uses AI to enhance the matching and chat experience.

## Features

- 🤖 AI-powered onboarding with personality analysis
- 💝 Daily curated matches using vector similarity
- 💬 Real-time chat with AI wingman suggestions
- 🛡️ Toxicity detection and sentiment analysis
- 📱 Beautiful mobile-first UI with Expo

## Tech Stack

- **Frontend**: React Native (Expo), TypeScript, MobX
- **Backend**: Express.js, TypeScript, Prisma
- **Database**: PostgreSQL with pgvector
- **AI**: Ollama (Llama 2), Natural Language Processing
- **Real-time**: Socket.io
- **DevOps**: Docker, GitHub Actions

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- PostgreSQL (v14 or higher)
- Ollama (for local LLM)
- Expo CLI (`npm install -g expo-cli`)

## Project Structure

```
DatingAppDemo/
├── src/                    # Frontend React Native app
│   ├── navigation/        # Navigation configuration
│   ├── screens/          # App screens
│   ├── store/            # MobX stores
│   ├── services/         # API services
│   └── theme/            # UI theme configuration
│
└── backend/              # Express.js backend
    ├── prisma/          # Database schema and migrations
    ├── src/
    │   ├── routes/      # API routes
    │   ├── services/    # Business logic
    │   └── utils/       # Utility functions
    └── postman/         # API documentation and tests
```

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/DatingAppDemo.git
   cd DatingAppDemo
   ```

2. Install dependencies:

   ```bash
   # Install frontend dependencies
   cd src
   yarn install

   # Install backend dependencies
   cd ../backend
   yarn install
   ```

3. Set up the database:

   ```bash
   # Create a PostgreSQL database
   createdb dating_app

   # Run Prisma migrations
   cd backend
   yarn prisma migrate dev
   ```

4. Configure environment variables:

   ```bash
   # In backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start Ollama (for local LLM):

   ```bash
   # Install Ollama if not already installed
   brew install ollama

   # Start Ollama service
   ollama serve

   # Pull and run Llama 2 model
   ollama run llama2:7b
   ```

## Running the Application

### Backend Server

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

   The server will start on http://localhost:3001

3. Verify the server is running:
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok"}
   ```

### Frontend App

1. Open a new terminal window and navigate to the frontend directory:

   ```bash
   cd src
   ```

2. Start the Expo development server:

   ```bash
   yarn start
   ```

   This will start the Metro bundler and show a QR code.

3. Run the app:
   - **On iOS Simulator:**
     ```bash
     yarn ios
     ```
   - **On Android Emulator:**
     ```bash
     yarn android
     ```
   - **On Physical Device:**
     - Install Expo Go from the App Store (iOS) or Play Store (Android)
     - Scan the QR code with your device's camera
     - The app will open in Expo Go

### Development Workflow

1. **Backend Development:**

   - The server will automatically restart when you make changes
   - API endpoints are available at `http://localhost:3001/api/*`
   - Check the console for server logs and errors

2. **Frontend Development:**

   - Changes will automatically reload in the app
   - Use the Expo developer menu (shake device or press 'd' in terminal)
   - Enable Fast Refresh in the developer menu for instant updates

3. **Testing the Full Stack:**
   - Backend API: Use the Postman collection in `backend/postman/`
   - Frontend: Test the onboarding flow and chat features
   - Real-time features: Test chat functionality between multiple devices

### Troubleshooting

1. **Backend Issues:**

   - Check if PostgreSQL is running: `pg_isready`
   - Verify Ollama is running: `curl http://localhost:11434/api/version`
   - Check server logs for detailed error messages

2. **Frontend Issues:**

   - Clear Metro bundler cache: `yarn start --clear`
   - Reset Expo cache: `expo start -c`
   - Check Expo logs in the terminal

3. **Database Issues:**
   - Reset database: `yarn prisma migrate reset`
   - Regenerate Prisma client: `yarn prisma generate`

## Development

### Backend Development

- API routes are in `backend/src/routes/`
- Database schema is in `backend/prisma/schema.prisma`
- Run migrations: `yarn prisma migrate dev`
- Generate Prisma client: `yarn prisma generate`

### Frontend Development

- Screens are in `src/screens/`
- Navigation is configured in `src/navigation/`
- State management is in `src/store/`
- API services are in `src/services/`

### Testing the API

- Import the Postman collection from `backend/postman/`
- Set up environment variables in Postman
- Run the onboarding flow tests

## API Documentation

The API documentation is available in the Postman collection at `backend/postman/onboarding.postman_collection.json`. Import this into Postman to view detailed API documentation and test the endpoints.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
