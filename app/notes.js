const selectedNoteItems = () => document.querySelectorAll(".notes-noteslist__item--selected")
    , unselectedNoteItems = () => document.querySelectorAll(".notes-noteslist__item:not(.notes-noteslist__item--selected)");

const createNotesInput = document.getElementById("create-notes-input")
    , createNotesButton = document.getElementById("create-notes-btn")
    , createNotesFAB = document.getElementById("create-notes-fab")
    , createNotesWarning = document.getElementById("create-notes-warning");

const searchbar = document.getElementById("search-notes-searchbar")
    , searchTopbar = document.getElementById("search-notes-topbar")
    , selectTopbar = document.getElementById("select-notes-topbar");

const selectNotesAll = document.getElementById("select-notes-all")
    , selectNotesNumber = document.getElementById("select-notes-number")
    , selectNotesDelete = document.getElementById("select-notes-delete")
    , selectNotesClose = document.getElementById("select-notes-close");

const main = document.querySelector("main");

class Note {
    constructor(id, title, creationDate) {
        this.id = id;
        this.title = title;
        this.body = "";
        this.creationDate = creationDate;
        this.editionDate = creationDate;
        NotesList.add(this);
        this.open()
    }

    show(showCreationDate = false) {
        const noteDate = showCreationDate ? this.creationDate : this.editionDate
            , todayDate = new Date()
            , yesterdayDate = new Date(new Date().setDate(todayDate.getDate() - 1));

        let noteDateProp = {
            day: noteDate.getDate(),
            month: noteDate.toLocaleString("default", { month: "short" }),
            year: noteDate.getFullYear()
        }

        const capitalizeFirstLetter = month => month.charAt(0).toUpperCase() + month.substring(1, 3);
        noteDateProp.month = capitalizeFirstLetter(noteDateProp.month);

        let date = noteDateProp.month + " " + noteDateProp.day + " " + noteDateProp.year
        if (noteDate.toDateString() == todayDate.toDateString()) {
            const addLeadingZeros = str => ("0" + str).slice(-2);

            noteDateProp.hour = addLeadingZeros(noteDate.getHours());
            noteDateProp.mins = addLeadingZeros(noteDate.getMinutes());
            date = noteDateProp.hour + ":" + noteDateProp.mins;

        } else if (noteDate.toDateString() == yesterdayDate.toDateString()) {
            date = "Yesterday";
        }

        let body = this.body.split("\n")[0]

        const noteEl = document.createElement("div")
        noteEl.classList.add("notes-noteslist__item", "ripple")
        noteEl.setAttribute("tabindex", 1)
        noteEl.setAttribute("id", `note-${this.id}`)
        noteEl.ondblclick = () => this.open()

        noteEl.innerHTML = `
            <label class="notes-noteslist__item__label" for="note-checkbox-${this.id}">
                <div class="notes-noteslist__item__checkbox">
                    <input type="checkbox" class="md3-input--checkbox" id="note-checkbox-${this.id}">
                </div>
                <div class="notes-noteslist__item__info">
                    <span class="notes-noteslist__item__title">${this.title}</span>
                    <span class="notes-noteslist__item__body">${body}</span>
                </div>
                <span class="notes-noteslist__item__date">${date}</span>
            </label>
        `

        const inputEl = noteEl.querySelector("input")
        inputEl.oninput = () => this.select(noteEl);

        main.prepend(noteEl)
    }

    open() {
        location.href = "edit.html";
        localStorage.setItem("openedNote", JSON.stringify(this))
    }

    select(noteEl) {
        noteEl.classList.toggle("notes-noteslist__item--selected");

        const thereIsNoSelected = selectedNoteItems().length == 0;
        selectNotesNumber.textContent = selectedNoteItems().length;
        
        selectTopbar.style.visibility = thereIsNoSelected ? "hidden" : "visible";
        searchTopbar.style.visibility = thereIsNoSelected ? "visible" : "hidden";
        createNotesFAB.style.visibility = thereIsNoSelected ? "visible" : "hidden";
    }
}

class AppNotesList extends Array {
    add(newNote) {
        if (!this.some(note => note.id == newNote.id)) {
            this.push(newNote);
            localStorage.setItem("NotesList", JSON.stringify(this));
            this.show();
        }
    }

    show() {
        if (appLocation == "Notes") {
            document.querySelectorAll(".notes-noteslist__item").forEach(noteEl => noteEl.remove())

            selectTopbar.style.visibility = "hidden";
            searchTopbar.style.visibility = "visible"
            createNotesFAB.style.visibility = "visible"

            let showCreationDate = false;
            const sortListBy = setDefaultItem("sortBy", "Modification");
            switch (sortListBy) {
                case "Name":
                    this.sortByName()
                    break;

                case "Modification":
                    this.sortByModification()
                    break;

                case "Creation":
                    showCreationDate = true;
                    this.sortByCreation()
                    break;
            }

            this.forEach(note => { note.__proto__ = Note.prototype, note.show(showCreationDate) })
            localStorage.setItem("openedNote", JSON.stringify(null))
        }
    }

    sortByName() {
        this.sort((a, b) => b.title.localeCompare(a.title))
    }

    sortByModification() {
        this.sort((a, b) => a.editionDate.getTime() - b.editionDate.getTime())
    }

    sortByCreation() {
        this.sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime())
    }

    selectAll() {
        unselectedNoteItems().forEach(noteEl => {
            noteEl.classList.add("notes-noteslist__item--selected")
            const inputEl = noteEl.querySelector("input");
            inputEl.checked = true
        })

        selectNotesNumber.textContent = this.length;
    }

    delete(...notes) {
        let thisNotesList = this

        const notesToDeleteIDs = notes.map(noteEl =>
            noteEl.getAttribute("id").replace("note-", "")
        )

        thisNotesList = this.filter(note => !notesToDeleteIDs.includes(note.id))
        this.splice(0, this.length)

        thisNotesList.forEach(note => this.push(note))
        localStorage.setItem("NotesList", JSON.stringify(this))
        this.show()
    }
}

var NotesList = setDefaultItem("NotesList", new AppNotesList())
NotesList.__proto__ = AppNotesList.prototype;
NotesList.forEach(note => {
    note.creationDate = new Date(note.creationDate)
    note.editionDate = new Date(note.editionDate)
})

NotesList.show()