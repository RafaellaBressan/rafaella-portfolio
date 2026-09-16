"use strict";
// A navegação e o conteúdo continuam disponíveis quando JavaScript está desativado.
document.documentElement.classList.add("js");
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-principal");
  const header = document.querySelector(".site-header");
  const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
  const sections = [...document.querySelectorAll("main section[id]")];
  function setMenu(open, restoreFocus = false) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener("click", () =>
    setMenu(toggle.getAttribute("aria-expanded") !== "true"),
  );
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    )
      setMenu(false, true);
  });
  document.addEventListener("click", (event) => {
    if (
      toggle.getAttribute("aria-expanded") === "true" &&
      !header.contains(event.target)
    )
      setMenu(false);
  });
  const wideScreen = window.matchMedia("(min-width: 951px)");
  wideScreen.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
  let framePending = false;
  function updateNavigation() {
    const threshold = header.getBoundingClientRect().height + 85;
    let current = "inicio";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold)
        current = section.id;
    }
    navLinks.forEach((link) => {
      if (link.hash === "#" + current)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    framePending = false;
  }
  function requestNavigationUpdate() {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateNavigation);
    }
  }
  window.addEventListener("scroll", requestNavigationUpdate, { passive: true });
  window.addEventListener("resize", requestNavigationUpdate);
  window.addEventListener("hashchange", requestNavigationUpdate);
  updateNavigation();
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("enter");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(
        ".section-heading, .project, .about-copy, .process-steps",
      )
      .forEach((element) => observer.observe(element));
  }
})();
