function getShortDescription(description) {
    const temp = document.createElement("div");
    temp.innerHTML = description;

    const text = temp.innerText.trim();

    if (text === "") return "Image attached";

    const words = text.split(/\s+/);

    return words.length <= 4
        ? text
        : words.slice(0, 4).join(" ") + "...";
}


/* Shrink big images so they fit in localStorage (~5MB limit) */
function compressImage(file, callback) {
    const reader = new FileReader();

    reader.onload = () => {
        /* Small images and GIFs are kept as they are */
        if (file.size < 300 * 1024 || file.type === "image/gif") {
            callback(reader.result);
            return;
        }

        const img = new Image();

        img.onload = () => {
            const maxSize = 1400;

            const scale = Math.min(
                1,
                maxSize / Math.max(img.width, img.height)
            );

            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            callback(canvas.toDataURL("image/jpeg", 0.8));
        };

        img.onerror = () => callback(reader.result);
        img.src = reader.result;
    };

    reader.readAsDataURL(file);
}


function openDescriptionOverlay(
    target,
    isInput = false,
    editMode = false
) {
    if (document.querySelector(".description-overlay")) return;

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

        titleText = card.querySelector("h3").textContent;
        assignedText = card.querySelector("small").textContent;
    }

    const overlay = el("div", "description-overlay");
    const editor = el("div", "description-editor");

    const header = el("div", "description-editor-header");
    const headerText = el("div");

    const heading = el("h2", "", titleText);
    const assigned = el("p", "", assignedText);
    const closeButton = el("button", "description-close", "×");

    headerText.append(heading, assigned);
    header.append(headerText, closeButton);

    const toolbar = el("div", "description-toolbar");

    const boldButton = el("button", "", "B");
    const italicButton = el("button", "", "I");
    const underlineButton = el("button", "", "U");
    const linkButton = el("button", "", "🔗");
    const imageButton = el("button", "", "🖼");
    const fileButton = el("button", "", "📎");

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

    const editorArea = el("div", "description-content");

    editorArea.contentEditable =
        isInput || editMode ? "true" : "false";

    editorArea.innerHTML = currentDescription || "";

    editorArea.setAttribute(
        "data-placeholder",
        "Write your task description here..."
    );

    editorArea.addEventListener("click", event => {
        if (editorArea.contentEditable !== "true") return;

        if (event.target.tagName === "IMG") {
            document
                .querySelectorAll(".description-content img")
                .forEach(img => img.classList.remove("selected-image"));

            event.target.classList.add("selected-image");
            removeImageButton.style.display = "inline-block";
        }
    });

    let assignedInput = null;

    /* Assigned dropdown only exists in edit mode */
    if (!isInput && editMode) {
        assignedInput = createAssignedDropdown(
            assignedText.replace("Assigned to: ", "")
        );
    }

    const actions = el("div", "description-actions");

    const cancelButton =
        el("button", "description-cancel", "Cancel");

    const saveButton =
        el("button", "description-save", "Save");

    if (!isInput && !editMode) {
        toolbar.style.display = "none";
        saveButton.style.display = "none";

        actions.append(cancelButton);
    } else {
        actions.append(cancelButton, saveButton);
    }

    editor.append(
        header,
        toolbar,
        editorArea,
        actions
    );

    overlay.append(editor);
    document.body.appendChild(overlay);

    /* Existing task edit mode */
    if (!isInput && editMode) {
        assigned.style.display = "none";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.className = "overlay-title-input";
        titleInput.value = titleText;

        heading.replaceWith(titleInput);

        /* "Assigned to:" + dropdown directly under the title */
        const assignedRow = el("div", "assigned-row");
        const assignedLabel =
            el("label", "assigned-label", "Assigned to:");

        assignedRow.append(assignedLabel, assignedInput);
        headerText.append(assignedRow);

        editorArea.focus();
    }

    boldButton.addEventListener("click", event => {
        event.stopPropagation();
        document.execCommand("bold");
        editorArea.focus();
    });

    italicButton.addEventListener("click", event => {
        event.stopPropagation();
        document.execCommand("italic");
        editorArea.focus();
    });

    underlineButton.addEventListener("click", event => {
        event.stopPropagation();
        document.execCommand("underline");
        editorArea.focus();
    });

    linkButton.addEventListener("click", event => {
        event.stopPropagation();

        const url = prompt("Enter URL:");
        if (!url) return;

        document.execCommand("createLink", false, url);
        editorArea.focus();
    });

    fileButton.addEventListener("click", event => {
        event.stopPropagation();

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.click();

        fileInput.addEventListener("change", () => {
            if (!fileInput.files.length) return;

            const fileText = document.createElement("div");
            fileText.textContent =
                "📎 " + fileInput.files[0].name;

            editorArea.appendChild(fileText);
        });
    });

    imageButton.addEventListener("click", event => {
        event.stopPropagation();

        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.click();

        imageInput.addEventListener("change", () => {
            if (!imageInput.files.length) return;

            compressImage(imageInput.files[0], dataUrl => {
                const image = document.createElement("img");

                image.src = dataUrl;
                image.className = "description-image";

                editorArea.appendChild(image);
            });
        });
    });

    removeImageButton.addEventListener("click", event => {
        event.stopPropagation();

        const selectedImage =
            editorArea.querySelector(".selected-image");

        if (!selectedImage) return;

        selectedImage.remove();
        removeImageButton.style.display = "none";
    });

    saveButton.addEventListener("click", event => {
        event.stopPropagation();

        const textDescription =
            editorArea.innerText.trim();

        const richDescription =
            editorArea.innerHTML.trim();

        /* New task */
        if (isInput) {
            target.value = textDescription;
            target.dataset.richDescription = richDescription;

            overlay.remove();
            return;
        }

        /* Existing task */
        const titleInput =
            editor.querySelector(".overlay-title-input");

        const newTitle = titleInput.value.trim();

        if (newTitle === "") {

    showCustomAlert("Task title is required");

    return;
}

        card.querySelector("h3").textContent = newTitle;

        target.dataset.fullDescription =
            richDescription || "No description";

        target.textContent =
            getShortDescription(
                textDescription || "No description"
            );

        card.querySelector("small").textContent =
            "Assigned to: " +
            (assignedInput.input.value || "Not assigned");

        saveCurrentBoard();
        overlay.remove();
    });

    function closeOverlay() {
        if (editorArea.contentEditable === "true") {
            let hasChanges = false;

            const originalDescription =
                currentDescription
                    .replace(/<[^>]*>/g, "")
                    .trim();

            if (
                editorArea.innerText.trim() !==
                originalDescription
            ) {
                hasChanges = true;
            }

            const titleInput =
                editor.querySelector(".overlay-title-input");

            if (
                titleInput &&
                titleInput.value.trim() !== titleText.trim()
            ) {
                hasChanges = true;
            }

            if (assignedInput) {
                const originalAssigned =
                    assignedText
                        .replace("Assigned to: ", "")
                        .trim();

                if (
                    assignedInput.input.value.trim() !==
                    originalAssigned
                ) {
                    hasChanges = true;
                }
            }
if (hasChanges) {

    showCustomConfirm(
        "Are you sure you want to close? Your work is not saved.",

        function () {
            overlay.remove();
        }
    );

    return;
}
        }

        overlay.remove();
    }

    cancelButton.addEventListener("click", event => {
        event.stopPropagation();
        closeOverlay();
    });

    closeButton.addEventListener("click", event => {
        event.stopPropagation();
        closeOverlay();
    });

    overlay.addEventListener("click", event => {
        event.stopPropagation();

        if (event.target === overlay) {
            closeOverlay();
        }
    });
}