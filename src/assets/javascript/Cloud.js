//buttons

const backBtn = document.getElementById('backButton');
const newFolderBtn = document.getElementById('newFolderButton');
const deleteBtn = document.getElementById('deleteButton');
const downloadBtn = document.getElementById('downloadButton');

//handle window
function onLoad() {
    Adjust();
    handleBackButton();
}

window.onload = onLoad;
window.onresize = Adjust;

//adjust the size of the opened image to the screen size

function Adjust() {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    const cloudItems = document.querySelectorAll('.cloudItemContainer');

    cloudItems.forEach((item) => {
        const dataFileHeight = parseFloat(item.getAttribute('data-fileheight'));
        const dataFileWidth = parseFloat(item.getAttribute('data-filewidth'));

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

//handle the click on the item

const items = document.querySelectorAll('.cloudItemContainer');

items.forEach(item => {
    item.addEventListener('click', handleItemClick, { passive: true });
    item.addEventListener('touchstart', handleTouchStart, { passive: true });
});

document.addEventListener('click', handleBodyClick, { passive: true });
document.addEventListener('touchstart', handleBodyClick, { passive: true });

function handleItemClick(event) {
    const clickedItem = event.currentTarget;
    const clickedItemType = clickedItem.dataset.filetype;
    const clickedItemPath = clickedItem.dataset.filepath;
    const clickedItemHeight = clickedItem.dataset.fileheight;
    const clickedItemWidth = clickedItem.dataset.filewidth;

    if (clickedItem.classList.contains('cloudItemContainerSelected')) {
        if (clickedItemType === "folder") {
            window.location.href = clickedItemPath.trim();
        } else {
            window.open(clickedItemPath.trim(), "_blank", `location=yes,height=${clickedItemHeight},width=${clickedItemWidth},status=yes`);
        }
    } else {
        items.forEach(item => {
            item.classList.remove('cloudItemContainerSelected');
        });
        clickedItem.classList.add('cloudItemContainerSelected');
        if (deleteBtn.classList.contains('disabled') && downloadBtn.classList.contains('disabled')) {
            deleteBtn.classList.remove('disabled');
            downloadBtn.classList.remove('disabled');
        }
    }

    event.stopPropagation();
}

function handleTouchStart(event) {
    const touchedItem = event.currentTarget;

    items.forEach(item => {
        item.classList.remove('cloudItemContainerSelected');
    });

    touchedItem.classList.toggle('cloudItemContainerSelected');

    event.stopPropagation();
}

function handleBodyClick(event) {
    const clickedElement = event.target;

    if (!clickedElement.closest('.cloudItemContainer')) {
        items.forEach(item => {
            item.classList.remove('cloudItemContainerSelected');
        });

        if (!deleteBtn.classList.contains('disabled') && !downloadBtn.classList.contains('disabled')) {
            deleteBtn.classList.add('disabled');
            downloadBtn.classList.add('disabled');
        }
    }
}

//handle the back button so its disabled when on root folder

function handleBackButton() {
    if ("<%= directory %>" === "./") {
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

//handle delete button