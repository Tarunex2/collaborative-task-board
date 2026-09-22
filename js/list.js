
function createList(name, tasks = []) {

    const list = el("div", "list");

    // Header: title + task count + remove button
    const header = el("div", "list-header");
    const title = el("h2", "", name);
    const headerRight = el("div", "header-right");
    const taskCount = el("span", "task-count", tasks.length);
    const removeListButton = el("button", "remove-list", "×");

    headerRight.append(taskCount, removeListButton);
    header.append(title, headerRight);
    list.append(header);

    // Tasks
    tasks.forEach(function (taskData) {
        list.append(createTaskCard(taskData));
    });

    // Add Task button
    list.append(el("button", "add-task", "+ Add Task"));

    removeListButton.addEventListener("click", function () {
        list.remove();
        showLists();
    });

    setupAddTask(list);
    setupDragAndDrop(list);

    return list;
}
