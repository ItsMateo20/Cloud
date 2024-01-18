const html = document.querySelector('html');

async function GetCsrfToken() {
    return fetch("/api/csrfToken?action=get", {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'get',
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                return data.csrfToken
            } else {
                return false
            }
        });
}

//settings

let settings = {}
let info = {}

//buttons

const backBtn = document.getElementById('backButton');
const newFolderBtn = document.getElementById('newFolderButton');
const uploadBtn = document.getElementById('uploadFileButton');
const renameBtn = document.getElementById('renameFileButton');
const deleteBtn = document.getElementById('deleteButton');
const downloadBtn = document.getElementById('downloadButton');

const darkThemeBtn = document.getElementById('darkThemeSettingButton');
const showImageBtn = document.getElementById('showImageSettingButton');

//handle window events

window.onload = loadSettings;
window.onresize = Adjust;

//load settings

function loadSettings() {
    fetch("/api/user?action=settings&action2=get", {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'get',
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                settings = data.settings;
                info = data.info;
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


                if (info.admin == true) {
                    if (settings.adminMode == true) {
                        adminModeBtn.dataset.value = "true";
                        adminModeBtn.querySelector('i').classList.add('bi-check');
                    } else if (settings.adminMode == false) {
                        adminModeBtn.dataset.value = "false";
                        adminModeBtn.querySelector('i').classList.add('bi-x');
                    }
                }



                Adjust();
                setTheme();
                handleBackButton();
                handleItemEventListener("spawn");
                loadingDiv("hide");
            } else {
                location.reload()
            }
        });
}

// handle validation for change password
const oldPassword1Input = document.getElementById('oldpassword1');
const oldPassword2Input = document.getElementById('oldpassword2');
const newPasswordInput = document.getElementById('newpassword');
const changePasswordBtn = document.getElementById('changePasswordBtn');

oldPassword1Input.addEventListener('input', handleOldPasswordInput);
oldPassword2Input.addEventListener('input', handleOldPasswordInput);

changePasswordBtn.addEventListener('click', handleChangePasswordClick, { passive: true });

function handleChangePasswordClick(event) {
    const oldPassword1 = oldPassword1Input.value;
    const oldPassword2 = oldPassword2Input.value;
    const newPassword = newPasswordInput.value;

    if (oldPassword1.trim() !== oldPassword2.trim()) {
        if (oldPassword1Input.classList.contains('is-valid')) oldPassword1Input.classList.remove('is-valid');
        if (oldPassword2Input.classList.contains('is-valid')) oldPassword2Input.classList.remove('is-valid');
        if (!oldPassword1Input.classList.contains('is-invalid')) oldPassword1Input.classList.add('is-invalid');
        if (!oldPassword2Input.classList.contains('is-invalid')) oldPassword2Input.classList.add('is-invalid');
    }

    if (oldPassword1.trim() === oldPassword2.trim()) {
        if (oldPassword1Input.classList.contains('is-invalid')) oldPassword1Input.classList.remove('is-invalid');
        if (oldPassword2Input.classList.contains('is-invalid')) oldPassword2Input.classList.remove('is-invalid');
        oldPassword1Input.classList.add('is-valid');
        oldPassword2Input.classList.add('is-valid');
    }

    if (oldPassword1.trim() === oldPassword2.trim() && newPassword.trim().length >= 5) {
        loadingDiv("show");
        GetCsrfToken().then((csrfToken) => {
            fetch("/api/user?action=password-set", {
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                method: 'post',
                body: JSON.stringify({ _csrf: csrfToken, oldpassword1: oldPassword1.trim(), oldpassword2: oldPassword2.trim(), newpassword: newPassword.trim() }),
            }).then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        getSuccessMessage(data.message);
                        document.location.href = "/login";
                    } else {
                        getErrorMessage(data.message);
                    }
                    loadingDiv("hide");
                });
        })
    }
}


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
                item.querySelector("img").src = item.dataset.fileredirect.trim() + "&preview=true";
            }
            // else if (fileType === "video") {
            //     if (item.querySelector("img").classList.contains('cloudItemContainerImg')) item.querySelector("img").classList.remove('cloudItemContainerImg');
            //     if (!item.querySelector("img").classList.contains('cloudItemContainerPortrait') || !item.querySelector("img").classList.contains('cloudItemContainerLandscape')) {
            //         if (dataFileHeight > dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerPortrait');
            //         if (dataFileHeight < dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerLandscape');
            //         if (dataFileHeight == dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerPortrait');
            //     }
            //     item.querySelector("img").src = item.dataset.fileredirect.trim() + "&preview=true";
            // }
        } else {
            if (!item.querySelector("img").classList.contains('cloudItemContainerImg')) item.querySelector("img").classList.add('cloudItemContainerImg');
            if (item.querySelector("img").classList.contains('cloudItemContainerPortrait')) item.querySelector("img").classList.remove('cloudItemContainerPortrait');
            if (item.querySelector("img").classList.contains('cloudItemContainerLandscape')) item.querySelector("img").classList.remove('cloudItemContainerLandscape');
            if (fileType == "image") item.querySelector("img").src = 'icons/image.png';
            if (fileType == "video") item.querySelector("img").src = 'icons/video.png';
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
        if (!downloadBtn.classList.contains('disabled')) downloadBtn.classList.add('disabled');
        if (!renameBtn.classList.contains('disabled')) renameBtn.classList.add('disabled');
    } else if (value == false) {
        if (deleteBtn.classList.contains('disabled')) deleteBtn.classList.remove('disabled');
        if (downloadBtn.classList.contains('disabled')) downloadBtn.classList.remove('disabled');
        if (renameBtn.classList.contains('disabled')) renameBtn.classList.remove('disabled');
    }
}

function handleItemClick(event) {
    const clickedItem = event.currentTarget;
    const clickedItemType = clickedItem.dataset.filetype || "other";
    const clickedItemPath = clickedItem.dataset.fileredirect;
    const clickedItemHeight = clickedItem.dataset.fileheight || 150;
    const clickedItemWidth = clickedItem.dataset.filewidth || 300;

    if (clickedItem.classList.contains('cloudItemContainerSelected')) {
        if (clickedItemType === "folder" || clickedItemType === "other") {
            window.location.href = clickedItemPath.trim();
            return event.stopPropagation();
        } else {
            window.open(clickedItemPath.trim(), "_blank", `location=yes,height=${clickedItemHeight},width=${clickedItemWidth},status=yes`);
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
    const directory = document.getElementById('directory').dataset.directory;
    if (directory.endsWith("/") && directory.startsWith("/")) {
        backBtn.classList.add('disabled');
    }
}

//handle new folder button

newFolderBtn.addEventListener('click', handleNewFolderClick, { passive: true });

function handleNewFolderClick(event) {
    const newFolderName = prompt("Podaj nazwę nowego folderu");

    if (newFolderName !== null) {
        if (newFolderName.trim() !== "") {
            window.location.href = `/folder/new?name=${newFolderName}`;
        }
    }
}

//handle upload button

uploadBtn.addEventListener('click', handleUploadClick, { passive: true });

function handleUploadClick(event) {
    setDisabledState(true);
    const fileInput = document.createElement('input')
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*,audio/*';
    fileInput.multiple = true;
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();
}

function createItemElement(file) {
    const { type, name, path, redirect, height, width } = file;

    const container = document.createElement('div');
    container.classList.add('col', 'cloudItemContainer');
    container.dataset.filetype = type;
    container.dataset.filename = name;
    container.dataset.filepath = path;
    container.dataset.fileredirect = redirect;
    container.dataset.fileheight = height;
    container.dataset.filewidth = width;

    const img = document.createElement('img');
    img.title = '';
    img.alt = '';
    img.src = 'icons/other.png'
    if (type === "folder") img.src = 'icons/folder.png';
    else if (type === "image") img.src = 'icons/image.png';
    else if (type === "video") img.src = 'icons/video.png';
    else if (type === "audio") img.src = 'icons/audio.png';

    const h1 = document.createElement('h1');
    h1.textContent = file.name;

    container.appendChild(img);
    container.appendChild(h1);

    return container;
}

function handleFileSelect(event) {
    loadingDiv("show");
    const selectedFiles = event.currentTarget.files;

    if (selectedFiles.length == 0) return loadingDiv("hide");
    if (selectedFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }
        GetCsrfToken().then((csrfToken) => {
            formData.append('_csrf', csrfToken);
            fetch('/file/upload', {
                credentials: 'same-origin',
                method: 'post',
                body: formData,
            }).then((response) => response.json())
                .then(async (data) => {
                    if (data.success) {
                        const files = data.files;
                        const rowToAddTo = document.querySelector('.app-row');
                        for (let i = 0; i < files.length; i++) {
                            const newItemElement = await createItemElement(files[i]);
                            rowToAddTo.appendChild(newItemElement);
                        }
                        handleItemEventListener("respawn");
                        getSuccessMessage(data.message);
                    } else {
                        getErrorMessage(data.message);
                    }
                    loadingDiv("hide");
                });
        })
    } else {
        loadingDiv("hide");
    }
}

//handle rename button

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
            GetCsrfToken().then((csrfToken) => {
                fetch('/file/rename', {
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'post',
                    body: JSON.stringify({ _csrf: csrfToken, name: selectedFileName.toString(), path: selectedFilePath.toString(), type: selectedFileType.toString(), newName: newName.toString() }),
                }).then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            const newFileName = `${newName}.${selectedFileName.split('.').pop()}`
                            selectedFile.querySelector('h1').textContent = newFileName
                            console.log(newName)
                            selectedFile.dataset.filename = newFileName
                            selectedFile.dataset.fileredirect = selectedFile.dataset.fileredirect.replace(selectedFileName, newFileName);
                            selectedFile.dataset.filepath = selectedFile.dataset.filepath.replace(selectedFileName, newFileName);
                            getSuccessMessage(data.message);
                        } else {
                            getErrorMessage(data.message);
                        }
                        loadingDiv("hide");
                    });
            })
        }
    }
}

//handle delete button

deleteBtn.addEventListener('click', handleDeleteClick, { passive: true });

function handleDeleteClick(event) {
    const selectedFile = document.querySelector('.cloudItemContainerSelected');
    const selectedFilePath = selectedFile.dataset.filepath;
    const selectedFileName = selectedFile.dataset.filename;
    const selectedFileType = selectedFile.dataset.filetype;

    let confirmMessage

    if (selectedFileType === "folder") {
        confirmMessage = `Czy na pewno chcesz usunąć folder ${selectedFileName}?`
    } else if (selectedFileType === "image") {
        confirmMessage = `Czy na pewno chcesz usunąć obraz ${selectedFileName}?`
    } else if (selectedFileType === "video") {
        confirmMessage = `Czy na pewno chcesz usunąć film ${selectedFileName}?`
    } else if (selectedFileType === "audio") {
        confirmMessage = `Czy na pewno chcesz usunąć plik audio ${selectedFileName}?`
    } else {
        confirmMessage = `Czy na pewno chcesz usunąć plik ${selectedFileName}?`
    }

    setDisabledState(true);
    loadingDiv("show");

    if (confirm(confirmMessage) === true) {
        GetCsrfToken().then((csrfToken) => {
            fetch("/file/delete", {
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                method: 'post',
                body: JSON.stringify({ _csrf: csrfToken, name: selectedFileName.toString(), path: selectedFilePath.toString(), type: selectedFileType.toString() }),
            }).then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        selectedFile.remove();
                        getSuccessMessage(data.message);
                    } else {
                        getErrorMessage(data.message);
                    }
                    loadingDiv("hide");
                })
        })
    } else {
        loadingDiv("hide");
    }
}

//handle download button

downloadBtn.addEventListener('click', handleDownloadClick, { passive: true });

function handleDownloadClick(event) {
    const selectedFile = document.querySelector('.cloudItemContainerSelected');
    const selectedFilePath = selectedFile.dataset.filepath;
    const selectedFileName = selectedFile.dataset.filename;
    const selectedFileType = selectedFile.dataset.filetype;

    window.location.href = `/file/download?name=${selectedFileName}&path=${selectedFilePath}&type=${selectedFileType}`;
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


    GetCsrfToken().then((csrfToken) => {
        fetch("/api/user?action=settings&action2=darkMode", {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({ _csrf: csrfToken, value: body.classList.contains("app-dark-theme") ? "true" : "false" }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success === false) {
                    getErrorMessage(data.message);
                }
            });
    })
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

    GetCsrfToken().then((csrfToken) => {
        fetch("/api/user?action=settings&action2=showImage", {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({ _csrf: csrfToken, value: showImageBtn.dataset.value.toString() }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success === false) {
                    getErrorMessage(data.message);
                }
            });
    })
}