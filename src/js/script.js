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