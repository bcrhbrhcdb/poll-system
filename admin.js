document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'apet2804@mpsedu.org') {
        alert('Unauthorized access');
        window.location.href = 'signup.html';
        return;
    }

    document.getElementById('poll-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = document.getElementById('question').value;
        const options = document.getElementById('options').value.split(',').map(option => option.trim());

        const { data, error } = await supabase
            .from('Polls')
            .insert({ question, options });

        if (error) {
            alert('Error creating poll: ' + error.message);
        } else {
            alert('Poll created successfully!');
            document.getElementById('poll-form').reset();
        }
    });
});