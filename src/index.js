import { createIcons, icons } from 'lucide';
import { NProgress } from 'nprogress-v2';
import 'nprogress-v2/dist/index.css';

import './app-core.js';

import './style/style.css';

import './components/header.js';
import './components/sidebar.js';
import './components/footer.js';
import './components/views/start-view.js';
import './components/views/notes-view.js';
import './components/views/form-view.js';
import './components/views/archive-view.js';
import './components/empty-list.js';
import './components/loading.js';

NProgress.configure({ 
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08
});

createIcons({ icons });