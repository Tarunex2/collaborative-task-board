function createList(name, tasks = []) {

    const list = el("div", "list");

    // Header: title + task count
    const header = el("div", "list-header");
    const title = el("h2", "", name);
    const headerRight = el("div", "header-right");
    const taskCount = el("span", "task-count", tasks.length);

    headerRight.append(taskCount);
    header.append(title, headerRight);
    list.append(header);

    // Tasks
    tasks.forEach(function (taskData) {
        list.append(createTaskCard(taskData));
    });

    // Add Task button
    list.append(el("button", "add-task", "+ Add Task"));

    setupAddTask(list);
    setupDragAndDrop(list);

    return list;
}