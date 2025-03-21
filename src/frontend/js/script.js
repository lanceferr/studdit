// Upvote and Comment Button Handling
document.querySelectorAll('.post-interactions button').forEach(button => {
    button.addEventListener('click', function() {
        const postNumber = this.getAttribute('data-post-number');
        const buttonText = this.innerText;

        if (buttonText.includes('👍')) {
            let votes = parseInt(buttonText.split(' ')[1]);
            this.innerText = `👍 ${votes + 1}`;
            console.log(`Post ${postNumber} upvoted`);
        } else if (buttonText.includes('💬')) {
            window.location.href = `thread${postNumber}.html`;
        }
    });
});

// Handle "Create Thread" Button Link
document.addEventListener("DOMContentLoaded", function() {
    const createThreadLink = document.getElementById("create-thread-link");
    const username = localStorage.getItem('username');
    const isLoggedIn = localStorage.getItem("token"); 
    if (createThreadLink) {
        // If user is logged in, set the dynamic link
        if (isLoggedIn && username) {
            createThreadLink.href = `/${username}/create-thread`;  
        } else {
            createThreadLink.href = '/login'; // Redirect to login if not logged in
            createThreadLink.style.display = "none"; // Optionally hide the button too
        }
    }
});
