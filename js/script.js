document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // VARIABLES GLOBALES
  // =========================
  let currentIndex = 0;
  let isAnimating = false;

  const sections = document.querySelectorAll("main section");
  const cards = document.querySelectorAll(".skill-card");
  const scrollButtons = document.querySelectorAll(".scroll-down");

  // =========================
  // POSITION INITIALE DES SECTIONS
  // =========================
  sections.forEach((section, index) => {
    section.style.transform = index === 0
      ? "translateY(0)"
      : "translateY(100%)";
  });

  // =========================
  // FONCTION DE CHANGEMENT DE SECTION
  // =========================
  function changeSection(newIndex, direction) {
    if (isAnimating || newIndex === currentIndex) return;

    isAnimating = true;

    const current = sections[currentIndex];
    const next = sections[newIndex];

    next.style.transform =
      direction === "down"
        ? "translateY(100%)"
        : "translateY(-100%)";

    void next.offsetHeight;

    current.style.transform =
      direction === "down"
        ? "translateY(-100%)"
        : "translateY(100%)";

    next.style.transform = "translateY(0)";

    // Animation des cartes de compétences
    if (newIndex === 1 && cards.length > 0) {
      cards.forEach((card, index) => {
        card.classList.remove("show");
        setTimeout(() => {
          card.classList.add("show");
        }, index * 100);
      });
    }

    currentIndex = newIndex;

    setTimeout(() => {
      isAnimating = false;
    }, 700);
  }

  // =========================
  // NAVIGATION AVEC LA MOLETTE
  // =========================
  window.addEventListener("wheel", (e) => {
    if (isAnimating) return;

    if (e.deltaY > 0 && currentIndex < sections.length - 1) {
      changeSection(currentIndex + 1, "down");
    }

    if (e.deltaY < 0 && currentIndex > 0) {
      changeSection(currentIndex - 1, "up");
    }
  });
// =========================
// NAVIGATION TACTILE (MOBILE)
// =========================
let touchStartY = 0;

window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

window.addEventListener("touchend", (e) => {
  if (isAnimating) return;

  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  if (Math.abs(diff) > 50) { // seuil pour éviter les faux mouvements
    if (diff > 0 && currentIndex < sections.length - 1) {
      changeSection(currentIndex + 1, "down");
    } else if (diff < 0 && currentIndex > 0) {
      changeSection(currentIndex - 1, "up");
    }
  }
});
  // =========================
  // NAVIGATION AVEC LA FLÈCHE
  // =========================
  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (isAnimating) return;

      if (currentIndex < sections.length - 1) {
        changeSection(currentIndex + 1, "down");
      }
    });
  });

  // =================================
  // GESTION DU FORMULAIRE DE CONTACT 
  // ==================================
  if (typeof emailjs !== "undefined") {
    emailjs.init("nuynziyA5BWnmMb1m");

    const form = document.getElementById("contact-form");
    const messageBox = document.getElementById("form-message");

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs
          .sendForm("theoMailJs", "template_gite1bq", this)
          .then(() => {
            // Masquer le formulaire
            form.style.display = "none";

            // Afficher le message de confirmation
            if (messageBox) {
              messageBox.classList.add("show");
            }

            // Réinitialiser le formulaire
            form.reset();

            // Redirection vers la page d'accueil après 3 secondes
            setTimeout(() => {
              window.location.href = "index.html";
            }, 3000);
          })
          .catch((error) => {
            console.error(error);

            if (messageBox) {
              messageBox.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Une erreur est survenue. Merci de réessayer.</p>
              `;
              messageBox.classList.add("show");
            }
          });
      });
    }
  } else {
    console.warn("EmailJS non chargé sur cette page.");
  }

});