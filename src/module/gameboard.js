export const Gameboard = (function () {
    function createBoard(size) {
        const gameboard = [];
        for (let i = 0; i < size; i++) {
            gameboard[i] = [];
            for (let j = 0; j < size; j++) {
                gameboard[i][j] = 0;
            }
        }

        return gameboard;
    }

    function allShipsSunk(board) {
        const ships = new Set();

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                const cell = board[i][j];
                if (cell !== 0 && cell !== "hit" && cell !== "miss") {
                    ships.add(cell);
                }
            }
        }

        if (ships.size === 0) {
            let hasHits = false;
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if (board[i][j] === "hit") {
                        hasHits = true;
                        break;
                    }
                }
                if (hasHits) break;
            }

            return hasHits;
        }

        for (const ship of ships) {
            if (!ship.isSunk()) {
                return false;
            }
        }

        return true;
    }

    function receiveAttack(board, row, col) {
        if (row < 0 || row >= board.length || col < 0 || col >= board.length) {
            return false;
        }

        const target = board[row][col];

        if (target !== 0 && target !== "miss" && target !== "hit") {
            const ship = target;
            ship.hit(); // Send the 'hit' function to the correct ship
            board[row][col] = "hit"; // Record the hit
            return true;
        }
        else if (target === 0) {
            board[row][col] = "miss"; // Record the coordinates of the missed shot
            return true;
        }

        return false;
    }

    function placeShip(board, ship, row, col, isHorizontal = true) {
        const shipLength = ship.length;
        const boardSize = board.length;

        if (isHorizontal && col + shipLength > boardSize) {
            return false;
        }
        if (!isHorizontal && row + shipLength > boardSize) {
            return false;
        }

        if (isHorizontal) {
            for (let r = Math.max(0, row - 1); r <= Math.min(boardSize - 1, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(boardSize - 1, col + shipLength); c++) {
                    if (board[r][c] !== 0) {
                        return false;
                    }
                }
            }
        } else {
            for (let c = Math.max(0, col - 1); c <= Math.min(boardSize - 1, col + 1); c++) {
                for (let r = Math.max(0, row - 1); r <= Math.min(boardSize - 1, row + shipLength); r++) {
                    if (board[r][c] !== 0) {
                        return false;
                    }
                }
            }
        }

        if (isHorizontal) {
            for (let i = 0; i < shipLength; i++) {
                board[row][col + i] = ship;
            }
        } else {
            for (let i = 0; i < shipLength; i++) {
                board[row + i][col] = ship;
            }
        }

        return true;
    }

    return {
        createBoard,
        placeShip,
        receiveAttack,
        allShipsSunk,
    };
})();