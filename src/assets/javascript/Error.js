const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('error')) {
    const errorType = urlParams.get('error');

    if (errorType) {
        const textDiv = document.getElementById('error-message');
        if (errorType === 'MISSING_DATA_LOGIN') {
            textDiv.textContent = 'Przepraszamy, musisz wprowadzić wszystkie wymagane dane.';
        } else if (errorType === 'INCORRECT_DATA_LOGIN') {
            textDiv.textContent = 'Przepraszamy, wprowadzone dane są nieprawidłowe. Spróbuj ponownie.';
        } else if (errorType === 'MISSING_DATA_SIGNUP') {
            textDiv.textContent = 'Przepraszamy, musisz wprowadzić wszystkie wymagane dane.';
        } else if (errorType === 'INCORRECT_DATA_SIGNUP') {
            textDiv.textContent = 'Przepraszamy, wprowadzone dane są nieprawidłowe. Spróbuj ponownie.';
        } else if (errorType === 'PASSWORD_NOT_MATCH_SIGNUP') {
            textDiv.textContent = 'Przepraszamy, wprowadzone hasła nie są takie same. Spróbuj ponownie.';
        } else if (errorType === 'ACCOUNT_ALREADY_EXISTS_SIGNUP') {
            textDiv.textContent = 'Przepraszamy, konto o podanym adresie e-mail już istnieje. Spróbuj ponownie.';
        } else if (errorType === 'UNKNOWN_ERROR') {
            textDiv.textContent = 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
        }
    }
}
