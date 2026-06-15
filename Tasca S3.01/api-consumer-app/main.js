import axios, { isCancel, AxiosError } from "axios";

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10;

const apiSelector = document.getElementById("api-select").value
const searchInput = document.getElementById("search-input").value
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



