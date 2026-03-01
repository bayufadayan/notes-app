class Loading extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Fetching notes...</p>
        </div>
        `
    }
}

customElements.define('loading-progress', Loading);