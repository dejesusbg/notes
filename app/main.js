var idCount = setDefaultItem("idCount", 0)

createNotesInput.select()
createNotesInput.oninput = function () {
    createNotesButton.disabled = this.value.length ? false : true;

    const charLimit = 30;
    if (this.value.length > charLimit) {
        this.value = this.value.substr(0, charLimit)
        createNotesWarning.style.display = "block"
    }
}

createNotesButton.onclick = function () {
    const title = createNotesInput.value
        , creationDate = new Date();

    idCount += 1;
    localStorage.setItem("idCount", JSON.stringify(idCount))
    new Note(new String(idCount), title, creationDate);

    createNotesInput.value = "New note"
    createNotesInput.select()

    setTimeout(closeDialog, 0)
}

selectNotesAll.onclick = function () {
    if (unselectedNoteItems().length) {
        NotesList.selectAll()
    } else {
        NotesList.show()
    }
}

selectNotesDelete.onclick = function () {
    NotesList.delete(...selectedNoteItems())
}

selectNotesClose.onclick = function () {
    NotesList.show()
}

searchbar.oninput = function () {
    const query = this.value.trim().slice(0, 32)

    if (!query.length) {
        NotesList.show();
        document.getElementById("notes-noteslist--empty__text").textContent = "There's no notes"
        document.getElementById("notes-noteslist--empty__subtext").textContent = "Tap the button to add one"
    } else {
        const found = NotesList.filter(note => (note.title + " " + note.body).toLowerCase().includes(query))
        found.show()

        if (!found.length) {
            document.getElementById("notes-noteslist--empty__text").textContent = "No notes found"
            document.getElementById("notes-noteslist--empty__subtext").textContent = "Make sure that there's no typos"
        }
    }
}

document.addEventListener("keydown", function (e) {
    const key = e.key
        , ctrlKey = e.ctrlKey
        , shiftKey = e.shiftKey
        , altKey = e.altKey;

    if (ctrlKey) {
        switch (key) {
            case "a":
                if (selectedNoteItems().length > 0) {
                    e.preventDefault();
                    NotesList.selectAll()
                }
                break;

            case "d":
                if (selectedNoteItems().length == 0) {
                    e.preventDefault();
                    createNotesFAB.click()
                }
                break;

            case "l":
                e.preventDefault();
                changeDarkMode()
                break;

            case "Enter":
                if (document.activeElement.classList.contains("notes-noteslist__item")) {
                    e.preventDefault();

                    const ID = document.activeElement.getAttribute("id").replace("note-", "")
                    NotesList.find(note => note.id == ID).open()
                }
                break;

            case "Delete":
                if (selectedNoteItems().length > 0) {
                    selectNotesDelete.click();
                }
                break;
        }
    } else if (key == "Enter" && createNotesInput == document.activeElement) {
        createNotesButton.click()
    } else if (key == "Enter" && document.activeElement.classList.contains("notes-noteslist__item")) {
        document.activeElement.querySelector("label").click()
    } else if (key == "Escape" && document.activeElement.classList.contains("notes-noteslist__item")) {
        selectNotesClose.click()
    }
})
