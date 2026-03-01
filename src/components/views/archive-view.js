import { createIcons, icons } from 'lucide';
import { NProgress } from 'nprogress-v2';
import { getArchivedNotes } from '../../utils/notes-manager.js';
import '../note-item-card.js';
import '../loading.js';

class ArchiveView extends HTMLElement {
    connectedCallback() {
        this.render();

        window.addEventListener('notes-updated', () => {
            this.render();
        });
    }

    async render() {

        this.innerHTML = `
            <div class="archive-header">
                <i data-lucide="archive"></i>
                <h1 class="archive-title">Archived Notes</h1>
            </div>
            <ul class="start-notes-list">
                <loading-progress></loading-progress>
            </ul>
        `;
        
        createIcons({ icons });
        NProgress.start();
        
        try {
            const archivedNotes = await getArchivedNotes();

            let notesListCard;
            if (archivedNotes.length > 0) {
                notesListCard = archivedNotes.map(note => `
                    <note-item-card 
                        data-id="${note.id}" 
                        data-title="${note.title}"
                        data-body="${note.body}">
                    </note-item-card>
                `).join('');
            } else {
                notesListCard = `
                <empty-list type="archive"></empty-list>
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

customElements.define('archive-view', ArchiveView);
