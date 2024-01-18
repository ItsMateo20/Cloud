const urlParams = new URLSearchParams(window.location.search);
const errorMessagesURL = "../json/errorMessages.json";
const successMessagesURL = "../json/successMessages.json";

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
        const errorMessages = {
            "MISSING_DATA_LOGIN": "Przepraszamy, musisz wprowadzić wszystkie wymagane dane.",
            "INCORRECT_DATA_LOGIN": "Przepraszamy, wprowadzone dane są nieprawidłowe. Spróbuj ponownie.",
            "1": "",
            "EMAIL_NOT_FOUND": "Przepraszamy, podany adres e-mail nie został znaleziony. Spróbuj ponownie.",
            "MISSING_DATA_SIGNUP": "Przepraszamy, musisz wprowadzić wszystkie wymagane dane.",
            "INCORRECT_DATA_SIGNUP": "Przepraszamy, wprowadzone dane są nieprawidłowe. Spróbuj ponownie.",
            "PASSWORD_NOT_MATCH_SIGNUP": "Przepraszamy, wprowadzone hasła nie są takie same. Spróbuj ponownie.",
            "ACCOUNT_ALREADY_EXISTS_SIGNUP": "Przepraszamy, konto o podanym adresie e-mail już istnieje. Spróbuj ponownie.",
            "2": "",
            "FAILED_AUTHENTICATION": "Przepraszamy, nie udało się potwierdzić twoje dane. Spróbuj ponownie.",
            "ACCESS_DENIED": "Przepraszamy, nie masz uprawnień do wykonania tej operacji. Spróbuj ponownie.",
            "3": "",
            "INVALID_FOLDER": "Przepraszamy, wybrany folder jest nieprawidłowy. Spróbuj ponownie.",
            "4": "",
            "FILE_ALREADY_EXISTS": "Przepraszamy, plik o podanej nazwie już istnieje. Zmień nazwę pliku i spróbuj ponownie.",
            "5": "",
            "FILE_DOESNT_EXIST": "Przepraszamy, plik nie został znaleziony. Spróbuj ponownie.",
            "FOLDER_DOESNT_EXIST": "Przepraszamy, folder nie został znaleziony. Spróbuj ponownie.",
            "6": "",
            "ERROR_WHILE_DELETING_FILE": "Przepraszamy, wystąpił błąd podczas usuwania pliku. Spróbuj ponownie.",
            "ERROR_WHILE_UPLOADING_FILE": "Przepraszamy, wystąpił błąd podczas przesyłania pliku. Spróbuj ponownie.",
            "7": "",
            "ZIP_CREATION_ERROR": "Przepraszamy, wystąpił błąd podczas tworzenia archiwum. Spróbuj ponownie.",
            "8": "",
            "EMAIL_ALREADY_ADMIN": "Przepraszamy, podany adres e-mail jest już administratorem. Spróbuj ponownie.",
            "EMAIL_NOT_ADMIN": "Przepraszamy, podany adres e-mail nie jest administratorem. Spróbuj ponownie.",
            "EMAIL_ALREADY_WHITELISTED": "Przepraszamy, podany adres e-mail jest już na białej liście. Spróbuj ponownie.",
            "EMAIL_NOT_WHITELISTED": "Przepraszamy, podany adres e-mail nie jest na białej liście. Spróbuj ponownie.",
            "9": "",
            "PASSWORD_NOT_MATCH": "Przepraszamy, wprowadzone hasła nie są takie same. Spróbuj ponownie.",
            "UNKNOWN_ERROR": "Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie."
        };
        const errorMessage = errorMessages[error] || 'Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie.';
        textDiv.classList.add('text-danger');
        textDiv.textContent = errorMessage;
        wait(5000).then(() => {
            textDiv.classList.remove('text-danger');
            textDiv.textContent = '';
        })
    }
}

function getSuccessMessage(success) {
    if (success) {
        const successMessages = {
            "FILE_UPLOADED": "Plik został przesłany",
            "FILE_DELETED": "Plik został usunięty",
            "FOLDER_DELETED": "Folder został usunięty",
            "FOLDER_RENAMED": "Foldera nazwa została zmieniona",
            "FILE_RENAMED": "Nazwa pliku została zmieniona",
            "UPDATED_SETTING": "Ustawienie zostało zaktualizowane",
            "PASSWORD_CHANGED": "Hasło zostało zmienione",
            "EMAIL_ADMINED": "Email został dodany do listy administratorów",
            "EMAIL_UNADMINED": "Email został usunięty z listy administratorów",
            "EMAIL_WHITELISTED": "Email został dodany do białej listy",
            "EMAIL_UNWHITELISTED": "Email został usunięty z białej listy"
        }
        const successMessage = successMessages[success] || 'Przepraszamy, coś poszło dobrze ależ i też wystąpił nieznany błąd.';
        textDiv.classList.add('text-success');
        textDiv.textContent = successMessage;
        wait(5000).then(() => {
            textDiv.classList.remove('text-success');
            textDiv.textContent = '';
        })
    }
}
