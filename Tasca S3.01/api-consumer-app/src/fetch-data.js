import { searchInput } from "./variables-and-consts";
import { apiSelector } from "./variables-and-consts";
import { resultsContainer } from "./variables-and-consts";
import { paginationContainer } from "./variables-and-consts";
import { hideError } from "./status-functions";
import { showError } from "./status-functions";
import { hideLoading } from "./status-functions";
import { showLoading } from "./status-functions";
import { fetchDataWithFetch } from "./fetch-data-fetch";
import { fetchDataWithAxios } from "./fetch-data-axios";

export async function fetchData() {
    const searchTerm = searchInput.value
    const useAxios = apiSelector.value === "axios"

    resultsContainer.textContent = "";
    paginationContainer.textContent = "";
    hideError();

    if (apiSelector.value === ""){
        showError("You must choose a valid API method, please select Axios or Fetch to proceed.");
        hideLoading();
        return;
    }
    
    showLoading();
    hideError();

    try {
        if (useAxios) {
            await fetchDataWithAxios(searchTerm, fetchData)
        } else {
            await fetchDataWithFetch(searchTerm, fetchData);
        }
    } catch (error) {
        console.error ("An unexpected error ocurred", error)
        showError("An unexpected error ocurred")
    } finally {
        hideLoading();
    }
}