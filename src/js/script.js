document.querySelectorAll('.post-interactions button').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.innerText;
        if (buttonText.includes('👍')) {
            let votes = parseInt(buttonText.split(' ')[1]);
            this.innerText = `👍 ${votes + 1}`;
        } else if (buttonText.includes('💬')) {
            alert("This will show comments (not implemented in this version).");
        }
    });
});
