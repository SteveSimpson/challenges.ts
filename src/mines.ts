// I think most of this will work OK, but its not quite done & I can see some bugs

// if I flag a location that has a help count then subsequently remove that flag
// the help count would not be shown

interface coordinate {
    x: number,
    y: number,
}

interface flagCoordinate extends coordinate {
    isMine: boolean, // true if there is actually a mine there
    lastCharacter: string,
}

// Wining is either having all hidden spaces displayed OR
// having all mines flagged
class MineSweeper {
    private board: string[][]; // [rows][cols] or [y][x]
    private helps: number[][]; // holds the number of adjacent mines
    private mines: coordinate[] = []
    private flags: flagCoordinate[] = []
    private rows: number;
    private cols: number;

    private default = "*";
    private displayFlag = "f";
    private empty = "_";



    constructor(rows: number, cols: number, mines: number) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array.from({length: rows}, () => Array.from({length: cols}, () => this.default));
        this.helps = Array.from({length: rows}, () => Array.from({length: cols}, () => 0));

        while (this.mines.length < mines) {
            this.placeMine();
        }

        // console.log(this.mines);
        this.printBoard();
        // console.log(this.helps);
    }

    private getRandIntFromZero(max: number): number {
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * maxFloored);
    }

    // this function could blow up... 
    // It should work fine when the mine count is low compared to the board size
    // But if mine count starts approaching a significant % of board size, then
    // randomly finding free spaces could become a problem.
    private placeMine(): number {
        let placed = 0;

        const col = this.getRandIntFromZero(this.cols);
        const row = this.getRandIntFromZero(this.rows);

        if (this.mines.filter(mine => mine.x === col && mine.y === row).length === 0) {
            this.mines.push({x: col, y: row});

            const startX = Math.max(0, col - 1);
            const startY = Math.max(0, row - 1);
            const endX = Math.min(this.cols - 1, col + 1);
            const endY = Math.min(this.rows - 1, row + 1);
            
            //console.log("MINE", col, row );

            // set the help adjacent mine count
            for(let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    //console.log("HELP?", x, y );
                    // skip the mine itself
                    if (x !== col && y !== row) {
                        //console.log("HELP!", x, y );
                        this.helps[y][x] = this.helps[y][x] + 1
                    }
                }
            }

            return 1;
        }

        return 0;
    }

    private isMine(x: number, y: number): boolean {
        if (this.mines.filter(mine => mine.x === x && mine.y === y).length > 0) {
            return true;
        }

        return false;
    }

    // this would just be the board object if we were using a UI
    // but this makes it prettier for text / testing
    private printBoard() {
        let showBoard = ""
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                showBoard = showBoard + this.board[y][x];
            }
            showBoard = showBoard + "\n"
        }
        console.log(showBoard);
    }

    private check(x: number, y: number) {
        const startX = Math.max(x - 1, 0);
        const startY = Math.max(y - 1, 0);
        const endX = Math.min(x + 1, this.cols - 1);
        const endY = Math.min(y + 1, this.rows - 1);

        if (this.helps[y][x] === 0 && this.board[y][x] !== this.displayFlag ) {
            // can't override a flag here, but will a false flag break stuff
            this.board[y][x] = this.empty;
        }

        if (this.board[y][x] === this.empty) {
            // this space has been cleared check around it
            for (let col = startX; col <= endX; col++) {
                for (let row = startY; row <= endY; row++) {
                    if(col !== x && row !== y) {
                        console.log(x, y);
                        
                        // this.check(col, row);
                    }
                } 
            }
        } else {
            // set the location to the help value
            this.board[y][x] = this.helps[y][x].toString();
        }
    }

    // returned if the game is done (could be a win or a loss)
    // log indicates BOOM or WIN!
    clear(x: number, y: number): boolean {
        if (this.isMine(x, y)) {
            console.log("BOOM!");

            return true;
        }
        // since this coordinate didn't BOOM! set it to clear
        // clear overrides a flag, so allow
        this.board[y][x] = this.empty;

        // then call the check function
        this.check(x, y);

        // need to actually determine win condition of everything cleared
        this.printBoard();
        return false;
    }

    toggleFlag(x: number, y: number): boolean {
        // is this currently flagged?
        const flagRemoved = this.flags.filter(flag => !(flag.x === x && flag.y === y));

        if (flagRemoved.length !== this.flags.length) {
            this.board[y][x] = this.flags.filter(flag => flag.x === x && flag.y === y)[0].lastCharacter;

            this.flags = flagRemoved;
            console.log("Flag Removed");
            this.board[y][x] = this.default;
        } else {
            this.flags.push({
                x: x,
                y: y,
                isMine: this.isMine(x, y), 
                lastCharacter: this.board[y][x],
            });

            console.log("Flag Added");
            this.board[y][x] = this.displayFlag;
        }

        // console.log(this.flags);

        // Now check flags win condition
        // have we found all the mines? & do we have any false flags?
        if (this.flags.filter(flag => flag.isMine === true).length === this.mines.length && this.flags.length === this.mines.length) {
            console.log("You found all the mines!");
            return true;
        }
        
        return false
    }

    // dump all the mines - this is for testing; ideally have an env check so that it couldn't run in a real system
    // or since its only a dumb game we let it--- ha, ha
    cheat(): coordinate[] {
        return this.mines;
    }
}

let game = new MineSweeper(10, 10, 10);

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 1; j++) {
        console.log(i, j, game.clear(i, j));
    }
}

// console.log(game.toggleFlag(1,1)); // Flagged
// console.log(game.toggleFlag(1,1)); // Flag Removed

// const mines = game.cheat();

// console.log(game.clear(mines[0].x, mines[0].y)) // this will go BOOM!

// // since we don't clear the state and nothing has really been altered with can keep playing / testing
// for(let key in mines) {
//     console.log("toogle flag: " + mines[key].x + ", " + mines[key].y);
//     console.log(game.toggleFlag(mines[key].x, mines[key].y)); // should cycle through for win
// }
