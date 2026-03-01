import { createIcons, icons } from 'lucide';
import iziToast from 'izitoast';
import { getNoteById, archiveNote, unarchiveNote, deleteNote } from '../../utils/notes-manager.js';

class NotesView extends HTMLElement {
    connectedCallback() {
        const noteId = this.getAttribute('note-id');
        if (noteId) {
            this.render(noteId);
        }
        this.attachEventListeners();
    }

    static get observedAttributes() {
        return ['note-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'note-id' && newValue && oldValue !== newValue) {
            this.render(newValue);
        }
    }

    async render(noteId) {
        // Show loading state
        this.innerHTML = '<p class="loading-text">Loading note...</p>';
        
        const note = await getNoteById(noteId);
        
        if (!note) {
            this.innerHTML = '<p>Note not found</p>';
            return;
        }

        const date = new Date(note.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const formattedTime = date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const archiveButton = note.archived 
            ? `<button class="btn-action btn-unarchive" data-action="unarchive">
                <i data-lucide="archive-restore"></i>
                Unarchive
               </button>`
            : `<button class="btn-action btn-archive" data-action="archive">
                <i data-lucide="archive"></i>
                Archive
               </button>`;

        this.innerHTML = `
            <small class="content-date">
                <p><i data-lucide="calendar"></i> ${formattedDate}</p>
                <p><i data-lucide="clock"></i> ${formattedTime}</p>
            </small>
            <h2 class="content-title">${note.title}</h2>
            <div class="action-container">
                ${archiveButton}
                <button class="btn-action btn-delete" data-action="delete">
                    <i data-lucide="trash-2"></i>
                    Delete
                </button>
            </div>
            <p class="content-text">${note.body}</p>
        `;

        setTimeout(() => createIcons({ icons }), 0);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const archiveButtons = this.querySelectorAll('[data-action="archive"], [data-action="unarchive"]');
        const deleteButtons = this.querySelectorAll('[data-action="delete"]');

        archiveButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const noteId = this.getAttribute('note-id');
                const action = btn.getAttribute('data-action');

                if (action === 'archive') {
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
                                    window.appSwitchView('home');
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
                } else if (action === 'unarchive') {
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
                                    window.appSwitchView('home');
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
                }
            });
        });

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const noteId = this.getAttribute('note-id');
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
                                window.appSwitchView('home');
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
            });
        });
    }
}

customElements.define('notes-view', NotesView);
