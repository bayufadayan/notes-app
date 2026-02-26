import { addNote } from '../../utils/notes-manager.js';

class FormView extends HTMLElement {
    connectedCallback() {
        this.render();
        this.attachEventListeners();
        setTimeout(() => lucide.createIcons(), 0);
    }

    render() {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const formattedTime = now.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        this.innerHTML = `
            <small class="content-date">
                <p><i data-lucide="calendar"></i> ${formattedDate}</p>
                <p><i data-lucide="clock"></i> ${formattedTime}</p>
            </small>
            <form class="notes-form">
                <input
                    type="text"
                    id="note-title"
                    name="title"
                    placeholder="Your Note Title"
                    required
                />
                <small class="content-word-count">0/50</small>
                <textarea
                    name="content"
                    id="note-content"
                    cols="30"
                    rows="10"
                    placeholder="Write your note here..."
                    required
                ></textarea>
                <button type="submit" class="btn-save-notes">
                    <i data-lucide="save"></i>
                    Save Note
                </button>
            </form>
        `;
    }

    attachEventListeners() {
        const form = this.querySelector('.notes-form');
        const titleInput = this.querySelector('#note-title');
        const contentInput = this.querySelector('#note-content');
        const wordCount = this.querySelector('.content-word-count');

        titleInput.addEventListener('input', () => {
            const length = titleInput.value.length;
            wordCount.textContent = `${length}/50`;
            
            if (length > 50) {
                wordCount.style.color = '#ff4d4d';
            } else {
                wordCount.style.color = '#a8a1a1';
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(titleInput.value, contentInput.value);
        });
    }

    handleSubmit(title, content) {
        if (title.length > 50) {
            alert('Title max 50 characters!');
            return;
        }

        if (!title.trim() || !content.trim()) {
            alert('Title and content cannot be empty!');
            return;
        }

        const newNote = addNote(title, content);
        
        if (newNote) {
            alert('Note successfully saved!');
            
            this.querySelector('#note-title').value = '';
            this.querySelector('#note-content').value = '';
            this.querySelector('.content-word-count').textContent = '0/50';
            
            window.appSwitchView('home');
        } else {
            alert('Failed to save note. Please try again.');
        }
    }
}

customElements.define('form-view', FormView);
