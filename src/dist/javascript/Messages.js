const urlParams = new URLSearchParams(window.location.search);
let localizationFile = `localization/${settings.language || 'pl_PL'}.json`;

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
    fetch(localizationFile)
        .then((response) => response.json())
        .then((localizationData) => {
            const errorMessage = localizationData.Errors[error] || 'Sorry, an unknown error occurred. Please try again.';
            textDiv.classList.add('text-danger');
            textDiv.textContent = errorMessage;
            waitAndClear();
        })
        .catch((error) => {
            console.error('Error fetching error messages:', error);
            textDiv.classList.add('text-danger');
            textDiv.textContent = 'Sorry, an unknown error occurred. Please try again.';
            waitAndClear();
        });
}

function getSuccessMessage(success) {
    fetch(localizationFile)
        .then((response) => response.json())
        .then((localizationData) => {
            const successMessage = localizationData.Successes[success] || 'Sorry, something went well but also an unknown error occurred.';
            textDiv.classList.add('text-success');
            textDiv.textContent = successMessage;
            waitAndClear();
        })
        .catch((error) => {
            console.error('Error fetching success messages:', error);
            textDiv.classList.add('text-danger');
            textDiv.textContent = 'Sorry, something went well but also an unknown error occurred.';
            waitAndClear();
        });
}

function waitAndClear() {
    setTimeout(() => {
        textDiv.classList.remove('text-danger');
        textDiv.classList.remove('text-success');
        textDiv.textContent = '';
    }, 5000);
}
