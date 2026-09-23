let currentBoardId = "website";

const boardTitle = document.querySelector(".board-header h1");

// Load Board
function loadBoard(boardId) {
    const board = boardData[boardId];

    if (!board) return;

    const boardContainer = document.querySelector(".board");

    boardContainer.innerHTML = "";
    currentPage = 1;

    board.lists.forEach(function (listData) {
        boardContainer.append(
            createList(listData.name, listData.tasks)
        );
    });

    showLists();
}

// Save Board
function saveCurrentBoard() {
    const lists = document.querySelectorAll(".board > .list");

    boardData[currentBoardId].lists =
        Array.from(lists).map(function (list) {
            const cards = list.querySelectorAll(".task-card");

            return {
                name: list.querySelector(".list-header h2").textContent,

                tasks: Array.from(cards).map(function (card) {
                    const description = card.querySelector("p");

                    return {
                        title: card.querySelector("h3").textContent,

                        description:
                            description.dataset.fullDescription ||
                            description.textContent,

                        assignedTo:
                            card.querySelector("small").textContent
                                .replace("Assigned to: ", "")
                    };
                })
            };
        });

    localStorage.setItem(
        "taskBoardData",
        JSON.stringify(boardData)
    );
}

// Switch Board
function switchBoard(boardItem) {
    saveCurrentBoard();

    document.querySelectorAll(".board-item").forEach(function (item) {
        item.classList.remove("active");
    });

    boardItem.classList.add("active");

    currentBoardId = boardItem.dataset.board;
    boardTitle.textContent = boardData[currentBoardId].title;

    loadBoard(currentBoardId);
}

// Sidebar
function setupSidebar() {
    document.querySelector(".sidebar").addEventListener(
        "click",
        function (event) {
            const boardItem = event.target.closest(".board-item");

            if (boardItem) {
                switchBoard(boardItem);
            }
        }
    );
}

// Create Board
function setupCreateBoard() {
    const createBoardButton =
        document.querySelector(".create-board");

    createBoardButton.addEventListener("click", function () {
        if (document.querySelector(".board-form")) return;

        const { form, inputs, submitBtn } = buildForm(
            "board-form",
            ["Enter board name"],
            "Create"
        );

        const boardInput = inputs[0];

        createBoardButton.before(form);
        boardInput.focus();

        submitBtn.addEventListener("click", function () {
            const boardName = boardInput.value.trim();

            if (boardName === "") {
                alert("Please enter board name");
                return;
            }

            const boardId = "board_" + Date.now();

            // Create new board with default lists
            boardData[boardId] = {
                title: boardName,

                lists: [
                    {
                        name: "To Do",
                        tasks: []
                    },
                    {
                        name: "In Progress",
                        tasks: []
                    },
                    {
                        name: "Done",
                        tasks: []
                    }
                ]
            };

            const boardItem = el(
                "div",
                "board-item",
                boardName
            );

            boardItem.dataset.board = boardId;

            form.replaceWith(boardItem);

            localStorage.setItem(
                "taskBoardData",
                JSON.stringify(boardData)
            );

            switchBoard(boardItem);
        });
    });
}