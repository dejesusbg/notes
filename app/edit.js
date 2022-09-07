var openedNote = JSON.parse(localStorage.getItem("openedNote"));

if (!openedNote) { location.href = "index.html" }
openedNote.__proto__ = Note.prototype;

const editNotesInput = document.getElementById("edit-notes-input")
    , editNotesButton = document.getElementById("edit-notes-btn")
    , editNotesWarning = document.getElementById("edit-notes-warning")
    , editNotesTitle = document.getElementById("edit-topbar-title")
    , editNotesBody = document.getElementById("edit-notes-body")
    , editPageTitle = document.querySelector("title")
    , editNotesShare = document.getElementById("edit-notes-share");

editNotesInput.oninput = function () {
    editNotesButton.disabled = this.value.length ? false : true;

    const charLimit = 30;
    if (this.value.length > charLimit) {
        this.value = this.value.substr(0, charLimit)
        editNotesWarning.style.display = "block"
    }
}

updateTitle()
function updateTitle() {
    editNotesTitle.textContent = openedNote.title
    editPageTitle.textContent = openedNote.title;
    editNotesInput.value = openedNote.title;
    editNotesInput.select();
}

function saveNoteChanges() {
    NotesList = NotesList.filter(note => note.id != openedNote.id)
    NotesList.add(openedNote)
    localStorage.setItem("openedNote", JSON.stringify(openedNote))
}

editNotesButton.onclick = () => {
    const newTitle = editNotesInput.value;

    openedNote.title = newTitle;
    openedNote.editionDate = new Date();
    updateTitle();
    saveNoteChanges();

    setTimeout(closeDialog, 0);
}

let editNotesBodyFontSize = setDefaultItem("fontSize", "Medium");

switch (editNotesBodyFontSize) {
    case "Small":
        editNotesBody.style.font = "var(--font-body-m)"
        break;

    case "Medium":
        editNotesBody.style.font = "var(--font-body-l)"
        break;

    case "Large":
        editNotesBody.style.font = "var(--font-title-l)"
        break;
}

editNotesBody.value = openedNote.body

editNotesBody.focus()
editNotesBody.oninput = function () {
    openedNote.body = this.value
    openedNote.editionDate = new Date();
    saveNoteChanges()
}

editNotesShare.onclick = async () => {
    const shareData = {
        title: openedNote.title,
        text: openedNote.body
    };

    const canShare = navigator.canShare && navigator.canShare(shareData);
    if (canShare) { navigator.share(shareData) }
}

document.addEventListener("keydown", (e) => {
    const key = e.key,
        ctrlKey = e.ctrlKey;

    if (ctrlKey) {
        switch (key) {
            case "s":
                e.preventDefault();
                break;
        
            case "l":
                e.preventDefault();
                changeDarkMode();
                break;
        }
    } else if (key == "Enter" && editNotesInput == document.activeElement) {
        editNotesButton.click();
    }
})