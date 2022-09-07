function addRipple(...e) { e.forEach(e => document.querySelectorAll(e).forEach(e => e.classList.add("ripple"))) }

addRipple(
    ".md3-btn",
    ".md3-card",
    ".md3-chip",
    ".md3-menu__item",
    ".md3-nav__item__label",
    ".md3-drawer__item__label"
);

const removeChildren = e => { while (e.firstChild) e.removeChild(e.firstChild) };

// Dialogs
const openDialog = id => document.getElementById(id).showModal();
const closeDialog = () => document.querySelectorAll(".md3-dialog").forEach(e => e.close());

document.addEventListener("click", function (e) {
    if (e.target.tagName !== "DIALOG") return;

    const rect = e.target.getBoundingClientRect();
    const hasClickInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientY && e.clientX <= rect.left + rect.width);
    if (!hasClickInDialog) e.target.close()
})

// Menus
const menuScrim = document.createElement("div");
menuScrim.classList.add("md3-menu-scrim");
document.body.prepend(menuScrim);

function openMenu(trigger, e, type) {
    e.preventDefault();

    document.querySelectorAll(".md3-menu[open='true']").forEach(m => m.setAttribute("open", false));

    const menu = document.getElementById(trigger.getAttribute(type));
    if (!menu) return;

    const menuRect = menu.getBoundingClientRect()
        , bodyRect = document.body.getBoundingClientRect()
        , rect = trigger.getBoundingClientRect();

    if ((bodyRect.width < 512 || bodyRect.height < 512) && menu.classList.contains("md3-menu--sheet")) {
        menuScrim.setAttribute("open", true);
        menu.setAttribute("open", true);
        return
    }

    const mid = {
        top: (e.clientY < bodyRect.height / 2),
        right: (e.clientX > bodyRect.width / 2),
        bottom: (e.clientY > bodyRect.height / 2),
        left: (e.clientX < bodyRect.width / 2)
    }

    let x = e.clientX
        , y = e.clientY
        , origin = "top";

    if (trigger.tagName === "BUTTON") {
        if (mid.top) { y = rect.top + rect.height + 4 }
        else if (mid.bottom) { y = rect.top - menuRect.height - 4, origin = "bottom" }

        if (mid.left) { x = rect.left }
        else if (mid.right) { x = rect.left - menuRect.width + rect.width }

    } else {
        let originX, originY;
        if (mid.top) { originY = "0" }
        else if (mid.bottom) { y -= (menuRect.height - 2), originY = "100%" }

        if (mid.right) { x -= (menuRect.width - 2), originX = "100%" }
        else if (mid.left) { originX = "0" }

        x -= 1; y -= 1;
        origin = originX + " " + originY;
    }

    menu.style.top = y;
    menu.style.left = x;
    menu.style.transformOrigin = origin;
    menu.setAttribute("open", true)
}

const closeMenu = () => document.querySelectorAll(".md3-menu, .md3-menu-scrim").forEach(e => e.setAttribute("open", false));
const closeMenuOnOutsideClick = (e, type) => { if (!(e.target.offsetParent ?? e.target).getAttribute(type)) closeMenu() };

document.querySelectorAll("[click]").forEach(e => e.addEventListener("click", function (e) { openMenu(this, e, "click") }));
document.querySelectorAll("[contextmenu]").forEach(e => e.addEventListener("contextmenu", function (e) { openMenu(this, e, "contextmenu") }));

document.addEventListener("click", function (e) { closeMenuOnOutsideClick(e, "click") });
document.addEventListener("contextmenu", function (e) { closeMenuOnOutsideClick(e, "contextmenu") });
document.addEventListener("resize", closeMenu);
document.addEventListener("scroll", closeMenu);

// Drawer
const drawerScrim = document.createElement("div");
drawerScrim.classList.add("md3-drawer-scrim");
document.body.prepend(drawerScrim);

function openDrawer(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;

    drawerScrim.onclick = () => {
        drawer.setAttribute("open", false);
        drawerScrim.setAttribute("open", false);
    }

    drawer.setAttribute("open", true)
    drawerScrim.setAttribute("open", true)
}

// Top App Bar
function topbarScroll() {
    const isTop = 0 === window.scrollY,
        topbar = document.querySelector(".md3-topbar");

    if (!topbar) return;
    if (isTop) { topbar.classList.remove("md3-topbar--scrolled") }
    else { topbar.classList.add("md3-topbar--scrolled") }
}

document.addEventListener("scroll", topbarScroll);
topbarScroll()

// Snackbars
function openSnackbar(id) {
    const snackbar = document.getElementById(id);
    if (!snackbar) return;

    const closeSnackbar = () => snackbar.setAttribute("open", false);
    setTimeout(closeSnackbar, 1e4)

    snackbar.onclick = closeSnackbar;
    snackbar.setAttribute("open", true)
}
