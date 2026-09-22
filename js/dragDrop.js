
function setupDragAndDrop(list) {

    list.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    list.addEventListener("drop", function (event) {
        event.preventDefault();

        const task = document.querySelector(".dragging");

        if (!task) {
            return;
        }

        const oldList = task.closest(".list");

        list.insertBefore(task, list.querySelector(".add-task"));

        updateTaskCount(oldList);
        updateTaskCount(list);
    });
}
