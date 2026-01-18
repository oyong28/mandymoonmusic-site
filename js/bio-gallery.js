/*
  Purpose:
  Bio gallery carousel logic extracted from inline <script>.
  Uses images listed inside #hidden-gallery (static HTML).
*/

(function () {
  let galleryInitialized = false;

  function getHiddenImages() {
    const hidden = document.getElementById("hidden-gallery");
    if (!hidden) return [];
    return Array.from(hidden.querySelectorAll("img"));
  }

  function getVisibleIndexes() {
    const gallery = document.getElementById("bio-gallery");
    if (!gallery) return [];
    return Array.from(gallery.querySelectorAll("img")).map((img) => {
      const raw = img.getAttribute("index");
      return Number.parseInt(raw, 10);
    });
  }

  function clearVisibleImages() {
    const gallery = document.getElementById("bio-gallery");
    if (!gallery) return;
    Array.from(gallery.querySelectorAll("img")).forEach((img) => img.remove());
  }

  function insertThreeByIndexes(indexes) {
    const hiddenImages = getHiddenImages();
    const gallery = document.getElementById("bio-gallery");
    const leftAnchor = document.getElementById("gallery-left");

    if (!gallery || !leftAnchor) return;
    if (hiddenImages.length === 0) return;

    const safeIndexes = indexes.map((idx) => {
      if (idx < 0) return hiddenImages.length - 1;
      if (idx > hiddenImages.length - 1) return 0;
      return idx;
    });

    // Insert after #gallery-left in order: [0], [1], [2]
    safeIndexes.forEach((idx) => {
      const clone = hiddenImages[idx].cloneNode(true);
      leftAnchor.insertAdjacentElement("afterend", clone);
    });
  }

  function buildInitialGallery() {
    if (galleryInitialized) return;

    const hiddenImages = getHiddenImages();
    if (hiddenImages.length < 3) return;

    // Start by showing first 3 (0,1,2) to match existing behavior expectations.
    clearVisibleImages();
    insertThreeByIndexes([0, 1, 2]);

    galleryInitialized = true;
  }

  function scrollGallery(direction) {
    const hiddenImages = getHiddenImages();
    if (hiddenImages.length < 3) return;

    const current = getVisibleIndexes();
    if (current.length < 3) return;

    const next = [];

    if (direction === "right") {
      for (const n of current) {
        const m = n + 1 > hiddenImages.length - 1 ? 0 : n + 1;
        next.push(m);
      }
    }

    if (direction === "left") {
      for (const n of current) {
        const m = n - 1 < 0 ? hiddenImages.length - 1 : n - 1;
        next.push(m);
      }
    }

    clearVisibleImages();
    insertThreeByIndexes([next[0], next[1], next[2]]);
  }

  function wireControls() {
    const leftBtn = document.getElementById("scroll-left");
    const rightBtn = document.getElementById("scroll-right");

    if (leftBtn) {
      leftBtn.addEventListener("click", function () {
        scrollGallery("left");
      });

      leftBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") scrollGallery("left");
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener("click", function () {
        scrollGallery("right");
      });

      rightBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") scrollGallery("right");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildInitialGallery();
    wireControls();
  });
})();
