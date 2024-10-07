import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert('You must be logged in to access the admin panel.');
        window.location.href = 'index.html';
        return;
    }

    const createPollForm = document.getElementById('create-poll-form');
    createPollForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = document.getElementById('question').value;
        const options = document.getElementById('options').value.split(',').map(option => option.trim());

        try {
            const { data, error } = await supabase
                .from('Polls')
                .insert({ question, options, created_by: user.id });
            if (error) throw error;
            alert('Poll created successfully!');
            createPollForm.reset();
        } catch (error) {
            alert('Error creating poll: ' + error.message);
        }
    });
});