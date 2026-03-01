class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <p>&copy; 2026 Notes App</p>
            <i data-lucide="github"></i>
            <a href="https://github.com/bayufadayan" target="_blank">Check My Github</a>
        `;
    }
}

customElements.define('app-footer', Footer);