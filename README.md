# Full Stack Demo App
This is an interactive demo application using 3 dockerized microservices which are deployed to aws lambda
[Try it out here](https://barryhykesdemo.web.app)
## Demo Auth Credentials
 - email: blhyk.es@gmail.com
 - password: testpass1

## App Architechture
 - Angular/ Ionic/ Typescript Frontend frameworks -> src/app
 - Node.js + Express.js (Auth Microservice) -> ExpressJsAuth/src
 - Java + Spring Boot (Contact Email Microservice) -> SpringBootEmail/src
 - Python + Flask (Genomic Variants CRUD) -> FlaskVariantsApi/src
 - MongoDB
 - Docker
 - AWS (Lambda, Api Gateway, ECR, EC2, IAM)
 - Google Cloud Hosting

## Features
 - JWT Authentication
 - Mongo DB Schema
 - Unit Tests
 - Dockerized (with docker-compose)
 - AWS Lambda docker configurations
 - Rate Limits and Delays
 - Swagger API Documentation

## In Progress:
 - Unit Tests
 - Swagger docs
 - Error Handling
 - App Security
 - Input Validation

## To Do:
 - Annotate code
 - Auth verify email
 - Auth forgot password/ reset
 - cache variants result to reduce api calls
 - MongoDb document locking
