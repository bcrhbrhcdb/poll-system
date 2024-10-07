import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            console.log('Login successful:', data);
            alert('Logged in successfully!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Login error:', error);
            alert('Error logging in: ' + (error.message || 'Unknown error occurred'));
        }
    });
});