<div align="center">

# 📸 FlexIt

### _A Sleek, Premium Social Media Platform (Inspired by Instagram) with Real-Time Messaging & Media Hosting_

**Modern Feed · Double-Tap Like Animation · Google OAuth & Local JWT Authentication · Socket.io Real-time Chat · ImageKit Cloud CDN Integration · Private Accounts & Follow Requests**

[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📖 What is FlexIt?

**FlexIt** is a full-featured, responsive, production-ready social media platform inspired by Instagram. It provides users with a fluid, modern interface for sharing experiences, building a profile, and connecting with friends.

Key capabilities include:
- **Rich Social Feed & Interaction**: Share image and video posts (supporting carousel uploads of up to 7 media files), double-tap to like with interactive bubble pop animations, and follow other users.
- **Privacy & Request Control**: Users can toggle between Public and Private account settings. Private profiles trigger follow requests that can be accepted or rejected in a dedicated notification dashboard.
- **Real-Time Direct Messaging**: Seamless private chatting powered by a secure Socket.io connection. Conversational threads update instantly without page reloads.
- **High-Performance CDN Storage**: Integrates directly with the ImageKit.io Node SDK to handle fast, optimized cloud hosting for avatars, photos, and video posts.

The application is built with a modular, **feature-sliced frontend architecture** paired with a secure, RESTful **Express backend**, allowing for easy scaling and clean codebase maintenance.

---

## ✨ Features

- 🔐 **Dual Auth Flow** — Local email & password registration (with robust server-side validation and hashing) + social **Google OAuth 2.0 (Passport.js)** logins. Secure session tokens are transmitted and saved via HTTP-only cookies.
- 📸 **Advanced Post Composer** — Post up to 7 photos or videos in a single post. Features automatic client-side form parsing and memory-buffered uploads directly to **ImageKit CDN**.
- 🎬 **Dynamic Social Feed & Media Player** — Custom slide-to-transition carousels with dot trackers. Video posts support mute/unmute toggles and utilize an **Intersection Observer** to auto-play/pause videos contextually as they scroll in and out of the viewport.
- ❤️ **Interactive Micro-Animations** — Sleek Framer Motion transitions. Includes "double-tap to like" logic that triggers a pulsing heart overlay animation.
- 💬 **Authenticated Real-Time Chat** — Instant full-duplex messaging built on **Socket.io**. The chat sidebar lists conversations sorted by recency and handles instant push messaging.
- 👤 **Granular Profile Settings** — Update account bios, usernames, private/public account status, and profile pictures. Displays user posts in a responsive grid.
- 🔔 **Follow Request Notifications** — Live status updates and request moderation panel to accept/reject followers.
- 🔍 **Real-Time User Search** — Search database profiles with instant feedback and inline follow triggers.
- 📦 **Docker Support** — Seamless local environment setup using `docker-compose` alongside a multi-stage production Dockerfile.

---

## 🏗️ Tech Stack

### Frontend (`/frontend`)
| Technology | Purpose |
|---|---|
| React 19 | UI component architecture and state bindings |
| Vite 8 | Fast module bundler and development server |
| Redux Toolkit | Centralized global store management (auth state, chat data, user profiles) |
| Tailwind CSS v4 | Native utility-first stylesheet layouts |
| Framer Motion | High-performance CSS micro-animations, slide transitions, and double-tap heart pops |
| Lucide React | High-quality, clean vector icon pack |
| Axios | Client-side HTTP requests with interceptors and credential-sharing |
| Socket.io-client | Real-time websocket communication interface |

### Backend (`/backend`)
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API routers, controllers, and socket orchestration |
| MongoDB + Mongoose | NoSQL Document Database and ODM schema modelings |
| Socket.io | Full-duplex websocket server |
| Passport.js | Google OAuth 2.0 social authentication strategy |
| ImageKit Node SDK | Programmatic media uploads, image resizing, and video delivery |
| JSONWebToken | Secure stateless token signing and verification |
| Cookie-Parser | Express cookie extraction for JWTs |
| Multer | Multipart file upload parsing (memory storage) |
| Express Validator | Server-side request body sanitation and validation |

---

## 📂 Project Structure

```
FlexIt/
├── backend/                 # Node.js + Express.js Backend
│   ├── src/
│   │   ├── config/          # Environment & Database connections
│   │   ├── controllers/     # Controller handlers (auth, chat, post, user)
│   │   ├── middlewares/     # JWT authentication middleware
│   │   ├── models/          # MongoDB Mongoose schemas (User, Post, Like, Comment, Follow, Message)
│   │   ├── routes/          # REST Endpoint routes
│   │   ├── services/        # Storage helper service (ImageKit wrapper)
│   │   ├── socket/          # Socket.io chat server handling
│   │   ├── validators/      # express-validator schemas
│   │   └── app.js           # Server middlewares, routing, and passport init
│   ├── public/              # Production frontend built bundle
│   ├── dockerfile           # Development Docker config
│   └── server.js            # Node HTTP server launcher
│
├── frontend/                # Vite + React Frontend
│   ├── src/
│   │   ├── app/             # App Router, Global CSS, Redux store configs
│   │   ├── components/      # Reusable UI layouts (Dock, Sidebar, Windows, layouts)
│   │   ├── features/        # Feature-sliced modules (auth, chats, posts, users)
│   │   │   ├── auth/        # Login/Register pages, state hooks, and API actions
│   │   │   ├── chats/       # Real-time messages page, hooks, and services
│   │   │   ├── posts/       # Post creation, home feed, likes, and carousels
│   │   │   └── users/       # Profile edit, follow requests, user search
│   │   └── utils/           # Global helpers & Axios instance configuration
│   ├── dockerfile           # Development Docker config
│   ├── index.html           # HTML mount point
│   └── vite.config.js       # Vite build configurations
│
├── docker-compose.yml       # Dev orchestration configuration
└── dockerfile               # Root production multi-stage Docker build
```

---

## 🔌 API Reference

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `POST` | `/register` | Public | Register a new local account (validates name, email, password) |
| `POST` | `/login` | Public | Authenticates credentials locally and issues JWT HTTP cookie |
| `POST` | `/logout` | Bearer/Cookie | Clears auth tokens and logs out user session |
| `GET`  | `/me` | Bearer/Cookie | Resolves profile details of currently authenticated user |
| `GET`  | `/google` | Public | Redirects user to Google OAuth credentials screen |
| `GET`  | `/google/callback` | Google Redirect | Processes Google OAuth profile, registers/logs in user, issues JWT cookie |

### 📸 Posts — `/api/posts`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `POST` | `/` | Bearer/Cookie | Creates post with up to 7 image/video attachments (multipart-form upload) |
| `GET`  | `/` | Public | Fetches all social feed posts |

### 👤 User Management & Follows — `/api/users`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `GET`  | `/search` | Bearer/Cookie | Searches profiles by username query |
| `POST` | `/follow/:userId` | Bearer/Cookie | Follow/Unfollow a user (triggers pending request if account is private) |
| `GET`  | `/follow-requests` | Bearer/Cookie | Fetches incoming follow requests for private profiles |
| `PATCH`| `/follow-requests/:requestId/accept` | Bearer/Cookie | Accepts follow request |
| `DELETE`| `/follow-requests/:requestId/reject` | Bearer/Cookie | Rejects follow request |
| `GET`  | `/profile` | Bearer/Cookie | Retrieves profile and posts of the authenticated user |
| `PUT`  | `/profile` | Bearer/Cookie | Updates user settings (username, bio, profile image, public/private status) |

### 💬 Real-Time Chats — `/api/chats`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `GET`  | `/users` | Bearer/Cookie | Fetches all active chat user connections |
| `GET`  | `/messages/:userId` | Bearer/Cookie | Retrieves private conversation history with a target user |

---

## 🔌 WebSocket Events (Real-Time Chat)

WebSocket connection requires a valid HTTP JWT token cookie. Under the hood, Socket.io parses incoming cookies to authenticate connections.

### Client-to-Server Events
- `send_message` (data): Emits a private message to a specific receiver.
  ```json
  {
    "message": "Hello!",
    "receiver": "receiver_user_id"
  }
  ```

### Server-to-Client Events
- `receive_message` (payload): Received when another user sends a message.
  ```json
  {
    "_id": "message_id",
    "content": "Hello!",
    "sender": "sender_user_id",
    "receiver": "receiver_user_id",
    "createdAt": "2026-05-29T00:00:00.000Z"
  }
  ```
- `message_sent` (payload): Acknowledgment sent back to the sender containing the saved message schema.
- `message_error` (error): Emitted to the client if a message fails to save or send.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (version 20+)
- MongoDB Atlas or a local MongoDB database instance
- Google Cloud Console credentials (for Google OAuth client ID and Secret)
- ImageKit.io Account (for media uploads and delivery CDN)

---

### Method 1: Running Manually (Locally)

#### 1. Clone the Repository
```bash
git clone https://github.com/shobhit2603/FlexIt.git
cd FlexIt
```

#### 2. Set Up the Backend Server
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key_secret
FRONTEND_URL=http://localhost:5173

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# ImageKit Credentials
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

> [!NOTE]
> For local manual running (without Docker), update the `proxy` settings inside `frontend/vite.config.js` to target your local backend server:
> ```js
> proxy: {
>   "/api": {
>     target: "http://localhost:3000",
>     changeOrigin: true,
>   },
>   "/socket.io": {
>     target: "http://localhost:3000",
>     changeOrigin: true,
>   }
> }
> ```

Start the backend in development mode:
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

#### 3. Set Up the Client Frontend
```bash
cd ../frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### Method 2: Running with Docker-Compose

Docker Compose spins up the backend and frontend client simultaneously, referencing internal service DNS names (`http://backend:3000` inside Vite's proxy configs).

#### 1. Configure the `.env` Files
Create the `/backend/.env` file as shown above.

#### 2. Launch Docker Compose
In the root directory of the project, execute:
```bash
docker-compose up --build
```
This builds the client and server images, handles volume caching for node_modules, and launches the services:
- **Frontend Client**: Exposed on `http://localhost:5173`
- **Backend Server**: Exposed on `http://localhost:8080` (internally port `3000`)

To stop the containers, run:
```bash
docker-compose down
```

---

### Method 3: Deploying with Production Dockerfile (Single Container)
The root repository contains a production-ready `dockerfile` that uses a multi-stage process to compile the React frontend, copy the build assets into the Express server's public directory, and start the node server.

To run the production container:
```bash
docker build -t flexit:latest .
docker run -p 3000:3000 --env-file ./backend/.env flexit:latest
```

---

## 🌐 Deployment

| Service | Recommended Provider | Configuration |
|---|---|---|
| **Frontend & Backend (Monolith Container)** | **Render / fly.io / AWS ECS** | Deploy using the root-level `dockerfile`. Set port mapping to `3000` and supply the backend env variables. |
| **Database** | **MongoDB Atlas** | Managed MongoDB Cloud Instance. Make sure to whitelist the server's IP address. |
| **Media Assets CDN** | **ImageKit.io** | Cloud CDN for optimized delivery and storage of images/videos. |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.

---

<div align="center">

Built with ❤️ by [Shobhit](https://github.com/shobhit2603)

</div>
