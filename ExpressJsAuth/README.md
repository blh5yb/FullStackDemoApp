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
 - req body: {"name": "name", "email": "example@email.com", "password": "supersecretpassword"}
 - returns: accessToken, refreshtoken, User
### POST /refresh
 - req cookies: refreshToken
 - returns: accessToken


## Product Endpoints
### GET /products
### GET /products/{id}
### PUT /products/ (Protected)
 - req headers: authorization
 - req cookies refreshToken 
 - req body: {"name": "name", "price": 10, "description": "test description"}
### Patch /products/{id} (Protected)
 - req headers: authorization
 - req cookies refreshToken 
 - req body: {"name": "name", "price": 10, "description": "test description"}
### DELETE /products/{id} (Protected)
 - req headers: authorization
 - req cookies refreshToken 


## In Progress:
 - Unit Tests
 - Swagger docs
 - Error Handling
 - App Security
 - Input Validation

## To Do:
 - Annotate code
 - Email endpoint

