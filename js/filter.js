/* =========================
   PRIORITY FILTER
========================= */

const priorityFilterBtn =
    document.querySelector("#priorityFilterBtn");

const priorityFilterOptions =
    document.querySelector("#priorityFilterOptions");


/* OPEN / CLOSE DROPDOWN */

priorityFilterBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    priorityFilterOptions.style.display =
        priorityFilterOptions.style.display === "block"
            ? "none"
            : "block";
});


/* FILTER TASKS */

priorityFilterOptions
    .querySelectorAll("button")
    .forEach(function (option) {

        option.addEventListener("click", function () {

            const selectedPriority =
                option.dataset.priority;

            const taskCards =
                document.querySelectorAll(".task-card");

            taskCards.forEach(function (card) {

                if (selectedPriority === "all") {

                    card.style.display = "";

                    return;
                }

                const priorityDropdown =
                    card.querySelector(".priority-dropdown");

                if (!priorityDropdown) {
                    card.style.display = "none";
                    return;
                }

                const taskPriority =
                    priorityDropdown.selectedValue;

                if (taskPriority === selectedPriority) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";
                }
            });

            priorityFilterBtn.querySelector("span").textContent =
                selectedPriority === "all"
                    ? "Priority"
                    : selectedPriority;

            priorityFilterOptions.style.display = "none";
        });
    });


/* CLOSE WHEN CLICKING OUTSIDE */

document.addEventListener("click", function (event) {

    if (!event.target.closest(".filter-box")) {

        priorityFilterOptions.style.display = "none";
    }
});