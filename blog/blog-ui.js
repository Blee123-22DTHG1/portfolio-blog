// ✅ bật chế độ JS animation (để reveal hoạt động)
document.documentElement.classList.add("js-enabled");

// ===== Scroll Progress Bar =====
function initProgressBar() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + "%";
  });
}

// ===== Reveal On Scroll =====
function revealBlogContent() {
  const els = document.querySelectorAll(".reveal");
  const trigger = window.innerHeight * 0.85;

  els.forEach((el) => {
    if (el.getBoundingClientRect().top < trigger) el.classList.add("show");
  });
}

// ===== Parallax Hero Image =====
function initParallax() {
  const hero = document.querySelector(".blog-hero img");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.15;
    hero.style.transform = `translateY(${offset}px) scale(1.05)`;
  });
}

// ===== Auto Table Of Contents =====
function initTOC() {
  const toc = document.getElementById("toc");
  const headings = document.querySelectorAll(".blog-content h2");

  if (!toc || headings.length === 0) return;

  toc.innerHTML = Array.from(headings)
    .map((h, idx) => {
      const id = `section-${idx}`;
      h.id = id;
      return `<a href="#${id}">${h.innerText}</a>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initProgressBar();
  initParallax();
  initTOC();
  revealBlogContent();
  window.addEventListener("scroll", revealBlogContent);
});
