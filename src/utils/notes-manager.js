import { notesData } from '../data/notes.js';

const STORAGE_KEY = 'notes_app_data';

function initializeNotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse notes from localStorage:', e);
            return [...notesData];
        }
    }
    return [...notesData];
}

function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getAllNotes() {
    return initializeNotes();
}

export function getNoteById(id) {
    const notes = getAllNotes();
    return notes.find(note => note.id === id);
}

export function addNote(title, body) {
    const notes = getAllNotes();
    const newNote = {
        id: `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        body: body.trim(),
        createdAt: new Date().toISOString(),
        archived: false,
    };
    
    notes.unshift(newNote);
    saveNotes(notes);
    window.dispatchEvent(new CustomEvent('notes-updated'));
    
    return newNote;
}

export function deleteNote(id) {
    const notes = getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) {
        return false;
    }
    
    saveNotes(filteredNotes);
    window.dispatchEvent(new CustomEvent('notes-updated'));
    
    return true;
}

export function archiveNote(id) {
    const notes = getAllNotes();
    const note = notes.find(note => note.id === id);
    
    if (!note) {
        return false;
    }
    
    note.archived = true;
    saveNotes(notes);
    window.dispatchEvent(new CustomEvent('notes-updated'));
    
    return true;
}

export function unarchiveNote(id) {
    const notes = getAllNotes();
    const note = notes.find(note => note.id === id);
    
    if (!note) {
        return false;
    }
    
    note.archived = false;
    saveNotes(notes);
    window.dispatchEvent(new CustomEvent('notes-updated'));
    
    return true;
}
