document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const emailInput = document.getElementById('email-input');
    const bioInput = document.getElementById('bio-input');

    if (usernameInput.value && passwordInput.value && emailInput.value && bioInput.value) {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const newUser = {
            username: usernameInput.value,
            password: passwordInput.value,
            email: emailInput.value,
            bio: bioInput.value,
            profilePicture: 'default.png', 
            courses: [] 
        };

        storedUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(storedUsers));
        alert('Registration successful!');
        window.location.href = '/login.html';
    } else {
        alert('Username, password, email, and bio are required.');
    }
});

function displayProfilePic() {
    const input = document.getElementById('photo');
    const img = document.getElementById('profilePic');

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        img.src = e.target.result;
        img.style.display = 'block';
      };

      reader.readAsDataURL(input.files[0]);
    }
}

function submitForm() {
    const formData = new FormData(document.getElementById('profileForm'));

    for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
}