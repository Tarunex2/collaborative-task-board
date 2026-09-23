function setupDragAndDrop(list) {

    list.addEventListener("dragover", function (event) {

        event.preventDefault();

        const draggingTask =
            document.querySelector(".dragging");

        if (!draggingTask) {
            return;
        }

        const taskCards =
            Array.from(
                list.querySelectorAll(".task-card:not(.dragging)")
            );

        let nextTask = null;

        for (const task of taskCards) {

            const rect =
                task.getBoundingClientRect();

            const middle =
                rect.top + rect.height / 2;

            if (event.clientY < middle) {

                nextTask = task;

                break;
            }
        }


        if (nextTask) {

            list.insertBefore(
                draggingTask,
                nextTask
            );

        } else {

            list.insertBefore(
                draggingTask,
                list.querySelector(".add-task")
            );
        }
    });


    list.addEventListener("drop", function (event) {

        event.preventDefault();

        const task =
            document.querySelector(".dragging");

        if (!task) {
            return;
        }


        const oldList =
            task.closest(".list");


        /* Keep the position created by dragover */

        if (task.parentElement !== list) {

            const taskCards =
                Array.from(
                    list.querySelectorAll(
                        ".task-card:not(.dragging)"
                    )
                );

            let nextTask = null;

            for (const card of taskCards) {

                const rect =
                    card.getBoundingClientRect();

                const middle =
                    rect.top + rect.height / 2;

                if (event.clientY < middle) {

                    nextTask = card;

                    break;
                }
            }


            if (nextTask) {

                list.insertBefore(
                    task,
                    nextTask
                );

            } else {

                list.insertBefore(
                    task,
                    list.querySelector(".add-task")
                );
            }
        }


        updateTaskCount(oldList);

        updateTaskCount(list);

        saveCurrentBoard();
    });
}