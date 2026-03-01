import { getAllNotes } from '../utils/notes-manager.js';
import './note-item.js';

class Sidebar extends HTMLElement {
    connectedCallback() {
        this.render();
        window.addEventListener('notes-updated', () => {
            this.render();
        });
    }

    attachEventListeners() {
        const homeBtn = this.querySelector('[data-nav="home"]');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => window.appSwitchView('home'));
        }

        const addBtn = this.querySelector('.btn-add-notes');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.appSwitchView('form');
            });
        }

        const archiveBtn = this.querySelector('[data-nav="archive"]');
        if (archiveBtn) {
            archiveBtn.addEventListener('click', () => window.appSwitchView('archive'));
        }
    }

    render() {
        const notesData = getAllNotes();
        const notesList = notesData
            .filter(note => !note.archived)
            .map(note => `
                <note-item 
                    data-id="${note.id}" 
                    data-title="${note.title}">
                </note-item>
            `).join('');

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
                ${notesList}
            </ul>
        `;
        
        this.attachEventListeners();
        lucide.createIcons();
    }
}

customElements.define('app-sidebar', Sidebar);