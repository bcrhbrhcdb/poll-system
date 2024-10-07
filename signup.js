import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            console.log('Attempting signup...');
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/index.html`
                }
            });
            
            if (error) {
                console.error('Supabase signup error:', error);
                throw error;
            }
            
            console.log('Signup successful:', data);
            alert('Signed up successfully! Please check your email for verification.');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Signup error:', error);
            if (error.message.includes("Unexpected token '<'")) {
                alert('There was a network error. Please check your internet connection and try again.');
            } else {
                alert('Error signing up: ' + (error.message || 'Unknown error occurred'));
            }
        }
    });
});