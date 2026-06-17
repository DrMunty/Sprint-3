import { resultsContainer } from "./variables-and-consts";
import { setupPagination } from "./setup-pagination";


export function displayResults(items, totalItems, onPageChange) {
    resultsContainer.textContent = ""

    if (items.length === 0){
        return resultsContainer.textContent = "No results were found." 
    }

    items.forEach((item) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.innerHTML = `
    <h3> ${item.title} </h3>
    <p> ${item.body} </p>
    <p> ${item.id} </p>
    `
    resultsContainer.appendChild(card)

    });
    
    setupPagination(totalItems, onPageChange)
}