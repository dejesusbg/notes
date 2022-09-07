function setDefaultItem(key, def) {
    const value = JSON.parse(localStorage.getItem(key)) ?? def;
    localStorage.setItem(key, JSON.stringify(value))
    return value;
}
const appLocation = document.querySelector("title").textContent

function setColorScheme() {
    const primary = setDefaultItem("primaryColor", "#0000ff")
        , secondary = setDefaultItem("secondaryColor", "#ff00ff")

    colorScheme(primary, secondary)
}

function setDarkMode() {
    const mediaQueryDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
        , prefersDarkMode = setDefaultItem("prefersDarkMode", mediaQueryDarkMode.matches)

    document.body.classList.add(prefersDarkMode ? "dark" : "light")
    document.body.classList.remove(!prefersDarkMode ? "dark" : "light")
}

function changeDarkMode() {
    toggleDarkMode()
    const newDarkMode = !JSON.parse(localStorage.getItem("prefersDarkMode"))
    localStorage.setItem("prefersDarkMode", newDarkMode)
}

setColorScheme()
setDarkMode()
