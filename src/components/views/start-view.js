import { createIcons, icons } from 'lucide';
import { NProgress } from 'nprogress-v2';
import { getUnarchivedNotes } from '../../utils/notes-manager.js';
import '../loading.js';
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
            archiveBtn.addEventListener('click', () => {
                const allNotes = document.querySelectorAll('.notes-item');
                allNotes.forEach(note => note.classList.remove('active'));
                
                const allNavBtns = document.querySelectorAll('.btn-list-notes');
                allNavBtns.forEach(btn => btn.classList.remove('active'));
                
                const sidebarArchiveBtn = document.querySelector('[data-nav="archive"]');
                if (sidebarArchiveBtn) {
                    sidebarArchiveBtn.classList.add('active');
                }
                
                window.appSwitchView('archive');
            });
        }
    }

    async render() {
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
                <loading-progress></loading-progress>
            </ul>
        `;

        this.attachEventListeners();
        createIcons({ icons });
        NProgress.start();

        try {
            const notesData = await getUnarchivedNotes();

            let notesListCard;
            if (notesData.length > 0) {
                notesListCard = notesData.map(note => `
                    <note-item-card 
                        data-id="${note.id}" 
                        data-title="${note.title}"
                        data-body="${note.body}">
                    </note-item-card>
                `).join('');
            } else {
                notesListCard = `
                <empty-list type="notes" isIconAppear="false"></empty-list>
                `;
            }

            const listContainer = this.querySelector('.start-notes-list');
            if (listContainer) {
                listContainer.innerHTML = notesListCard;
            }
        } finally {
            NProgress.done();
        }
    }
}

customElements.define('start-view', StartView);