function loadingDiv(value) {
    const loadingDiv = document.querySelector('#loading');
    if (value == "hide") {
        loadingDiv.classList.add("d-none")
    } else if (value == "show") {
        loadingDiv.classList.remove("d-none")
    }
}