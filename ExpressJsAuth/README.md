# Demo Spring API
This is a demo node express.js api with some unit tests
### note: use .env file to export env variable and dotenv node package to load the env variables

## Features
 - Mongo DB Schema
 - Unit Tests
 - Dockerized (with docker-compose)
 - AWS Lambda docker configuration
 - Rate Limits and Delays
 - Swagger API Documentation

## Programming Languages and Frameworks
 - Javascript
 - MongoDB
 - Express.js
 - Node.js
 - Docker

## Cmds
```
    npm test
    node --watch src/index.mjs
    docker-compose build app
    docker-compose up
```

## Swagger UI Docs
http://localhost:3000/api-docs

## Auth Endpoints
### POST /register
 - req body: {"name": "name", "email": "example@email.com", "password": "supersecretpassword"}
 - returns: accessToken, refreshtoken, User
### POST /login
 - req body: {"email": "example@email.com", "password": "supersecretpassword"}
 - returns: accessToken, refreshtoken, User
### POST /refresh
 - req cookies: refreshToken
 - returns: accessToken


## In Progress:
 - Unit Tests
 - Swagger docs
 - Error Handling
 - App Security
 - Input Validation

## To Do:
 - Annotate code
 - Email endpoint

