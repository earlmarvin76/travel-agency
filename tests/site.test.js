const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/style.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'assets/js/script.js'), 'utf8');

const navigationLinks = [...html.matchAll(/<li><a href="([^"]+)">([^<]+)<\/a><\/li>/g)];

test('navigation exposes four unique section links', () => {
    assert.equal(navigationLinks.length, 5);
    assert.deepEqual(
        navigationLinks.map(([, href]) => href),
        ['#top', '#destinations', '#videos', '#bookings', '#contact']
    );
});

test('travel videos stay embedded on the homepage', () => {
    assert.match(html, /id="videos"/);
    assert.equal((html.match(/<iframe class="video-frame"/g) || []).length, 3);
    assert.equal((html.match(/youtube\.com\/embed\?listType=search/g) || []).length, 3);
    assert.match(css, /\.video-frame/);
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
    assert.match(html, /href="#top"/);
    assert.match(script, /window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\)/);
    assert.match(script, /event\.preventDefault\(\)/);
});

test('booking form requires valid booking details', () => {
    assert.match(html, /id="booking-form"/);
    assert.match(html, /id="destination"[^>]*required/);
    assert.match(html, /id="travel-date"[^>]*required/);
    assert.match(html, /id="email"[^>]*required/);
    assert.match(html, /id="travelers"[^>]*min="1"[^>]*max="12"/);
    assert.match(script, /bookingForm\.checkValidity\(\)/);
});

test('booking form creates a prefilled email request', () => {
    assert.match(html, /action="mailto:earlmarvin76@gmail\.com"/);
    assert.match(script, /Travel booking request/);
    assert.match(script, /window\.location\.href = `mailto:earlmarvin76@gmail\.com/);
});

test('page includes keyboard focus and header-safe scrolling styles', () => {
    assert.match(css, /:focus-visible/);
    assert.match(css, /scroll-behavior: smooth/);
    assert.match(css, /scroll-margin-top: 90px/);
});
