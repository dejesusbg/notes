const openedNote = JSON.parse(localStorage.getItem("openedNote"));
if (!openedNote) location.href = "index.html";
openedNote.__proto__ = Note.prototype;

const editPageTitle = document.querySelector("title"),
  editNotesTitle = document.getElementById("edit-topbar-title"),
  editNotesBody = document.getElementById("edit-notes-body"),
  editNotesShare = document.getElementById("edit-notes-share");

const CHAR_LIMIT = 30;
const fontSizes = {
  Small: "var(--font-body-m)",
  Medium: "var(--font-body-l)",
  Large: "var(--font-title-l)",
};

function updateNoteTitle() {
  editNotesTitle.textContent = openedNote.title;
  editPageTitle.textContent = openedNote.title;
}

function saveNoteChanges() {
  NotesList = NotesList.filter((note) => note.id !== openedNote.id);
  NotesList.add(openedNote);
  localStorage.setItem("openedNote", JSON.stringify(openedNote));
}

function setFontSize() {
  const fontSize = setDefaultItem("fontSize", "Medium");
  editNotesBody.style.font = fontSizes[fontSize] || fontSizes.Medium;
}

editNotesTitle.oninput = () => {
  const newTitle = editNotesTitle.textContent.slice(0, CHAR_LIMIT);
  editNotesTitle.textContent = newTitle;

  openedNote.title = newTitle;
  openedNote.editionDate = new Date();

  updateNoteTitle();
  saveNoteChanges();
};

editNotesBody.value = openedNote.body;
editNotesBody.focus();
editNotesBody.oninput = () => {
  openedNote.body = editNotesBody.value;
  openedNote.editionDate = new Date();
  saveNoteChanges();
};

editNotesShare.onclick = async () => {
  const shareData = { title: openedNote.title, text: openedNote.body };
  if (navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData);
  }
};

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey) {
    switch (e.key) {
      case "s":
        e.preventDefault();
        break;
      case "l":
        e.preventDefault();
        changeDarkMode();
        break;
    }
  }
});

updateNoteTitle();
setFontSize();
