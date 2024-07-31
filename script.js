// Animaciones al hacer scroll
document.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + window.innerHeight;

    sections.forEach(section => {
        if (section.offsetTop < scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
            section.classList.add('fade-in');
        } else {
            section.classList.remove('fade-in');
        }
    });
});

// Función para mostrar una alerta de bienvenida
window.onload = function() {
    setTimeout(function() {
        alert('¡Bienvenido a Royal Card Duel! Explora nuestros productos y disfruta de la experiencia.');
    }, 2000);
};
