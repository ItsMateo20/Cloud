// Get references to your elements
const items = document.querySelectorAll('.cloudItemContainer');
const deleteBtn = document.getElementById('deleteButton');

items.forEach(item => {
    item.addEventListener('click', handleItemClick);
    item.addEventListener('touchstart', handleTouchStart);
});

document.addEventListener('click', handleBodyClick);
document.addEventListener('touchstart', handleBodyClick);

function handleItemClick(event) {
    const clickedItem = event.currentTarget;
    const clickedItemPath = clickedItem.dataset.filepath;

    if (clickedItem.classList.contains('cloudItemContainerSelected')) {
        // If the item is already selected, redirect to the specified URL
        window.location.href = clickedItemPath.trim(); // Trim to remove any extra spaces
    } else {
        // If the item is not selected, toggle the selected class
        items.forEach(item => {
            item.classList.remove('cloudItemContainerSelected');
        });
        clickedItem.classList.add('cloudItemContainerSelected');

        // Enable buttons
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
