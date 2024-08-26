const PORT = 5000;

const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const app = express()
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());
app.use(cors());


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });

let games = {};
const Characters = ["P", "H1", "H2"]

function createNewGame() {
  return {
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    players: [],
    currentTurn: 0,
    A: 5,
    B: 5,
    gameOver: false,
  };
}

function initializePieces(gameId, row, characters) {
  const board = games[gameId].board;
  let char = row == 0 ? 'A' : 'B'
  board[row][0] = `${char}-${characters[0]}`
  board[row][1] = `${char}-${characters[1]}`
  board[row][2] = `${char}-${characters[2]}`
  board[row][3] = `${char}-${characters[3]}`
  board[row][4] = `${char}-${characters[4]}`
}

function handlePlayerMove(gameId, playerId, move) {
  console.log("moving " + move)
  const player = playerId == 0 ? 'A' : 'B'
  const piece = move.split(":")[0];
  const direction = move.split(":")[1];
  let row = parseInt(move.split(":")[2]);
  const col = parseInt(move.split(":")[3]);
  if (player == 'A') row = 4 - row;

  if (piece == "P") return movePawn(gameId, row, col, direction, player)
  else if (piece == "H1") return moveH1(gameId, row, col, direction, player)
  else return moveH2(gameId, row, col, direction, player)
}

wss.on('connection', ws => {
  console.log("Connected " + new Date().toISOString())
  ws.on('message', message => {
    const msg = JSON.parse(message);

    if (msg.type === 'init') {
      const { gameId } = msg
      console.log(games[gameId])
      if (games[gameId]) {
        const game = games[gameId];
        if (game.players.length < 2) {
          game.players.push(ws);
          ws.send(JSON.stringify({ type: 'getChars', playerId: game.players.length - 1, characters: Characters }));
        }
        else ws.send(JSON.stringify({ type: 'error', msg: "Game Already Full" }));
      }
      else ws.send(JSON.stringify({ type: 'error', msg: "Invalid Game Id" }))

    }
    else if (msg.type === 'setChars') {
      console.log("Settimg chars")
      const { gameId, playerId, characters } = msg
      console.log(games[gameId])
      if (games[gameId]) {
        const game = games[gameId];
        initializePieces(gameId, playerId == 0 ? 0 : 4, characters)
        game.players.forEach((player, index) => {
          const gameState = {
            board: index == 0 ? game.board.slice().reverse() : game.board,
            currentTurn: game.currentTurn,
            gameOver: game.gameOver,
          };
          player.send(JSON.stringify({ type: 'start', playerId: index, game: gameState }));
        });
      }
      else ws.send(JSON.stringify({ type: 'error', msg: "Invalid Game Id" }))

    }
    else if (msg.type === 'reconnect') {
      const game = games[msg.gameId];
      if (game && msg.playerId < game.players.length) {
        game.players[msg.playerId] = ws
        game.players.forEach((player, index) => {
          const gameState = {
            board: index == 0 ? game.board.slice().reverse() : game.board,
            currentTurn: game.currentTurn,
            gameOver: game.gameOver,
          };
          player.send(JSON.stringify({ type: 'start', playerId: index, game: gameState }));
        });
      }
      else {
        console.log("invalid")
        ws.send(JSON.stringify({ type: 'error', msg: "Some error occured" }));
      }
    }
    else if (msg.type === 'move') {
      const game = games[msg.gameId];
      if (game && game.currentTurn === msg.playerId) {
        const result = handlePlayerMove(msg.gameId, msg.playerId, msg.move);
        if (result.status) {
          let opponent = msg.playerId == 0 ? "B" : "A"
          if (game[opponent] == 0) {
            game.gameOver = true;
          } else {
            game.currentTurn = game.currentTurn == 0 ? 1 : 0;
          }
          game.players.forEach((player, index) => {
            const tempBoard = index == 0 ? game.board.slice().reverse() : game.board
            player.send(JSON.stringify({ type: 'update', board: tempBoard, currentTurn: game.currentTurn, gameStatus:game.gameOver }));
          });

        }
        else {
          game.players[msg.playerId].send(JSON.stringify({ type: 'invalid' }));
        }
      }
    }
    else if (msg.type === 'restart') {
      const game = games[msg.gameId];
      for(let i=0;i<5;i++){
        for(let j=0;j<5;j++) game.board[i][j] = null
      }
      game.currentTurn = 0;
      game["A"] = 0;
      game["B"] = 0;
      game.gameOver = false;
      game.players.forEach((player, index) => {
        player.send(JSON.stringify({ type: 'getChars', playerId: index, characters: Characters }));
      });
    }
  });
});

function movePawn(gameId, row, col, direction, player) {
  let change = []
  let opponent = player == "A" ? "B" : "A"
  if (player == "A") change = [1, -1]
  else change = [-1, 1]
  let game = games[gameId]
  let currBoard = game["board"]
  if (direction == "L") {
    if (col - 1 >= 0 && (!currBoard[row][col - 1] || currBoard[row][col - 1].split('-')[0] != player)) {
      if (currBoard[row][col - 1] != null) game[opponent]--
      currBoard[row][col - 1] = currBoard[row][col];
      currBoard[row][col] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "R") {
    if (col + 1 < 5 && (!currBoard[row][col + 1] || currBoard[row][col + 1].split('-')[0] != player)) {
      if (currBoard[row][col + 1] != null) game[opponent]--
      currBoard[row][col + 1] = currBoard[row][col];
      currBoard[row][col] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "F") {
    if (row + change[0] < 5 && (!currBoard[row + change[0]][col] || currBoard[row + change[0]][col].split('-')[0] != player)) {
      if (currBoard[row + change[0]][col] != null) game[opponent]--
      currBoard[row + change[0]][col] = currBoard[row][col];
      currBoard[row][col] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else {
    if (row + change[1] >= 0 && (!currBoard[row + change[1]][col] || currBoard[row + change[1]][col].split('-')[0] != player)) {
      if (currBoard[row + change[1]][col] != null) game[opponent]--
      currBoard[row + change[1]][col] = currBoard[row][col];
      currBoard[row][col] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
}

function moveH1(gameId, row, col, direction, player) {
  let change = []
  let opponent = player == "A" ? "B" : "A"
  if (player == "A") change = [1, 2, -1, -2]
  else change = [-1, -2, 1, 2]
  let game = games[gameId]
  let currBoard = game["board"]
  if (direction == "L" && col - 2 >= 0) {
    if ((!currBoard[row][col - 1] || currBoard[row][col - 1].split('-')[0] != player) && (!currBoard[row][col - 2] || currBoard[row][col - 2].split('-')[0] != player)) {
      if (currBoard[row][col - 1] != null) game[opponent]--
      if (currBoard[row][col - 2] != null) game[opponent]--
      currBoard[row][col - 2] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[row][col - 1] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "R" && col + 2 < 5) {
    if ((!currBoard[row][col + 2] || currBoard[row][col + 2].split('-')[0] != player) && (!currBoard[row][col + 1] || currBoard[row][col + 1].split('-')[0] != player)) {
      if (currBoard[row][col + 2] != null) game[opponent]--
      if (currBoard[row][col + 1] != null) game[opponent]--
      currBoard[row][col + 2] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[row][col + 1] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "F" && row + change[1] < 5 && row + change[1] >= 0) {
    if ((!currBoard[row + change[0]][col] || currBoard[row + change[0]][col].split('-')[0] != player) && (!currBoard[row + change[1]][col] || currBoard[row + change[1]][col].split('-')[0] != player)) {
      if (currBoard[row + change[0]][col] != null) game[opponent]--
      if (currBoard[row + change[1]][col] != null) game[opponent]--
      currBoard[row + change[1]][col] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[row + change[0]][col] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "B" && row + change[3] >= 0 && row + change[3] < 5) {
    if ((!currBoard[row + change[2]][col] || currBoard[row + change[2]][col].split('-')[0] != player) || (!currBoard[row + change[3]][col] || currBoard[row + change[3]][col].split('-')[0] != player)) {
      if (currBoard[row + change[2]][col] != null) game[opponent]--
      if (currBoard[row + change[3]][col] != null) game[opponent]--
      currBoard[row + change[3]][col] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[row + change[2]][col] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else {
    return { status: false, msg: "Invalid Move" }
  }
}

function checkRange(row, col) {
  if (row >= 0 && row < 5 && col >= 0 && col < 5) return true;
  return false
}

function moveH2(gameId, row, col, direction, player) {
  let opponent = player == "A" ? "B" : "A"
  let changeRow = []
  let changeCol = []
  let betweenRow = []
  let betweenCol = []
  if (player == "A") {
    changeRow = [2, 2, -2, -2]
    changeCol = [2, -2, 2, -2]
    betweenRow = [1, 1, -1, -1]
    betweenCol = [1, -1, 1, -1]
  }
  else {
    changeRow = [-2, -2, 2, 2]
    changeCol = [-2, 2, -2, 2]
    betweenRow = [-1, -1, 1, 1]
    betweenCol = [-1, 1, -1, 1]
  }
  let game = games[gameId]
  let currBoard = game["board"]
  if (direction == "FR" && checkRange(row + changeRow[0], col + changeCol[0])) {
    let destRow = row + changeRow[0]
    let destCol = col + changeCol[0]
    let btwRow = row + betweenRow[0]
    let btwCol = col + betweenCol[0]
    if ((!currBoard[btwRow][btwCol] || currBoard[btwRow][btwCol].split('-')[0] != player) && (!currBoard[destRow][destCol] || currBoard[destRow][destCol].split('-')[0] != player)) {
      if (currBoard[btwRow][btwCol] != null) game[opponent]--
      if (currBoard[destRow][destCol] != null) game[opponent]--
      currBoard[destRow][destCol] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[btwRow][btwCol] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "FL" && checkRange(row + changeRow[1], col + changeCol[1])) {
    let destRow = row + changeRow[1]
    let destCol = col + changeCol[1]
    let btwRow = row + betweenRow[1]
    let btwCol = col + betweenCol[1]
    if ((!currBoard[btwRow][btwCol] || currBoard[btwRow][btwCol].split('-')[0] != player) && (!currBoard[destRow][destCol] || currBoard[destRow][destCol].split('-')[0] != player)) {
      if (currBoard[btwRow][btwCol] != null) game[opponent]--
      if (currBoard[destRow][destCol] != null) game[opponent]--
      currBoard[destRow][destCol] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[btwRow][btwCol] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "BR" && checkRange(row + changeRow[2], col + changeCol[2])) {
    let destRow = row + changeRow[2]
    let destCol = col + changeCol[2]
    let btwRow = row + betweenRow[2]
    let btwCol = col + betweenCol[2]
    if ((!currBoard[btwRow][btwCol] || currBoard[btwRow][btwCol].split('-')[0] != player) && (!currBoard[destRow][destCol] || currBoard[destRow][destCol].split('-')[0] != player)) {
      if (currBoard[btwRow][btwCol] != null) game[opponent]--
      if (currBoard[destRow][destCol] != null) game[opponent]--
      currBoard[destRow][destCol] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[btwRow][btwCol] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else if (direction == "BL" && checkRange(row + changeRow[3], col + changeCol[3])) {
    let destRow = row + changeRow[3]
    let destCol = col + changeCol[3]
    let btwRow = row + betweenRow[3]
    let btwCol = col + betweenCol[3]
    if ((!currBoard[btwRow][btwCol] || currBoard[btwRow][btwCol].split('-')[0] != player) && (!currBoard[destRow][destCol] || currBoard[destRow][destCol].split('-')[0] != player)) {
      if (currBoard[btwRow][btwCol] != null) game[opponent]--
      if (currBoard[destRow][destCol] != null) game[opponent]--
      currBoard[destRow][destCol] = currBoard[row][col];
      currBoard[row][col] = null
      currBoard[btwRow][btwCol] = null
      games[gameId]["board"] = currBoard
      return { status: true, msg: "Moved Successfully" }
    }
    else return { status: false, msg: "Invalid Move" }
  }
  else {
    return { status: false, msg: "Invalid Move" }
  }
}


app.get('/create-game', async (req, res) => {
  const gameId = uuidv4();
  console.log(gameId)
  games[gameId] = createNewGame();
  console.log(games[gameId])
  res.status(200).send({ gameId })
})

app.post('/check-game', async (req, res) => {
  const { gameId } = req.body
  console.log(gameId)
  if (games[gameId] && games[gameId].players.length < 2) res.status(200).send({ status: true, msg: "" })
  else if (games[gameId] && games[gameId].players.length == 2) res.status(200).send({ status: false, msg: "Game Already Full" })
  else res.status(200).send({ status: false, msg: "Invalid Game Id" })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
