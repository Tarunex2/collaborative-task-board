function createAssignedDropdown(selectedValue = "") {

    const wrapper = document.createElement("div");
    wrapper.className = "assigned-autocomplete";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Assigned to";
    input.value = selectedValue;

    const dropdown = document.createElement("div");
    dropdown.className = "assigned-suggestions";

    const members = [
        "Tarun Chuphal",
        "Yuvika Bhat",
        "Rudra Kathait",
        "Prabal Chauhan",
        "Naiyar Alam",
        "Naval Chuphal",
        "Ridam Bhardwaj"
    ];

    wrapper.append(input, dropdown);

    wrapper.input = input;


    function showSuggestions() {

        const searchText =
            input.value.toLowerCase().trim();

        dropdown.innerHTML = "";

        const matches =
            searchText === ""
                ? members
                : members.filter(member =>
                    member.toLowerCase().includes(searchText)
                );

        if (matches.length === 0) {

            dropdown.style.display = "none";
            return;
        }

        matches.forEach(member => {

            const option =
                document.createElement("div");

            option.textContent = member;

            option.addEventListener("click", () => {

                input.value = member;

                dropdown.style.display = "none";
            });

            dropdown.appendChild(option);
        });

        dropdown.style.display = "block";
    }


    input.addEventListener(
        "input",
        showSuggestions
    );

    input.addEventListener(
        "focus",
        showSuggestions
    );


    document.addEventListener(
        "click",
        event => {

            if (!wrapper.contains(event.target)) {

                dropdown.style.display = "none";
            }
        }
    );


    return wrapper;
}


/* =========================
   PRIORITY DROPDOWN
========================= */

function createPriorityDropdown(
    selectedValue = "Medium"
) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "priority-dropdown";


    const label =
        document.createElement("span");

    label.className =
        "priority-label";

    label.innerHTML = `
        <i class="fa-solid fa-bolt"></i>
        Priority:
    `;


    const selector =
        document.createElement("div");

    selector.className =
        "priority-selector";


    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "priority-btn";

    button.innerHTML = `
        <span>${selectedValue}</span>
        <i class="fa-solid fa-chevron-down"></i>
    `;


    const dropdown =
        document.createElement("div");

    dropdown.className =
        "priority-options";


    const priorities = [

        ["Highest", "fa-angles-up"],

        ["High", "fa-caret-up"],

        ["Medium", "fa-minus"],

        ["Low", "fa-caret-down"],

        ["Lowest", "fa-angles-down"],

        ["Hotfix", "fa-fire-flame-curved"]

    ];


    priorities.forEach(
        ([name, icon]) => {

            const option =
                document.createElement("div");

            option.className =
                "priority-option";


            option.innerHTML = `
                <i class="fa-solid ${icon}"></i>
                <span>${name}</span>
            `;


            option.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    button
                        .querySelector("span")
                        .textContent = name;


                    wrapper.selectedValue =
                        name;


                    if (wrapper.taskData) {

                        wrapper.taskData.priority =
                            name;

                        saveCurrentBoard();
                    }


                    dropdown.style.display =
                        "none";
                }
            );


            dropdown.appendChild(option);
        }
    );


    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            dropdown.style.display =
                dropdown.style.display === "block"
                    ? "none"
                    : "block";
        }
    );


    document.addEventListener(
        "click",
        event => {

            if (!wrapper.contains(event.target)) {

                dropdown.style.display =
                    "none";
            }
        }
    );


    selector.append(
        button,
        dropdown
    );


    wrapper.append(
        label,
        selector
    );


    wrapper.selectedValue =
        selectedValue;


    return wrapper;
}


/* =========================
   CREATE TASK CARD
========================= */

function createTaskCard(taskData) {

    const card =
        el("div", "task-card");

    card.draggable = true;


    const title =
        el(
            "h3",
            "",
            taskData.title
        );


    /* =========================
       DESCRIPTION
    ========================= */

    const fullDescription =
        taskData.description ||
        "No description";


    const description =
        el(
            "p",
            "",
            getShortDescription(
                fullDescription
            )
        );


    description.dataset.fullDescription =
        fullDescription;


    /* =========================
       ASSIGNED TO
    ========================= */

    const assigned =
        el(
            "small",
            "",
            "Assigned to: " +
            (
                taskData.assignedTo ||
                "Not assigned"
            )
        );


    /* =========================
       PRIORITY
    ========================= */

    const priority =
        createPriorityDropdown(
            taskData.priority ||
            "Medium"
        );


    priority.taskData =
        taskData;


    /* =========================
       EDIT BUTTON
    ========================= */

    const editBtn =
        el(
            "button",
            "task-edit-btn"
        );


    editBtn.innerHTML =
        '<i class="fa-solid fa-pen-to-square"></i>';

    editBtn.title =
        "Edit task";


    /* =========================
       DELETE BUTTON
    ========================= */

    const deleteBtn =
        el(
            "button",
            "delete-btn"
        );


    deleteBtn.innerHTML =
        '<i class="fa-solid fa-trash"></i>';

    deleteBtn.title =
        "Delete task";


    /* =========================
       BUTTON CONTAINER
    ========================= */

    const buttons =
        el(
            "div",
            "task-buttons"
        );


    buttons.append(
        deleteBtn
    );


    /* =========================
       CARD CONTENT
    ========================= */

    card.append(
        title,
        description,
        assigned,
        priority,
        buttons,
        editBtn
    );


    /* =========================
       DRAG & DROP
    ========================= */

    card.addEventListener(
        "dragstart",
        () => {

            card.classList.add(
                "dragging"
            );

            document.body.style.cursor =
                "grabbing";
        }
    );


    card.addEventListener(
        "dragend",
        () => {

            card.classList.remove(
                "dragging"
            );

            document.body.style.cursor =
                "default";
        }
    );


    /* =========================
       OPEN TASK DETAIL
    ========================= */

    card.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest("h3") ||
                event.target.closest("p") ||
                event.target.closest("small") ||
                event.target.closest("button") ||
                event.target.closest(
                    ".priority-dropdown"
                )
            ) {

                return;
            }


            openTaskDetail(
                readCardData(card)
            );
        }
    );


    /* =========================
       EDIT TASK
    ========================= */

    editBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            openDescriptionOverlay(
                description,
                false,
                true
            );
        }
    );


    /* =========================
       DELETE TASK
    ========================= */

    deleteBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const list =
                card.closest(".list");


            card.remove();


            updateTaskCount(
                list
            );


            saveCurrentBoard();
        }
    );


    return card;
}


/* =========================
   READ CURRENT CARD DATA
   (so the detail page shows edits)
========================= */

function readCardData(card) {

    const description =
        card.querySelector("p");

    return {

        title:
            card.querySelector("h3").textContent,

        description:
            description.dataset.fullDescription ||
            description.textContent,

        assignedTo:
            card.querySelector("small")
                .textContent
                .replace("Assigned to: ", ""),

        priority:
            card.querySelector(".priority-dropdown")
                ?.selectedValue || "Medium"
    };
}


/* =========================
   SHORT DESCRIPTION
========================= */

function getShortDescription(
    description
) {

    const temp =
        document.createElement("div");


    temp.innerHTML =
        description;


    const text =
        temp.innerText.trim();


    if (text === "") {

        return "Image attached";
    }


    const words =
        text.split(/\s+/);


    return words.length <= 4
        ? text
        : words
            .slice(0, 4)
            .join(" ") + "...";
}


/* =========================
   ADD TASK
========================= */

function setupAddTask(list) {

    const addButton =
        list.querySelector(
            ".add-task"
        );


    addButton.addEventListener(
        "click",
        () => {

            if (
                list.querySelector(
                    ".task-form"
                )
            ) {

                return;
            }


            const {
                form,
                inputs,
                submitBtn
            } = buildForm(
                "task-form",
                [
                    "Enter task title",
                    "Enter task description",
                    "Assigned to"
                ],
                "Add Task"
            );


            const [
                titleInput,
                descriptionInput
            ] = inputs;


            /* =========================
               ASSIGNED DROPDOWN
            ========================= */

            const assignedInput =
                createAssignedDropdown();


            inputs[2].remove();


            form.insertBefore(
                assignedInput,
                submitBtn
            );


            /* =========================
               PRIORITY
            ========================= */

            const priorityInput =
                createPriorityDropdown(
                    "Medium"
                );


            form.insertBefore(
                priorityInput,
                submitBtn
            );


            addButton.before(
                form
            );


            titleInput.focus();


            /* =========================
               CLOSE TASK FORM
            ========================= */

            function closeTaskForm(event) {

                if (
                    form.contains(
                        event.target
                    )
                ) {

                    return;
                }


                if (
                    event.target ===
                    addButton
                ) {

                    return;
                }


                if (
                    document.querySelector(
                        ".description-overlay"
                    )
                ) {

                    return;
                }


                const hasChanges =
                    inputs.some(
                        input =>
                            input.value
                                .trim() !== ""
                    );
if (hasChanges) {

    document.removeEventListener(
        "click",
        closeTaskForm
    );

    showCustomConfirm(
        "Your work is not saved. Are you sure you want to close?",

        function () {

            form.remove();
        },

        function () {

            document.addEventListener(
                "click",
                closeTaskForm
            );
        }
    );

    return;
}

                form.remove();


                document.removeEventListener(
                    "click",
                    closeTaskForm
                );
            }


            document.addEventListener(
                "click",
                closeTaskForm
            );


            /* =========================
               DESCRIPTION EDITOR
            ========================= */

            descriptionInput.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    openDescriptionOverlay(
                        descriptionInput,
                        true
                    );
                }
            );


            /* =========================
               ADD TASK BUTTON
            ========================= */

            submitBtn.addEventListener(
                "click",
                () => {

                    const taskTitle =
                        titleInput.value.trim();


                    if (
                        taskTitle === ""
                    ) {

                        showCustomAlert(
                            "Please enter a task"
                        );

                        return;
                    }


                    const card =
                        createTaskCard({

                            title:
                                taskTitle,

                            description:
                                descriptionInput
                                    .dataset
                                    .richDescription ||
                                descriptionInput
                                    .value
                                    .trim(),

                            assignedTo:
                                assignedInput
                                    .input
                                    .value,

                            priority:
                                priorityInput
                                    .selectedValue
                        });


                    addButton.before(
                        card
                    );


                    form.remove();


                    document.removeEventListener(
                        "click",
                        closeTaskForm
                    );


                    updateTaskCount(
                        list
                    );


                    saveCurrentBoard();
                }
            );
        }
    );
}


/* =========================
   TASK DETAIL PAGE
========================= */

function openTaskDetail(taskData) {

    const mainContent =
        document.querySelector(".main-content");

    const boardHeader =
        document.querySelector(".board-header");

    const board =
        document.querySelector(".board");


    /* HIDE MAIN BOARD */

    boardHeader.style.display = "none";
    board.style.display = "none";


    /* REMOVE OLD DETAIL PAGE */

    const oldDetail =
        document.querySelector(".task-detail-view");

    if (oldDetail) {
        oldDetail.remove();
    }


    /* =========================
       DETAIL VIEW
    ========================= */

    const detail =
        el("div", "task-detail-view");


    /* =========================
       TOP BAR
    ========================= */

    const top =
        el("div", "task-detail-top");


    const backButton =
        el("button", "back-btn");


    backButton.innerHTML =
        '<i class="fa-solid fa-arrow-left"></i> Back to Board';


    top.append(backButton);


    /* =========================
       TASK HEADER
    ========================= */

    const header =
        el("div", "task-detail-header");


    const title =
        el(
            "h1",
            "",
            taskData.title
        );


    const meta =
        el(
            "div",
            "task-detail-meta"
        );


    /* ASSIGNED */

    const assignedName =
        taskData.assignedTo &&
        taskData.assignedTo !== "Not assigned"
            ? taskData.assignedTo
            : "";


    const assigned =
        el(
            "div",
            "assigned-info"
        );


    const assignedValue =
        el(
            "div",
            "detail-value"
        );


    const avatar =
        el(
            "span",
            assignedName
                ? "detail-avatar"
                : "detail-avatar unassigned",
            assignedName
                ? assignedName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map(word => word[0].toUpperCase())
                    .join("")
                : "?"
        );


    assignedValue.append(
        avatar,
        el(
            "span",
            "",
            assignedName || "Not assigned"
        )
    );


    assigned.append(
        el("span", "detail-label", "Assigned to"),
        assignedValue
    );


    /* PRIORITY */

    const priorityName =
        taskData.priority || "Medium";


    const priorityIcons = {
        Highest: "fa-angles-up",
        High: "fa-caret-up",
        Medium: "fa-minus",
        Low: "fa-caret-down",
        Lowest: "fa-angles-down",
        Hotfix: "fa-fire-flame-curved"
    };


    const priority =
        el(
            "div",
            "detail-priority"
        );


    const priorityChip =
        el(
            "span",
            "priority-chip priority-" +
            priorityName.toLowerCase()
        );


    priorityChip.innerHTML =
        '<i class="fa-solid ' +
        (priorityIcons[priorityName] || "fa-bolt") +
        '"></i>';


    priorityChip.append(
        el("span", "", priorityName)
    );


    priority.append(
        el("span", "detail-label", "Priority"),
        priorityChip
    );


    meta.append(
        assigned,
        priority
    );


    header.append(
        title,
        meta
    );


    /* =========================
       SEPARATOR
    ========================= */

    const line =
        el(
            "div",
            "detail-line"
        );


    /* =========================
       DESCRIPTION
    ========================= */

    const content =
        el(
            "section",
            "task-detail-content"
        );


    const heading =
        el("h2");


    heading.innerHTML =
        '<i class="fa-regular fa-file-lines"></i> Description';


    const description =
        el(
            "div",
            "task-detail-description"
        );


    description.innerHTML =
        taskData.description ||
        "No description";


    if (
        !taskData.description ||
        taskData.description === "No description"
    ) {

        description.classList.add("is-empty");
    }


    content.append(
        heading,
        description
    );


    /* =========================
       BUILD DETAIL PAGE
    ========================= */

    detail.append(
        top,
        header,
        line,
        content
    );


    mainContent.append(
        detail
    );


    backButton.addEventListener(
        "click",
        function () {

            detail.remove();

            boardHeader.style.display =
                "";

            board.style.display =
                "";
        }
    );
}