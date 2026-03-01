import { createIcons, icons } from 'lucide';

class EmptyList extends HTMLElement {
    connectedCallback() {
        const type = this.getAttribute('type') || 'notes';
        const isIconAppear = this.getAttribute('isIconAppear') !== 'false';
        
        const messages = {
            notes: {
                icon: 'notebook-pen',
                text: 'No notes available. Start adding some notes!'
            },
            archive: {
                icon: 'archive-x',
                text: 'No archived notes yet. Archive a note to see it here!'
            }
        };
        
        const config = messages[type] || messages.notes;
        
        this.innerHTML = `
            <div class="empty-list-container">
                ${isIconAppear ? `<i data-lucide="${config.icon}"></i>` : ''}
                <p class="empty-list-message">${config.text}</p>
            </div>
        `;
        
        createIcons({ icons });
    }
}

customElements.define('empty-list', EmptyList);