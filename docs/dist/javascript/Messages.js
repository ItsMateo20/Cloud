const urlParams = new URLSearchParams(window.location.search);

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
        const errorMessage = localization[settings.localization].Errors[error] || 'Sorry, an unknown error occurred. Please try again.';
        textDiv.classList.add('text-danger');
        textDiv.textContent = errorMessage;
        waitAndClear();
    }
}

function getSuccessMessage(success) {
    if (success) {
        const successMessage = localization[settings.localization].Successes[success] || 'Sorry, something went well but also an unknown error occurred.';
        textDiv.classList.add('text-success');
        textDiv.textContent = successMessage;
        waitAndClear();
    }
}

function waitAndClear() {
    setTimeout(() => {
        textDiv.classList.remove('text-danger');
        textDiv.classList.remove('text-success');
        textDiv.textContent = '';
    }, 5000);
}