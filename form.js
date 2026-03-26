// Form Validation and Handling
function handleFormSubmit(event) {
    event.preventDefault();

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const destination = document.getElementById('destination').value;

    // Validation flags
    let isValid = true;

    // Validate name
    if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters long.';
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate subject
    if (subject.length < 5) {
        document.getElementById('subjectError').textContent = 'Subject must be at least 5 characters long.';
        isValid = false;
    }

    // Validate message
    if (message.length < 10) {
        document.getElementById('messageError').textContent = 'Message must be at least 10 characters long.';
        isValid = false;
    }

    // If valid, process form
    if (isValid) {
        // Prepare form data
        const formData = {
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
            destination: destination,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage (simulating database)
        let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        submissions.push(formData);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));

        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = '✓ Thank you for your message! We will get back to you soon.';
        successMessage.classList.add('show');

        // Reset form
        document.getElementById('contactForm').reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);

        console.log('Form submitted:', formData);
    }
}

// Add password field validation (for potential future use)
function validatePassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}