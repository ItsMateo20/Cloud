const elements = document.querySelectorAll('[data-localize]');
const inputElements = document.querySelectorAll('[data-localize-placeholder]');
let local = settings.localization || 'pl_PL';
let localization = {
    "pl_PL": {
        "Main": {
            "Title": "Chmura",
            "LoadingMessage": "Wczytywanie...",
            "Directory": "Katalog",
            "OldPassword": "Stare Hasło",
            "RepeatOldPassword": "Powtórz Stare Hasło",
            "PleaseEnterOldPassword": "Proszę Wprowadź Stare Hasło",
            "PleaseRepeatOldPassword": "Proszę Powtórz Stare Hasło",
            "NewPassword": "Nowe Hasło",
            "ChangePassword": "Zmień Hasło",
            "ChangePasswordMenuTitle": "Menu Zmiany Hasła",
            "AdminMenuTitle": "Menu Administratora",
            "WhitelistMenuTitle": "Menu Białej Listy",
            "Add": "Dodaj",
            "Back": "Powrót",
            "EditFiles": "Edytuj Pliki",
            "UploadFiles": "Wgraj Pliki",
            "Rename": "Zmień Nazwę",
            "NewFolder": "Nowy Folder",
            "Delete": "Usuń",
            "Download": "Pobierz",
            "LoggedInAs": "Zalogowany jako",
            "DarkTheme": "Ciemny Motyw",
            "ShowThumbnails": "Pokaż Miniatury",
            "AdminMode": "Tryb Administratora",
            "Logout": "Wyloguj",
            "Login": "Zaloguj",
            "Login2": "Zaloguj się",
            "SignUp": "Zarejestruj",
            "SignUp2": "Zarejestruj się",
            "YesAccountLogin": "Masz już konto? Zaloguj się!",
            "NoAccountSignUp": "Nie masz konta? Zarejestruj się!",
            "EmailAdress": "Adres E-mail",
            "EnterNewName": "Wprowadź nową nazwę",
            "EnterEmail": "Wprowadź adres e-mail",
            "EnterPassword": "Wprowadź hasło",
            "PleaseEnterEmail": "Proszę podać adres e-mail",
            "PleaseEnterPassword": "Wprowadź Hasło",
            "PleaseRepeatPassword": "Proszę Powtórz Hasło",
            "ConfirmDeletionOfFolder": "Czy na pewno chcesz usunąć folder",
            "ConfirmDeletionOfFile": "Czy na pewno chcesz usunąć plik",
            "NotGiveAwayEmailAdress": "Nie podajemy twojego adresu e-mail nikomu"
        },
        "Pages": {
            "Home": "Strona główna",
            "Login": "Zaloguj się",
            "SignUp": "Zarejestruj się"
        },
        "Errors": {
            "MISSING_DATA_LOGIN": "Przepraszamy, musisz wprowadzić wszystkie wymagane dane.",
            "INCORRECT_DATA_LOGIN": "Przepraszamy, wprowadzone dane są nieprawidłowe. Spróbuj ponownie.",
            "EMAIL_NOT_FOUND": "Przepraszamy, podany adres e-mail nie został znaleziony. Spróbuj ponownie.",
            "MISSING_DATA_SIGNUP": "Przepraszamy, musisz wprowadzić wszystkie wymagane dane.",
            "INCORRECT_DATA_SIGNUP": "Przepraszamy, wprowadzone dane są nieprawidłowe. Spróbuj ponownie.",
            "PASSWORD_NOT_MATCH_SIGNUP": "Przepraszamy, wprowadzone hasła nie są takie same. Spróbuj ponownie.",
            "ACCOUNT_ALREADY_EXISTS_SIGNUP": "Przepraszamy, konto o podanym adresie e-mail już istnieje. Spróbuj ponownie.",
            "FAILED_AUTHENTICATION": "Przepraszamy, nie udało się potwierdzić twoje dane. Spróbuj ponownie.",
            "ACCESS_DENIED": "Przepraszamy, nie masz uprawnień do wykonania tej operacji. Spróbuj ponownie.",
            "INVALID_FOLDER": "Przepraszamy, wybrany folder jest nieprawidłowy. Spróbuj ponownie.",
            "FILE_ALREADY_EXISTS": "Przepraszamy, plik o podanej nazwie już istnieje. Zmień nazwę pliku i spróbuj ponownie.",
            "FILE_DOESNT_EXIST": "Przepraszamy, plik nie został znaleziony. Spróbuj ponownie.",
            "FOLDER_DOESNT_EXIST": "Przepraszamy, folder nie został znaleziony. Spróbuj ponownie.",
            "ERROR_WHILE_DELETING_FILE": "Przepraszamy, wystąpił błąd podczas usuwania pliku. Spróbuj ponownie.",
            "ERROR_WHILE_UPLOADING_FILE": "Przepraszamy, wystąpił błąd podczas przesyłania pliku. Spróbuj ponownie.",
            "ZIP_CREATION_ERROR": "Przepraszamy, wystąpił błąd podczas tworzenia archiwum. Spróbuj ponownie.",
            "EMAIL_ALREADY_ADMIN": "Przepraszamy, podany adres e-mail jest już administratorem. Spróbuj ponownie.",
            "EMAIL_NOT_ADMIN": "Przepraszamy, podany adres e-mail nie jest administratorem. Spróbuj ponownie.",
            "EMAIL_ALREADY_WHITELISTED": "Przepraszamy, podany adres e-mail jest już na białej liście. Spróbuj ponownie.",
            "EMAIL_NOT_WHITELISTED": "Przepraszamy, podany adres e-mail nie jest na białej liście. Spróbuj ponownie.",
            "PASSWORD_NOT_MATCH": "Przepraszamy, wprowadzone hasła nie są takie same. Spróbuj ponownie.",
            "UNKNOWN_ERROR": "Przepraszamy, wystąpił nieznany błąd. Spróbuj ponownie."
        },
        "Successes": {
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
    },
    "en_UK": {
        "Main": {
            "Title": "Cloud",
            "LoadingMessage": "Loading...",
            "Directory": "Directory",
            "OldPassword": "Old Password",
            "RepeatOldPassword": "Repeat Old Password",
            "PleaseEnterOldPassword": "Please Enter Old Password",
            "PleaseRepeatOldPassword": "Please Repeat Old Password",
            "NewPassword": "New Password",
            "ChangePassword": "Change Password",
            "ChangePasswordMenuTitle": "Change Password Menu",
            "AdminMenuTitle": "Admin Menu",
            "WhitelistMenuTitle": "Whitelist Menu",
            "Add": "Add",
            "Back": "Back",
            "EditFiles": "Edit Files",
            "UploadFiles": "Upload Files",
            "Rename": "Rename",
            "NewFolder": "New Folder",
            "Delete": "Delete",
            "Download": "Download",
            "LoggedInAs": "Logged in as",
            "DarkTheme": "Dark Theme",
            "ShowThumbnails": "Show Thumbnails",
            "AdminMode": "Admin Mode",
            "Logout": "Logout",
            "Login": "Login",
            "Login2": "Log In",
            "SignUp": "Sign Up",
            "SignUp2": "Sign Up",
            "YesAccountLogin": "Already have an account? Log in!",
            "NoAccountSignUp": "Don't have an account? Sign up!",
            "EmailAdress": "Email Address",
            "EnterNewName": "Enter new name for",
            "EnterEmail": "Enter email address",
            "EnterPassword": "Enter password",
            "PleaseEnterEmail": "Please enter email address",
            "PleaseEnterPassword": "Please enter password",
            "PleaseRepeatPassword": "Please repeat password",
            "ConfirmDeletionOfFolder": "Are you sure you want to delete the folder",
            "ConfirmDeletionOfFile": "Are you sure you want to delete the file",
            "NotGiveAwayEmailAdress": "We do not give away your email address"
        },
        "Pages": {
            "Home": "Home",
            "Login": "Login",
            "SignUp": "Sign Up"
        },
        "Errors": {
            "MISSING_DATA_LOGIN": "Sorry, you must enter all required data.",
            "INCORRECT_DATA_LOGIN": "Sorry, the entered data is incorrect. Please try again.",
            "EMAIL_NOT_FOUND": "Sorry, the entered email address was not found. Please try again.",
            "MISSING_DATA_SIGNUP": "Sorry, you must enter all required data.",
            "INCORRECT_DATA_SIGNUP": "Sorry, the entered data is incorrect. Please try again.",
            "PASSWORD_NOT_MATCH_SIGNUP": "Sorry, the entered passwords do not match. Please try again.",
            "ACCOUNT_ALREADY_EXISTS_SIGNUP": "Sorry, an account with the entered email address already exists. Please try again.",
            "FAILED_AUTHENTICATION": "Sorry, we could not authenticate your data. Please try again.",
            "ACCESS_DENIED": "Sorry, you do not have permission to perform this operation. Please try again.",
            "INVALID_FOLDER": "Sorry, the selected folder is invalid. Please try again.",
            "FILE_ALREADY_EXISTS": "Sorry, a file with the entered name already exists. Please rename the file and try again.",
            "FILE_DOESNT_EXIST": "Sorry, the file was not found. Please try again.",
            "FOLDER_DOESNT_EXIST": "Sorry, the folder was not found. Please try again.",
            "ERROR_WHILE_DELETING_FILE": "Sorry, an error occurred while deleting the file. Please try again.",
            "ERROR_WHILE_UPLOADING_FILE": "Sorry, an error occurred while uploading the file. Please try again.",
            "ZIP_CREATION_ERROR": "Sorry, an error occurred while creating the zip archive. Please try again.",
            "EMAIL_ALREADY_ADMIN": "Sorry, the entered email address is already an administrator. Please try again.",
            "EMAIL_NOT_ADMIN": "Sorry, the entered email address is not an administrator. Please try again.",
            "EMAIL_ALREADY_WHITELISTED": "Sorry, the entered email address is already whitelisted. Please try again.",
            "EMAIL_NOT_WHITELISTED": "Sorry, the entered email address is not whitelisted. Please try again.",
            "PASSWORD_NOT_MATCH": "Sorry, the entered passwords do not match. Please try again.",
            "UNKNOWN_ERROR": "Sorry, an unknown error occurred. Please try again."
        },
        "Successes": {
            "FILE_UPLOADED": "File uploaded successfully",
            "FILE_DELETED": "File deleted successfully",
            "FOLDER_DELETED": "Folder deleted successfully",
            "FOLDER_RENAMED": "Folder name changed successfully",
            "FILE_RENAMED": "File name changed successfully",
            "UPDATED_SETTING": "Setting updated successfully",
            "PASSWORD_CHANGED": "Password changed successfully",
            "EMAIL_ADMINED": "Email added to administrator list",
            "EMAIL_UNADMINED": "Email removed from administrator list",
            "EMAIL_WHITELISTED": "Email added to whitelist",
            "EMAIL_UNWHITELISTED": "Email removed from whitelist"
        }
    }
};

const localButton = document.querySelectorAll('[id=localButton]');
localButton.forEach(button => {
    button.addEventListener('click', changeLocal);
});

async function changeLocal(event) {
    const clickedItem = event.currentTarget;
    if (clickedItem.dataset.local) {
        const localButton = document.querySelector(`[data-local="${settings.localization}"]`)
        if (localButton) localButton.classList.remove('active');

        local = clickedItem.dataset.local;
        settings.localization = local;

        document.getElementById('localButtonImage').src = `./assets/icons/${settings.localization}.png`;
        clickedItem.classList.add('active');
        document.title = `${localization[local].Pages["Home"]} | ${localization[local].Main["Title"]} Preview`

        loadingDiv('show');
        localize();
        loadingDiv('hide');
    }
}

async function localize() {
    const fetchPromises = Array.from(elements).map(async element => {
        let key = element.getAttribute('data-localize');
        let value = localization[local].Main[key];
        if (value) {
            element.textContent = value;
        }
    });

    const inputFetchPromises = Array.from(inputElements).map(async element => {
        let key = element.getAttribute('data-localize-placeholder');
        let value = localization[local].Main[key];
        if (value) {
            element.setAttribute('placeholder', value);
        }
    });

    Promise.all(fetchPromises)
        .catch(error => {
            console.error('Error fetching localization:', error);
        });

    Promise.all(inputFetchPromises)
        .catch(error => {
            console.error('Error fetching localization:', error);
        });
}

async function getLocalizedText(key) {
    try {
        return (localization[local].Main[key]).toString();
    } catch (error) {
        console.error('Error fetching localization:', error);
    }
}
