import { fetchButton, state } from "./src/variables-and-consts";
import { fetchData } from "./src/fetch-data";
import { hideError } from "./src/status-functions";
import { hideLoading } from "./src/status-functions";

hideError();
hideLoading();

fetchButton.addEventListener("click", () => {
    state.currentPage = 1;
    fetchData();
});