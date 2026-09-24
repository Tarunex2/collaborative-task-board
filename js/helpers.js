/* =========================
   CREATE ELEMENT
========================= */

function el(
    tag,
    className = "",
    text = ""
) {

    const element =
        document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}


/* =========================
   BUILD FORM
========================= */

function buildForm(
    className,
    placeholders,
    buttonText
) {

    const form =
        document.createElement("div");

    form.className =
        className;


    const inputs =
        placeholders.map(
            placeholder => {

                const input =
                    document.createElement(
                        "input"
                    );

                input.type = "text";

                input.placeholder =
                    placeholder;

                return input;
            }
        );


    const submitBtn =
        document.createElement(
            "button"
        );

    submitBtn.type = "button";

    submitBtn.textContent =
        buttonText;


    inputs.forEach(input => {

        form.appendChild(input);
    });


    form.appendChild(
        submitBtn
    );


    return {
        form,
        inputs,
        submitBtn
    };
}


/* =========================
   UPDATE TASK COUNT
========================= */

function updateTaskCount(list) {

    if (!list) {
        return;
    }


    const count =
        list.querySelectorAll(
            ".task-card"
        ).length;


    const countElement =
        list.querySelector(
            ".task-count"
        );


    if (countElement) {

        countElement.textContent =
            count;
    }
}


/* =========================
   CUSTOM ALERT
========================= */

function showCustomAlert(
    message,
    title = "Alert"
) {

    const alertBox =
        document.querySelector(
            "#customAlert"
        );

    const alertTitle =
        document.querySelector(
            "#customAlertTitle"
        );

    const alertMessage =
        document.querySelector(
            "#customAlertMessage"
        );

    const closeButton =
        document.querySelector(
            "#customAlertClose"
        );


    if (!alertBox) {
        return;
    }


    alertTitle.textContent =
        title;


    alertMessage.textContent =
        message;


    alertBox.style.display =
        "flex";


    closeButton.onclick =
        function (event) {

            event.stopPropagation();

            alertBox.style.display =
                "none";
        };
}


/* =========================
   CUSTOM CONFIRM
========================= */

function showCustomConfirm(
    message,
    onConfirm,
    onCancel
) {

    const confirmBox =
        document.querySelector("#customConfirm");

    const messageBox =
        document.querySelector("#customConfirmMessage");

    const yesButton =
        document.querySelector("#customConfirmLeave");

    const noButton =
        document.querySelector("#customConfirmCancel");


    if (
        !confirmBox ||
        !messageBox ||
        !yesButton ||
        !noButton
    ) {
        console.log("Custom confirm elements not found");
        return;
    }


    messageBox.textContent = message;

    confirmBox.style.display = "flex";


    /* YES */

    yesButton.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        confirmBox.style.display = "none";

        if (typeof onConfirm === "function") {
            onConfirm();
        }
    };


    /* NO */

    noButton.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        confirmBox.style.display = "none";

        if (typeof onCancel === "function") {
            onCancel();
        }
    };
}