# Igma-api

## About this Project

The idea of the project is create a simple customer registration api, where the main focus is to demonstrate my skills in building apis and in logic and creation of data validation algorithms.

CPF validation was performed based on the rules found [here](https://www.macoratti.net/alg_cpf.htm#:~:text=O).
And the algorithm that was made in this application is present [here](https://github.com/rafaeelnunesf/igma-api/blob/main/src/validation/cpf.validation.ts).

## Built With

The following tools and frameworks were used in the construction of the project:<br>

<p float="left">
  <img alt="Typescript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="NestJS" src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/>
  <img alt="Postgres" src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img alt="SQLITE" src="https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white"/>
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
  <img alt="Jest" src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img alt="Node.js"src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="EsLint" src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img alt="Prettier" src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E"/>
  <img alt="Ubuntu" src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"/>
</p>

This is a test project, so, I'll be happy if you could provide me any feedback about the project, code, structure or anything that you can report that could make me a better developer!

Email-me: rafaelnfsq@gmail.com

Connect with me at [LinkedIn](https://www.linkedin.com/in/rafaeelnunesf).

## How to run in development

1. Clone this repository

2. Clone the backend repository available [here!](https://github.com/rafaeelnunesf/igma-api)
3. Follow instructions to run backend available [here!](https://github.com/rafaeelnunesf/igma-api)
4. Install dependencies

```bash
npm install
```

5. Rename the `.env example` file to `.env`

6. Create a database file

```bash
npm run create-db
```

#### Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev
```

## Testing

For run the tests you will need:

1. Copy the `.env.test example` file and rename to `.env.test`

2. Create a testing database file

```bash
npm run create-db:test
```

#### Running the tests

```bash
# unit tests
npm run test

# unit tests in watch mode
npm run test:watch

# test coverage
npm run test:cov
```

Note: For this project I used the sqlite database for simplification purposes, as I used Prisma ORM it is extremely easy to change to other types of supported databases, such as postgreSQL, mySQL and others.

During development I used postgres, but when I went to test it on windows I realized that it would be more complicated, so with just a few lines of code it was possible to change databases without wasting much time.

## Routes

The base URL is: http://localhost:3000

### Customers Routes

On this route you can create a customer:
| **url** | **Method** | Body Params | URL Params | Success Response | Error Responses |
| -------------------- | ---------- | ----------- | --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| /customers | `POST` | **Example:**<br />{<br />"name":"Rafael", <br />cpf: "111.444.777-35", <br />"birthday": "25/08/1998"<br />} | - | **Code:** 201 - Created | **Code:** 400 - Bad Request!<br />**Content:** `{"message": "You must enter all required fields"}` <br/><br /> **Code:** 400 - Bad Request!<br />**Content:** `{"message":  "Invalid CPF!"}` <br/><br />**Code:** 409 - Conflict! <br />**Content:** `{"message": "This CPF is already registered!"}` |

On this route you can get many customers:
| **url** | **Method** | Body Params | URL Params | Success Response | Error Response |
| ------------- | ---------- | ------------------------------------- | ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| /customers | `GET` |- | - | **Code:** 200 - OK<br />**Content:**<br /> Array of [Customers](#Customers) | - |

On this route you can get one customer by cpf:
| **url** | **Method** | Body Params | URL Params | Success Response | Error Response |
| ----------------------- | ---------- | ----------- | --------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| /customers/:cpf | `GET` | - | **Required:**<br /> cpf: String | **Code:** 200 - OK<br />**Content:** <br/>[Customer](#Customer) | **Code:** 404 - Not Found<br />**Content:** `{"message": "Customer not found!"}` |

### Models

#### Customers

```
[
  {
    "id": 1,
    "name": "Rafael",
    "cpf": "111.444.777-35",
    "birthday": "1998-08-28T03:00:00.000Z"
  }
  {
    "id": 2,
    "name": "Another Rafael",
    "cpf": "045.755.782-66",
    "birthday": "1998-08-28T03:00:00.000Z"
  }
]
```

#### Customer

```
{
  "id": 1,
  "name": "Rafael",
  "cpf": "111.444.777-35",
  "birthday": "1998-08-28T03:00:00.000Z"
}
```
