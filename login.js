document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { user, error } = await supabase.auth.signIn({ email, password });

    if (error) {
        alert('Error logging in: ' + error.message);
    } else {
        alert('Login successful!');
        window.location.href = 'index.html';
    }
});