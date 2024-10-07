document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert('Error signing up: ' + error.message);
        } else {
            alert('Signup successful! Please check your email for verification.');
            window.location.href = 'index.html';
        }
    });
});