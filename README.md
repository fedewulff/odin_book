<h1 align="center">Deer</h1>

<p align="center">A full-stack social media project from <a href="https://www.theodinproject.com/lessons/nodejs-messaging-app">Odin</a>

<h3>Demo: <a target="_blank" rel="noopener noreferrer" href="odin-book-frontend-7545.onrender.com">Deer</a></h3>

## Frontend built with

- Vite + React
- Websockets (Socket.io)
- React router v6
- CSS

### Dependencies

- **react**: library for building user interfaces
- **react-dom**: provides DOM-specific methods for rendering and managing React components within a web browser's Document Object Model
- **react-icons**: library of icons
- **react-router**: library designed specifically for React to handle client-side routing
- **socket.io-client**: library for frontend enabling real-time, bidirectional, and event-based communication between clients and a server

<br/><br/>

## Backend built with

- Node JS
- Express
- Passport
- Prisma ORM
- Cloudinary (will be added shortly)
- Multer

### Dependencies

- **@prisma/client**: auto-generated, type-safe query builder that provides an intuitive API for interacting with your database
- **@quixo3/prisma-session-store**: Express session store implementation that utilizes the Prisma Framework to persist session data in a database
- **bcrypt**: adaptive password-hashing function used to enhance security
- **cloudinary**: an API-first, cloud-based solution to manage images and videos for the web
- **cookie-parser**: makes it easy to read and manage cookies sent by the browser to the server.
- **cors**: allows a browser to request resources from a domain different from the one the browser originally loaded the page from
- **dotenv**: tool that loads environment variables, often containing sensitive information from a .env file
- **express**: unopinionated web framework for Node.js. It simplifies the process of building server-side applications and APIs
- **express-session**: middleware that provides server-side session management for applications
- **express-socket.io-session**: module that enables sharing cookie-based session data between express and socket.io applications
- **express-validator**: simplifies server-side input validation and sanitization
- **jsonwebtoken**: defines a compact and self-contained way for securely transmitting information between parties as a JSON object
- **multer**: library for handling file upload
- **passport**: that provides an extensible set of authentication strategies
- **passport-local**: authentication middleware using a username and password
- **passport.socketio**: allows to integrate passport.js authentication with socket.io connections
- **socket.io**: library for backend enabling real-time, bidirectional, and event-based communication between clients and a server

<br/><br/>

## Clone and start the project

Here is how you can start the project locally.

Prerequisites:

- Installed psql
- Installed npm
  <br/><br/>

**1. Clone the repo**

```
#SSH
$ git clone git@github.com:fedewulff/odin_book.git
```

**2. Download dependencies**

```
$ cd odin_book/frontend
$ npm i

$ cd odin_book/backend
$ npm i
```

**3. Create `.env` inside frondend and backend folder**

**4. Add the following to `.env` inside frontend folder**

```
VITE_BACKEND_URL="http://localhost:[PORT NUMBER FROM .env IN BACKEND]"
```

**5. Create postgresql database**

- `$ psql`
- 'CREATE DATABASE odin_book;`

**6. Create Cloudinary account** (skip this step)

**7. Add the following to `.env` inside backend folder**

```
NODE_ENV="development"
PORT=[XXXX]
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/odin_book"
FRONTEND_URL="http://localhost:[PORT RUNNING LOCAL DEV SERVER]"
SESSION_SECRET= #create strong password
CLOUDINARY_CLOUD_NAME= #given by cloudinary
CLOUDINARY_API_KEY= #given by cloudinary
CLOUDINARY_API_SECRET= #given by cloudinary

```

**8. Start the project**

cd odin_book/frontend `$ npm run dev`

cd odin_book/backend `$ node --watch src/app.js `
