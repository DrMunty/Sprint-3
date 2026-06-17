import { errorElement } from "./variables-and-consts";
import { loadingElement } from "./variables-and-consts";

export function showLoading(){
    loadingElement.hidden = false;
}

export function hideLoading(){
    loadingElement.hidden = true;
}

export function showError(message) {
    errorElement.textContent = message;
    errorElement.hidden = false;
}

export function hideError() {
    errorElement.hidden = true;
}