# Chatbot Fullstack Integration Plan

## Overview
This document outlines the comprehensive strategy to connect the React/Vite frontend with the Express/MySQL backend. It establishes a secure authentication flow using JWTs with frontend-managed cookies, an Axios instance for centralized API calls, scalable server actions, and a dynamic, user-friendly chatbot interface.

---

## Phase 1: Backend Updates (JWT & Department Integration)
Currently, the backend does not know the student's department during login. We must fetch it and sign it into the JWT.

1. **Update Auth Service (`backend/src/services/auth.service.js`)**
   - Modify the login SQL query to fetch the student's department by joining the `users` and `students` tables. Assuming `username` matches `roll_number`:
     ```javascript
     const [rows] = await db.execute(
       `SELECT u.*, s.department 
        FROM users u 
        LEFT JOIN students s ON u.username = s.roll_number 
        WHERE u.username = ?`,
       [username]
     );
     ```

2. **Update JWT Config (`backend/src/config/jwt.js`)**
   - Modify `generateToken` to include the `department` in the JWT payload:
     ```javascript
     export function generateToken(user) {
       return jwt.sign(
         {
           userId: user.user_id,
           role: user.role,
           department: user.department || null // Embed department
         },
         JWT_SECRET,
         { expiresIn: "1h" }
       );
     }
     ```

3. **Secure the Chat Route (`backend/src/routes/chat.routes.js`)**
   - Apply the `verifyToken` middleware to the chat endpoint:
     ```javascript
     router.post("/chat", verifyToken, chatHandler);
     ```

---

## Phase 2: Frontend Environment & Dependencies
1. **Environment Variables:**
   - Create a `.env` file in the `frontend` root directory:
     `VITE_API_BASE_URL=http://localhost:5000/api`
2. **Install Packages:**
   - Run the following command in the `frontend` directory:
     `npm install axios universal-cookie jwt-decode`

---

## Phase 3: Frontend API Architecture
1. **Create Axios Instance (`frontend/src/api/axiosInstance.js`)**
   - Import `axios` and `Cookies` from `universal-cookie`.
   - Initialize `axios.create()` using `import.meta.env.VITE_API_BASE_URL`.
   - **Request Interceptor:** Read the token via `new Cookies().get('token')` and attach it to `config.headers.Authorization` as a `Bearer` token.
   - **Response Interceptor:** Catch `401 Unauthorized` errors to automatically remove the cookie and redirect the user to the login page.

2. **Create Server Actions (`frontend/src/actions/`)**
   - **`auth.actions.js`**: Create `login(username, password)` which calls `axiosInstance.post('/login')`.
   - **`chat.actions.js`**: Create `sendMessage(message, department)` which calls `axiosInstance.post('/chat')`.
   - **`admin.actions.js`**: Prepare placeholder functions like `uploadTimetable(data)` for future backend endpoints.

---

## Phase 4: Frontend Authentication & Routing
1. **Refactor `Login.jsx`**
   - Replace the native `fetch` with the `login` server action.
   - On success, use `universal-cookie` to store the token:
     ```javascript
     const cookies = new Cookies();
     cookies.set('token', data.token, { path: '/', maxAge: 3600, sameSite: 'lax' });
     ```
   - Use `jwt-decode` to decode the token, extract the `role`, and navigate to `/student` or `/admin` accordingly.

2. **Refactor `ProtectedRoute.jsx`**
   - Remove `localStorage` logic. 
   - Check for token existence using `cookies.get('token')`.
   - If present, decode the token to verify if the user's `role` matches the `requiredRole` prop before rendering children.

---

## Phase 5: User-Friendly Chatbot Interface (`StudentDashboard.jsx`)
1. **Extract User Context:**
   - On component mount, decode the token from `universal-cookie` to extract the student's `department` so it can be passed to the `sendMessage` action.

2. **State Management:**
   - Create states: `messages` (array of `{ text, sender, time }`), `inputValue` (string), and `isTyping` (boolean).

3. **Message Handling & API Connection:**
   - Create an `handleSend` function triggered by the "Send" button or the "Enter" key.
   - Instantly append the user's message to the `messages` array and set `isTyping` to true.
   - Call `sendMessage(inputValue, decodedDepartment)`.
   - Upon receiving the response, append the bot's message to the array and set `isTyping` to false.

4. **UI/UX Formatting Upgrades:**
   - **Dynamic Rendering:** Map over the `messages` state to render user and bot chat bubbles dynamically instead of hardcoding them.
   - **Text Formatting:** The backend sends newline characters (`\n`) for timetable and fee lists. Apply the Tailwind class `whitespace-pre-wrap` to the bot's message container so these line breaks are preserved and rendered beautifully.
   - **Typing Indicator:** Render a small "Bot is typing..." animation when `isTyping` is true.
   - **Auto-Scroll:** Attach a `useRef` to a dummy div at the bottom of the chat view. Use a `useEffect` dependent on the `messages` array to trigger `scrollIntoView({ behavior: 'smooth' })` whenever a new message arrives.

5. **Logout Integration:**
   - Refactor the `handleLogout` function to run `cookies.remove('token', { path: '/' })` and redirect to the login screen.

---

## Phase 6: Recommended Future Features
1. **Admin Backend Routes:** The `AdminDashboard.jsx` forms currently lack backend support. Create Express controllers and routes (e.g., `/api/admin/timetable`) to process and insert this manual/CSV data into the database.
2. **Chat History:** Update the backend chat controller to save user queries and bot responses into the `query_history` table, and create an endpoint to load previous conversations when the user logs in.