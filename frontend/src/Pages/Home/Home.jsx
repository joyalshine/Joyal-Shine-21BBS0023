import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';


const Home = () => {
    const [gameId, setGameId] = useState('');

    const createNewGame = async () => {
        try {
            const res = await axios.get('http://localhost:5000/create-game'); 
            setGameId(res.data.gameId);
        } catch (err) {
            console.log(err);
        }
    };

    const launchGame = () => {
        window.open(`http://localhost:3000/game/${gameId}`, '_blank');
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Game</h1>
            <button className="create-game-button" onClick={createNewGame}>
                Create New Game
            </button>
            {gameId && (
                <div className="game-id-container">
                    {/* <p>Your Game ID:</p>
                    <h2>{gameId}</h2> */}
                    <p className='text-white'>Game URL:</p>
                    <h4>{`http://localhost:3000/game/${gameId}`}</h4>
                    <button className="launch-game-button" onClick={launchGame}>
                        Launch Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;


