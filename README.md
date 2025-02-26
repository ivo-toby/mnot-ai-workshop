# Smart Todo App with PostgreSQL

A React and Express todo application that automatically categorizes tasks using AI and stores them in a PostgreSQL database with Drizzle ORM.

## Features

- Create, read, update, and delete todo items
- Automatic categorization of todos using OpenAI
- Persistent storage with PostgreSQL
- Modern database management with Drizzle ORM

## Setup with Docker (Recommended)

This is the easiest way to get started, as it sets up both the application and PostgreSQL database in containers.

### Prerequisites

- Docker and Docker Compose installed on your system
- OpenAI API key (for the categorization feature)

### Running with Docker

1. Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY=your_openai_api_key_here
   ```

2. Start the application using Docker Compose:
   ```bash
   # Make the startup script executable
   chmod +x docker-start.sh
   
   # Run the application
   ./docker-start.sh
   ```

3. Access the application at http://localhost:3001

The Docker setup includes:
- PostgreSQL database container with persistent storage
- Application container with auto-migrations
- Automatic database connection retry logic
- Health checking to ensure the database is ready before starting the app

## Manual Setup (Without Docker)

### Prerequisites

- Node.js 16 or higher
- PostgreSQL database

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   DATABASE_URL=postgres://username:password@localhost:5432/your_database
   ```

### Database Setup

1. Create a PostgreSQL database for your application.
2. Generate the SQL migrations:
   ```bash
   npm run db:generate
   ```
3. Apply migrations to your database:
   ```bash
   npm run db:migrate
   ```

### Running the Application

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Access the application at http://localhost:3001

## Development

- Modifying the database schema:
  1. Update `db/schema.ts`
  2. Run `npm run db:generate` to create new migrations
  3. Apply migrations with `npm run db:migrate`

- View your database with Drizzle Studio:
  ```bash
  npm run db:studio
  ```

## Project Structure

- `/db` - Database configuration and schema
- `/drizzle` - Generated migrations
- `/src` - React frontend code
- `server.ts` - Express server and API routes
