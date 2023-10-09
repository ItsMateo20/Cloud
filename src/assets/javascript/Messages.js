const urlParams = new URLSearchParams(window.location.search);
const errorMessagesURL = "json/errorMessages.json";
const successMessagesURL = "json/successMessages.json";

const textDiv = document.getElementById('message');

if (urlParams.has('error')) {
    const errorType = urlParams.get('error');

    if (errorType) {
        fetch(errorMessagesURL)
            .then((response) => response.json())
            .then((errorMessages) => {
                const errorMessage = errorMessages[errorType] || 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
                textDiv.classList.add('text-danger');
                textDiv.textContent = errorMessage;
            })
            .catch((error) => {
                console.error('Error fetching error messages:', error);

                textDiv.classList.add('text-danger');
                textDiv.textContent = 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
            });
    }
} else if (urlParams.has('success')) {
    const successType = urlParams.get('success');

    if (successType) {
        fetch(successMessagesURL)
            .then((response) => response.json())
            .then((successMessages) => {
                const successMessage = successMessages[successType] || 'Przepraszamy, coś poszło dobrze ależ i też wystąpił nieznany błąd.';
                textDiv.classList.add('text-success');
                textDiv.textContent = successMessage;
            })
            .catch((error) => {
                console.error('Error fetching success messages:', error);
                textDiv.classList.add('text-danger');
                textDiv.textContent = 'Przepraszamy, coś poszło dobrze ależ i też wystąpił nieznany błąd.';
            });
    }
}

