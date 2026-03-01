class NoteItem extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("data-id") || "";
    const title = this.getAttribute("data-title");

    this.className = "notes-item";
    this.textContent = title;

    this.addEventListener("click", () => {
      const allNotes = document.querySelectorAll(".notes-item");
      allNotes.forEach((note) => note.classList.remove("active"));

      const allNavBtns = document.querySelectorAll(".btn-list-notes");
      allNavBtns.forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");
      window.appSwitchView("note", id);
    });
  }
}

customElements.define("note-item", NoteItem);
