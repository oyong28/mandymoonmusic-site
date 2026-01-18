/* ============================================================================
   Mandy Moon — Contact Form (fetch → /api/contact)
   Summary:
   - Intercepts the contact form submit (no page reload).
   - Sends JSON to POST /api/contact (NGINX proxies to Flask on localhost).
   - Includes a honeypot field named "website" (must remain empty).
   - Shows success/error feedback in the page.
   - Disables the submit button while sending to prevent double submits.
   ============================================================================ */

(function () {
  "use strict";

  // ---------- Config ----------
  const ENDPOINT = "/api/contact";

  // ---------- Helpers ----------
  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function setStatus(el, type, msg) {
    if (!el) return;
    el.textContent = msg || "";
    el.classList.remove("is-success", "is-error", "is-loading");
    if (type) el.classList.add(type);
  }

  function disableForm(form, disabled) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = disabled;
  }

  function getFieldValue(form, name) {
    const el = form.querySelector(`[name="${name}"]`);
    return el ? String(el.value || "").trim() : "";
  }

  // ---------- Main ----------
  document.addEventListener("DOMContentLoaded", function () {
    const form = $(".contact-form");
    if (!form) return;

    const statusEl = $("#contact-status");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const payload = {
        name: getFieldValue(form, "name"),
        email: getFieldValue(form, "email"),
        subject: getFieldValue(form, "subject"),
        message: getFieldValue(form, "message"),
        website: getFieldValue(form, "website"), // honeypot
      };

      // Front-end sanity checks (server still validates)
      if (
        !payload.name ||
        !payload.email ||
        !payload.subject ||
        !payload.message
      ) {
        setStatus(statusEl, "is-error", "Please fill out all required fields.");
        return;
      }

      disableForm(form, true);
      setStatus(statusEl, "is-loading", "Sending...");

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            (data && data.message) ||
            "Unable to send message right now. Please try again later.";
          setStatus(statusEl, "is-error", msg);
          disableForm(form, false);
          return;
        }

        const msg = (data && data.message) || "Thanks! Your message was sent.";
        setStatus(statusEl, "is-success", msg);
        form.reset();
        disableForm(form, false);
      } catch (err) {
        setStatus(statusEl, "is-error", "Network error. Please try again.");
        disableForm(form, false);
      }
    });
  });
})();
