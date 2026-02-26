import { archiveNote, unarchiveNote, deleteNote, getNoteById } from '../utils/notes-manager.js';

class NoteItemCard extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute('data-id') || '';
        const title = this.getAttribute('data-title');
        const body = this.getAttribute('data-body');
        
        const note = getNoteById(id);
        const archiveText = note?.archived ? 'Unarchive' : 'Archive';
        const archiveIcon = note?.archived ? 'archive-restore' : 'archive';

        this.className = 'start-notes-item';
        this.innerHTML = `
            <h2 class="start-notes-title">${title}</h2>
            <p class="start-notes-text">${body}</p>
            <button class="eclipse-more-button">
                <i data-lucide="more-vertical"></i>
            </button>
            <div class="eclipse-dropdown" style="display: none;">
                <button class="dropdown-item" data-action="archive">
                    <i data-lucide="${archiveIcon}"></i>
                    ${archiveText}
                </button>
                <button class="dropdown-item" data-action="delete">
                    <i data-lucide="trash-2"></i>
                    Delete
                </button>
            </div>
        `;

        this.addEventListener('click', (e) => {
            if (!e.target.closest('.eclipse-more-button') && !e.target.closest('.eclipse-dropdown')) {
                window.appSwitchView('note', id);
            }
        });

        this.attachDropdownListeners(id);

        setTimeout(() => lucide.createIcons(), 0);
    }

    attachDropdownListeners(noteId) {
        const moreButton = this.querySelector('.eclipse-more-button');
        const dropdown = this.querySelector('.eclipse-dropdown');

        moreButton.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.eclipse-dropdown').forEach(d => {
                if (d !== dropdown) d.style.display = 'none';
            });
            
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            setTimeout(() => lucide.createIcons(), 0);
        });

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        const archiveBtn = dropdown.querySelector('[data-action="archive"]');
        const deleteBtn = dropdown.querySelector('[data-action="delete"]');

        archiveBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const note = getNoteById(noteId);
            if (!note) return;

            if (note.archived) {
                if (confirm('Unarchive this note?')) {
                    if (unarchiveNote(noteId)) {
                        alert('Note unarchived successfully!');
                    }
                }
            } else {
                if (confirm('Archive this note?')) {
                    if (archiveNote(noteId)) {
                        alert('Note archived successfully!');
                    }
                }
            }
            
            dropdown.style.display = 'none';
        });

        deleteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
                if (deleteNote(noteId)) {
                    alert('Note deleted successfully!');
                }
            }
            
            dropdown.style.display = 'none';
        });
    }
}

customElements.define('note-item-card', NoteItemCard);