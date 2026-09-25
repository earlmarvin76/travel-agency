const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const destinationsHtml = fs.readFileSync(path.join(root, 'destinations.html'), 'utf8');
const videosHtml = fs.readFileSync(path.join(root, 'videos.html'), 'utf8');
const bookingsHtml = fs.readFileSync(path.join(root, 'bookings.html'), 'utf8');
const contactHtml = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/style.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'assets/js/script.js'), 'utf8');

const navigationLinks = [...html.matchAll(/<li><a href="([^"]+)">([^<]+)<\/a><\/li>/g)];

test('navigation exposes five separate pages', () => {
    assert.equal(navigationLinks.length, 5);
    assert.deepEqual(
        navigationLinks.map(([, href]) => href),
        ['index.html', 'destinations.html', 'videos.html', 'bookings.html', 'contact.html']
    );
});

test('travel videos have their own page', () => {
    assert.match(videosHtml, /Travel &#45; Videos/);
    assert.equal((videosHtml.match(/<iframe class="video-frame"/g) || []).length, 3);
    assert.equal((videosHtml.match(/youtube\.com\/embed\/[A-Za-z0-9_-]{11}/g) || []).length, 3);
    assert.equal((videosHtml.match(/youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}/g) || []).length, 3);
    assert.equal((videosHtml.match(/referrerpolicy="strict-origin-when-cross-origin"/g) || []).length, 3);
    assert.match(videosHtml, /<meta name="referrer" content="strict-origin-when-cross-origin">/);
    assert.match(videosHtml, /src="https:\/\/www\.youtube\.com\/embed\/_gIljISgm_k" title="Paris travel video"/);
    assert.match(css, /\.video-frame/);
});

test('destinations have their own page', () => {
    assert.match(destinationsHtml, /Top destinations/);
    assert.equal((destinationsHtml.match(/class="destination-card"/g) || []).length, 3);
});

test('contact details have their own page', () => {
    assert.match(contactHtml, /id="contact"/);
    assert.match(contactHtml, /Contact our team/);
    assert.match(contactHtml, /mailto:earlmarvin76@gmail\.com/);
    assert.match(contactHtml, /tel:\+447741499404/);
});

test('mobile navigation uses an accessible button', () => {
    assert.match(html, /<button type="button" class="nav-toggle"/);
    assert.match(html, /aria-controls="site-menu"/);
    assert.match(html, /aria-expanded="false"/);
    assert.match(script, /menuButton\.setAttribute\('aria-expanded', String\(isOpen\)\)/);
    assert.doesNotMatch(html, /id="nav-toggle"/);
    assert.doesNotMatch(css, /#nav-toggle/);
});

test('Home link explicitly scrolls to the top', () => {
    assert.match(html, /href="index\.html"/);
    assert.match(script, /window\.location\.pathname\.split\('\/'\)/);
});

test('booking form requires valid booking details', () => {
    assert.match(bookingsHtml, /id="booking-form"/);
    assert.match(bookingsHtml, /id="destination"[^>]*required/);
    assert.match(bookingsHtml, /id="travel-date"[^>]*required/);
    assert.match(bookingsHtml, /id="email"[^>]*required/);
    assert.match(bookingsHtml, /id="travelers"[^>]*min="1"[^>]*max="12"/);
    assert.match(script, /bookingForm\.checkValidity\(\)/);
});

test('booking form creates a prefilled email request', () => {
    assert.match(bookingsHtml, /action="mailto:earlmarvin76@gmail\.com"/);
    assert.match(script, /Travel booking request/);
    assert.match(script, /window\.location\.href = `mailto:earlmarvin76@gmail\.com/);
});

test('page includes keyboard focus and header-safe scrolling styles', () => {
    assert.match(css, /:focus-visible/);
    assert.match(css, /scroll-behavior: smooth/);
    assert.match(css, /scroll-margin-top: 90px/);
    assert.match(css, /background-attachment: fixed/);
    assert.match(css, /linear-gradient\(rgba\(20, 67, 99, 0\.28\)/);
});

test('footer includes a responsive location map', () => {
    assert.match(html, /class="footer-map"/);
    assert.equal((html.match(/tile\.openstreetmap\.org\/14\/817[567]\/52(?:79|80|81)\.png/g) || []).length, 9);
    assert.match(bookingsHtml, /class="map-label">Map showing Woburn Street, Hull, East Yorkshire/);
    assert.match(css, /\.footer-map img/);
    assert.match(css, /@media screen and \(max-width: 767px\)/);
});
