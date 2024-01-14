const html = document.querySelector('html');
//settings

let settings = {
    darkMode: false,
    showImage: true
}
let info = {}

//buttons

const backBtn = document.getElementById('backButton');
const newFolderBtn = document.getElementById('newFolderButton');
const renameBtn = document.getElementById('renameFileButton');
const deleteBtn = document.getElementById('deleteButton');

const darkThemeBtn = document.getElementById('darkThemeSettingButton');
const showImageBtn = document.getElementById('showImageSettingButton');

//handle window events

window.onload = loadSettings;
window.onresize = Adjust;

//load settings

function loadSettings() {
    if (settings.darkMode == true) {
        darkThemeBtn.dataset.value = "true";
        html.setAttribute('data-bs-theme', 'dark');
        body.classList.add("app-dark-theme")
        body.classList.remove("app-light-theme")
        darkThemeBtn.querySelector('i').classList.add('bi-moon');
    } else if (settings.darkMode == false) {
        darkThemeBtn.dataset.value = "false";
        html.setAttribute('data-bs-theme', 'light');
        darkThemeBtn.querySelector('i').classList.add('bi-sun');
    }

    if (settings.showImage == true) {
        showImageBtn.dataset.value = "true";
        showImageBtn.querySelector('i').classList.add('bi-check');
    } else if (settings.showImage == false) {
        showImageBtn.dataset.value = "false";
        showImageBtn.querySelector('i').classList.add('bi-x');
    }

    Adjust();
    setTheme();
    handleBackButton();
    handleItemEventListener("spawn");
    loadingDiv("hide");
}

// handle validation for change password
const oldPassword1Input = document.getElementById('oldpassword1');
const oldPassword2Input = document.getElementById('oldpassword2');
const newPasswordInput = document.getElementById('newpassword');
const changePasswordBtn = document.getElementById('changePasswordBtn');

oldPassword1Input.addEventListener('input', handleOldPasswordInput);
oldPassword2Input.addEventListener('input', handleOldPasswordInput);

function handleOldPasswordInput() {
    const oldPassword1 = oldPassword1Input.value;
    const oldPassword2 = oldPassword2Input.value;

    if (oldPassword1.trim() !== oldPassword2.trim()) {
        if (oldPassword1Input.classList.contains('is-valid')) oldPassword1Input.classList.remove('is-valid');
        if (oldPassword2Input.classList.contains('is-valid')) oldPassword2Input.classList.remove('is-valid');
        if (!oldPassword1Input.classList.contains('is-invalid')) oldPassword1Input.classList.add('is-invalid');
        if (!oldPassword2Input.classList.contains('is-invalid')) oldPassword2Input.classList.add('is-invalid');
    } else {
        if (oldPassword1Input.classList.contains('is-invalid')) oldPassword1Input.classList.remove('is-invalid');
        if (oldPassword2Input.classList.contains('is-invalid')) oldPassword2Input.classList.remove('is-invalid');
        oldPassword1Input.classList.add('is-valid');
        oldPassword2Input.classList.add('is-valid');
    }
}

// dark/light theme

const body = document.body

function setTheme() {
    if (body.classList.contains("app-dark-theme")) {
        const btn = document.querySelectorAll('.btn-outline-secondary')
        btn.forEach(btn => {
            btn.classList.toggle('btn-outline-light')
            btn.classList.toggle('btn-outline-secondary')
        })
    } else if (body.classList.contains("app-light-theme")) {
        const btn = document.querySelectorAll('.btn-outline-light')
        btn.forEach(btn => {
            btn.classList.toggle('btn-outline-light')
            btn.classList.toggle('btn-outline-secondary')
        })
    }
}

//adjust the size of the opened image to the screen size

function Adjust() {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    const cloudItems = document.querySelectorAll('.cloudItemContainer');

    cloudItems.forEach((item) => {
        const dataFileHeight = parseFloat(item.getAttribute('data-fileheight'));
        const dataFileWidth = parseFloat(item.getAttribute('data-filewidth'));
        const fileType = item.dataset.filetype;
        if (settings.showImage == true) {
            if (!fileType === "image" || fileType === "video") {
                if (!item.querySelector("img").classList.contains('cloudItemContainerImg')) {
                    item.querySelector("img").classList.add('cloudItemContainerImg');
                }
            } else if (fileType === "image") {
                if (item.querySelector("img").classList.contains('cloudItemContainerImg')) item.querySelector("img").classList.remove('cloudItemContainerImg');
                if (!item.querySelector("img").classList.contains('cloudItemContainerPortrait') || !item.querySelector("img").classList.contains('cloudItemContainerLandscape')) {
                    if (dataFileHeight > dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerPortrait');
                    if (dataFileHeight < dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerLandscape');
                    if (dataFileHeight == dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerPortrait');
                }
                item.querySelector("img").src = item.dataset.fileredirect.trim()
            }
        } else {
            if (!item.querySelector("img").classList.contains('cloudItemContainerImg')) item.querySelector("img").classList.add('cloudItemContainerImg');
            if (item.querySelector("img").classList.contains('cloudItemContainerPortrait')) item.querySelector("img").classList.remove('cloudItemContainerPortrait');
            if (item.querySelector("img").classList.contains('cloudItemContainerLandscape')) item.querySelector("img").classList.remove('cloudItemContainerLandscape');
            if (fileType == "image") item.querySelector("img").src = '../src/assets/icons/image.png';
            if (fileType == "video") item.querySelector("img").src = '../src/assets/icons/video.png';
        }

        if (dataFileHeight && dataFileWidth) {
            const heightScaleFactor = screenHeight / dataFileHeight;
            const widthScaleFactor = screenWidth / dataFileWidth;

            const scaleFactor = Math.min(heightScaleFactor, widthScaleFactor);

            const adjustedHeight = Math.round((dataFileHeight * scaleFactor) / 1.5);
            const adjustedWidth = Math.round((dataFileWidth * scaleFactor) / 1.5);

            item.setAttribute('data-fileheight', adjustedHeight.toString());
            item.setAttribute('data-filewidth', adjustedWidth.toString());
        }
    });
}

function loadingDiv(value) {
    const loadingDiv = document.querySelector('#loading');
    if (value == "hide") {
        loadingDiv.classList.add("d-none")
    } else if (value == "show") {
        loadingDiv.classList.remove("d-none")
    }
}


//handle the click on the item

let items = document.querySelectorAll('.cloudItemContainer');

function handleItemEventListener(value) {
    items = document.querySelectorAll('.cloudItemContainer');
    if (value == "spawn") {
        items.forEach(item => {
            item.addEventListener('click', handleItemClick, { passive: true });
        });
        Adjust()
    } else if (value == "respawn") {
        items.forEach(item => {
            item.removeEventListener('click', handleItemClick, { passive: true });
        });
        items.forEach(item => {
            item.addEventListener('click', handleItemClick, { passive: true });
        });
        Adjust()
    }
}

document.body.addEventListener('click', handleBodyClick, { passive: true });


function setDisabledState(value) {
    if (value == true) {
        if (!deleteBtn.classList.contains('disabled')) deleteBtn.classList.add('disabled');
        if (!renameBtn.classList.contains('disabled')) renameBtn.classList.add('disabled');
    } else if (value == false) {
        if (deleteBtn.classList.contains('disabled')) deleteBtn.classList.remove('disabled');
        if (renameBtn.classList.contains('disabled')) renameBtn.classList.remove('disabled');
    }
}

let lastFolder = "root"
let folderOpen = "root"

function handleItemClick(event) {
    const clickedItem = event.currentTarget;
    const clickedItemType = clickedItem.dataset.filetype || "other";
    const selectedFileName = clickedItem.dataset.filename;
    const clickedItemPath = clickedItem.dataset.fileredirect;
    const clickedItemHeight = clickedItem.dataset.fileheight || 150;
    const clickedItemWidth = clickedItem.dataset.filewidth || 300;

    if (clickedItem.classList.contains('cloudItemContainerSelected')) {
        if (clickedItemType === "folder" || clickedItemType === "other") {
            loadingDiv("show");
            lastFolder = folderOpen
            openFolder(selectedFileName, clickedItem.parentElement.id);
            return event.stopPropagation();
        } else {
            window.open(clickedItem.dataset.githubimage, "_blank", `location=yes,height=${clickedItemHeight},width=${clickedItemWidth},status=yes`);
            return event.stopPropagation();
        }
    } else {
        items.forEach(item => {
            item.classList.remove('cloudItemContainerSelected');
        });
        clickedItem.classList.add('cloudItemContainerSelected');
        setDisabledState(false);
        return event.stopPropagation();
    }
}

function openFolder(path, lastFolderOpen) {
    const folder = document.getElementById(path);
    const lastFolder = document.getElementById(lastFolderOpen);
    const directory = document.getElementById('directory').dataset;

    folderOpen = path

    if (folder) {
        directory.directory = `/${path}`;
        lastFolder.classList.add('d-none');
        folder.classList.remove('d-none');
        handleItemEventListener("respawn");
        Adjust();
        handleBackButton();
    }
    loadingDiv("hide");
}

function handleBodyClick(event) {
    const clickedElement = event.target;
    if (clickedElement.closest('.dropdown-toggle') || clickedElement.closest('.dropdown-item') || clickedElement.closest('.nav-item') || clickedElement.closest('.navbar-toggler')) return;

    if (!clickedElement.closest('.cloudItemContainer')) {
        items.forEach(item => {
            item.classList.remove('cloudItemContainerSelected');
        });
        setDisabledState(true);
    }
}

//handle the back button so its disabled when on root folder

function handleBackButton() {
    const directoryElement = document.getElementById('directory')
    if (directoryElement.dataset.directory == "/" || directoryElement.dataset.directory == "/root" || folderOpen == "root") {
        backBtn.classList.add('disabled');
        directoryElement.innerHTML = `<span class="navbar-text me-3">Katalog: ./</span>`
    } else {
        backBtn.classList.remove('disabled');
        directoryElement.innerHTML = `<span class="navbar-text me-3">Katalog: <a class="navbar-text" id="folderLink">./</a>
                    <span class="navbar-text">
                        ${folderOpen}
                    </span>
                </span>`;
        const folderLink = document.getElementById('folderLink');
        folderLink.addEventListener('click', function () {
            openFolder('root', folderOpen);
        });
    }
}

//handle back button

backBtn.addEventListener('click', handleBackClick, { passive: true });

function handleBackClick(event) {
    loadingDiv("show");
    openFolder(lastFolder, folderOpen);
}



//handle rename button

deleteBtn.addEventListener('click', handleDeleteClick, { passive: true });

function handleDeleteClick(event) {
    const selectedFile = document.querySelector('.cloudItemContainerSelected');
    const selectedFilePath = selectedFile.dataset.filepath;
    const selectedFileName = selectedFile.dataset.filename;
    const selectedFileType = selectedFile.dataset.filetype;

    let confirmMessage;

    if (selectedFileType === "folder") {
        confirmMessage = `Czy na pewno chcesz usunąć folder ${selectedFileName}?`;
    } else if (selectedFileType === "image") {
        confirmMessage = `Czy na pewno chcesz usunąć obraz ${selectedFileName}?`;
    } else if (selectedFileType === "video") {
        confirmMessage = `Czy na pewno chcesz usunąć film ${selectedFileName}?`;
    } else if (selectedFileType === "audio") {
        confirmMessage = `Czy na pewno chcesz usunąć plik audio ${selectedFileName}?`;
    } else {
        confirmMessage = `Czy na pewno chcesz usunąć plik ${selectedFileName}?`;
    }

    setDisabledState(true);
    loadingDiv("show");

    if (confirm(confirmMessage) === true) {
        if (selectedFileType == "folder") {
            document.getElementById(selectedFileName).remove();
        }
        selectedFile.remove();
        getSuccessMessage("FILE_DELETED")
    } else {
        getErrorMessage("FILE_DOESNT_EXIST");
    }
    loadingDiv("hide");
}

// handle rename button

renameBtn.addEventListener('click', handleRenameClick, { passive: true });

function handleRenameClick(event) {
    const selectedFile = document.querySelector('.cloudItemContainerSelected');
    const selectedFilePath = selectedFile.dataset.filepath;
    const selectedFileName = selectedFile.dataset.filename;
    const selectedFileType = selectedFile.dataset.filetype;

    setDisabledState(true);
    loadingDiv("show");

    let newName = prompt("Podaj nową nazwę");

    if (newName !== null) {
        if (newName.trim() !== "") {
            selectedFile.querySelector('h1').textContent = newName;
            selectedFile.dataset.filename = newName;
            selectedFile.dataset.fileredirect = selectedFile.dataset.fileredirect.replace(selectedFileName, newName);
            selectedFile.dataset.filepath = selectedFile.dataset.filepath.replace(selectedFileName, newName);
            if (selectedFileType === "folder") {
                document.getElementById(selectedFileName).id = newName;
                getSuccessMessage("FOLDER_RENAMED");
            } else {
                getSuccessMessage("FILE_RENAMED");
            }
            loadingDiv("hide");
        } else {
            getErrorMessage("UNKNOWN_ERROR");
            loadingDiv("hide");
        }
    }
}

//handle dark theme button

darkThemeBtn.addEventListener('click', handleDarkThemeClick, { passive: true });

function handleDarkThemeClick(event) {
    const darkThemeSettingStatus = darkThemeBtn.querySelector('i')

    if (body.classList.contains("app-dark-theme")) {
        darkThemeBtn.dataset.value = "false";
        html.setAttribute('data-bs-theme', 'light');
        settings.darkMode = false;
        body.classList.toggle("app-dark-theme");
        body.classList.toggle("app-light-theme");
        darkThemeBtn.querySelector('i').classList.toggle('bi-moon');
        darkThemeBtn.querySelector('i').classList.toggle('bi-sun');
    } else if (body.classList.contains("app-light-theme")) {
        darkThemeBtn.dataset.value = "true";
        html.setAttribute('data-bs-theme', 'dark');
        settings.darkMode = true;
        body.classList.toggle("app-light-theme");
        body.classList.toggle("app-dark-theme");
        darkThemeSettingStatus.classList.toggle('bi-sun');
        darkThemeSettingStatus.classList.toggle('bi-moon');
    }
    setTheme();
}

//handle show image button

showImageBtn.addEventListener('click', handleShowImageClick, { passive: true });

function handleShowImageClick(event) {
    const showImageSettingStatus = showImageBtn.querySelector('i')

    if (showImageBtn.dataset.value === "true") {
        showImageBtn.dataset.value = "false";
        settings.showImage = false;
        showImageSettingStatus.classList.toggle('bi-x');
        showImageSettingStatus.classList.toggle('bi-check');
    } else if (showImageBtn.dataset.value === "false") {
        showImageBtn.dataset.value = "true";
        settings.showImage = true;
        showImageSettingStatus.classList.toggle('bi-check');
        showImageSettingStatus.classList.toggle('bi-x');
    }

    setDisabledState(true);
    Adjust();
}
