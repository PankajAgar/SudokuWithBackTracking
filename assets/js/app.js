var BOARD_SEL = "#sudoku-board";
var TABS_SEL = "#generator-tabs";
var MESSAGE_SEL = "#message";
var PUZZLE_CONTROLS_SEL = "#puzzle-controls";
var IMPORT_CONTROLS_SEL = "#import-controls";
var SOLVER_CONTROLS_SEL = "#solver-controls";

var boards = {
    "generate": null,
    "import": null
};

// build board with 9*9 Sqaure inputs
var build_board = function() {
    for (var r = 0; r < 9; ++r) {
        var $row = $("<tr/>", {});
        for (var c = 0; c < 9; ++c) {
            var $square = $("<td/>", {});
            if (c % 3 == 2 && c != 8) {
                $square.addClass("border-right");
            }
            $square.append(
                $("<input/>", {
                    id: "row" + r + "-col" + c,
                    class: "square",
                    maxlength: "1",
                    type: "text"
                })
            );
            $row.append($square);
        }
        if (r % 3 == 2 && r != 8) {
            $row.addClass("border-bottom");
        }
        $(BOARD_SEL).append($row);
    }
};

// initialize board 
var init_board = function() {
    $(BOARD_SEL + " input.square").keyup(function() {
        $(this).change();
    });

};

// initialize tabs
var init_tabs = function() {
    $(TABS_SEL + " a").click(function(e) {
        e.preventDefault();
        var $t = $(this);
        var t_name = $t.attr("id");

        $(MESSAGE_SEL).hide();

        // If it's the import tab
        if (t_name === "import") {
            $(PUZZLE_CONTROLS_SEL).hide();
            $(IMPORT_CONTROLS_SEL).show();

            // Otherwise it's a normal difficulty tab
        } else {
            $(PUZZLE_CONTROLS_SEL).show();
            $(IMPORT_CONTROLS_SEL).hide();
        }
        show_puzzle(t_name);
        $t.tab('show');
    });
};

// Attach events
var init_controls = function() {

    // Re-generate the puzzle on click of refresh
    $(PUZZLE_CONTROLS_SEL + " #refresh").click(function(e) {
        e.preventDefault();
        var tab_name = get_tab();
        if (tab_name !== "import") {
            show_puzzle(tab_name, true);
        }
    });

    // Validate the import string and update the board
    $(IMPORT_CONTROLS_SEL + " #import-string").change(function() {
        var import_val = $(this).val();
        var error = false;
        var message = "";
        try {
            var solved_board = sudoku.isValidImport(import_val);
        } catch (e) {
            error = true;
            message = e;
        }

        if (!error) {
            boards["import"] = sudoku.board_string_to_grid(import_val);
            show_puzzle("import");
            $(MESSAGE_SEL + " #text")
                .html('');
            $(MESSAGE_SEL).hide();
        } else {
            $(MESSAGE_SEL + " #text")
                .html(message);
            $(MESSAGE_SEL).show();
            show_puzzle("import", true);
        }

    });

    // Attach key up event on input string
    $(IMPORT_CONTROLS_SEL + " #import-string").keyup(function() {
        $(this).change();
    });

    // Solve the current puzzle
    $(SOLVER_CONTROLS_SEL + " #solve").click(function(e) {
        e.preventDefault();
        solve_puzzle(get_tab());
    });

    // Reset the current puzzle
    $(SOLVER_CONTROLS_SEL + " #resetSolve").click(function(e) {
        e.preventDefault();
        reset_solve_puzzle(get_tab());
    });

    // Validate the user input puzzle
    $(SOLVER_CONTROLS_SEL + " #checkSolved").click(function(e) {
        e.preventDefault();
        check_Solved_puzzle(get_tab());
    });
};

// Initialize message
var init_message = function() {
    $(MESSAGE_SEL).hide();
}

// Solve the current puzzle
var solve_puzzle = function(puzzle) {
    if (typeof boards[puzzle] !== "undefined") {
        var error = false;
        try {
            var solved_board = sudoku.solve(boards[puzzle]);
        } catch (e) {
            error = true;
        }

        if (!error) {
            display_puzzle(solved_board, true);
            $(MESSAGE_SEL).hide();
        } else {
            $(MESSAGE_SEL + " #text")
                .html("<strong>Unable to solve!</strong> " +
                    "Check puzzle and try again.");
            $(MESSAGE_SEL).show();
        }
    }
};

// Validate the user input puzzle
var check_Solved_puzzle = function(puzzle) {
    if (typeof boards[puzzle] !== "undefined") {
        var error = false;
        try {
            var solved_board = sudoku.solve(boards[puzzle]);
        } catch (e) {
            error = true;
        }

        if (!error) {
            if (check_puzzle(solved_board)) {
                $(MESSAGE_SEL + " #text")
                    .html("<strong>Congrats you have done it !</strong>");
            } else {
                $(MESSAGE_SEL + " #text")
                    .html("<strong>Solution is not valid, Please re-check !</strong>");
            }
            $(MESSAGE_SEL).show();
        } else {
            $(MESSAGE_SEL + " #text")
                .html("<strong>Unable to solve!</strong> " +
                    "Check puzzle and try again.");
            $(MESSAGE_SEL).show();
        }
    }
};

// Reset the current puzzle
var reset_solve_puzzle = function(puzzle) {
    if (typeof boards[puzzle] !== "undefined") {
        display_puzzle(boards[puzzle], false);
    }
};

// Show puzzle
var show_puzzle = function(puzzle, refresh) {

    // If not a valid puzzle, default -> "generate"
    if (typeof boards[puzzle] === "undefined") {
        puzzle = "generate";
    }

    if (boards[puzzle] === null || refresh) {
        if (puzzle === "import") {
            boards[puzzle] = sudoku.board_string_to_grid(sudoku.BLANK_BOARD);
        } else {
            boards[puzzle] = sudoku.generate();
        }
    }

    display_puzzle(boards[puzzle]);
}

// display the puzzle in board
var display_puzzle = function(board, highlight) {
    for (var r = 0; r < 9; ++r) {
        for (var c = 0; c < 9; ++c) {
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            $square.removeClass("yellow-text");
            $square.removeClass("red-text");
            $square.removeClass("green-text");
            if (board[r][c] != sudoku.BLANK_CHAR) {
                var board_val = board[r][c];
                var square_val = $square.val();
                var isDisabled = $square.is('[disabled=disabled]');
                // If highlight and square is not disabled
                if (highlight && !isDisabled) {
                    // If user and not entered any number show green
                    if (square_val == "")
                        $square.addClass("green-text");
                    // If user and solved board number is different show red
                    else if (square_val != board_val)
                        $square.addClass("red-text");
                } else {
                    $square.attr("disabled", "disabled");
                }
                $square.val(board_val);
            } else {
                $square.val('');
                $square.removeAttr('disabled');
            }
            $square.change();
        }
    }
};

// check the puzzle with user input
var check_puzzle = function(board) {
    for (var r = 0; r < 9; ++r) {
        for (var c = 0; c < 9; ++c) {
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            var board_val = board[r][c];
            var square_val = $square.val();
            if (square_val != board_val) {
                return false;
            }
        }
    }
    return true;
};

// Get active tab.
var get_tab = function() {
    return $(TABS_SEL + " li.active a").attr("id");
};

// Click tab
var click_tab = function(tab_name) {
    $(TABS_SEL + " #" + tab_name).click();
};

// Initialize the game
$(function() {
    build_board();
    init_board();
    init_tabs();
    init_controls();
    init_message();

    // Initialize tooltips
    $("[rel='tooltip']").tooltip();

    // Start with generating an easy puzzle
    click_tab("generate");

    // Hide the loading screen, show the app
    $("#app-wrap").removeClass("hidden");
    $("#loading").addClass("hidden");
});