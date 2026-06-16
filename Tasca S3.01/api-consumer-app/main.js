import axios, { isCancel, AxiosError } from "axios";

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10;

const apiSelector = document.getElementById("api-select")
const searchInput = document.getElementById("search-input")
const fetchButton = document.getElementById("btn-get-data")
const loadingElement = document.getElementById("loading-status")
const errorElement = document.getElementById("error-message")
const resultsContainer = document.getElementById("results-container")
const paginationContainer = document.getElementById("pagination")

fetchButton.addEventListener("click", fetchData());

function showLoading(){
    loadingElement.hidden = false;
}

function hideLoading(){
    loadingElement.hidden = true;
}

function showError(message) {
    errorElement.hidden = false
}

function hideError() {
    errorElement.hidden = false
}

async function fetchData() {
    const searchTerm = searchInput.value
    const useAxios = apiSelector.value === "axios"
    
    showLoading();
    hideError();

    try {
        if (useAxios) {
            fetchDataWithAxios(searchTerm)
        } else {
            fetchDataWithFetch(searchTerm);
        }
    } catch (error) {
        // ... (Gestiona errors inesperats si s'escapen de les funcions específiques de Fetch/Axios)
    } finally {
        hideLoading();
    }


function displayResults(items, totalItems) {
    resultsContainer.textContent = ""

    if (items.length === 0){
        return resultsContainer.textContent = "No results were found" 
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
    

    setupPagination(totalItems)
}

function setupPagination(totalItems) {

}
}

async function fetchDataWithFetch(searchTerm) {

    try {
        const items = {
           _page: currentPage,
           _limit: itemsPerPage,
           q: searchTerm
        }
        const searchParams = new URLSearchParams(items);
        const queryString = searchParams.toString()
        const urlWithParams = `${API_URL}?${queryString}`
        const response = await fetch(urlWithParams)

        if (!response.ok){
            throw new Error ("Could not fetch resource");
        }

        const data = await response.json();

        const totalItems = parseInt(response.headers.get('X-Total-Count'), 10) || 0;

        displayResults(data,totalItems)
    }

    catch(error){
        console.error(error);
    }
}


async function fetchDataWithAxios(searchTerm) {

    try {
        const response = await axios.get(API_URL, {
            params: {
            _page: currentPage,
            _limit: itemsPerPage,
            q: searchTerm
        }
    });
    
    const data = response.data;

    const totalItems = parseInt(response.headers['x-total-count'], 10) || 0;
    
    displayResults(data, totalItems)

    } catch (error) {
        console.error("An error ocurred with Axios", error);

        const errorMessage = error.response?.statusText || error.message;

        showError(`Error: ${errorMessage}`)
    }
}



