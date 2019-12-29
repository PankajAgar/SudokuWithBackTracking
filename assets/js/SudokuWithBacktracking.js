(function(root) {
    var sudoku = root.sudoku = {}; // Global reference to the sudoku library

    const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Allowed DIGITS
    const MIN_GIVENS = 30; // Minimum number of givens 
    const NR_SQUARES = 81; // Number of squares

    var solutionsCounter = 0; // solution counter to check the total solution
    var sudokuTempArray = []; // Temp array to manipulate the array

    // Blank character and board representation
    sudoku.BLANK_CHAR = '.';
    sudoku.BLANK_BOARD = "...................................................." +
        ".............................";

    // sudoku public function 
    // ------------------------------------------------------------------------- 
    // Generate the sudoku and return
    sudoku.generate = function() {

        // Create the empty array and assign to temp array
        sudokuTempArray = createArray();

        // fill the complete array 
        fillGrid();

        var array = copyArray(sudokuTempArray);
        var attempts = 10;
        var rowNumber = 0;
        var colNumber = 0;
        var backUp = 0;

        // Check 5 attempts to generate
        while (attempts > 0) {

            // Get random row and column number
            rowNumber = rand_range(0, 9);
            colNumber = rand_range(0, 9);

            // if value is not empty then get random row and column number
            while (array[rowNumber][colNumber] == sudoku.BLANK_CHAR) {
                rowNumber = rand_range(0, 9);
                colNumber = rand_range(0, 9);
            }

            // back the numeber and assign empty to row and column
            backUp = array[rowNumber][colNumber];
            array[rowNumber][colNumber] = sudoku.BLANK_CHAR;

            // Copy the array after remove random sqaure
            sudokuTempArray = copyArray(array);

            // Reset the solution counter to 0
            solutionsCounter = 0;

            // Get the total solution count
            solutionsCountInternal();

            // If it is not having exactly one solution then re-assign the backup
            if (solutionsCounter != 1) {
                array[rowNumber][colNumber] = backUp;
                attempts -= 1;
            }
        }

        console.log(sudoku.board_grid_to_string(array));
        return array;
    };

    // Solve the passed puzzle and return solved array
    sudoku.solve = function(array) {
        sudokuTempArray = copyArray(array);
        if (solveInternal())
            return sudokuTempArray;

        throw "Not able to solve"
    };

    // Validate the import string
    sudoku.isValidImport = function(board) {

        // Empty board
        if (!board) {
            throw "Empty board.";
        }

        // Invalid board length
        if (board.length !== NR_SQUARES) {
            throw "Invalid board size. Board must be exactly " + NR_SQUARES +
                " squares.";
        }

        var nr_givens = 0;
        // Check for invalid characters and number of givens is at least MIN_GIVENS
        for (var i in board) {
            var intValue = parseInt(board[i])
            if (!isNaN(intValue)) {
                ++nr_givens;
            }
            if (board[i] !== sudoku.BLANK_CHAR && isNaN(intValue)) {
                throw "Invalid board character encountered at index " + i +
                    ": " + board[i];
            }
        }

        // If given inputs are less then minimum count
        if (nr_givens < MIN_GIVENS) {
            throw "Too few givens. Minimum givens is " + MIN_GIVENS;
        }

        sudokuTempArray = copyArray(sudoku.board_string_to_grid(board));

        // Validate if suduko is having unique numbers
        if (!isUniqueNumber(sudokuTempArray)) {
            throw "Invalid board, Number is not unique";
        }

        solutionsCounter = 0;
        solutionsCountInternal()

        // Check for solutions count
        if (solutionsCounter < 1)
            throw "No sudoku solution exist";
        else if (solutionsCounter > 1)
            throw "Sudoku has total " + MIN_GIVENS + " soluions, it should be unique"

        return true;

    };

    // Get total solutions count for passed array
    sudoku.solutionsCount = function(array) {
        sudokuTempArray = copyArray(array);
        solutionsCounter = 0;
        sudoku.solutionsCountInternal()
        return solutionsCounter;
    };

    // Conversions
    // -------------------------------------------------------------------------
    // Convert a board string to a two-dimensional array
    sudoku.board_string_to_grid = function(board_string) {
        var rows = [];
        var cur_row = [];
        for (var i in board_string) {
            cur_row.push(board_string[i]);
            if (i % 9 == 8) {
                rows.push(cur_row);
                cur_row = [];
            }
        }
        return rows;
    };

    // Convert a board grid to a string
    sudoku.board_grid_to_string = function(board_grid) {
        var board_string = "";
        for (var r = 0; r < 9; ++r) {
            for (var c = 0; c < 9; ++c) {
                board_string += board_grid[r][c];
            }
        }
        return board_string;
    };

    // Private Function
    // -------------------------------------------------------------------------
    // Fill the sudoku array for full solution
    function fillGrid() {
        // Get the next empty cell
        var nextEmptyCell = isNextEmptyCell();
        if (!nextEmptyCell.isCellAvailable) {
            return true;
        }

        var row = nextEmptyCell.row;
        var column = nextEmptyCell.column;

        // Shuffle the digits
        randomArray = shuffle(DIGITS);

        for (var value = 0; value < 9; value++) {
            // Check if number is not used in array
            if (CheckIfSafe(row, column, randomArray[value])) {
                sudokuTempArray[row][column] = randomArray[value];
                // If grid is full then return
                if (checkGrid())
                    return true;
                // Recursively fill the grid
                else if (fillGrid())
                    return true;

                // if it is not able to fill the full grid then set the blank
                sudokuTempArray[row][column] = sudoku.BLANK_CHAR;
            }
        }
        return false;
    };

    // Get the sudoku solution count
    function solutionsCountInternal() {
        // Get the next empty cell
        var nextEmptyCell = isNextEmptyCell();
        if (!nextEmptyCell.isCellAvailable) {
            return true;
        }

        var row = nextEmptyCell.row;
        var column = nextEmptyCell.column;

        for (var value = 1; value <= 9; value++) {
            // Check if number is not used in array
            if (CheckIfSafe(row, column, value)) {
                sudokuTempArray[row][column] = value;
                // If grid is full then set to false to see if other solution exists
                if (checkGrid()) {
                    solutionsCounter++;
                    return false;
                 // Recursively solve the grid
                } else if (solutionsCountInternal())
                    return true;

                // if it is not able to fill the full grid then set the blank
                sudokuTempArray[row][column] = 0;
            }
        }
        return false;
    };

    // Solve the sudoku
    function solveInternal() {
        // Get the next empty cell
        var nextEmptyCell = isNextEmptyCell();
        if (!nextEmptyCell.isCellAvailable) {
            return true;
        }

        var row = nextEmptyCell.row;
        var column = nextEmptyCell.column;

        for (var value = 1; value <= 9; value++) {
             // Check if number is not used in array
            if (CheckIfSafe(row, column, value)) {
                sudokuTempArray[row][column] = value;

                // Recursively solve the grid
                if (solveInternal())
                    return true;

                // if it is not able to fill the full grid then set the blank
                sudokuTempArray[row][column] = sudoku.BLANK_CHAR;
            }
        }
        return false;
    };

    // Check if array has unique number.
    function isUniqueNumber(board) {
        var rowHashes = [];
        var colHashes = [];
        var ltrHash = {};
        var rtlHash = {};
        var squareHash = {};

        for (var i = 0; i < 9; i++) {
            rowHashes[i] = {};
            colHashes[i] = {};
        }

        for (var i = 0; i < 3; i++) {
            squareHash[i] = {};
            for (var j = 0; j < 3; j++) {
                squareHash[i][j] = {};
            }
        }

        for (var i = 0; i < 9; i++) {
            var rowSquare = Math.floor(i / 3);

            for (var j = 0; j < 9; j++) {
                var value = board[i][j];
                if (value === sudoku.BLANK_CHAR) {
                    continue; // don't process
                }

                // If value already exists in row return false
                if (rowHashes[i][value]) {
                    return false;
                }

                // If value already exists in column return false
                if (colHashes[j][value]) {
                    return false;
                }

                var columnSquare = Math.floor(j / 3);

                // If value already exists in 3*3 square return false
                if (squareHash[rowSquare][columnSquare][value]) {
                    return false;
                }

                squareHash[rowSquare][columnSquare][value] = true;
                rowHashes[i][value] = true;
                colHashes[j][value] = true;
            }
        }
        return true;
    }

    // Get the next empty cell
    function isNextEmptyCell() {
        var row = column = 0;
        var isCellAvailable = false;
        for (row = 0; row < 9; row++) {
            for (column = 0; column < 9; column++) {
                if (sudokuTempArray[row][column] == sudoku.BLANK_CHAR) {
                    isCellAvailable = true;
                    break;
                }
            }
            if (isCellAvailable)
                break;

        }
        var obj = {
            isCellAvailable: isCellAvailable,
            row: row,
            column: column
        };
        return obj;;
    }

    // Check if grid is full
    function checkGrid() {
        for (var row = 0; row < 9; row++) {
            for (var column = 0; column < 9; column++) {
                if (sudokuTempArray[row][column] == sudoku.BLANK_CHAR) {
                    return false;
                }
            }
        }
        return true;
    }

     // Check if number is safe to add in grid
    function CheckIfSafe(rowNumber, columnNumber, value) {

        // Check for full row and column
        for (var i = 0; i < 9; i++) {
            if (sudokuTempArray[rowNumber][i] == value || sudokuTempArray[i][columnNumber] == value) {
                return false;
            }
        }

        // Check for 3*3 square
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (sudokuTempArray[i + (rowNumber - rowNumber % 3)][j + (columnNumber - columnNumber % 3)] == value) {
                    return false;
                }
            }
        }

        return true;
    }

    // Utility Function
    // -------------------------------------------------------------------------
    // Create 9*9 empty array
    function createArray() {
        var array = new Array();
        for (var i = 0; i < 9; i++) {
            array[i] = [];
        }

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                array[i][j] = sudoku.BLANK_CHAR
            }
        }
        return array;
    };

    // Copy 9*9 array from passed array
    function copyArray(array) {
        var copyArray = new Array();
        for (var i = 0; i < 9; i++) {
            copyArray[i] = [];
        }

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                copyArray[i][j] = array[i][j];
            }
        }
        return copyArray;
    };

    // Shuffle array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            // swap elements array[i] and array[j]
            // we use "destructuring assignment" syntax to achieve that
            // you'll find more details about that syntax in later chapters
            // same can be written as:
            // let t = array[i]; array[i] = array[j]; array[j] = t
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Get random number between min an max
    function rand_range(min, max) {
        min = min || 0;
        return Math.floor(Math.random() * (max - min)) + min;
    };

    // Pass whatever the root object is, lsike 'window' in browsers
})(this);