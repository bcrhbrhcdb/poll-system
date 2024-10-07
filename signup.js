import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            alert('Signed up successfully! Please check your email for verification.');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Error signing up: ' + error.message);
        }
    });
});