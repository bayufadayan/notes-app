class NoteItem extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute('data-id') || '';
        const title = this.getAttribute('data-title');

        this.className = 'notes-item';
        this.textContent = title;

        this.addEventListener('click', () => {
            window.appSwitchView('note', id);
        });
    }
}

customElements.define('note-item', NoteItem);