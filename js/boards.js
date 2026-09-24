let currentBoardId = "website";

const boardTitle = document.querySelector(".board-header h1");


function loadBoard(boardId) {

    const board = boardData[boardId];

    if (!board) return;

    const boardContainer =
        document.querySelector(".board");

    boardContainer.innerHTML = "";

    board.lists.forEach(function (listData) {

        boardContainer.append(
            createList(
                listData.name,
                listData.tasks
            )
        );

    });
}


function saveCurrentBoard() {

    const lists =
        document.querySelectorAll(".board > .list");

    boardData[currentBoardId].lists =
        Array.from(lists).map(function (list) {

            const cards =
                list.querySelectorAll(".task-card");

            return {

                name:
                    list.querySelector(
                        ".list-header h2"
                    ).textContent,

                tasks:
                    Array.from(cards).map(function (card) {

                        const description =
                            card.querySelector("p");

                        return {

                            title:
                                card.querySelector(
                                    "h3"
                                ).textContent,


                            description:
                                description
                                    .dataset
                                    .fullDescription ||
                                description.textContent,


                            assignedTo:
                                card.querySelector(
                                    "small"
                                ).textContent
                                    .replace(
                                        "Assigned to: ",
                                        ""
                                    ),


                            /* SAVE PRIORITY */
                            priority:
                                card.querySelector(
                                    ".priority-dropdown"
                                )?.selectedValue ||
                                "Medium"
                        };

                    })
            };

        });


    /* Save everything to localStorage */

    persistBoardData();
}


/* Save to localStorage without crashing when it is full */

function persistBoardData() {

    try {

        localStorage.setItem(
            "taskBoardData",
            JSON.stringify(boardData)
        );

    } catch (error) {

        showCustomAlert(
            "Storage is full, so your latest changes could not be saved. " +
            "Try removing or using smaller images.",
            "Storage full"
        );
    }
}


/* =========================
   SWITCH BOARD
========================= */

function switchBoard(boardItem) {

    saveCurrentBoard();

    document
        .querySelectorAll(".board-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });

    boardItem.classList.add("active");

    currentBoardId =
        boardItem.dataset.board;

    boardTitle.textContent =
        boardData[currentBoardId].title;

    loadBoard(currentBoardId);
}


/* =========================
   SETUP SIDEBAR
========================= */

function setupSidebar() {

    document
        .querySelector(".sidebar")
        .addEventListener(
            "click",
            function (event) {

                const boardItem =
                    event.target.closest(
                        ".board-item"
                    );

                if (boardItem) {
                    switchBoard(boardItem);
                }

            }
        );
}


/* =========================
   CREATE BOARD
========================= */

function setupCreateBoard() {

    const createBoardButton =
        document.querySelector(
            ".create-board"
        );

    createBoardButton.addEventListener(
        "click",
        function () {

            if (
                document.querySelector(
                    ".board-form"
                )
            ) {
                return;
            }


            const {
                form,
                inputs,
                submitBtn
            } = buildForm(
                "board-form",
                ["Enter board name"],
                "Create"
            );


            const boardInput =
                inputs[0];


            createBoardButton.before(form);

            boardInput.focus();


            submitBtn.addEventListener(
                "click",
                function () {

                    const boardName =
                        boardInput.value.trim();


                    if (boardName === "") {

                     showCustomAlert(
                    "Please enter board name"
                     );

                   return;
                }


                    const boardId =
                        "board_" + Date.now();


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


                    const boardItem =
                        el(
                            "div",
                            "board-item",
                            boardName
                        );


                    boardItem.dataset.board =
                        boardId;


                    form.replaceWith(
                        boardItem
                    );


                    persistBoardData();


                    switchBoard(
                        boardItem
                    );

                }
            );

        }
    );
}


/* =========================
   SIDEBAR TOGGLE
========================= */

const toggleSidebar =
    document.querySelector(
        "#toggleSidebar"
    );

const sidebarContainer =
    document.querySelector(
        ".sidebar-container"
    );


toggleSidebar.addEventListener(
    "click",
    function () {

        sidebarContainer.classList.toggle(
            "collapsed"
        );

        if (
            sidebarContainer.classList.contains(
                "collapsed"
            )
        ) {

            toggleSidebar.textContent =
                "☰";

        } else {

            toggleSidebar.textContent =
                "☰";

        }

    }
);