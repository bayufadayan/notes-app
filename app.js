window.appSwitchView = function(viewName, noteId = null) {
    const body = document.body;
    const startView = document.querySelector('start-view');
    const sidebar = document.querySelector('app-sidebar');
    const notesView = document.querySelector('notes-view');
    const formView = document.querySelector('form-view');
    const archiveView = document.querySelector('archive-view');

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
        window.closeSidebar();
    }

    if (viewName === 'home') {
        body.classList.add('home-layout');
        body.classList.remove('note-layout');
        
        startView.classList.add('active');
        sidebar.classList.remove('active');
        notesView.classList.remove('active');
        formView.classList.remove('active');
        archiveView.classList.remove('active');
        
        localStorage.setItem('currentView', 'home');
        localStorage.removeItem('currentNoteId');
    } else if (viewName === 'note') {
        body.classList.add('note-layout');
        body.classList.remove('home-layout');
        
        startView.classList.remove('active');
        sidebar.classList.add('active');
        notesView.classList.add('active');
        formView.classList.remove('active');
        archiveView.classList.remove('active');
        
        if (noteId) {
            notesView.setAttribute('note-id', noteId);
            localStorage.setItem('currentNoteId', noteId);
        }
        
        localStorage.setItem('currentView', 'note');
    } else if (viewName === 'form') {
        body.classList.add('note-layout');
        body.classList.remove('home-layout');
        
        startView.classList.remove('active');
        sidebar.classList.add('active');
        notesView.classList.remove('active');
        formView.classList.add('active');
        archiveView.classList.remove('active');
        
        localStorage.setItem('currentView', 'form');
        localStorage.removeItem('currentNoteId');
    } else if (viewName === 'archive') {
        body.classList.add('note-layout');
        body.classList.remove('home-layout');
        
        startView.classList.remove('active');
        sidebar.classList.add('active');
        notesView.classList.remove('active');
        formView.classList.remove('active');
        archiveView.classList.add('active');
        
        localStorage.setItem('currentView', 'archive');
        localStorage.removeItem('currentNoteId');
    }

    lucide.createIcons();
};

window.toggleSidebar = function() {
    const sidebar = document.querySelector('app-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    const body = document.body;
    
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('show');
    
    // Prevent body scroll when sidebar is open on mobile
    if (sidebar.classList.contains('open')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
};

window.closeSidebar = function() {
    const sidebar = document.querySelector('app-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    const body = document.body;
    
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    body.style.overflow = '';
};

window.appRestoreView = function() {
    const savedView = localStorage.getItem('currentView') || 'home';
    const savedNoteId = localStorage.getItem('currentNoteId');
    
    if (savedView === 'note' && savedNoteId) {
        window.appSwitchView('note', savedNoteId);
    } else {
        window.appSwitchView(savedView);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.appRestoreView();
    
    const backButtons = document.querySelectorAll('[data-nav="home"]');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => window.appSwitchView('home'));
    });
});
