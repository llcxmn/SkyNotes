# SkyNotes

SkyNotes is a modern, collaborative cloud-based note-taking platform. It allows users to create, edit, and organize notes with real-time collaboration, drawing tools, and customizable themes. The app supports user authentication, subscription plans, and integrates with AWS DynamoDB for scalable cloud storage. 

## Features
- **Rich Note Editing**: Create and edit sticky notes with text, colors, and drag-and-drop positioning.
- **Drawing Tools**: Draw and annotate directly on your notes with pencil and eraser tools.
- **User Authentication**: Secure login and registration with Firebase Auth.
- **Subscription Plans**: Multiple plans (Free, Stars, Orbit, Boost) with different note and word limits.
- **Cloud Storage**: All notes are saved in AWS DynamoDB for reliability and scalability.
- **Responsive UI**: Beautiful, mobile-friendly interface built with React and Tailwind CSS.
- **Chat**: Real-time chat sidebar for team communication (in collaborative mode).

## Tech Stack
- **Frontend**: React, NextJS, Tailwind CSS, SweetAlert2, FontAwesome
- **Backend**: Node.js, Express.
- **Database**: AWS DynamoDB
- **Authentication**: Firebase Auth

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- AWS account (for DynamoDB)
- Firebase project (for Auth)

### Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/llcxmn/SkyNotes.git SkyNotes
   cd SkyNotes
   ```
2. **Install dependencies:**
   ```sh
   cd client
   npm install
   cd ../server
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in both `client` and `server` folders.
   - Fill in your AWS, DynamoDB, and Firebase credentials.
4. **Run the app:**
   - Start the backend server:
     ```sh
     cd server
     npm run devStart
     ```
   - Start the frontend:
     ```sh
     cd ../client
     npm start
     ```
   - The app will be available at `http://localhost:3000`.

## Folder Structure
- `client/` - React + NextJS frontend
- `server/` - Node.js backend
- `client/src/lib/dynamoDB.js` - DynamoDB integration
- `client/src/pages/` + `client/src/component/` + `client/src/components/`- Main app pages (Notes, Billing, Profile, etc.)

## Subscription Plans
| Plan       | Notes/Day | Words/Note | 
|------------|-----------|------------|
| Free Plan  | 5         | 100        | 
| Stars      | 15        | 250        |
| Orbit      | 50        | 500        | 
| Boost      | Unlimited | Unlimited  |

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---
SkyNotes © 2025
