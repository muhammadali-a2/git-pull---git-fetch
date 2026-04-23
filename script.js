document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admissionForm');
    const successMessage = document.getElementById('successMessage');

    // 1. Handle Form Submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            // Collect form data into an object
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Log data to console (simulating an API call)
            console.log('Form Data Collected:', data);

            // Trigger Success UI
            showSuccess();
        }
    });

    // 2. Validation Logic
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            // Check text inputs and selects
            if (!field.value.trim()) {
                markError(field, true);
                isValid = false;
            } else {
                markError(field, false);
            }

            // Specific check for checkboxes (Terms & Privacy)
            if (field.type === 'checkbox' && !field.checked) {
                markError(field, true);
                isValid = false;
            }
        });

        // Specific check for Referral Checkboxes (at least one must be checked)
        const referrals = document.querySelectorAll('input[name="referral"]:checked');
        const referralGroup = document.querySelector('.checkbox-group');
        if (referrals.length === 0) {
            referralGroup.classList.add('error');
            isValid = false;
        } else {
            referralGroup.classList.remove('error');
        }

        if (!isValid) {
            scrollToFirstError();
        }

        return isValid;
    }

    // 3. Helper: Visual Feedback for Errors
    function markError(field, hasError) {
        if (hasError) {
            field.classList.add('error');
            // Optional: add a subtle shake effect
            field.style.animation = "shake 0.4s ease";
            setTimeout(() => field.style.animation = "", 400);
        } else {
            field.classList.remove('error');
        }
    }

    // 4. Helper: Scroll to error for better UX
    function scrollToFirstError() {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 5. Success Transition
    function showSuccess() {
        // Smoothly fade out form
        form.style.opacity = '0';
        form.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Scroll to top to see success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }

    // 6. Real-time Error Removal
    // Removes the red border as soon as the user starts typing/correcting
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            if (field.value.trim() !== "") {
                field.classList.remove('error');
            }
        });
        
        // Handle checkboxes specifically
        if (field.type === 'checkbox') {
            field.addEventListener('change', () => {
                if (field.checked) field.classList.remove('error');
            });
        }
    });
});

// Add a simple shake animation via JS-injected CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
