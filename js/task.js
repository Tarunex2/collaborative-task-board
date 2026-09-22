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
        const searchText = input.value.toLowerCase().trim();

        dropdown.innerHTML = "";

        const matches = searchText === ""
            ? members
            : members.filter(function (member) {
                return member.toLowerCase().includes(searchText);
            });

        if (matches.length === 0) {
            dropdown.style.display = "none";
            return;
        }

        matches.forEach(function (member) {
            const option = document.createElement("div");

            option.textContent = member;

            option.addEventListener("click", function () {
                input.value = member;
                dropdown.style.display = "none";
            });

            dropdown.appendChild(option);
        });

        dropdown.style.display = "block";
    }

    input.addEventListener("input", showSuggestions);
    input.addEventListener("focus", showSuggestions);

    document.addEventListener("click", function (event) {
        if (!wrapper.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    return wrapper;
}


/* Create Task Card */

function createTaskCard(taskData) {
    const card = el("div", "task-card");
    card.draggable = true;

    const title = el("h3", "", taskData.title);

    const fullDescription =
        taskData.description || "No description";

    const description = el(
        "p",
        "",
        getShortDescription(fullDescription)
    );

    description.dataset.fullDescription = fullDescription;

    const assigned = el(
        "small",
        "",
        "Assigned to: " + (taskData.assignedTo || "Not assigned")
    );

    const editBtn = el("button", "edit-btn", "✏️");
    editBtn.title = "Edit task";

    const deleteBtn = el("button", "delete-btn", "🗑️");
    deleteBtn.title = "Delete task";

    const buttons = el("div", "task-buttons");
    buttons.append(editBtn, deleteBtn);

    card.append(title, description, assigned, buttons);


    /* Drag */

    card.addEventListener("dragstart", function () {
        card.classList.add("dragging");
        document.body.style.cursor = "grabbing";
    });

    card.addEventListener("dragend", function () {
        card.classList.remove("dragging");
        document.body.style.cursor = "default";
    });


    /* Description */

    description.addEventListener("click", function (event) {
        event.stopPropagation();
        openDescriptionOverlay(description, false);
    });


    /* Delete */

    deleteBtn.addEventListener("click", function () {
        const list = card.closest(".list");

        card.remove();
        updateTaskCount(list);
    });


    /* Edit */

    editBtn.addEventListener("click", function () {
        openEditForm(card);
    });

    return card;
}


/* Short Description */

function getShortDescription(description) {
    const words = description.trim().split(/\s+/);

    if (words.length <= 4) {
        return description;
    }

    return words.slice(0, 4).join(" ") + "...";
}


/* Edit Task */

function openEditForm(card) {
    if (card.querySelector(".edit-form")) {
        return;
    }

    const title = card.querySelector("h3");
    const description = card.querySelector("p");
    const assigned = card.querySelector("small");
    const buttons = card.querySelector(".task-buttons");

    const cardButtons = buttons.querySelectorAll("button");

    const { form, inputs, submitBtn, cancelBtn } = buildForm(
        "edit-form",
        [
            "Task title",
            "Task description",
            "Assigned to"
        ],
        "Save"
    );

    const [titleInput, descriptionInput] = inputs;

    const currentAssigned = assigned.textContent.replace(
        "Assigned to: ",
        ""
    );

    const assignedInput =
        createAssignedDropdown(currentAssigned);

    inputs[2].remove();

    form.insertBefore(assignedInput, submitBtn);

    titleInput.value = title.textContent;

    descriptionInput.value =
        description.innerText ||
        description.textContent;

    descriptionInput.dataset.richDescription =
        description.dataset.fullDescription ||
        description.textContent;


    /* Open Description Editor */

    descriptionInput.addEventListener("click", function (event) {
        event.stopPropagation();

        openDescriptionOverlay(
            descriptionInput,
            true
        );
    });

    card.insertBefore(form, buttons);


    /* Hide Buttons */

    cardButtons.forEach(function (button) {
        button.style.display = "none";
    });

    function showCardButtons() {
        cardButtons.forEach(function (button) {
            button.style.display = "";
        });
    }


    /* Save */

    submitBtn.addEventListener("click", function () {
        if (titleInput.value.trim() === "") {
            alert("Task title is required");
            return;
        }

        title.textContent = titleInput.value;

        const newDescription =
            descriptionInput.value.trim() ||
            "No description";

        description.dataset.fullDescription =
            descriptionInput.dataset.richDescription ||
            newDescription;

        description.textContent =
            getShortDescription(newDescription);

        assigned.textContent =
            "Assigned to: " +
            (assignedInput.input.value || "Not assigned");

        form.remove();
showCardButtons();
saveCurrentBoard();
    });


    /* Cancel */

    cancelBtn.addEventListener("click", function () {
        form.remove();
        showCardButtons();
    });
}


/* Add Task */

function setupAddTask(list) {
    const addButton = list.querySelector(".add-task");

    addButton.addEventListener("click", function () {
        if (list.querySelector(".task-form")) {
            return;
        }

        const { form, inputs, submitBtn } = buildForm(
            "task-form",
            [
                "Enter task title",
                "Enter task description",
                "Assigned to"
            ],
            "Add Task"
        );

        const [titleInput, descriptionInput] = inputs;

        const assignedInput =
            createAssignedDropdown();

        inputs[2].remove();

        form.insertBefore(
            assignedInput,
            submitBtn
        );

        addButton.before(form);

        titleInput.focus();


        /* Open Description Editor */

        descriptionInput.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                openDescriptionOverlay(
                    descriptionInput,
                    true
                );
            }
        );


        /* Add Task */

        submitBtn.addEventListener(
            "click",
            function () {
                const taskTitle =
                    titleInput.value.trim();

                if (taskTitle === "") {
                    alert("Please enter a task");
                    return;
                }

                const card = createTaskCard({
                    title: taskTitle,

                    description:
                        descriptionInput.dataset.richDescription ||
                        descriptionInput.value.trim(),

                    assignedTo:
                        assignedInput.input.value
                });

                addButton.before(card);

                form.remove();

                updateTaskCount(list);
            }
        );
    });
}
