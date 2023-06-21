## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)

## Description
Resume API built with Node.js, TypeScript, NestJs and TypeORM. Provided API documentation via Swagger, authentication using JWT, database via MySQL or MariaDB, and AWS S3 or local storage driver support.

## Installation

- Requirements
  - Node.js >= 18
  - MySQL or MariaDB

- Clone this repository
  ```bash
  $ git clone https://github.com/yusuftaufiq/yusuftaufiq-api-developer-14Jun2023.git
  ```

- Install all required dependencies
  ```bash
  $ npm install
  ```

- Copy the environment file from `.env.example` to `.env`. Explanations of the configuration can be seen in the [following section](#environment-configuration).

- Start Node.js with one of the following commands:
  ```bash
  # development
  $ npm run start

  # watch mode
  $ npm run start:dev

  # production mode
  $ npm run build
  $ npm run start:prod

  # run migration if your APP_ENV in .env file is configured to production
  $ npm run typeorm migration:run
  ```

## Environment Configuration
- Application
  - `APP_ENV`: Define the current application environment. Possible values are `development`, `production`, and `testing` with the following details:
    - `development`: Enable TypeORM's query logging and sync database features
    - `production`: Disable query logging and the TypeORM database synchronization feature, all database schema changes must use migration with the following command:
      ```bash
      $ npm run typeorm migration:run
      ```
    - `testing`: Disable query logging but enable TypeORM to sync the database
  - `APP_PORT`
- Database
  - `DB_TYPE`: Determine the database type. Currently supported values are `mysql` or `mariadb`
  - `DB_HOST`
  - `DB_PORT`
  - `DB_DATABASE`
  - `DB_USERNAME`
  - `DB_PASSWORD`
  - `DB_FOREIGN_KEY`: Tell the TypeORM migration to enable or disable foreign keys. Possible values are `true` or `false`.
  - `DB_SSL`: If true the server will reject any connection which is not authorized with the list of supplied CAs. Possible values are `true` or `false`.
- Storage
  - `STORAGE_DRIVER`: File storage driver used to upload a profile picture or company logo. Possible values are `local` or `s3`, where local will upload files to the [`storages`](./storages/) directory and s3 will upload files to the AWS S3
  - `STORAGE_BUCKET`: AWS S3 storage bucket name, required if storage driver is set to s3
- JWT
  - `JWT_SECRET_KEY`: A solid private secret key, for example, a secret key can be generated from https://randomkeygen.com/
  - `JWT_TOKEN_TTL_IN_SECONDS`: The time before the JWT access token expires.

## API Documentation
API documentation can be checked in the `/docs` endpoint. Here's a quick overview of all the available endpoints:

```bash
# storages
/storages/{fileId} [GET]

# auth
/v1/auth/login (POST)
/v1/auth/register (POST)
/v1/auth/profile (GET)

# resumes
/v1/resumes (POST)
/v1/resumes (GET)
/v1/resumes/{resumeId} (GET)
/v1/resumes/{resumeId} (PATCH)
/v1/resumes/{resumeId} (DELETE)

# work-experiences
/v1/resumes/{resumeId}/work-experiences (POST)
/v1/resumes/{resumeId}/work-experiences (GET)
/v1/resumes/{resumeId}/work-experiences/bulk (POST)
/v1/work-experiences/{workExperienceId} (GET)
/v1/work-experiences/{workExperienceId} (PATCH)
/v1/work-experiences/{workExperienceId} (DELETE)
```

## Running Tests

```bash
# unit tests
$ npm run test

# e2e tests, make sure database connection in .env.testing environment is configured
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

