const header = document.querySelector('header');
const menuButton = document.querySelector('.nav-toggle');
const navigationLinks = document.querySelectorAll('#site-menu a');
const bookingForm = document.querySelector('#booking-form');
const travelDate = document.querySelector('#travel-date');
const formStatus = document.querySelector('#form-status');
const menuLinks = navigationLinks;

const updateActiveLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navigationLinks.forEach((link) => {
        const linkUrl = new URL(link.href, window.location.href);
        const isCurrentPage = linkUrl.pathname.split('/').pop() === currentPage;
        const isCurrentAnchor = isCurrentPage && linkUrl.hash && linkUrl.hash === window.location.hash;
        link.classList.toggle('active', isCurrentPage && (!linkUrl.hash || isCurrentAnchor));
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
