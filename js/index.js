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

window.addEventListener('scroll', function() {
    var btn = document.getElementById('back-to-top');
    if (btn) btn.style.display = window.scrollY > 400 ? 'block' : 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    filterPublications('all');

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
