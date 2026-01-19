{
  /* /*
    Prefill Contact Form Subject from URL:
    Example:
    https://mandymoonmusic.com/?subject=Booking%20Inquiry#contact-scroll
  */
}
(function () {
  function getPrefillSubject() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("subject") || "").trim();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const subject = getPrefillSubject();
    if (!subject) return;

    const subjectInput = document.getElementById("cf-subject");
    if (!subjectInput) return;

    // Set only if empty (so we don't overwrite user input)
    if (!subjectInput.value.trim()) subjectInput.value = subject;

    // Optional: place cursor there
    // subjectInput.focus();

    // Optional: clean the URL so refreshing doesn't keep re-prefilling
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, "", cleanUrl);
  });
})();
