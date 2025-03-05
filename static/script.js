document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const videoInput = document.getElementById('video');
    const videoPreview = document.getElementById('videoPreview');
    const selfieInput = document.getElementById('selfie');
    const selfiePreview = document.getElementById('selfiePreview');

    // Video Preview Functionality
    videoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            videoPreview.src = fileURL;
            videoPreview.style.display = 'block';
            
            // Add animation for video preview
            videoPreview.classList.add('animate__animated', 'animate__fadeIn');
        }
    });

    // Selfie Preview Functionality
    selfieInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                selfiePreview.src = e.target.result;
                selfiePreview.style.display = 'block';
                
                // Add animation for selfie preview
                selfiePreview.classList.add('animate__animated', 'animate__zoomIn');
            };
            reader.readAsDataURL(file);
        }
    });

    // Form Validation with Visual Feedback
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Remove previous validation states
        form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });

        let isValid = true;

        // Validate Roll Number (Only alphanumeric)
        const rollNumber = document.getElementById('roll_number');
        const rollNumberRegex = /^[a-zA-Z0-9]+$/;
        if (!rollNumberRegex.test(rollNumber.value.trim())) {
            rollNumber.classList.add('is-invalid');
            isValid = false;
        } else {
            rollNumber.classList.add('is-valid');
        }

        // Validate Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.add('is-valid');
        }

        // Validate Phone Number (10 digits)
        const phoneNumber = document.getElementById('phone_number');
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber.value.trim())) {
            phoneNumber.classList.add('is-invalid');
            isValid = false;
        } else {
            phoneNumber.classList.add('is-valid');
        }

        // Check if all required fields are filled
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (!field.classList.contains('is-invalid')) {
                field.classList.add('is-valid');
            }
        });

        // If form is valid, simulate submission
        if (isValid) {
            // Add submission animation
            const submitButton = event.target.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
            submitButton.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // Reset form and show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Your details have been submitted successfully.',
                    confirmButtonText: 'Great!',
                    showClass: {
                        popup: 'animate__animated animate__bounceIn'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__bounceOut'
                    }
                });

                // Reset form
                form.reset();
                videoPreview.style.display = 'none';
                selfiePreview.style.display = 'none';
                submitButton.innerHTML = 'Submit';
                submitButton.disabled = false;

                // Remove validation classes
                form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
                    el.classList.remove('is-invalid', 'is-valid');
                });
            }, 2000);
        } else {
            // Shake form to indicate validation error
            form.classList.add('animate__animated', 'animate__shakeX');
            setTimeout(() => {
                form.classList.remove('animate__animated', 'animate__shakeX');
            }, 1000);
        }
    });

    // Real-time validation for inputs
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid', 'is-valid');
        });
    });
});