import { paginationContainer } from "./variables-and-consts";
import { state } from "./variables-and-consts";

export function setupPagination(totalItems, onPageChange) {
    paginationContainer.textContent = ""
    const totalPages = Math.ceil(totalItems/state.itemsPerPage)
    for (let i = 1; i <= totalPages; i++){
        const button = document.createElement("button");
        button.classList.add("pagination-button");
        button.textContent = i

        if (i === state.currentPage){
            button.disabled = true;
        }

        button.addEventListener("click", () => {
            state.currentPage = i;
            onPageChange();
        });
        
        paginationContainer.appendChild(button)
    }
}