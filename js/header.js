/*
  Purpose:
  Mobile header menu behavior:
  - Toggle hamburger dropdown open/close
  - Toggle Listen submenu open/close
  - Close menus when a link is clicked
*/

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const dropdown = document.getElementById("header-dropdown");

    const listenToggle = document.querySelector(".mobile-submenu-toggle");
    const listenSubmenu = document.getElementById("listen-submenu");

    if (!hamburgerBtn || !dropdown) return;

    function setHamburgerExpanded(isOpen) {
      hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
      dropdown.classList.toggle("is-open", isOpen);
    }

    function setListenExpanded(isOpen) {
      if (!listenToggle || !listenSubmenu) return;
      listenToggle.setAttribute("aria-expanded", String(isOpen));
      listenSubmenu.classList.toggle("is-open", isOpen);
    }

    hamburgerBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("is-open");
      setHamburgerExpanded(!isOpen);

      // When opening menu, keep submenu closed by default
      if (!isOpen) setListenExpanded(false);
    });

    if (listenToggle && listenSubmenu) {
      listenToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        const isOpen = listenSubmenu.classList.contains("is-open");
        setListenExpanded(!isOpen);
      });
    }

    // Close when clicking outside
    document.addEventListener("click", function () {
      setHamburgerExpanded(false);
      setListenExpanded(false);
    });

    // Prevent clicks inside dropdown from closing it
    dropdown.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    // Close menu on any link click (better UX)
    dropdown.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setHamburgerExpanded(false);
        setListenExpanded(false);
      });
    });
  });
})();
