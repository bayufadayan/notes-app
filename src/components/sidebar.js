import { createIcons, icons } from "lucide";
import { NProgress } from "nprogress-v2";
import { getUnarchivedNotes } from "../utils/notes-manager.js";
import "./note-item.js";

class Sidebar extends HTMLElement {
  connectedCallback() {
    this.render();
    window.addEventListener("notes-updated", () => {
      this.render();
    });
  }

  attachEventListeners() {
    const homeBtn = this.querySelector('[data-nav="home"]');
    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        const allNotes = document.querySelectorAll(".notes-item");
        allNotes.forEach((note) => note.classList.remove("active"));

        const allNavBtns = document.querySelectorAll(".btn-list-notes");
        allNavBtns.forEach((btn) => btn.classList.remove("active"));
        homeBtn.classList.add("active");

        window.appSwitchView("home");
      });
    }

    const addBtn = this.querySelector(".btn-add-notes");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.appSwitchView("form");
      });
    }

    const archiveBtn = this.querySelector('[data-nav="archive"]');
    if (archiveBtn) {
      archiveBtn.addEventListener("click", () => {
        const allNotes = document.querySelectorAll(".notes-item");
        allNotes.forEach((note) => note.classList.remove("active"));

        const allNavBtns = document.querySelectorAll(".btn-list-notes");
        allNavBtns.forEach((btn) => btn.classList.remove("active"));
        archiveBtn.classList.add("active");

        window.appSwitchView("archive");
      });
    }
  }

  async render() {
    this.innerHTML = `
            <button class="btn-add-notes">
                <i data-lucide="plus"></i>
                Add Note
            </button>
            <button class="btn-list-notes" data-nav="home">
                <i data-lucide="home"></i>
                Home
            </button>
            <button class="btn-list-notes" data-nav="archive">
                <i data-lucide="archive"></i>
                Archive
            </button>
            <h3 class="sidebar-title">Notes List</h3>
            <ul class="notes-list custom-scrollbar">
                <loading-progress></loading-progress>
            </ul>
        `;

    createIcons({ icons });
    this.attachEventListeners();

    NProgress.start();

    try {
      const notesData = await getUnarchivedNotes();
      const notesList = notesData
        .map(
          (note) => `
                    <note-item 
                        data-id="${note.id}" 
                        data-title="${note.title}">
                    </note-item>
                `,
        )
        .join("");

      const listContainer = this.querySelector(".notes-list");
      if (listContainer) {
        listContainer.innerHTML =
          notesData.length > 0
            ? notesList
            : '<empty-list type="notes"></empty-list>';
      }
    } finally {
      NProgress.done();
    }
  }
}

customElements.define("app-sidebar", Sidebar);
