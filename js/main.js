const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar ul li a");

function updateActiveMenu(){

    const scrollY = window.scrollY;

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if(
            scrollY >= sectionTop &&
            scrollY < sectionTop + sectionHeight
        ){

            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            const activeLink = document.querySelector(
                `.navbar ul li a[href="#${sectionId}"]`
            );

            if(activeLink){
                activeLink.classList.add("active");
            }
        }
    });
}

window.addEventListener("scroll", updateActiveMenu);

updateActiveMenu();

/* =========================================
   ANIMAÇÕES AO ROLAR A PÁGINA
========================================= */

const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
);

function revealOnScroll(){

    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        const revealPoint = 100;

        if(elementTop < windowHeight - revealPoint){

            element.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();

/* =========================================
   MENU MOBILE
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".navbar ul");

if(menuToggle && mobileMenu){

    menuToggle.addEventListener("click", () => {

        mobileMenu.classList.toggle("menu-open");

        menuToggle.classList.toggle("active");

    });


    /* Fecha ao clicar em um link */

    mobileMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("menu-open");

            menuToggle.classList.remove("active");

        });

    });

}