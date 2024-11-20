## Table of Contents
- Local Development requirements
- Environment variables needed
- Description
- Sample Currency Pair
- Constraints
- Installation
- Running the app

## Environment variables needed
- MONGO_URI
- MIN_VALUE //minimum value required for a currency pair sell or buy. this was said to be 0 in the Assessement question, since BUY or SELL can not be lesser than 0
- MAX_FXQL //maximum limit for currency pairs  per request this was said to be 1000 in the Assessement but you can increase it buy setting the env

Please note: All envs must be set if not the EnvValidator will throw an error on app startup

## Local Development requirements
- Node.js (v14 or later)
- NPM (v6 or later)
- Docker (optional, for running the database in a container)

## Description

[FXQL-PARSER](https://github.com/nestjs/nest) this is a simple fxql parser implemented in Nestjs and Typescript for the [Miraapp](https://miraapp.notion.site/Backend-Developer-Technical-Assessment-a954df277ad34772a261ddfe2dd7210c) technical assessment. This project is a simple fxql parser that takes a string as input and returns a JSON object as output. The parser is implemented using the NestJS framework and TypeScript. The project includes a single endpoint that accepts a POST request with a JSON payload containing the fxql string. The endpoint returns a JSON object containing the parsed fxql string. The project also includes unit tests for the parser using Jest and Supertest. The project is structured as follows:

- `src/`: Contains the source code for the project.
  - `fxql/fxql.controller.ts`: Defines the endpoint for the parser.
  - `fxql/fxql.service.ts`: Contains the logic for parsing the fxql string.
  - `main.ts`: The entry point for the application.
  - `database`: This contains files for the database schema, database class which is an abstraction over the db calls and a db factory to return the class when needed
- `test/`: Contains the unit tests for the parser.
  - `app.e2e-spec.ts`: Contains the end-to-end tests for the parser.

## Sample Currency Pair

```json
{
  "FXQL": "USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}"
}
```

## Constraints

- The fxql string must be a valid fxql string. If the string is not valid, the parser should return an error message.
- A currency pair can not appear more than once among multiple fxql statements, e.g USD-GBP{} \n USD-GBP{} will throw an error message
- Maximum 1000 currency pairs per request
- Currency pair 1 Must be exactly 3 uppercase characters same with Currency pair 2
- Multiple FXQL statements should be separated by a single newline character
- Multiple newlines within a single FXQL statement
- CAP cannot be a negative number
- Missing single space after currency pair

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Stay in touch

- Author - [Abdulrahman Salau](https://github.com/raene)
- Email - [bob.salau@gmail.com](mailto:bob.salau@gmail.com)
- Website - [https://nestjs.com](https://nestjs.com/)
