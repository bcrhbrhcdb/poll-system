import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = document.getElementById('user-info');
    const pollsContainer = document.getElementById('polls-container');

    try {
        const { data: { user } } = await supabase.auth.getUser();

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

        await fetchAndDisplayPolls();
        startPollingForUpdates();
    } catch (error) {
        console.error('Error initializing app:', error);
        userInfo.innerHTML = '<p>Error loading user information. Please try again later.</p>';
    }
});

async function fetchAndDisplayPolls() {
    const pollsContainer = document.getElementById('polls-container');
    pollsContainer.innerHTML = '<p>Loading polls...</p>';

    try {
        const { data: polls, error } = await supabase
            .from('Polls')
            .select('*');

        if (error) throw error;

        pollsContainer.innerHTML = '';

        if (polls.length === 0) {
            pollsContainer.innerHTML = '<p>No polls available at the moment.</p>';
            return;
        }

        for (const poll of polls) {
            const pollElement = createPollElement(poll);
            pollsContainer.appendChild(pollElement);
            await updatePollDisplay(poll.id);
        }
    } catch (error) {
        console.error('Error fetching polls:', error);
        pollsContainer.innerHTML = '<p>Error loading polls. Please try again later.</p>';
    }
}

function createPollElement(poll) {
    const pollDiv = document.createElement('div');
    pollDiv.className = 'poll';
    pollDiv.id = `poll-container-${poll.id}`;
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
        <div id="results-${poll.id}" class="poll-results"></div>
    `;

    pollDiv.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
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
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        const { data: existingVote, error: checkError } = await supabase
            .from('Votes')
            .select('*')
            .eq('user_id', user.id)
            .eq('poll_id', pollId);

        if (checkError) throw checkError;

        if (existingVote.length > 0) {
            alert('You have already voted on this poll.');
            return;
        }

        const { error } = await supabase
            .from('Votes')
            .insert({ user_id: user.id, poll_id: pollId, option_index: optionIndex });

        if (error) throw error;

        alert('Vote recorded successfully!');
        await updatePollDisplay(pollId);
    } catch (error) {
        console.error('Error voting:', error);
        alert('Error recording vote: ' + error.message);
    }
}

async function updatePollDisplay(pollId) {
    try {
        const [{ data: poll }, { data: votes }] = await Promise.all([
            supabase.from('Polls').select('*').eq('id', pollId).single(),
            supabase.from('Votes').select('option_index').eq('poll_id', pollId)
        ]);

        if (!poll || !votes) throw new Error('Failed to fetch poll data');

        const pollContainer = document.getElementById(`poll-container-${pollId}`);
        const resultsContainer = document.getElementById(`results-${pollId}`);

        const totalVotes = votes.length;
        const voteCounts = poll.options.map((_, index) => 
            votes.filter(vote => vote.option_index === index).length
        );
        const votePercentages = voteCounts.map(count => 
            totalVotes > 0 ? (count / totalVotes * 100).toFixed(1) : 0
        );

        resultsContainer.innerHTML = `
            <h3>Results:</h3>
            ${poll.options.map((option, index) => `
                <div>
                    ${option}: ${voteCounts[index]} votes (${votePercentages[index]}%)
                    <div class="progress-bar" style="width: ${votePercentages[index]}%;"></div>
                </div>
            `).join('')}
            <p>Total votes: ${totalVotes}</p>
        `;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userVote } = await supabase
                .from('Votes')
                .select('*')
                .eq('user_id', user.id)
                .eq('poll_id', pollId);

            if (userVote && userVote.length > 0) {
                const form = pollContainer.querySelector('form');
                form.innerHTML = '<p>Thank you for voting!</p>';
            }
        }
    } catch (error) {
        console.error('Error updating poll display:', error);
    }
}

function startPollingForUpdates() {
    setInterval(fetchAndDisplayPolls, 30000); // Refresh every 30 seconds
}