function movePawn(gameId, row, col, direction, player) {
    let change = []
    if(player == "A") change = [1,-1]
    else change = [-1,1]
    let currBoard = games[gameId]["board"]
    if (direction == "L") {
        if (col - 1 >= 0 && (!currBoard[row][col - 1] || currBoard[row][col - 1].split('-')[0] != player)) {
            currBoard[row][col - 1] = currBoard[row][col];
            currBoard[row][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else if (direction == "R") {
        if (col + 1 < 5 && (!currBoard[row][col + 1] || currBoard[row][col + 1].split('-')[0] != player)) {
            currBoard[row][col + 1] = currBoard[row][col];
            currBoard[row][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else if (direction == "F") {
        if (row + change[0] < 5 && (!currBoard[row + change[0]][col] || currBoard[row + change[0]][col].split('-')[0] != player)) {
            currBoard[row + change[0]][col] = currBoard[row][col];
            currBoard[row][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else {
        if (row + change[1] >= 0 && (!currBoard[row + change[1]][col] || currBoard[row + change[1]][col].split('-')[0] != player)) {
            currBoard[row + change[1]][col] = currBoard[row][col];
            currBoard[row][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
}

function moveH1(gameId, row, col, direction, player) {
    let currBoard = games[gameId]["board"]
    if (direction == "L" && col - 2 >= 0) {
        if ((!currBoard[row][col - 1] || currBoard[row][col - 1].split('-')[0] != player) && (!currBoard[row][col - 2] || currBoard[row][col - 2].split('-')[0] != player)) {
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
            currBoard[row][col + 2] = currBoard[row][col];
            currBoard[row][col] = null
            currBoard[row][col + 1] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else if (direction == "F" && row + 2 < 5) {
        if ((!currBoard[row + 1][col] || currBoard[row + 1][col].split('-')[0] != player) && (!currBoard[row + 2][col] || currBoard[row + 2][col].split('-')[0] != player)) {
            currBoard[row + 2][col] = currBoard[row][col];
            currBoard[row][col] = null
            currBoard[row + 1][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else if (direction == "B" && row - 2 >= 0) {
        if ((!currBoard[row - 1][col] || currBoard[row - 1][col].split('-')[0] != player) || (!currBoard[row - 2][col] || currBoard[row - 2][col].split('-')[0] != player)) {
            currBoard[row - 2][col] = currBoard[row][col];
            currBoard[row][col] = null
            currBoard[row - 1][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else {
        return { status: false, msg: "Invalid Move" }
    }
}

function moveH2(gameId, row, col, direction, player) {
    let currBoard = games[gameId]["board"]
    if (direction == "FL" && col - 2 >= 0) {
        if ((!currBoard[row][col - 1] || currBoard[row][col - 1].split('-')[0] != player) && (!currBoard[row][col - 2] || currBoard[row][col - 2].split('-')[0] != player)) {
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
            currBoard[row][col + 2] = currBoard[row][col];
            currBoard[row][col] = null
            currBoard[row][col + 1] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else if (direction == "F" && row + 2 < 5) {
        if ((!currBoard[row + 1][col] || currBoard[row + 1][col].split('-')[0] != player) && (!currBoard[row + 2][col] || currBoard[row + 2][col].split('-')[0] != player)) {
            currBoard[row + 2][col] = currBoard[row][col];
            currBoard[row][col] = null
            currBoard[row + 1][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else if (direction == "B" && row - 2 >= 0) {
        if ((!currBoard[row - 1][col] || currBoard[row - 1][col].split('-')[0] != player) || (!currBoard[row - 2][col] || currBoard[row - 2][col].split('-')[0] != player)) {
            currBoard[row - 2][col] = currBoard[row][col];
            currBoard[row][col] = null
            currBoard[row - 1][col] = null
            games[gameId]["board"] = currBoard
            return { status: true, msg: "Moved Successfully" }
        }
        else return { status: false, msg: "Invalid Move" }
    }
    else {
        return { status: false, msg: "Invalid Move" }
    }
}

module.exports = { movePawn, moveH1, moveH2 }