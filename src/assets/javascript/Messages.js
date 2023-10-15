const urlParams = new URLSearchParams(window.location.search);
const errorMessagesURL = "json/errorMessages.json";
const successMessagesURL = "json/successMessages.json";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const textDiv = document.getElementById('message');

if (urlParams.has('error')) {
    const errorType = urlParams.get('error');

    if (errorType) {
        getErrorMessage(errorType);
    }
} else if (urlParams.has('success')) {
    const successType = urlParams.get('success');

    if (successType) {
        getSuccessMessage(successType);
    }
}

function getErrorMessage(error) {
    if (error) {
        fetch(errorMessagesURL)
            .then((response) => response.json())
            .then((errorMessages) => {
                const errorMessage = errorMessages[error] || 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
                textDiv.classList.add('text-danger');
                textDiv.textContent = errorMessage;
            })
            .catch((error) => {
                console.error('Error fetching error messages:', error);

                textDiv.classList.add('text-danger');
                textDiv.textContent = 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
            });
        wait(5000).then(() => {
            textDiv.classList.remove('text-danger');
            textDiv.textContent = '';
        })
    }
}

function getSuccessMessage(success) {
    if (success) {
        fetch(successMessagesURL)
            .then((response) => response.json())
            .then((successMessages) => {
                const successMessage = successMessages[success] || 'Przepraszamy, coś poszło dobrze ależ i też wystąpił nieznany błąd.';
                textDiv.classList.add('text-success');
                textDiv.textContent = successMessage;
            })
            .catch((error) => {
                console.error('Error fetching success messages:', error);
                textDiv.classList.add('text-danger');
                textDiv.textContent = 'Przepraszamy, coś poszło dobrze ależ i też wystąpił nieznany błąd.';
            });
        wait(5000).then(() => {
            textDiv.classList.remove('text-success');
            textDiv.textContent = '';
        })
    }
}
