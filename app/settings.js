const settingsColorPrimary = document.getElementById("settings-color-primary")
    , settingsColorSecondary = document.getElementById("settings-color-secondary")
    , settingsColorDefaultBtn = document.getElementById("settings-color-default-btn")
    , settingsColorBtn = document.getElementById("settings-color-btn")

settingsColorPrimary.value = setDefaultItem("primaryColor", "#0000ff");
settingsColorSecondary.value = setDefaultItem("secondaryColor", "#aa00ff");

settingsColorDefaultBtn.onclick = function () {
    settingsColorPrimary.value = "#0000ff"
    settingsColorSecondary.value = "#ff00ff"
}

settingsColorBtn.onclick = function () {
    localStorage.setItem("primaryColor", JSON.stringify(settingsColorPrimary.value))
    localStorage.setItem("secondaryColor", JSON.stringify(settingsColorSecondary.value))

    colorScheme(settingsColorPrimary.value, settingsColorSecondary.value)
    setTimeout(closeDialog, 0)
}

const settingsFontSizeBtn = document.getElementById("settings-fontsize-btn")
    , settingsFontSizeDescription = document.getElementById("settings-fontsize-desc")
    , settingsFontSizeOptions = document.querySelectorAll(".settings-fontsize-option")

let fontSize = setDefaultItem("fontSize", "Medium");
settingsFontSizeDescription.textContent = fontSize;

document.querySelector(`[value=${fontSize}]`).classList.add("settings-fontsize-selected")

settingsFontSizeOptions.forEach(opt => opt.onclick = () => {
    fontSize = opt.getAttribute("value")

    settingsFontSizeDescription.textContent = fontSize;
    localStorage.setItem("fontSize", JSON.stringify(fontSize))

    document.querySelector(".settings-fontsize-selected").classList.remove("settings-fontsize-selected")
    opt.classList.add("settings-fontsize-selected")
})

const settingsSortByBtn = document.getElementById("settings-sortby-btn")
    , settingsSortByDescription = document.getElementById("settings-sortby-desc")
    , settingsSortByOptions = document.querySelectorAll(".settings-sortby-option")

let sortBy = setDefaultItem("sortBy", "Modification");
settingsSortByDescription.textContent = sortBy;

document.querySelector(`[value=${sortBy}]`).classList.add("settings-sortby-selected")

settingsSortByOptions.forEach(opt => opt.onclick = () => {
    sortBy = opt.getAttribute("value")

    settingsSortByDescription.textContent = sortBy;
    localStorage.setItem("sortBy", JSON.stringify(sortBy))

    document.querySelector(".settings-sortby-selected").classList.remove("settings-sortby-selected")
    opt.classList.add("settings-sortby-selected")
})

const settingsDeleteBtn = document.getElementById("settings-delete-btn")
settingsDeleteBtn.onclick = function () {
    localStorage.clear()
    location.reload()
}

addRipple(".settings-item")