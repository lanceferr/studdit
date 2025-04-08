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
      alert('Something went wrong.');
    }
  }
  
document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-button');
    const token = localStorage.getItem("token");
  
    likeButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const postId = button.getAttribute('data-post-id');
  
        try {
          const response = await fetch(`/posts/${postId}/like`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies with the request
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

//search bar functionality
document.getElementById('form-search').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const search = '/search/';
  const searchTerm = search.concat(document.getElementById('search').value);
  window.location.href = searchTerm;
});

 // deleting post function
document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', async function() {
        const postId = this.getAttribute('data-post-id');

        if (confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`/posts/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Post deleted!');
                    window.location.reload();
                } else {
                    alert(result.message || 'Failed to delete post');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('An error occurred.');
            }
        }
    });
});

function sortPosts(sortBy) {
  const postsContainer = document.querySelector('.posts');
  const posts = Array.from(postsContainer.querySelectorAll('.post'));  // Get all post elements

  let sortedPosts = posts.slice();  // Copy the posts array to avoid mutating the original

  if (sortBy === 'date') {
      // Sort posts by date (assuming posts have a 'date' attribute in the HTML)
      sortedPosts.sort((a, b) => new Date(b.querySelector('.post-subinfo p').textContent) - new Date(a.querySelector('.post-subinfo p').textContent));
  } else if (sortBy === 'rating') {
      // Sort posts by rating (assuming posts have a 'likes' button with text content)
      sortedPosts.sort((a, b) => parseInt(b.querySelector('.like-button').textContent.split(' ')[1]) - parseInt(a.querySelector('.like-button').textContent.split(' ')[1]));
  } else if (sortBy === 'comments') {
      // Sort posts by the number of comments (assuming posts have a button displaying comment count)
      sortedPosts.sort((a, b) => parseInt(b.querySelector('.post-interactions button').textContent.split(' ')[1]) - parseInt(a.querySelector('.post-interactions button').textContent.split(' ')[1]));
  }

  // Remove the current posts and append sorted posts
  postsContainer.innerHTML = '';
  sortedPosts.forEach(post => {
      postsContainer.appendChild(post);  // Append each sorted post
  });
}

// Sort posts by selected criteria
document.getElementById('sort').addEventListener('change', function(event) {
  const sortBy = event.target.value;
  sortPosts(sortBy);
});




  
