# Node CRUD API

👩🏻‍🎓 This repository contains the solution for the second-week task of RSSchool Node.js course

## Usage

Before statring, you have to clone the repo and install all the dependencies and `.env` file:

```bash
# Install dependencies
npm install

# Set up .env
cp .env.example .env
```

Then, you can run the application with the following command:

```bash
npm run start:prod
```

This API supports multiple endpoints and represents a set of users stored in in-memory database.

| Method | Endpoint | Description |
| :---: | --- | --- |
| __GET__ | api/users | Get all persons from the database |
| __GET__ | api/users/{userId} | Get a record with `id === userId` if it exists |
| __POST__ | api/users | Create record about new user and store it in database |
| __PUT__ | api/users/{userId} | Update existing user |
| __DELETE__ | api/users/{userId} | Delete existing user from the database |

Users are stored as objects that have following properties:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| __id__ | `string, uuid` | --- | User's unique identifier (generated on server side) |
| __username__ | `string` | ✅ | User's name |
| __age__ | `number` | ✅ | User's age |
| __hobbies__ | `string[], []` | ✅ | User's hobbies |

## Development

For the developers, you can run the application in watch mode with the following command:

```bash
npm run start:dev
```

## License

[MIT](https://github.com/ChocolateNao/node-crud-api/blob/master/LICENSE)
