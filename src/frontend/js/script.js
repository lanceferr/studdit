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

async function addComment(postId) {
    const textarea = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
    const content = textarea.value.trim();
    const author = localStorage.getItem('userId'); // optional — fallback will be handled on backend
  
    if (!content) {
      alert("Please enter a comment");
      return;
    }
  
    try {
      const response = await fetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, author, post: postId })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Comment added!');
        location.reload(); // or dynamically add to DOM
      } else {
        alert(result.message || 'Failed to post comment.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('An error occurred.');
    }
  }
  
document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-button');
  
    likeButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const postId = button.getAttribute('data-post-id');
  
        try {
          const response = await fetch(`/posts/${postId}/like`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          const data = await response.json();
  
          if (response.ok) {
            // ✅ Update the button to show new like count
            button.textContent = `👍 ${data.likes}`;
          } else {
            alert(data.message || 'Failed to like post.');
          }
        } catch (error) {
          console.error('Error liking post:', error);
          alert('Something went wrong.');
        }
      });
    });
});
  
  