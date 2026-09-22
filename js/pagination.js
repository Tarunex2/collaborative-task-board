

let currentPage = 1;

const listsPerPage = 3;

const prevPage = document.querySelector("#prevPage");
const nextPage = document.querySelector("#nextPage");
const pageNumber = document.querySelector("#pageNumber");


function showLists() {

    const allLists = document.querySelectorAll(".board > .list");

    const totalPages = Math.ceil(allLists.length / listsPerPage);

    // Keep the page number valid (e.g. after removing a list)
    currentPage = Math.min(currentPage, Math.max(totalPages, 1));

    const start = (currentPage - 1) * listsPerPage;
    const end = start + listsPerPage;

    allLists.forEach(function (list, index) {
        list.style.display = (index >= start && index < end) ? "" : "none";
    });

    pageNumber.textContent = "Page " + currentPage;

    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
}


function setupPagination() {

    nextPage.addEventListener("click", function () {
        currentPage++;
        showLists();
    });

    prevPage.addEventListener("click", function () {
        currentPage--;
        showLists();
    });
}
