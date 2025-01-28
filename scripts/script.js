// Initialize EmailJS
emailjs.init('DXjuxo2U7ysdz2fA5'); // Replace with your public key

const btn = document.getElementById('button');

document.getElementById('form')
    .addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        btn.value = 'Sending...'; // Change button text while sending

        const serviceID = 'default_service'; // Your service ID
        const templateID = 'template_lpsv7it'; // Your template ID

        // Send the form data to EmailJS
        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Send Email'; // Restore button text
                document.getElementById('statusMessage').textContent = 'Email sent successfully!';
                document.getElementById('statusMessage').style.color = 'green';
                event.target.reset(); // Clear the form
            }, (err) => {
                btn.value = 'Send Email'; // Restore button text
                document.getElementById('statusMessage').textContent = 'Failed to send email. Please try again.';
                document.getElementById('statusMessage').style.color = 'red';
                console.error('EmailJS Error:', err);
            });
    });
