import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
const Cell = ({ cell, isSelected, onClick, playerId }) => {
  const isOwnPiece = cell && cell.startsWith(playerId === 0 ? 'A' : 'B');
  const isOpponentPiece = cell && cell.startsWith(playerId === 0 ? 'B' : 'A');

  return (
    <div
      className={`grid-item ${isSelected ? 'selected' : ''} ${isOwnPiece ? 'own-piece' : ''} ${isOpponentPiece ? 'opponent-piece' : ''}`}
      onClick={onClick}
    >
      {cell}
    </div>
  );
};

const GameBoard = ({ ws, playerId, board,setBoard, gameId,selectedPiece, setSelectedPiece,currentTurn, setCurrentTurn,winStatus, setWinStatus}) => {

  const movements = {
    "P": [ "F", "B","L", "R"],
    "H1": ["F", "B","L", "R"],
    "H2": ["FL", "FR", "BL", "BR"]
  }

  // useEffect(() => {
  //   ws.onmessage = (event) => {
  //     console.log("client msg")
  //     const msg = JSON.parse(event.data);
  //     console.log(msg)
  //     if (msg.type === 'start') {
  //       setBoard(msg.game.board);
  //       setCurrentTurn(msg.game.currentTurn);
  //     }
  //     if (msg.type === 'update') {
  //       setWinStatus(msg.gameStatus)
  //       setBoard(msg.board);
  //       setCurrentTurn(msg.currentTurn);
  //     }
  //     if (msg.type === 'invalid') {
  //       toast.error("Invalid move, try again!", {
  //         duration: 1500
  //       });
  //     }
  //   };
  // }, [ws]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (currentTurn != playerId || winStatus) return
    if (board[rowIndex][colIndex] && board[rowIndex][colIndex].startsWith(playerId == 0 ? 'A' : 'B')) {
      setSelectedPiece({ rowIndex, colIndex });
    }
  };

  const handleMoveClick = (direction, piece) => {
    if (selectedPiece) {
      const moveCommand = `${piece}:${direction}:${selectedPiece.rowIndex}:${selectedPiece.colIndex}`;
      console.log(moveCommand)
      ws.send(JSON.stringify({ type: 'move', playerId, move: moveCommand, gameId }));
      console.log("msg sent")
      setSelectedPiece(null);
    }
  };

  const handleRestartGame = () => {
    ws.send(JSON.stringify({ type: 'restart', gameId }));
  };

  const currentPlayer = currentTurn == playerId ? `Player ${currentTurn + 1}(Your turn)` : 'Waiting for opponent';
  return (
    <div className={`game-container ${winStatus ? currentTurn == playerId ? "won-match" : "lost-match" : ""}`}>
      {!winStatus ? <h3>Current Player: {currentPlayer}</h3> : <></>}
      {winStatus ? currentTurn == playerId ?
        <div>
          <h4>You won the Game</h4>
          <div className="button-group">
            <button onClick={handleRestartGame} className="restart-button">Restart Game</button>
          </div>
        </div> :
        <div>
          <h4>Player {currentTurn + 1} won the game</h4>
          <div className="button-group">
            <button onClick={handleRestartGame} className="restart-button">Restart Game</button>
          </div>
        </div> : <></>}
      {!winStatus ? <><div className="grid-container">
        {board && board.map((row, rowIndx) => (
          row.map((cell, colIndx) => (
            <Cell
              key={rowIndx * 5 + colIndx}
              cell={cell}
              playerId={playerId}
              isSelected={selectedPiece && selectedPiece.rowIndex === rowIndx && selectedPiece.colIndex === colIndx}
              onClick={() => handleCellClick(rowIndx, colIndx)}
            />
          ))
        ))}
      </div>
        <div className="selected-info">
          Selected: {selectedPiece ? board[selectedPiece.rowIndex][selectedPiece.colIndex] : 'None'}
        </div></> : <></>}
      <div className="controls">
        {
          selectedPiece && board[selectedPiece.rowIndex][selectedPiece.colIndex] && movements[board[selectedPiece.rowIndex][selectedPiece.colIndex].split("-")[1]].map((key, indx) => {
            return (
              <button key={indx} onClick={() => handleMoveClick(key, board[selectedPiece.rowIndex][selectedPiece.colIndex].split("-")[1])}>{key}</button>
            )
          })}
      </div>
      <Toaster />
    </div>
  );
};

export default GameBoard;

