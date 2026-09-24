function toggleNews(btn) {
    var extras = document.querySelectorAll('li.news-extra');
    var expanded = btn.getAttribute('data-expanded') === 'true';
    extras.forEach(function(el) {
        el.style.display = expanded ? 'none' : 'list-item';
    });
    btn.setAttribute('data-expanded', expanded ? 'false' : 'true');
    btn.innerHTML = expanded ? '&#9660; Show more' : '&#9650; Show less';
}

function filterPublications(mode) {
    var blocks = document.querySelectorAll('.publication-block');
    blocks.forEach(function(el) {
        if (mode === 'selected') {
            var isHighlight = el.getAttribute('data-highlight') === 'true';
            el.style.display = isHighlight ? '' : 'none';
            el.classList.remove('publication-highlight');
        } else {
            el.style.display = '';
            if (el.getAttribute('data-highlight') === 'true') {
                el.classList.add('publication-highlight');
            }
        }
    });
    var btnAll = document.getElementById('btn-all');
    var btnSelected = document.getElementById('btn-selected');
    if (btnAll) btnAll.classList.toggle('is-dark', mode === 'all');
    if (btnSelected) btnSelected.classList.toggle('is-dark', mode === 'selected');
}

var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(pref) {
    var dark = pref === 'dark' || (pref === 'system' && systemDark.matches);
    document.documentElement.dataset.themePref = pref;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelectorAll('[data-theme-option]').forEach(function(btn) {
        var active = btn.dataset.themeOption === pref;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

function setTheme(pref) {
    try {
        if (pref === 'system') localStorage.removeItem('theme');
        else localStorage.setItem('theme', pref);
    } catch (e) {}
    applyTheme(pref);
}

systemDark.addEventListener('change', function() {
    if (document.documentElement.dataset.themePref === 'system') applyTheme('system');
});

window.addEventListener('scroll', function() {
    var btn = document.getElementById('back-to-top');
    if (btn) btn.style.display = window.scrollY > 400 ? 'block' : 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    filterPublications('all');

    document.querySelectorAll('.tldr-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var panel = document.getElementById(btn.getAttribute('aria-controls'));
            var open = btn.getAttribute('aria-expanded') !== 'true';
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (panel) panel.classList.toggle('is-open', open);
        });
    });

    applyTheme(document.documentElement.dataset.themePref || 'system');
    document.querySelectorAll('[data-theme-option]').forEach(function(btn) {
        btn.addEventListener('click', function() { setTheme(btn.dataset.themeOption); });
    });

    // Bulma navbar burger toggle.
    var burgers = document.querySelectorAll('.navbar-burger');
    burgers.forEach(function(burger) {
        burger.addEventListener('click', function() {
            var targetId = burger.dataset.target;
            var target = document.getElementById(targetId);
            burger.classList.toggle('is-active');
            if (target) target.classList.toggle('is-active');
        });
    });

    // Close mobile menu after tapping a nav link.
    document.querySelectorAll('#site-navbar-menu .navbar-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var menu = document.getElementById('site-navbar-menu');
            var burger = document.querySelector('.navbar-burger');
            if (menu) menu.classList.remove('is-active');
            if (burger) burger.classList.remove('is-active');
        });
    });
});
