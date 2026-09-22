function setupSearch() {

    const searchInput =
        document.querySelector("#searchInput");

    const clearSearch =
        document.querySelector("#clearSearch");


    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();


            document.querySelectorAll(
                ".task-card"
            ).forEach(function (task) {

                const taskText =
                    ["h3", "p", "small"]
                        .map(function (selector) {

                            return task.querySelector(
                                selector
                            ).textContent;

                        })
                        .join(" ")
                        .toLowerCase();


                task.style.display =
                    taskText.includes(searchText)
                        ? ""
                        : "none";

            });


            clearSearch.style.display =
                searchInput.value
                    ? "block"
                    : "none";

        }
    );


    clearSearch.addEventListener(
        "click",
        function () {

            searchInput.value = "";

            document.querySelectorAll(
                ".task-card"
            ).forEach(function (task) {

                task.style.display = "";

            });


            clearSearch.style.display =
                "none";

            searchInput.focus();

        }
    );

}