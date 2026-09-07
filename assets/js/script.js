const header = document.querySelector('header');
const menuButton = document.querySelector('.nav-toggle');
const navigationLinks = document.querySelectorAll('#site-menu a');
const bookingForm = document.querySelector('#booking-form');
const travelDate = document.querySelector('#travel-date');
const formStatus = document.querySelector('#form-status');
const menuLinks = navigationLinks;

const updateActiveLink = () => {
    const currentHash = window.location.hash || '#top';

    navigationLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === currentHash);
    });
};

updateActiveLink();
window.addEventListener('hashchange', updateActiveLink);

if (menuButton) {
    menuButton.addEventListener('click', () => {
        const isOpen = header.classList.toggle('nav-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-open');
            menuButton.setAttribute('aria-expanded', 'false');
        });
    });

    const homeLink = document.querySelector('#site-menu a[href="#top"]');
    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.history.replaceState(null, '', '#top');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateActiveLink();
    });
}

if (travelDate) {
    travelDate.min = new Date().toISOString().split('T')[0];
}

if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
        }

        const formData = new FormData(bookingForm);
        const subject = `Travel booking request: ${formData.get('destination')}`;
        const body = [
            `Destination: ${formData.get('destination')}`,
            `Travel date: ${formData.get('travel-date')}`,
            `Travelers: ${formData.get('travelers')}`,
            `Reply email: ${formData.get('email')}`
        ].join('\n');

        formStatus.textContent = 'Opening your email app with the booking request.';
        window.location.href = `mailto:earlmarvin76@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}
