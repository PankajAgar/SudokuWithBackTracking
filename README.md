A Sudoku puzzle JavaScript library.

Intro
--------------------------------------------------------------------------------

Puzzles are represented by a string of digits, 1-9, and '.' as spaces. Each character represents a square, e.g., 

"1..4795..4653.1.872.95.6.41784..5......8.7.943..2..7.85.36.28.9....5..2....9..615"
    
Represents the following board:

1 . .  | 4 7 9 |  5 . .   
4 6 5  | 3 . 1 |  . 8 7   
2 . 9  | 5 . 6 |  . 4 1
				  
------ + ----- + -----
				  
7 8 4  | . . 5 |  . . .   
. . .  | 8 . 7 |  . 9 4   
3 . .  | 2 . . |  7 . 8   
				  
------ + ----- + -----
				  
5 . 3  | 6 . 2 |  8 . 9   
. . .  | . 5 . |  . 2 .   
. . .  | 9 . . |  6 1 5
		 
Generate a Sudoku puzzle
--------------------------------------------------------------------------------

>>> sudoku.generate()
"1..4795..4653.1.872.95.6.41784..5......8.7.943..2..7.85.36.28.9....5..2....9..615"


Validate the imported string
--------------------------------------------------------------------------------

>>> sudoku.isValidImport("1..4795..4653.1.872.95.6.41784..5......8.7.943..2..7.85.36.28.9....5..2....9..615")


Solve the current puzzle
--------------------------------------------------------------------------------

>>> sudoku.solve(puzzleArray)

--------------------------------------------------------------------------------
Use the "Refresh" button to re-generate the puzzle.

Use the "Import" button to import the puzzle.

Use the "Solve" button to solve the puzzle.

Use the "Reset" button to reset the puzzle.

Use the "Validate" button to validate the user input.
