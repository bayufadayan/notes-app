import { createIcons, icons } from 'lucide';

class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <button class="hamburger-menu" onclick="window.toggleSidebar()">
                <i data-lucide="menu"></i>
            </button>
            <i data-lucide="notebook-pen"></i>
            <h1 class="header-title">My Notes</h1>
        `;

        createIcons({ icons });
    }
    
}

customElements.define('app-header', Header);