const BASE_URL = process.env.BASE_URL;

export async function getAllNotes() {
    try {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch notes');
        }
        
        return result.data || [];
    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
}

export async function getArchivedNotes() {
    try {
        const response = await fetch(`${BASE_URL}/notes/archived`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch archived notes');
        }
        
        return result.data || [];
    } catch (error) {
        console.error('Error fetching archived notes:', error);
        return [];
    }
}

export async function getNoteById(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch note');
        }
        
        return result.data || null;
    } catch (error) {
        console.error('Error fetching note by ID:', error);
        return null;
    }
}

export async function addNote(title, body) {
    try {
        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();
        
        if (!trimmedTitle || !trimmedBody) {
            throw new Error('Title and body are required');
        }
        
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                title: trimmedTitle, 
                body: trimmedBody 
            }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to create note');
        }
        
        window.dispatchEvent(new CustomEvent('notes-updated'));
        
        return result.data;
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
}

export async function deleteNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete note');
        }
        
        window.dispatchEvent(new CustomEvent('notes-updated'));
        
        return result.status === 'success';
    } catch (error) {
        console.error('Error deleting note:', error);
        return false;
    }
}

export async function archiveNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to archive note');
        }
        
        window.dispatchEvent(new CustomEvent('notes-updated'));
        
        return result.status === 'success';
    } catch (error) {
        console.error('Error archiving note:', error);
        return false;
    }
}

export async function unarchiveNote(id) {
    try {
        const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to unarchive note');
        }
        
        window.dispatchEvent(new CustomEvent('notes-updated'));
        
        return result.status === 'success';
    } catch (error) {
        console.error('Error unarchiving note:', error);
        return false;
    }
}
