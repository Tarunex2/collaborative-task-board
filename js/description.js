function getShortDescription(description) {
    const words = description.trim().split(/\s+/);

    return words.length <= 4
        ? description
        : words.slice(0, 4).join(" ") + "...";
}

function openDescriptionOverlay(target, isInput = false) {
    if (document.querySelector(".description-overlay")) return;

    let titleText = "Task Description";
    let assignedText = "";
    let currentDescription = "";

    if (isInput) {
        currentDescription =
            target.dataset.richDescription || target.value;

        const form = target.closest(".task-form, .edit-form");
        const titleInput = form.querySelector("input");

        titleText = titleInput.value || "New Task";
    } else {
        const card = target.closest(".task-card");

        currentDescription =
            target.dataset.fullDescription || target.innerHTML;

        titleText = card.querySelector("h3").textContent;
        assignedText = card.querySelector("small").textContent;
    }

    const overlay = el("div", "description-overlay");
    const editor = el("div", "description-editor");

    // Header
    const header = el("div", "description-editor-header");
    const headerText = el("div");
    const heading = el("h2", "", titleText);
    const assigned = el("p", "", assignedText);
    const closeButton = el("button", "description-close", "×");

    headerText.append(heading, assigned);
    header.append(headerText, closeButton);

    // Toolbar
    const toolbar = el("div", "description-toolbar");

    const boldButton = el("button", "", "B");
    const italicButton = el("button", "", "I");
    const underlineButton = el("button", "", "U");
    const linkButton = el("button", "", "🔗");
    const imageButton = el("button", "", "🖼");
    const fileButton = el("button", "", "📎");

    toolbar.append(
        boldButton,
        italicButton,
        underlineButton,
        linkButton,
        imageButton,
        fileButton
    );

    // Editor
    const editorArea = el("div", "description-content");

    editorArea.contentEditable = "true";
    editorArea.innerHTML = currentDescription || "";
    editorArea.setAttribute(
        "data-placeholder",
        "Write your task description here..."
    );

    // File attachment
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";

    fileButton.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        if (!fileInput.files.length) return;

        const fileText = document.createElement("div");
        fileText.textContent = "📎 " + fileInput.files[0].name;

        editorArea.appendChild(fileText);
    });

    // Formatting
    boldButton.addEventListener("click", function () {
        document.execCommand("bold");
        editorArea.focus();
    });

    italicButton.addEventListener("click", function () {
        document.execCommand("italic");
        editorArea.focus();
    });

    underlineButton.addEventListener("click", function () {
        document.execCommand("underline");
        editorArea.focus();
    });

    // Link
    linkButton.addEventListener("click", function () {
        const url = prompt("Enter URL:");

        if (!url) return;

        document.execCommand("createLink", false, url);
        editorArea.focus();
    });

    // Image
    imageButton.addEventListener("click", function () {
        const imageInput = document.createElement("input");

        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.click();

        imageInput.addEventListener("change", function () {
            if (!imageInput.files.length) return;

            const reader = new FileReader();

            reader.onload = function () {
                const image = document.createElement("img");
                image.src = reader.result;
                image.className = "description-image";

                const wrapper = document.createElement("div");
                wrapper.className = "image-resize-wrapper";

                const handle = document.createElement("div");
                handle.className = "image-resize-handle";

                wrapper.append(image, handle);
                editorArea.appendChild(wrapper);

                let resizing = false;
                let startX = 0;
                let startWidth = 0;

                handle.addEventListener("mousedown", function (event) {
                    event.preventDefault();

                    resizing = true;
                    startX = event.clientX;
                    startWidth = image.offsetWidth;

                    document.body.style.cursor = "nwse-resize";
                });

                document.addEventListener("mousemove", function (event) {
                    if (!resizing) return;

                    const newWidth =
                        startWidth + (event.clientX - startX);

                    if (newWidth > 100 && newWidth <= 700) {
                        image.style.width = newWidth + "px";
                    }
                });

                document.addEventListener("mouseup", function () {
                    if (!resizing) return;

                    resizing = false;
                    document.body.style.cursor = "default";
                });
            };

            reader.readAsDataURL(imageInput.files[0]);
        });
    });

    // Actions
    const actions = el("div", "description-actions");
    const cancelButton = el(
        "button",
        "description-cancel",
        "Cancel"
    );
    const saveButton = el(
        "button",
        "description-save",
        "Save"
    );

    actions.append(cancelButton, saveButton);
    editor.append(header, toolbar, editorArea, actions);
    overlay.append(editor);
    document.body.appendChild(overlay);

    editorArea.focus();

    // Save
    saveButton.addEventListener("click", function () {
        const textDescription = editorArea.innerText.trim();
        const richDescription = editorArea.innerHTML.trim();

        if (isInput) {
            target.value = textDescription;
            target.dataset.richDescription = richDescription;
        } else {
            const finalText = textDescription || "No description";
            const finalRich =
                richDescription || "No description";

            target.dataset.fullDescription = finalRich;
            target.textContent = getShortDescription(finalText);
        }

        overlay.remove();
    });

    // Close
    function closeOverlay() {
        overlay.remove();
    }

    cancelButton.addEventListener("click", closeOverlay);
    closeButton.addEventListener("click", closeOverlay);

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeOverlay();
        }
    });
}

