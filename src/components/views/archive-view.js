import { createIcons, icons } from 'lucide';
import { getArchivedNotes } from '../../utils/notes-manager.js';
import '../note-item-card.js';

class ArchiveView extends HTMLElement {
    connectedCallback() {
        this.render();
        
        window.addEventListener('notes-updated', () => {
            this.render();
        });
    }

    async render() {
        this.innerHTML = '<p class="loading-text">Loading archived notes...</p>';
        
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
            notesListCard = '<p class="empty-message">No archived notes yet.</p>';
        }

        this.innerHTML = `
            <div class="archive-header">
                <i data-lucide="archive"></i>
                <h1 class="archive-title">Archived Notes</h1>
            </div>
            <ul class="start-notes-list">
                ${notesListCard}
            </ul>
        `;
        
        setTimeout(() => createIcons({ icons }), 0);
    }
}

customElements.define('archive-view', ArchiveView);
