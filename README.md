# ecommerce-backend

## This project was developed as an example of how to create a simple Typescript backend implementation with these key features in mind:


- RESTful API
- MongoDB Communication
- JWT Authentication
- Swagger documentation setup
- Automated tests with Jest
- Dockerfile for ease of deployment
- Github Actions CI/CD steps

## How To Run

1. Locally

This project was developed using Node version ^20.12
To run, simply execute the following commands:

```sh
npm install
npm start
```

2. Dockerfile

You can also run via the included Docker image:

```sh
docker build -t ecommerce-backend .
docker run -ti -p 3000:3000 ecommerce-backend
```

## Tests

This project can be tested with Jest by running the following command:

```sh
npm test
```

The Github Actions pipeline will ensure that each commit will be tested before any release.

## API Documentation

When the project is running, access the Swagger Documentation in the **_/api-docs_** route.


## TODO:

- Dockerhub publish step in Github Actions

### Author: [Heitor Marsolla](https://github.com/hmarsolla)