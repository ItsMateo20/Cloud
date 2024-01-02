const adminModeBtn = document.getElementById('adminModeSettingButton');

const adminBtn = document.getElementById('adminButton');
const whitelistBtn = document.getElementById("whitelistButton");

adminModeBtn.addEventListener('click', handleAdminModeClick, { passive: true });

function handleAdminModeClick(event) {
    const adminModeSettingStatus = adminModeBtn.querySelector('i')

    if (adminModeBtn.dataset.value === "true") {
        adminModeBtn.dataset.value = "false";
        settings.adminMode = false;
        adminModeSettingStatus.classList.toggle('bi-x');
        adminModeSettingStatus.classList.toggle('bi-check');
    } else if (adminModeBtn.dataset.value === "false") {
        adminModeBtn.dataset.value = "true";
        settings.adminMode = true;
        adminModeSettingStatus.classList.toggle('bi-check');
        adminModeSettingStatus.classList.toggle('bi-x');
    }

    setDisabledState(true);

    fetch("/settings/adminMode", {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({ _csrf: csrfToken, value: adminModeBtn.dataset.value.toString() }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.success === false) {
                getErrorMessage(data.message);
            } else {
                location.reload()
            }
        });
}

adminBtn.addEventListener("click", adminButtonClick, { passive: true });

function adminButtonClick() {
    var adminInput = document.getElementById("adminInput");
    var adminEmailList = document.getElementById("adminEmailList");
    loadingDiv("show")
    fetch("/api/admin?action=add", {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({ _csrf: csrfToken, email: adminInput.value }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                getSuccessMessage(data.message);
                adminEmailList.innerHTML = "";
                data.list.forEach(user => {
                    adminEmailList.innerHTML += `
                    <tr>
                        <td>
                            ${user.email}
                            </br>
                            <button class="btn btn-outline-danger" type="button" onclick="removeadminButton(this)"
                                data-email="${user.email}">Usuń</button>
                        </td>
                    </tr>
                    `
                });
            } else {
                getErrorMessage(data.message);
            }
            adminInput.value = "";
            loadingDiv("hide")
        });
}

function removeadminButton({ dataset }) {
    var email = dataset.email;
    var adminEmailList = document.getElementById("adminEmailList");
    loadingDiv("show")
    fetch("/api/admin?action=remove", {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({ _csrf: csrfToken, email: email }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                getSuccessMessage(data.message);
                adminEmailList.innerHTML = "";
                data.list.forEach(user => {
                    adminEmailList.innerHTML += `
                    <tr>
                        <td>
                            ${user.email}
                            </br>
                            <button class="btn btn-outline-danger" type="button" onclick="removeadminButton(this)"
                                data-email="${user.email}">Usuń</button>
                        </td>
                    </tr>
                    `
                });
            } else {
                getErrorMessage(data.message);
            }
            loadingDiv("hide")
        });
}


whitelistBtn.addEventListener("click", whitelistButtonClick, { passive: true });

function whitelistButtonClick() {
    var whitelistInput = document.getElementById("whitelistInput");
    var whitelistEmailList = document.getElementById("whitelistEmailList");
    loadingDiv("show")
    fetch("/api/whitelist?action=add", {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({ _csrf: csrfToken, email: whitelistInput.value }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                getSuccessMessage(data.message);
                whitelistEmailList.innerHTML = "";
                data.list.forEach(user => {
                    whitelistEmailList.innerHTML += `
                    <tr>
                        <td>
                            ${user.email}
                            </br>
                            <button class="btn btn-outline-danger" type="button" onclick="unwhitelistButton(this)"
                                data-email="${user.email}">Usuń</button>
                        </td>
                    </tr>
                    `
                });
            } else {
                getErrorMessage(data.message);
            }
            whitelistInput.value = "";
            loadingDiv("hide")
        });
}

function unwhitelistButton({ dataset }) {
    var email = dataset.email;
    var whitelistEmailList = document.getElementById("whitelistEmailList");
    loadingDiv("show")
    fetch("/api/whitelist?action=remove", {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({ _csrf: csrfToken, email: email }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                getSuccessMessage(data.message);
                whitelistEmailList.innerHTML = "";
                data.list.forEach(user => {
                    whitelistEmailList.innerHTML += `
                    <tr>
                        <td>
                            ${user.email}
                            </br>
                            <button class="btn btn-outline-danger" type="button" onclick="unwhitelistButton(this)"
                                data-email="${user.email}">Usuń</button>
                        </td>
                    </tr>
                    `
                });
            } else {
                getErrorMessage(data.message);
            }
            loadingDiv("hide")
        });
}