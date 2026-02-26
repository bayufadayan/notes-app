import { getAllNotes } from '../../utils/notes-manager.js';
import '../note-item-card.js';

class StartView extends HTMLElement {
    connectedCallback() {
        this.render();
        window.addEventListener('notes-updated', () => {
            this.render();
        });
    }

    attachEventListeners() {
        const addBtn = this.querySelector('.btn-start-add-notes');
        if (addBtn) {
            addBtn.addEventListener('click', () => window.appSwitchView('form'));
        }

        const archiveBtn = this.querySelector('.btn-start-look-archive');
        if (archiveBtn) {
            archiveBtn.addEventListener('click', () => window.appSwitchView('archive'));
        }
    }

    render() {
        const notesData = getAllNotes();
        const notesListCard = notesData
            .filter(note => !note.archived)
            .map(note => `
                <note-item-card 
                    data-id="${note.id}" 
                    data-title="${note.title}"
                    data-body="${note.body}">
                </note-item-card>
            `).join('');

        this.innerHTML = `
            <figure class="start-icon">
                <i data-lucide="notebook-pen"></i>
            </figure>
            <h1 class="greeting">What do you want to note down today?</h1>
            <button class="btn-start-add-notes">
                <i data-lucide="plus"></i>
                Add Note
            </button>
            <button class="btn-start-look-archive">
                <i data-lucide="archive"></i>
                Archive
            </button>
            <ul class="start-notes-list">
                ${notesListCard}
            </ul>
        `;
        
        this.attachEventListeners();
        setTimeout(() => lucide.createIcons(), 0);
    }
}

customElements.define('start-view', StartView);