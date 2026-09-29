# Notes API

A REST API built with Node.js, Express, MongoDB, and Mongoose for storing private notes. Users register or log in to receive a JSON Web Token (JWT), then use that token to manage their own notes.

Built for **Lab 14.2: Secure Record Storage**.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Create, read, update, and delete notes
- Automatically associate notes with their creator
- Return only the authenticated user's notes
- Prevent users from accessing, updating, or deleting another user's notes
- Validate required titles and content
- Record creation and update timestamps

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- jsonwebtoken
- dotenv
- Morgan
- Nodemon
- Postman

## Project Structure

```text
notes-api/
├── config/
│   └── connection.js
├── controllers/
│   ├── noteControllers.js
│   └── user-controllers.js
├── models/
│   ├── Note.js
│   └── User.js
├── routes/
│   └── api/
│       ├── noteRoutes.js
│       └── userRoutes.js
├── utils/
│   └── auth.js
├── .gitignore
├── package-lock.json
├── package.json
└── server.js
```

## Installation

1. Clone this repository and open the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=replace_with_a_long_random_secret
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   To start without Nodemon:

   ```bash
   npm start
   ```

5. Confirm that the terminal reports the server is listening and MongoDB is connected.

The API runs at `http://localhost:3000` with this configuration. Keep `.env` in `.gitignore`.

## API Endpoints

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/api/users/register` | Register a user | Not required |
| POST | `/api/users/login` | Log in and receive a token | Not required |
| GET | `/api/users` | Retrieve the authenticated user | Required |
| POST | `/api/notes` | Create a note | Required |
| GET | `/api/notes` | List the authenticated user's notes | Required |
| GET | `/api/notes/:id` | Retrieve an owned note | Required |
| PUT | `/api/notes/:id` | Update an owned note | Required |
| DELETE | `/api/notes/:id` | Delete an owned note | Required |

## Authentication

Registration and login return a JWT in the response's `token` field. Tokens expire after one hour.

For protected requests in Postman:

1. Open the request's **Authorization** tab.
2. Select **Bearer Token**.
3. Paste the token value returned by registration or login.
4. Send the request.

Paste only the token value, without quotes or the word `Bearer`. Postman creates this header automatically:

```http
Authorization: Bearer YOUR_LOGIN_TOKEN
```

`JWT_SECRET` is the server's signing secret and remains in `.env`. It is not the token sent with requests.

## Example Requests

Select **Body → raw → JSON** for requests containing a body.

### Register

**POST** `/api/users/register`

```json
{
  "username": "exampleuser",
  "email": "exampleuser@example.com",
  "password": "ExamplePass1!"
}
```

Successful registration returns `201 Created` and a token.

### Log In

**POST** `/api/users/login`

```json
{
  "email": "exampleuser@example.com",
  "password": "ExamplePass1!"
}
```

Successful login returns `200 OK` and a token. Incorrect credentials return a generic authentication error.

### Create a Note

**POST** `/api/notes`

```json
{
  "title": "Prepare for Friday's meeting",
  "content": "Review the monthly sales report and prepare three questions."
}
```

Successful creation returns `201 Created` with the saved note and its `_id`.

The server assigns the owner from the verified token. The request body only needs `title` and `content`.

### List Your Notes

**GET** `/api/notes`

Returns `200 OK` with an array containing only the authenticated user's notes. If the user has no notes, the response is `[]`.

### Retrieve One Note

**GET** `/api/notes/NOTE_ID`

Replace `NOTE_ID` with the note's `_id`. The note's `user` field identifies its owner.

### Update a Note

**PUT** `/api/notes/NOTE_ID`

```json
{
  "content": "Sales report reviewed. Prepare three questions for Friday."
}
```

Updates allow changes to title and content while preserving the owner.

### Delete a Note

**DELETE** `/api/notes/NOTE_ID`

Returns a success message after deleting an owned note. No request body is required.

## Ownership Authorization

The authentication middleware verifies the JWT and stores the authenticated user's ID on `req.user._id`.

Each note includes a required `user` field referencing the `User` model.

- Creating a note assigns `req.user._id` as its owner.
- Listing notes filters by the authenticated user's ID.
- Retrieving, updating, and deleting a note require an ownership check.
- Requests for another user's note return `403 Forbidden`.
- Requests for a nonexistent note return `404 Not Found`.

## Manual Testing

The following behaviors were tested in Postman using two accounts:

- Registration and login returned tokens.
- The first account created, retrieved, updated, and deleted its note.
- The second account could not update or delete the first account's note.
- Listing notes with the second account returned an empty array and excluded the first account's note.
- Requests without an Authorization header returned `401`.
- Malformed tokens were rejected with `401`.

## Response Status Codes

| Status | Meaning |
| --- | --- |
| 200 | Request succeeded |
| 201 | User or note created |
| 400 | Invalid input or unsuccessful login |
| 401 | Missing, expired, or invalid authentication token |
| 403 | User does not own the requested note |
| 404 | Requested note does not exist |
| 500 | Server error |

## Author

Priscilla Leonard