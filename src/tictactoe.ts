
class TicTacToe {
    board: number[][] = [];
    currentPlayer: number = -1;

    constructor(size: number) {
        const row = Array(size).fill(-1);
        for (let i = 0; i < size; i++) {
            //add a copy of the row to the column
            this.board.push([...row]);
        }
    }

    private checkWin(x: number, y: number, player: number): boolean {
        const size = this.board.length;
        let winColumn = 1;
        let winRow = 1;
        let winDiag1 = 1;
        let winDiag2 = 1;

        for (let i = 0; i < size; i++) {
            // check column - if any cell in the column is not the player, no win
            if (this.board[x][i] != player) {
                winColumn = 0;
            }
            // check row
            if (this.board[i][y] != player) {
                winRow = 0;
            }
            // check diagonal top-left to bottom-right
            if (this.board[i][i] != player) {
                winDiag1 = 0;
            }
            // check diagonal bottom-left to top-right
            if (this.board[i][size - i - 1] != player) {
                winDiag2 = 0;
            }
        }

        if (winColumn + winRow + winDiag1 + winDiag2 > 0) {
            return true;
        }   

        return false;
    }

    move(x: number, y: number, player: number): boolean {
        if (player === this.currentPlayer) {
            throw new Error("Not your turn");
        }
        if (this.board[x][y] !== -1) {
            throw new Error("Cell already occupied");
        }
        this.board[x][y] = player;
        this.currentPlayer = player;

        return this.checkWin(x, y, player);
    }
}

export { TicTacToe };
    
// Example usage:          
let game = new TicTacToe(3);
console.log(game.move(0, 0, 1)); // false
console.log(game.move(0, 1, 2)); // false
console.log(game.move(1, 1, 1)); // false
console.log(game.move(0, 2, 2)); // false
console.log(game.move(2, 2, 1)); // true (player 1 wins)


game = new TicTacToe(3);
console.log(game.move(0, 0, 1)); // false
try {
    console.log(game.move(0, 1, 1)); // excepotion
} catch (e: any) {
    console.log(e.message);
}

game = new TicTacToe(3);
console.log(game.move(0, 0, 1)); // false
try {
    console.log(game.move(0, 0, 2)); // excepotion
} catch (e: any) {
    console.log(e.message);
}
