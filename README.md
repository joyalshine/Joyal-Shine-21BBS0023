
# Game Project

This project is a web-based game with a React frontend and a Node.js/Express backend. The game allows players to join and play in real-time with WebSocket communication.

## Project Structure

```bash
root/
│
├── frontend/       # Contains the React frontend code
├── backend/        # Contains the Node.js/Express backend code
└── README.md       # This README file
```

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or above)
- **npm** (Node Package Manager, comes with Node.js)
- **Git** (for cloning the repository)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/joyalshine/Joyal-Shine-21BBS0023.git
cd Joyal-Shine-21BBS0023
```

### 2. Setting Up the Backend

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the backend server:

    ```bash
    npm start
    ```

    The backend server will start on `http://localhost:5000`.

### 3. Setting Up the Frontend

1. Open a new terminal window/tab and navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm start
    ```

    The frontend server will start on `http://localhost:3000`.

## Running the Application

- Once both servers are running, you can open your browser and navigate to `http://localhost:3000` to access the game.
- The Home page contains a button to create a new Game
- When create game is pressed it gives you a new game url which can be shared and played
- The backend will handle the game logic, WebSocket connections, and API requests.
- The frontend will display the game board and allow players to interact with the game.
