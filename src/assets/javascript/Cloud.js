//settings

let settings = {}

//buttons

const backBtn = document.getElementById('backButton');
const newFolderBtn = document.getElementById('newFolderButton');
const uploadBtn = document.getElementById('uploadFileButton');
const renameBtn = document.getElementById('renameFileButton');
const deleteBtn = document.getElementById('deleteButton');
const downloadBtn = document.getElementById('downloadButton');

const showImageBtn = document.getElementById('showImageSettingButton');

//handle window events

window.onload = loadSettings;
window.onresize = Adjust;

//load settings

function loadSettings() {
    fetch("/settings/settings", {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                settings = data.settings;
                if (settings.showImage == true) {
                    showImageBtn.dataset.value = "true";
                    showImageBtn.querySelector('i').classList.add('bi-check');
                } else if (settings.showImage == false) {
                    showImageBtn.dataset.value = "false";
                    showImageBtn.querySelector('i').classList.add('bi-x');
                }

                Adjust();
                handleBackButton();
                handleItemEventListener("spawn");
                loadingDiv("hide");
            } else {
                location.reload()
            }
        });
}

//adjust the size of the opened image to the screen size

function Adjust() {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    const cloudItems = document.querySelectorAll('.cloudItemContainer');

    cloudItems.forEach((item) => {
        const dataFileHeight = parseFloat(item.getAttribute('data-fileheight'));
        const dataFileWidth = parseFloat(item.getAttribute('data-filewidth'));
        if (settings.showImage == true) {
            if (!item.dataset.filetype === "image") {
                if (!item.querySelector("img").classList.contains('cloudItemContainerImg')) {
                    item.querySelector("img").classList.add('cloudItemContainerImg');
                }
            } else if (item.dataset.filetype === "image") {
                if (item.querySelector("img").classList.contains('cloudItemContainerImg')) item.querySelector("img").classList.remove('cloudItemContainerImg');
                if (!item.querySelector("img").classList.contains('cloudItemContainerPortrait') || !item.querySelector("img").classList.contains('cloudItemContainerLandscape')) {
                    if (dataFileHeight > dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerPortrait');
                    if (dataFileHeight < dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerLandscape');
                    if (dataFileHeight == dataFileWidth) item.querySelector("img").classList.add('cloudItemContainerPortrait');
                }
                item.querySelector("img").src = item.dataset.fileredirect.trim();
            }
        } else {
            if (!item.querySelector("img").classList.contains('cloudItemContainerImg')) item.querySelector("img").classList.add('cloudItemContainerImg');
            if (item.querySelector("img").classList.contains('cloudItemContainerPortrait')) item.querySelector("img").classList.remove('cloudItemContainerPortrait');
            if (item.querySelector("img").classList.contains('cloudItemContainerLandscape')) item.querySelector("img").classList.remove('cloudItemContainerLandscape');
            if (item.dataset.filetype == "image") item.querySelector("img").src = 'icons/image.png';
            if (item.dataset.filetype == "video") item.querySelector("img").src = 'icons/video.png';
            if (item.dataset.filetype == "folder") item.querySelector("img").src = 'icons/folder.png';
            if (item.dataset.filetype == "other") item.querySelector("img").src = 'icons/other.png';
        }

        if (dataFileHeight && dataFileWidth) {
            const heightScaleFactor = screenHeight / dataFileHeight;
            const widthScaleFactor = screenWidth / dataFileWidth;

            const scaleFactor = Math.min(heightScaleFactor, widthScaleFactor);

            const adjustedHeight = (dataFileHeight * scaleFactor) / 1.5;
            const adjustedWidth = (dataFileWidth * scaleFactor) / 1.5;

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
    const clickedItemType = clickedItem.dataset.filetype;
    const clickedItemPath = clickedItem.dataset.fileredirect;
    const clickedItemHeight = clickedItem.dataset.fileheight;
    const clickedItemWidth = clickedItem.dataset.filewidth;

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


        fetch('/file/upload', {
            method: 'post',
            body: formData,
        }).then((response) => response.json())
            .then(async (data) => {
                if (data.success) {
                    const files = data.files;
                    const rowToAddTo = document.querySelector('.row');
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
            fetch('/file/rename', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: selectedFileName.toString(), path: selectedFilePath.toString(), type: selectedFileType.toString(), newName: newName.toString() }),
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
    } else {
        confirmMessage = `Czy na pewno chcesz usunąć plik ${selectedFileName}?`
    }

    setDisabledState(true);
    loadingDiv("show");

    if (confirm(confirmMessage)) {
        fetch("/file/delete", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedFileName.toString(), path: selectedFilePath.toString(), type: selectedFileType.toString() }),
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

//handle show image button

showImageBtn.addEventListener('click', handleShowImageClick, { passive: true });

function handleShowImageClick(event) {
    const showImageSettingStatus = document.getElementById('showImageSettingStatus');

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

    fetch("/settings/showImage", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: showImageBtn.dataset.value.toString() }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.success === false) {
                getErrorMessage(data.message);
            }
        });
}
