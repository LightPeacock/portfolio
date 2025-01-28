let slideIndex = 0;

function moveSlide(n) {
    const slides = document.querySelectorAll('.carousel-images img');
    slideIndex = (slideIndex + n + slides.length) % slides.length;
    const offset = -slideIndex * 100;
    document.querySelector('.carousel-images').style.transform = `translateX(${offset}%)`;
}
