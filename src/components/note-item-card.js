import { createIcons, icons } from 'lucide';
import iziToast from 'izitoast';
import { archiveNote, unarchiveNote, deleteNote, getNoteById } from '../utils/notes-manager.js';

class NoteItemCard extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    async render() {
        const id = this.getAttribute('data-id') || '';
        const title = this.getAttribute('data-title');
        const body = this.getAttribute('data-body');
        
        const note = await getNoteById(id);
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

        setTimeout(() => createIcons({ icons }), 0);
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
            setTimeout(() => createIcons({ icons }), 0);
        });

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        const archiveBtn = dropdown.querySelector('[data-action="archive"]');
        const deleteBtn = dropdown.querySelector('[data-action="delete"]');

        archiveBtn?.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            const note = await getNoteById(noteId);
            if (!note) return;

            if (note.archived) {
                iziToast.question({
                    timeout: false,
                    close: false,
                    overlay: true,
                    displayMode: 'once',
                    id: 'question',
                    zindex: 999,
                    title: 'Unarchive Note',
                    message: 'Unarchive this note?',
                    position: 'center',
                    buttons: [
                        ['<button><b>Yes</b></button>', async (instance, toast) => {
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            const success = await unarchiveNote(noteId);
                            if (success) {
                                iziToast.success({
                                    title: 'Success',
                                    message: 'Note unarchived successfully!',
                                    position: 'topRight'
                                });
                            } else {
                                iziToast.error({
                                    title: 'Error',
                                    message: 'Failed to unarchive note.',
                                    position: 'topRight'
                                });
                            }
                        }, true],
                        ['<button>No</button>', (instance, toast) => {
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                        }]
                    ]
                });
            } else {
                iziToast.question({
                    timeout: false,
                    close: false,
                    overlay: true,
                    displayMode: 'once',
                    id: 'question',
                    zindex: 999,
                    title: 'Archive Note',
                    message: 'Archive this note?',
                    position: 'center',
                    buttons: [
                        ['<button><b>Yes</b></button>', async (instance, toast) => {
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            const success = await archiveNote(noteId);
                            if (success) {
                                iziToast.success({
                                    title: 'Success',
                                    message: 'Note archived successfully!',
                                    position: 'topRight'
                                });
                            } else {
                                iziToast.error({
                                    title: 'Error',
                                    message: 'Failed to archive note.',
                                    position: 'topRight'
                                });
                            }
                        }, true],
                        ['<button>No</button>', (instance, toast) => {
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                        }]
                    ]
                });
            }
            
            dropdown.style.display = 'none';
        });

        deleteBtn?.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            iziToast.question({
                timeout: false,
                close: false,
                overlay: true,
                displayMode: 'once',
                id: 'question',
                zindex: 999,
                title: 'Delete Note',
                message: 'Are you sure? This action cannot be undone.',
                position: 'center',
                buttons: [
                    ['<button><b>Delete</b></button>', async (instance, toast) => {
                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                        const success = await deleteNote(noteId);
                        if (success) {
                            iziToast.success({
                                title: 'Success',
                                message: 'Note deleted successfully!',
                                position: 'topRight'
                            });
                        } else {
                            iziToast.error({
                                title: 'Error',
                                message: 'Failed to delete note.',
                                position: 'topRight'
                            });
                        }
                    }, true],
                    ['<button>Cancel</button>', (instance, toast) => {
                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    }]
                ]
            });
            
            dropdown.style.display = 'none';
        });
    }
}

customElements.define('note-item-card', NoteItemCard);