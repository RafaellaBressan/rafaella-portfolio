(() => {
  const menu = document.querySelector("#menu-principal");
  const toggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");
  const mobile = window.matchMedia("(max-width: 850px)");

  if (menu && toggle && navbar) {
    const setMenu = (open, returnFocus = false) => {
      menu.classList.toggle("menu-open", open);
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", () =>
      setMenu(toggle.getAttribute("aria-expanded") !== "true"),
    );
    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      setMenu(false);
      // Evita deixar o foco em um link que acabou de ser ocultado.
      if (mobile.matches) {
        if (link.getAttribute("href").startsWith("#")) {
          const destination = document.getElementById(link.hash.slice(1));
          if (destination) {
            destination.tabIndex = -1;
            destination.focus({ preventScroll: true });
          }
        } else {
          toggle.focus();
        }
      }
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      )
        setMenu(false, true);
    });
    document.addEventListener("click", (event) => {
      if (!navbar.contains(event.target)) setMenu(false);
    });
    navbar.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !navbar.contains(event.relatedTarget))
        setMenu(false);
    });
    mobile.addEventListener("change", () => setMenu(false));
    document.documentElement.classList.add("menu-enhanced");
  }

  const sections = [...document.querySelectorAll("main > section[id]")];
  const links = [...document.querySelectorAll('.navbar a[href^="#"]')].filter(
    (link) => !link.classList.contains("logo"),
  );
  let scheduled = false;
  const updateCurrent = () => {
    const threshold = 125;
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold)
        current = section.id;
    }
    for (const link of links) {
      const active = link.hash === "#" + current;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
    scheduled = false;
  };
  const scheduleCurrent = () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateCurrent);
    }
  };
  window.addEventListener("scroll", scheduleCurrent, { passive: true });
  window.addEventListener("resize", scheduleCurrent);
  updateCurrent();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((element) => observer.observe(element));
    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) observer.disconnect();
    });
  }
})();
