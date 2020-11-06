var scrollButton = document.getElementById("scrollToTop");

function scrollFunction() {
    scrollButton.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

$(document).ready(() => {
    window.onscroll = function() { scrollFunction() };
});

$(window).on('load', () => {
    AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true
    })
})