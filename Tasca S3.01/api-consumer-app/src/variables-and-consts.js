export const API_URL = 'https://jsonplaceholder.typicode.com/posts';
export const state = {
    currentPage: 1,
    itemsPerPage: 10
}
export const apiSelector = document.getElementById("api-select")
export const searchInput = document.getElementById("search-input")
export const fetchButton = document.getElementById("btn-get-data")
export const loadingElement = document.getElementById("loading-status")
export const errorElement = document.getElementById("error-message")
export const resultsContainer = document.getElementById("results-container")
export const paginationContainer = document.getElementById("pagination")
