import axios, { isCancel, AxiosError } from "axios";
import { state } from "./variables-and-consts";
import { API_URL } from "./variables-and-consts";
import { displayResults } from "./display-results";
import { showError } from "./status-functions";

export async function fetchDataWithAxios(searchTerm, onPageChange) {

    try {
        const response = await axios.get(API_URL, {
            params: {
            _page: state.currentPage,
            _limit: state.itemsPerPage,
            q: searchTerm
        }
    });
    
    const data = response.data;

    const totalItems = parseInt(response.headers['x-total-count'], 10) || 0;
    
    displayResults(data, totalItems, onPageChange)

    } catch (error) {
        console.error("An error ocurred with Axios", error);

        const errorMessage = error.response?.statusText || error.message;

        showError(`Error: ${errorMessage}`)
    }
}



