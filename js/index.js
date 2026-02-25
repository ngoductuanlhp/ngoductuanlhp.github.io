
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
    document.getElementById('btn-all').classList.toggle('is-dark', mode === 'all');
    document.getElementById('btn-selected').classList.toggle('is-dark', mode === 'selected');
}

window.addEventListener('scroll', function() {
    var btn = document.getElementById('back-to-top');
    if (btn) btn.style.display = window.scrollY > 400 ? 'block' : 'none';
});

$(document).ready(function() {
    filterPublications('selected');
})
