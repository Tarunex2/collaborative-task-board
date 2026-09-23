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
                : members.filter(function (member) {
                    return member
                        .toLowerCase()
                        .includes(searchText);
                });


        if (matches.length === 0) {

            dropdown.style.display = "none";

            return;
        }


        matches.forEach(function (member) {

            const option =
                document.createElement("div");

            option.textContent = member;

            option.addEventListener(
                "click",
                function () {

                    input.value = member;

                    dropdown.style.display = "none";
                }
            );

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
        function (event) {

            if (!wrapper.contains(event.target)) {

                dropdown.style.display = "none";
            }
        }
    );


    return wrapper;
}


/* Create Task Card */

function createTaskCard(taskData) {

    const card =
        el("div", "task-card");

    card.draggable = true;


    const title =
        el("h3", "", taskData.title);


    const fullDescription =
        taskData.description ||
        "No description";


    const description =
        el(
            "p",
            "",
            getShortDescription(fullDescription)
        );


    description.dataset.fullDescription =
        fullDescription;


    const assigned =
        el(
            "small",
            "",
            "Assigned to: " +
            (taskData.assignedTo ||
                "Not assigned")
        );


    const deleteBtn =
        el("button", "delete-btn");


    deleteBtn.innerHTML =
        '<i class="fa-solid fa-trash"></i>';


    deleteBtn.title =
        "Delete task";


    const buttons =
        el("div", "task-buttons");


    buttons.append(deleteBtn);


    card.append(
        title,
        description,
        assigned,
        buttons
    );


    /* Drag */

    card.addEventListener(
        "dragstart",
        function () {

            card.classList.add("dragging");

            document.body.style.cursor =
                "grabbing";
        }
    );


    card.addEventListener(
        "dragend",
        function () {

            card.classList.remove(
                "dragging"
            );

            document.body.style.cursor =
                "default";
        }
    );


    /* Open Task Detail */

    card.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest("h3") ||
                event.target.closest("p") ||
                event.target.closest("small") ||
                event.target.closest("button")
            ) {
                return;
            }


            window.open(
                "task-detail.html?title=" +
                encodeURIComponent(taskData.title),
                "_blank"
            );
        }
    );


    /* Open Description */

    description.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            openDescriptionOverlay(
                description,
                false
            );
        }
    );


    /* Delete */

    deleteBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const list =
                card.closest(".list");

            card.remove();

            updateTaskCount(list);

            saveCurrentBoard();
        }
    );


    return card;
}


/* Short Description */

function getShortDescription(description) {

    const temp = document.createElement("div");

    temp.innerHTML = description;

    const text = temp.innerText.trim();

    if (text === "") {
        return "Image attached";
    }

    const words = text.split(/\s+/);

    if (words.length <= 4) {
        return text;
    }

    return words
        .slice(0, 4)
        .join(" ") + "...";
}

/* Add Task */

function setupAddTask(list) {

    const addButton =
        list.querySelector(".add-task");


    addButton.addEventListener(
        "click",
        function () {

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


            const assignedInput =
                createAssignedDropdown();


            inputs[2].remove();


            form.insertBefore(
                assignedInput,
                submitBtn
            );


            addButton.before(form);


            titleInput.focus();


            /* Close Add Task form when clicking outside */

            function closeTaskForm(event) {

                /* Ignore clicks inside the form */

                if (form.contains(event.target)) {
                    return;
                }


                /* Ignore the Add Task button */

                if (event.target === addButton) {
                    return;
                }


                /* Ignore clicks inside description overlay */

                if (
                    document.querySelector(
                        ".description-overlay"
                    )
                ) {
                    return;
                }


                const hasChanges =
                    inputs.some(function (input) {

                        return input.value
                            .trim() !== "";
                    });


                if (hasChanges) {

                    const leave =
                        confirm(
                            "Are you sure you want to close? Your work is not saved."
                        );


                    if (!leave) {
                        return;
                    }
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


            /* Description Editor */

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

                        alert(
                            "Please enter a task"
                        );

                        return;
                    }


                    const card =
                        createTaskCard({

                            title: taskTitle,

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
                                    .value
                        });


                    addButton.before(card);


                    form.remove();


                    document.removeEventListener(
                        "click",
                        closeTaskForm
                    );


                    updateTaskCount(list);

                    saveCurrentBoard();
                }
            );
        }
    );
}