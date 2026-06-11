# 🛣️ API Quick Map

All API routes are prefixed with `/api`.

### 🔐 Auth Routes (`/auth`)
- `POST /signup`: Create a new account.
- `POST /login`: Authenticate a user.
- `GET /logout`: Clear session/cookies.
- `GET /check`: Verify if user is authenticated.
- `PUT /update-profile`: Update profile picture.

### 💬 Message Routes (`/message`)
- `GET /contacts`: Fetch all available users to chat with.
- `GET /chats`: Get the list of active conversations.
- `GET /:id`: Retrieve message history with a specific user.
- `POST /send/:id`: Send a new message (text or image).

---
*Refer to the controllers in `server/src/controllers` for logic details.*
