// Get references to your elements
const items = document.querySelectorAll('.cloudItemContainer');
const deleteBtn = document.getElementById('deleteButton');

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
        deleteBtn.removeAttribute('disabled');
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

        deleteBtn.setAttribute('disabled', 'disabled');
    }
}
