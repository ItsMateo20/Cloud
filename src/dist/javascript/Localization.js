const elements = document.querySelectorAll('[data-localize]');
const inputElements = document.querySelectorAll('[data-localize-placeholder]');
let local = 'pl_PL';
let localization = {};

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
        settings.localization = local || clickedItem.dataset.local;
        localization = await fetch('localization/' + local + '.json').then((response) => response.json())

        document.getElementById('localButtonImage').src = `icons/${settings.localization}.png`;
        clickedItem.classList.add('active');
        document.title = `${localization.Pages["Home"]} | ${localization.Main["Title"]}`
        localizationFile = `localization/${local}.json`

        loadingDiv('show');
        await GetCsrfToken().then(async csrfToken => {
            await fetch('api/user?action=settings&action2=localization', {
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                method: 'post',
                body: JSON.stringify({ _csrf: csrfToken, value: local }),
            }).then((response) => response.json())
                .then((data) => {
                    if (data.success === false) {
                        getErrorMessage(data.message);
                    }
                });
        })
        localize();
        loadingDiv('hide');
    }
}

async function localize() {
    local = settings.localization || 'pl_PL';
    localizationFile = `localization/${local}.json`
    localization = await fetch('localization/' + local + '.json').then((response) => response.json())
    const fetchPromises = Array.from(elements).map(async element => {
        let key = element.getAttribute('data-localize');
        let value = localization.Main[key];
        if (value) {
            element.textContent = value;
        }
    });

    const inputFetchPromises = Array.from(inputElements).map(async element => {
        let key = element.getAttribute('data-localize-placeholder');
        let value = localization.Main[key];
        if (value) {
            element.setAttribute('placeholder', value);
        }
    });

    let htmllang
    if (local === 'pl_PL') htmllang = 'pl';
    else if (local === 'en_UK') htmllang = 'en';
    document.querySelector('html').setAttribute('lang', htmllang);

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
        return (localization.Main[key]).toString();
    } catch (error) {
        console.error('Error fetching localization:', error);
    }
}
