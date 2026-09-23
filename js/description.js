function getShortDescription(description) {

    const words = description.trim().split(/\s+/);

    return words.length <= 4
        ? description
        : words.slice(0, 4).join(" ") + "...";
}


function openDescriptionOverlay(target, isInput = false) {

    if (document.querySelector(".description-overlay")) {
        return;
    }

    let card = null;
    let titleText = "Task Description";
    let assignedText = "";
    let currentDescription = "";

    if (isInput) {

        currentDescription =
            target.dataset.richDescription || target.value;

        const form = target.closest(".task-form");
        const titleInput = form.querySelector("input");

        titleText = titleInput.value || "New Task";

    } else {

        card = target.closest(".task-card");

        currentDescription =
            target.dataset.fullDescription || target.innerHTML;

        titleText =
            card.querySelector("h3").textContent;

        assignedText =
            card.querySelector("small").textContent;
    }


    /* Overlay */

    const overlay = el("div", "description-overlay");
    const editor = el("div", "description-editor");


    /* Header */

    const header = el(
        "div",
        "description-editor-header"
    );

    const headerText = el("div");

    const heading = el("h2", "", titleText);

    const assigned = el("p", "", assignedText);

    const closeButton =
        el("button", "description-close", "×");

    headerText.append(heading, assigned);
    header.append(headerText, closeButton);


    /* Toolbar */

    const toolbar = el("div", "description-toolbar");

    const boldButton = el("button", "", "B");
    const italicButton = el("button", "", "I");
    const underlineButton = el("button", "", "U");
    const linkButton = el("button", "", "🔗");
    const imageButton = el("button", "", "🖼");
    const fileButton = el("button", "", "📎");

    /* Remove Image Button */

    const removeImageButton =
        el("button", "remove-image-btn", "Remove Image");

    removeImageButton.style.display = "none";

    toolbar.append(
        boldButton,
        italicButton,
        underlineButton,
        linkButton,
        imageButton,
        fileButton,
        removeImageButton
    );


    /* Description */

    const editorArea =
        el("div", "description-content");

    editorArea.contentEditable = isInput
        ? "true"
        : "false";

    editorArea.innerHTML =
        currentDescription || "";

    editorArea.setAttribute(
        "data-placeholder",
        "Write your task description here..."
    );


    /* Select Image */

    editorArea.addEventListener(
        "click",
        function (event) {

            /* Only allow image selection in edit mode */

            if (editorArea.contentEditable !== "true") {
                return;
            }

            if (event.target.tagName === "IMG") {

                document
                    .querySelectorAll(
                        ".description-content img"
                    )
                    .forEach(function (img) {

                        img.classList.remove(
                            "selected-image"
                        );
                    });


                event.target.classList.add(
                    "selected-image"
                );


                removeImageButton.style.display =
                    "inline-block";
            }
        }
    );


    /* Edit button */

    const editButton =
        el("button", "overlay-edit-btn", "✏️ Edit");


    /* Assigned dropdown */

    let assignedInput = null;

    if (!isInput) {

        assignedInput =
            createAssignedDropdown(
                assignedText.replace(
                    "Assigned to: ",
                    ""
                )
            );

        assignedInput.style.display = "none";
    }


    /* Actions */

    const actions =
        el("div", "description-actions");

    const cancelButton =
        el("button", "description-cancel", "Cancel");

    const saveButton =
        el("button", "description-save", "Save");


    /* Existing task starts in view mode */

    if (!isInput) {

        toolbar.style.display = "none";

        saveButton.style.display = "none";

        editButton.style.display = "inline-block";

        actions.append(
            editButton,
            cancelButton,
            saveButton
        );

    } else {

        actions.append(
            cancelButton,
            saveButton
        );
    }


    editor.append(
        header,
        toolbar,
        editorArea,
        actions
    );


    if (assignedInput) {

        editor.insertBefore(
            assignedInput,
            editorArea
        );
    }


    overlay.append(editor);

    document.body.appendChild(overlay);


    /* Edit */

    editButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            editButton.style.display = "none";

            toolbar.style.display = "flex";

            saveButton.style.display = "inline-block";

            assignedInput.style.display = "block";

            editorArea.contentEditable = "true";

            const titleInput =
                document.createElement("input");

            titleInput.type = "text";

            titleInput.className =
                "overlay-title-input";

            titleInput.value =
                titleText;

            heading.replaceWith(titleInput);

            editorArea.focus();
        }
    );


    /* Formatting */

    boldButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            document.execCommand("bold");

            editorArea.focus();
        }
    );


    italicButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            document.execCommand("italic");

            editorArea.focus();
        }
    );


    underlineButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            document.execCommand("underline");

            editorArea.focus();
        }
    );


    /* Link */

    linkButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const url =
                prompt("Enter URL:");

            if (!url) {
                return;
            }

            document.execCommand(
                "createLink",
                false,
                url
            );

            editorArea.focus();
        }
    );


    /* File */

    fileButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const fileInput =
                document.createElement("input");

            fileInput.type = "file";

            fileInput.click();

            fileInput.addEventListener(
                "change",
                function () {

                    if (!fileInput.files.length) {
                        return;
                    }

                    const fileText =
                        document.createElement("div");

                    fileText.textContent =
                        "📎 " +
                        fileInput.files[0].name;

                    editorArea.appendChild(
                        fileText
                    );
                }
            );
        }
    );


    /* Image */

    imageButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const imageInput =
                document.createElement("input");

            imageInput.type = "file";

            imageInput.accept = "image/*";

            imageInput.click();

            imageInput.addEventListener(
                "change",
                function () {

                    if (!imageInput.files.length) {
                        return;
                    }

                    const reader =
                        new FileReader();

                    reader.onload =
                        function () {

                            const image =
                                document.createElement("img");

                            image.src =
                                reader.result;

                            image.className =
                                "description-image";

                            editorArea.appendChild(
                                image
                            );
                        };

                    reader.readAsDataURL(
                        imageInput.files[0]
                    );
                }
            );
        }
    );


    /* Remove Image */

    removeImageButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const selectedImage =
                editorArea.querySelector(
                    ".selected-image"
                );

            if (!selectedImage) {
                return;
            }

            selectedImage.remove();

            removeImageButton.style.display =
                "none";
        }
    );


    /* Save */

    saveButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const textDescription =
                editorArea.innerText.trim();

            const richDescription =
                editorArea.innerHTML.trim();


            /* New Task */

            if (isInput) {

                target.value =
                    textDescription;

                target.dataset.richDescription =
                    richDescription;

                overlay.remove();

                return;
            }


            /* Existing Task */

            const titleInput =
                editor.querySelector(
                    ".overlay-title-input"
                );

            const newTitle =
                titleInput.value.trim();

            if (newTitle === "") {

                alert(
                    "Task title is required"
                );

                return;
            }


            const finalDescription =
                textDescription ||
                "No description";


            card.querySelector("h3")
                .textContent =
                newTitle;


            target.dataset.fullDescription =
                richDescription ||
                "No description";


            target.textContent =
                getShortDescription(
                    finalDescription
                );


            card.querySelector("small")
                .textContent =
                "Assigned to: " +
                (
                    assignedInput.input.value ||
                    "Not assigned"
                );


            saveCurrentBoard();

            overlay.remove();
        }
    );


    /* Close */

    function closeOverlay() {

        if (
            editorArea.contentEditable === "true"
        ) {

            let hasChanges = false;


            /* Check description */

            const originalDescription =
                currentDescription
                    .replace(/<[^>]*>/g, "")
                    .trim();

            const newDescription =
                editorArea.innerText.trim();

            if (
                newDescription !==
                originalDescription
            ) {

                hasChanges = true;
            }


            /* Check title */

            const titleInput =
                editor.querySelector(
                    ".overlay-title-input"
                );

            if (titleInput) {

                if (
                    titleInput.value.trim() !==
                    titleText.trim()
                ) {

                    hasChanges = true;
                }
            }


            /* Check assigned person */

            if (assignedInput) {

                const originalAssigned =
                    assignedText
                        .replace(
                            "Assigned to: ",
                            ""
                        )
                        .trim();

                const newAssigned =
                    assignedInput.input.value
                        .trim();

                if (
                    newAssigned !==
                    originalAssigned
                ) {

                    hasChanges = true;
                }
            }


            /* Confirmation */

            if (hasChanges) {

                const leave =
                    confirm(
                        "Are you sure you want to close? Your work is not saved."
                    );

                if (!leave) {
                    return;
                }
            }
        }

        overlay.remove();
    }


    /* Cancel */

    cancelButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            closeOverlay();
        }
    );


    /* Close X */

    closeButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            closeOverlay();
        }
    );


    /* Click Outside */

    overlay.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (event.target === overlay) {

                closeOverlay();
            }
        }
    );
}