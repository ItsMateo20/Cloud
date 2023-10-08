const urlParams = new URLSearchParams(window.location.search);
const errorMessagesURL = "json/errorMessages.json";

if (urlParams.has('error')) {
    const errorType = urlParams.get('error');

    if (errorType) {
        const textDiv = document.getElementById('error-message');

        // Fetch the error messages JSON file
        fetch(errorMessagesURL)
            .then((response) => response.json())
            .then((errorMessages) => {
                const errorMessage = errorMessages[errorType] || 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
                textDiv.textContent = errorMessage;
                console.log(errorMessages, errorMessage);
            })
            .catch((error) => {
                console.error('Error fetching error messages:', error);
                textDiv.textContent = 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
            });
    }
}
