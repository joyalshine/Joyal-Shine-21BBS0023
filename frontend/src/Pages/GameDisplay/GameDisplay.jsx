import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GameBoard from '../../Components/GameBoard/GameBoard'
import './GameDisplay.css'
import toast from 'react-hot-toast';
import CharacterSelection from '../../Components/CharacterSelection/CharacterSelection'

function GameDisplay() {
    const { gameId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState("")
    const [charList, setcharList] = useState([])
    const [errMsg, setErrMsg] = useState("")
    const [playerId, setPlayerId] = useState(null);
    const [isValid, setIsValid] = useState(false)
    const [ws, setWs] = useState(null);
    const [game, setGame] = useState({})
    const [board, setBoard] = useState([])

    const [selectedPiece, setSelectedPiece] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [winStatus, setWinStatus] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const socket = new WebSocket('ws://localhost:8000/');
        setWs(socket);

        const storedPlayerId = localStorage.getItem('playerId');
        const storedGameId = localStorage.getItem('gameId');

        socket.onopen = () => {
            if (storedPlayerId && storedGameId == gameId) {
                setPlayerId(storedPlayerId);
                console.log("reconnecting")
                socket.send(JSON.stringify({ type: 'reconnect', playerId: storedPlayerId, gameId: gameId }));
            } else {
                socket.send(JSON.stringify({ type: 'init', gameId }));
            }

        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log(msg)
            if (msg.type == "start") {
                setIsValid(true)
                setIsLoading(false);
                setPlayerId(msg.playerId);
                setGame(msg.game)
                setCurrentTurn(msg.game.currentTurn)
                setWinStatus(msg.game.gameOver)
                setBoard(msg.game.board)
                setState("start")
                localStorage.setItem('playerId', msg.playerId);
                localStorage.setItem('gameId', gameId);
            } else if (msg.type == "getChars") {
                setPlayerId(msg.playerId);
                setcharList(msg.characters)
                setState("selection")
                setIsValid(true)
                setIsLoading(false);
            }
            else if (msg.type == "error") {
                setIsValid(false)
                setIsLoading(false);
                setErrMsg(msg.msg)
                setWs(null)
                socket.close()
            }
            if (msg.type === 'start') {
                setBoard(msg.game.board);
                setCurrentTurn(msg.game.currentTurn);
            }
            if (msg.type === 'update') {
                setWinStatus(msg.gameStatus)
                setBoard(msg.board);
                setCurrentTurn(msg.currentTurn);
            }
            if (msg.type === 'invalid') {
                toast.error("Invalid move, try again!", {
                    duration: 1500
                });
            }
        };
    }, []);
    return (
        <div>
            {isLoading ? <div>
                Loading
            </div> : isValid ? <div className="App">
                <header className="App-header">
                    {state == "selection" ? <CharacterSelection charList={charList} ws={ws} gameId={gameId} playerId={playerId} /> :
                        <GameBoard ws={ws} playerId={playerId} board={board} setBoard={setBoard} gameId={gameId} selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} winStatus={winStatus} setWinStatus={setWinStatus} />
                    }
                </header>
            </div> : errMsg}
        </div>
    )
}

export default GameDisplay
