const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const progress = document.querySelector(".scroll-line span");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    navigation.classList.toggle("open", !open);
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    navigation.classList.remove("open");
  }));
}

const updateProgress = () => {
  if (!progress) return;
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${range > 0 ? window.scrollY / range * 100 : 0}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("visible"));
}

const previewVideos = document.querySelectorAll(".preview-video");
if (reducedMotion) {
  previewVideos.forEach((video) => video.pause());
} else if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.2 });
  previewVideos.forEach((video) => videoObserver.observe(video));
}

const dialog = document.querySelector(".project-dialog");
const dialogVideo = document.querySelector(".dialog-video");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector(".dialog-description");
let activePreviewTrigger = null;
const openPreview = (button) => {
  if (!dialog || !dialogVideo) return;
  activePreviewTrigger = button;
  previewVideos.forEach((video) => video.pause());
  dialogTitle.textContent = button.dataset.title || "Project preview";
  dialogDescription.textContent = button.dataset.copy || "";
  dialogVideo.poster = button.dataset.poster || "";
  dialogVideo.src = button.dataset.preview || "";
  dialog.hidden = false;
  dialog.setAttribute("aria-hidden", "false");
  dialog.classList.add("is-open");
  document.body.classList.add("preview-open");
  dialogVideo.play().catch(() => {});
};

document.querySelectorAll("[data-preview]").forEach((button) => {
  button.addEventListener("click", () => openPreview(button));
});

const closeDialog = () => {
  if (!dialog?.classList.contains("is-open")) return;
  if (!dialogVideo) return;
  dialog.classList.remove("is-open");
  dialog.setAttribute("aria-hidden", "true");
  document.body.classList.remove("preview-open");
  dialog.hidden = true;
  dialogVideo.pause();
  dialogVideo.removeAttribute("src");
  dialogVideo.load();
  activePreviewTrigger?.focus();
  if (!reducedMotion) previewVideos.forEach((video) => {
    const bounds = video.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < window.innerHeight) video.play().catch(() => {});
  });
};
document.querySelector(".dialog-close")?.addEventListener("click", closeDialog);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDialog();
});

const stage = document.querySelector(".hero-stage");
if (stage && window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    stage.style.setProperty("--pointer-x", `${x * 14}px`);
    stage.style.setProperty("--pointer-y", `${y * 14}px`);
  });
  stage.addEventListener("pointerleave", () => {
    stage.style.setProperty("--pointer-x", "0px");
    stage.style.setProperty("--pointer-y", "0px");
  });
}
