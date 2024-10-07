document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = document.getElementById('user-info');
    const pollsContainer = document.getElementById('polls-container');

    const user = supabase.auth.user();

    if (user) {
        userInfo.innerHTML = `
            <p>Welcome, ${user.email}</p>
            <button id="logout-btn">Log Out</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.reload();
        });
    } else {
        userInfo.innerHTML = `
            <a href="login.html">Log In</a> | 
            <a href="signup.html">Sign Up</a>
        `;
    }

    // Fetch and display polls
    const { data: polls, error } = await supabase
        .from('Polls')
        .select('*');

    if (error) {
        console.error('Error fetching polls:', error);
        return;
    }

    polls.forEach(poll => {
        const pollElement = createPollElement(poll);
        pollsContainer.appendChild(pollElement);
    });
});

function createPollElement(poll) {
    const pollDiv = document.createElement('div');
    pollDiv.className = 'poll';
    pollDiv.innerHTML = `
        <h2>${poll.question}</h2>
        <form id="poll-${poll.id}">
            ${poll.options.map((option, index) => `
                <label>
                    <input type="radio" name="option" value="${index}">
                    ${option}
                </label>
            `).join('')}
            <button type="submit">Vote</button>
        </form>
    `;

    pollDiv.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!supabase.auth.user()) {
            alert('Please log in to vote.');
            return;
        }
        const selectedOption = e.target.querySelector('input[name="option"]:checked');
        if (!selectedOption) {
            alert('Please select an option.');
            return;
        }
        await vote(poll.id, parseInt(selectedOption.value));
    });

    return pollDiv;
}

async function vote(pollId, optionIndex) {
    const user = supabase.auth.user();
    const { data: existingVote, error: checkError } = await supabase
        .from('Votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('poll_id', pollId);

    if (checkError) {
        console.error('Error checking existing vote:', checkError);
        return;
    }

    if (existingVote.length > 0) {
        alert('You have already voted on this poll.');
        return;
    }

    const { data, error } = await supabase
        .from('Votes')
        .insert({ user_id: user.id, poll_id: pollId, option_index: optionIndex });

    if (error) {
        alert('Error recording vote: ' + error.message);
    } else {
        alert('Vote recorded successfully!');
        // You could update the poll display here to show the new vote count
    }
}