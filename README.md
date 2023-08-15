E-Learning Website Readme
Welcome to the E-Learning Website repository! This project is an interactive e-learning platform that allows users to watch educational videos, 
upload their own content, and rate videos. It's built using Typescript and powered by Node.js, 
Express, PostgreSQL, Redis, and Prisma ORM on the back end.

Features
Video Streaming: Users can watch educational videos on various topics.
Content Upload: Users have the ability to upload their own educational content to share with the community.
Video Rating: Users can rate videos using star ratings to provide feedback and help others find quality content.

Tech Stacks
The E-Learning Website is built using the following technologies:

Programming Languages: TypeScript
Back End: Node.js, Express
Database: PostgreSQL
Caching: Redis
ORM: Prisma

Getting Started
To get the E-Learning Website up and running on your local machine, follow these steps:

Prerequisites
Make sure you have the following software installed:

Node.js: Download Node.js
PostgreSQL: Download PostgreSQL
Redis: Download Redis
Git (for cloning the repository): Download Git

Backend
The backend component is responsible for managing data, server-side logic, and communication with databases.

Installation

Clone this repository using Git:
```bash
git clone https://github.com/Chainarate/api-learnhub
```
Navigate to the project directory:
```bash
cd e-learning-website
```
Make sure you have pnpm installed globally:
```bash
npm install -g pnpm
```
Install backend dependencies:
```bash
pnpm install
```
Generate Prisma client:
```bash
npx prisma generate
```
Run migrations:
```bash
npx prisma migrate dev
```
Compile TypeScript:
```bash
npx tsc
```

Start the backend server:
```bash
node dist/index.js
```

Database Setup
Ensure you have PostgreSQL and Redis databases set up and running. Update the backend configuration files for database connections.

PostgreSQL
Update the database connection details in backend/.env:
```ts
const databaseConfig = {
  // ...
  database: 'your_postgresql_database_name',
  // ...
};
```
Redis
Update Redis configuration in backend/config/redis.ts:
```ts
const redisConfig = {
  // ...
  host: 'your_redis_host',
  port: your_redis_port,
  // ...
};
```
Usage
Here are a few things you can do with the E-Learning Website:

Browse and watch educational videos.
Upload your own educational content.
Rate videos using star ratings.
Feel free to explore and contribute to the project!
