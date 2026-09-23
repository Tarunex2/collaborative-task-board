function el(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}


// Update the number badge of a list
function updateTaskCount(list) {
    list.querySelector(".task-count").textContent =
        list.querySelectorAll(".task-card").length;
}


function buildForm(className, placeholders, submitLabel) {

    const form = el("div", className);

    const inputs = placeholders.map(function (placeholder) {
        const input = el("input");
        input.placeholder = placeholder;
        return input;
    });

    const submitBtn = el("button", "", submitLabel);
    const cancelBtn = el("button", "", "Cancel");

    form.append(...inputs, submitBtn, cancelBtn);


    // Cancel form
    cancelBtn.addEventListener("click", function () {

        const hasChanges = inputs.some(function (input) {
            return input.value.trim() !== "";
        });

        if (hasChanges) {

            const leave = confirm(
                "Your work is not saved. Are you sure you want to close?"
            );

            if (!leave) {
                return;
            }
        }

        form.remove();
    });


    form.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            submitBtn.click();
        }

    });


    return {
        form,
        inputs,
        submitBtn,
        cancelBtn
    };
}

