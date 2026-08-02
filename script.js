const menuBtn = document.querySelector(".menu-btn"),
  nav = document.querySelector(".nav");
document.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }),
);
function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}
menuBtn.addEventListener("click", () =>
  setMenu(!nav.classList.contains("open")),
);
nav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
addEventListener(
  "resize",
  () => {
    if (innerWidth > 900) setMenu(false);
  },
  { passive: true },
);
function lockPageScroll() {
  if (document.body.classList.contains("modal-open")) return;
  const scrollbarWidth = Math.max(
    0,
    window.innerWidth - document.documentElement.clientWidth,
  );
  document.documentElement.style.setProperty(
    "--scrollbar-compensation",
    `${scrollbarWidth}px`,
  );
  document.body.classList.add("modal-open");
}
function unlockPageScroll() {
  if (document.querySelector("dialog[open]")) return;
  document.body.classList.remove("modal-open");
  requestAnimationFrame(() =>
    document.documentElement.style.removeProperty("--scrollbar-compensation"),
  );
}
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
document
  .querySelectorAll(".team-grid,.gallery,.award-list")
  .forEach((group) =>
    [...group.children].forEach((el, index) =>
      el.style.setProperty("--delay", `${Math.min(index, 5) * 65}ms`),
    ),
  );
const header = document.querySelector(".header"),
  progress = document.querySelector(".scroll-progress");
let ticking = false;
function updateScroll() {
  const y = scrollY,
    max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max ? y / max : 0})`;
  header.classList.toggle("scrolled", y > 40);
  ticking = false;
}
addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  },
  { passive: true },
);
updateScroll();
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')],
  navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
const sectionObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      }
    }),
  { rootMargin: "-35% 0px -55% 0px" },
);
navSections.forEach((section) => sectionObserver.observe(section));
const projects = document.querySelector(".projects");
let projectGlowFrame = 0,
  projectGlowX = projects.clientWidth / 2,
  projectGlowY = projects.clientHeight * 0.3,
  projectGlowTargetX = projectGlowX,
  projectGlowTargetY = projectGlowY;
function animateProjectGlow() {
  projectGlowX += (projectGlowTargetX - projectGlowX) * 0.1;
  projectGlowY += (projectGlowTargetY - projectGlowY) * 0.1;
  projects.style.setProperty("--mx", `${projectGlowX}px`);
  projects.style.setProperty("--my", `${projectGlowY}px`);
  if (
    Math.abs(projectGlowTargetX - projectGlowX) > 0.2 ||
    Math.abs(projectGlowTargetY - projectGlowY) > 0.2
  ) {
    projectGlowFrame = requestAnimationFrame(animateProjectGlow);
  } else {
    projectGlowFrame = 0;
  }
}
projects.addEventListener("pointerenter", () =>
  projects.classList.add("pointer-active"),
);
projects.addEventListener(
  "pointermove",
  (e) => {
    const r = projects.getBoundingClientRect();
    projectGlowTargetX = e.clientX - r.left;
    projectGlowTargetY = e.clientY - r.top;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      projectGlowX = projectGlowTargetX;
      projectGlowY = projectGlowTargetY;
      projects.style.setProperty("--mx", `${projectGlowX}px`);
      projects.style.setProperty("--my", `${projectGlowY}px`);
    } else if (!projectGlowFrame) {
      projectGlowFrame = requestAnimationFrame(animateProjectGlow);
    }
  },
  { passive: true },
);
projects.addEventListener("pointerleave", () =>
  projects.classList.remove("pointer-active"),
);
const footer = document.querySelector("body > footer");
let footerGlowFrame = 0,
  footerGlowX = 50,
  footerGlowY = 50,
  footerGlowTargetX = 50,
  footerGlowTargetY = 50;
function animateFooterGlow() {
  footerGlowX += (footerGlowTargetX - footerGlowX) * 0.1;
  footerGlowY += (footerGlowTargetY - footerGlowY) * 0.1;
  footer.style.setProperty("--fx", `${footerGlowX}%`);
  footer.style.setProperty("--fy", `${footerGlowY}%`);
  if (
    Math.abs(footerGlowTargetX - footerGlowX) > 0.1 ||
    Math.abs(footerGlowTargetY - footerGlowY) > 0.1
  ) {
    footerGlowFrame = requestAnimationFrame(animateFooterGlow);
  } else {
    footerGlowFrame = 0;
  }
}
footer.addEventListener("pointerenter", () => footer.classList.add("pointer-active"));
footer.addEventListener("pointerleave", () => footer.classList.remove("pointer-active"));
footer.addEventListener(
  "pointermove",
  (event) => {
    const rect = footer.getBoundingClientRect();
    footerGlowTargetX = ((event.clientX - rect.left) / rect.width) * 100;
    footerGlowTargetY = ((event.clientY - rect.top) / rect.height) * 100;
    if (!footerGlowFrame) footerGlowFrame = requestAnimationFrame(animateFooterGlow);
  },
  { passive: true },
);
const box = document.querySelector(".lightbox"),
  boxMedia = box.querySelector(".lightbox-media"),
  boxCurrent = box.querySelector(".lightbox-current"),
  works = [...document.querySelectorAll(".work")];
let currentPhoto = 0,
  touchStart = 0,
  activePhotos = [],
  photoRequest = 0;
boxCurrent.addEventListener("error", () => {
  boxCurrent.alt = "";
  boxCurrent.removeAttribute("src");
});
function paintViewer(src) {
  boxMedia.style.backgroundImage = `url("${src.replaceAll('"', "%22")}")`;
}
const workPhotos = works.map((work) => ({
  src: work.dataset.src,
  alt: work.querySelector("img").alt,
  title: work.querySelector("b").textContent,
}));
const photoCache = new Map();
function loadPhoto(src) {
  if (photoCache.has(src)) return photoCache.get(src);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    let settled = false;
    const ready = async () => {
      if (settled) return;
      settled = true;
      try {
        if (image.decode) await image.decode();
      } catch {}
      resolve(image);
    };
    image.onload = ready;
    image.onerror = () => {
      settled = true;
      photoCache.delete(src);
      reject(new Error(`Не удалось загрузить ${src}`));
    };
    image.src = src;
    if (image.complete && image.naturalWidth) ready();
  });
  photoCache.set(src, promise);
  while (photoCache.size > 12)
    photoCache.delete(photoCache.keys().next().value);
  return promise;
}
function preloadPhoto(index) {
  const photo =
    activePhotos[(index + activePhotos.length) % activePhotos.length];
  if (photo) loadPhoto(photo.src).catch(() => {});
}
function animateViewerChange(direction = 0) {
  boxMedia.classList.remove("photo-page-next", "photo-page-prev", "photo-page-fade");
  void boxMedia.offsetWidth;
  boxMedia.classList.add(
    direction > 0
      ? "photo-page-next"
      : direction < 0
        ? "photo-page-prev"
        : "photo-page-fade",
  );
}
function showPhoto(index, direction = 0) {
  if (!activePhotos.length) return;
  const request = ++photoRequest;
  currentPhoto = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[currentPhoto],
    preview = photo.thumb || photo.src;
  box.querySelector(".lightbox-title").textContent = "";
  box.querySelector(".lightbox-count").textContent =
    `${String(currentPhoto + 1).padStart(2, "0")} / ${String(activePhotos.length).padStart(2, "0")}`;
  if (!boxMedia.style.backgroundImage)
    loadPhoto(preview)
      .then((image) => {
        if (request === photoRequest && !boxMedia.style.backgroundImage)
          paintViewer(image.src);
      })
      .catch(() => {});
  loadPhoto(photo.src)
    .then((image) => {
      if (request !== photoRequest) return;
      paintViewer(image.src);
      animateViewerChange(direction);
    })
    .catch(() => {});
  preloadPhoto(currentPhoto + 1);
  preloadPhoto(currentPhoto - 1);
}
function openLightbox(photos, index = 0) {
  activePhotos = photos;
  if (!box.open) boxMedia.style.backgroundImage = "";
  box.classList.remove("is-closing");
  if (!box.open) box.showModal();
  showPhoto(index);
  lockPageScroll();
}
function closeAnimated(dialog) {
  if (!dialog.open || dialog.classList.contains("is-closing")) return;
  dialog.classList.add("is-closing");
  setTimeout(() => {
    dialog.close();
    dialog.classList.remove("is-closing");
  }, 280);
}
works.forEach((work, index) =>
  work.addEventListener("click", () => {
    work.blur();
    openLightbox(workPhotos, index);
  }),
);
box
  .querySelector(".lightbox-close")
  .addEventListener("click", () => closeAnimated(box));
box
  .querySelector(".lightbox-prev")
  .addEventListener("click", () => showPhoto(currentPhoto - 1, -1));
box
  .querySelector(".lightbox-next")
  .addEventListener("click", () => showPhoto(currentPhoto + 1, 1));
box.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeAnimated(box);
});
box.addEventListener("close", () => {
  photoRequest++;
  unlockPageScroll();
});
box.addEventListener("click", (e) => {
  if (e.target === box) closeAnimated(box);
});
box.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showPhoto(currentPhoto - 1, -1);
  if (e.key === "ArrowRight") showPhoto(currentPhoto + 1, 1);
});
boxMedia.addEventListener(
  "touchstart",
  (e) => (touchStart = e.changedTouches[0].clientX),
  { passive: true },
);
boxMedia.addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 45)
      showPhoto(currentPhoto + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
  },
  { passive: true },
);
const albumDialog = document.querySelector(".album-dialog"),
  albumGrid = document.querySelector(".album-grid"),
  albumPhotos = document.querySelector(".album-photos");
function openAlbum(album) {
  albumDialog.classList.remove("is-closing");
  albumDialog.querySelector(".album-title").textContent = album.title;
  albumDialog.querySelector(".album-total").textContent =
    `${album.photos.length} фотографий`;
  albumPhotos.replaceChildren();
  const photos = album.photos.map((photo, index) => ({
    src: photo.src,
    thumb: photo.thumb,
    title: `${album.title} · ${index + 1}`,
    alt: `${album.title}, фотография ${index + 1}`,
  }));
  const fragment = document.createDocumentFragment();
  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.className = "album-photo";
    button.style.setProperty("--photo-delay", `${Math.min(index, 12) * 28}ms`);
    button.setAttribute("aria-label", photo.alt);
    const img = document.createElement("img");
    img.alt = photo.alt;
    img.loading = index < 8 ? "eager" : "lazy";
    img.decoding = "async";
    if (index < 4) img.fetchPriority = "high";
    const reveal = () => button.classList.add("loaded");
    img.addEventListener("load", reveal, { once: true });
    img.addEventListener(
      "error",
      () => {
        button.classList.add("loaded", "load-error");
      },
      { once: true },
    );
    img.src = photo.thumb;
    button.append(img);
    button.addEventListener("click", () => openLightbox(photos, index));
    fragment.append(button);
  });
  albumPhotos.append(fragment);
  if (!albumDialog.open) albumDialog.showModal();
  requestAnimationFrame(() =>
    albumPhotos.querySelectorAll("img").forEach((img) => {
      if (img.complete)
        img.dispatchEvent(new Event(img.naturalWidth ? "load" : "error"));
    }),
  );
  lockPageScroll();
  albumDialog.scrollTop = 0;
}
(window.PHOTO_ALBUMS || []).forEach((album, index) => {
  const button = document.createElement("button");
  button.className = "album-card reveal";
  button.style.setProperty("--delay", `${Math.min(index, 5) * 65}ms`);
  button.innerHTML = `<img src="${album.cover}" alt="${album.title}" loading="${index < 3 ? "eager" : "lazy"}" decoding="async"><span class="album-card-content"><h3>${album.title}</h3><p>${album.photos.length} фотографий · открыть альбом</p></span>`;
  button.addEventListener("click", () => openAlbum(album));
  albumGrid.append(button);
  observer.observe(button);
});
albumDialog
  .querySelector(".album-close")
  .addEventListener("click", () => closeAnimated(albumDialog));
albumDialog.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeAnimated(albumDialog);
});
albumDialog.addEventListener("close", () => {
  unlockPageScroll();
});
albumDialog.addEventListener("click", (e) => {
  if (e.target === albumDialog) closeAnimated(albumDialog);
});
const STUDIO_PHONE = "79032105544",
  MAX_LINK =
    "https://max.ru/u/f9LHodD0cOKclH9cCMD7R6vFdcU49KZQVYp5IbUi39KY3-VkR1BZZfP8eU4";
async function copyMessage(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}
const emailLink = document.querySelector(".studio-email");
emailLink?.addEventListener("click", async () => {
  await copyMessage(emailLink.dataset.email || emailLink.textContent.trim());
  const toast = document.querySelector(".toast");
  toast.textContent = "Email скопирован";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
});
const application = document.querySelector(".application-dialog"),
  applicationText = document.querySelector(".application-text");
document.querySelector("#signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  applicationText.value = [
    "Здравствуйте, Анна Александровна! Хочу записаться на просмотр в театр танца «Зеркальный мир».",
    "",
    `Имя родителя: ${data.get("name")}`,
    `Возраст ребёнка: ${data.get("age")}`,
    `Телефон для связи: ${data.get("phone")}`,
    data.get("message") ? `Комментарий: ${data.get("message")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  applicationText.style.height = "auto";
  applicationText.style.height = `${applicationText.scrollHeight + 2}px`;
  application.showModal();
  lockPageScroll();
});
application
  .querySelector(".application-close")
  .addEventListener("click", () => closeAnimated(application));
application.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeAnimated(application);
});
application.addEventListener("close", unlockPageScroll);
application.addEventListener("click", (e) => {
  if (e.target === application) closeAnimated(application);
});
application
  .querySelector(".application-copy")
  .addEventListener("click", async () => {
    await copyMessage(applicationText.value);
    const toast = document.querySelector(".toast");
    toast.textContent = "Текст заявки скопирован";
    toast.classList.add("show");
    document.querySelectorAll(".application-actions .is-locked").forEach((link) => {
      link.classList.remove("is-locked");
      link.removeAttribute("aria-disabled");
      link.removeAttribute("tabindex");
      link.classList.add("is-unlocked");
    });
    setTimeout(() => toast.classList.remove("show"), 2600);
  });
document.querySelectorAll(".button,.nav-cta,.contact-links a").forEach((el) =>
  el.addEventListener("pointerdown", (e) => {
    const ripple = document.createElement("i"),
      rect = el.getBoundingClientRect();
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    el.append(ripple);
    setTimeout(() => ripple.remove(), 650);
  }),
);
