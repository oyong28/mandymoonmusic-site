/*
  Purpose:
  Reveal sections on scroll using IntersectionObserver.
  Applies to elements with class "reveal".
*/

(function () {
  function revealElement(el) {
    el.classList.add("is-visible");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (elements.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(revealElement);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          revealElement(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  });
})();
