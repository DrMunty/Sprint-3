import { state } from "./variables-and-consts";
import { API_URL } from "./variables-and-consts";
import { displayResults } from "./display-results";
import { showError } from "./status-functions";
import { fetchData } from "./fetch-data";


export async function fetchDataWithFetch(searchTerm) {

    try {
        const items = {
           _page: state.currentPage,
           _limit: state.itemsPerPage,
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

        displayResults(data,totalItems, fetchData)
    }

    catch(error){
        console.error(error);
        showError(error.message)
    }
}