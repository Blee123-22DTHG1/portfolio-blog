// ===================== HAMBURGER MENU =====================
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// ===================== COPY CODE BUTTONS =====================
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((block) => {
    if (block.querySelector(".copy-btn")) return;

    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerText = "Copy";

    button.addEventListener("click", async () => {
      const code = block.querySelector("code")?.innerText || "";
      try {
        await navigator.clipboard.writeText(code);
        button.innerText = "Copied ✅";
        setTimeout(() => (button.innerText = "Copy"), 1500);
      } catch (err) {
        button.innerText = "Failed ❌";
        setTimeout(() => (button.innerText = "Copy"), 1500);
      }
    });

    block.appendChild(button);
  });
}

// ===================== FADE-UP ANIMATION =====================
function revealOnScroll() {
  const items = document.querySelectorAll(".fade-up");
  const trigger = window.innerHeight * 0.9;

  items.forEach((item) => {
    const top = item.getBoundingClientRect().top;
    if (top < trigger) item.classList.add("show");
  });
}

// ===================== BLOG RENDER + SEARCH + FILTER + PAGINATION =====================
let currentPage = 1;
const postsPerPage = 2;
let selectedTag = "all"; // filter by tag chip

// ✅ Generate Framework options automatically from blogPosts
function generateFrameworkFilter(posts) {
  const frameworkFilter = document.getElementById("frameworkFilter");
  if (!frameworkFilter) return;

  // Get unique frameworks
  const frameworks = [...new Set(posts.map((p) => p.framework).filter(Boolean))].sort();

  // Render options
  frameworkFilter.innerHTML = `
    <option value="all">Tất cả Framework</option>
    ${frameworks.map((fw) => `<option value="${fw}">${fw}</option>`).join("")}
  `;
}

function getUniqueTags(posts) {
  const allTags = posts.flatMap((p) => p.tags);
  return ["all", ...new Set(allTags)];
}

function renderTagChips(posts) {
  const chipContainer = document.getElementById("tagChips");
  if (!chipContainer) return;

  const tags = getUniqueTags(posts);

  chipContainer.innerHTML = tags
    .map(
      (tag) => `
      <div class="chip ${tag === "all" ? "active" : ""}" data-tag="${tag}">
        ${tag === "all" ? "Tất cả" : "#" + tag}
      </div>
    `
    )
    .join("");

  chipContainer.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      chipContainer.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      selectedTag = chip.dataset.tag;
      currentPage = 1;
      applyFiltersAndRender(posts);
    });
  });
}

function renderLatestPost(posts) {
  const latest = posts[0];
  const latestContainer = document.getElementById("latestPost");
  if (!latestContainer || !latest) return;

  latestContainer.innerHTML = `
    <div class="latest-card fade-up">
      <h3>${latest.title}</h3>
      <p>${latest.desc}</p>
      <p class="blog-tags">${latest.tags.map((t) => "#" + t).join(" ")}</p>
      <button class="btn btn-color-1 project-btn" onclick="location.href='${latest.url}'">
        Đọc bài
      </button>
    </div>
  `;
}

function renderBlogPage(posts, page) {
  const blogList = document.getElementById("blogList");
  if (!blogList) return;

  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const paginatedPosts = posts.slice(start, end);

  blogList.innerHTML = paginatedPosts
    .map(
      (post) => `
      <div class="details-container color-container blog-card fade-up">
        <img class="blog-img" src="${post.image}" alt="${post.title}" />
        <div class="blog-body">
          <div>
            <div class="blog-meta">
              <span>${post.date}</span>
              <span class="blog-framework">${post.framework}</span>
            </div>
            <h2 class="experience-sub-title project-title">${post.title}</h2>
            <p class="blog-desc">${post.desc}</p>
            <p class="blog-tags">${post.tags.map((t) => "#" + t).join(" ")}</p>
          </div>
          <div class="btn-container">
            <button class="btn btn-color-2 project-btn" onclick="location.href='${post.url}'">
              Đọc bài
            </button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  // re-run animation after render
  revealOnScroll();
}

function setupPagination(posts) {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");
  if (!prevBtn || !nextBtn || !pageInfo) return;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  if (totalPages === 0) {
    pageInfo.textContent = "Không có bài viết phù hợp";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    prevBtn.style.opacity = "0.5";
    nextBtn.style.opacity = "0.5";
    return;
  }

  function updatePageInfo() {
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    prevBtn.style.opacity = currentPage === 1 ? "0.5" : "1";
    nextBtn.style.opacity = currentPage === totalPages ? "0.5" : "1";
  }

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderBlogPage(posts, currentPage);
      updatePageInfo();
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderBlogPage(posts, currentPage);
      updatePageInfo();
    }
  };

  updatePageInfo();
}

function applyFiltersAndRender(originalPosts) {
  const searchInput = document.getElementById("blogSearch");
  const frameworkFilter = document.getElementById("frameworkFilter");

  let posts = [...originalPosts];

  const query = searchInput?.value?.toLowerCase() || "";
  const fw = frameworkFilter?.value || "all";

  // Search filter
  if (query) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.tags.join(" ").toLowerCase().includes(query) ||
        (p.framework || "").toLowerCase().includes(query)
    );
  }

  // Framework filter
  if (fw !== "all") posts = posts.filter((p) => p.framework === fw);

  // Tag filter
  if (selectedTag !== "all") posts = posts.filter((p) => p.tags.includes(selectedTag));

  // sort newest
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // reset page nếu page vượt tổng số trang
  const totalPages = Math.ceil(posts.length / postsPerPage);
  if (currentPage > totalPages) currentPage = 1;

  renderBlogPage(posts, currentPage);
  setupPagination(posts);
}

document.addEventListener("DOMContentLoaded", () => {
  // copy buttons for blog pages (and any code blocks on site)
  addCopyButtons();

  // render blog section on index
  if (typeof blogPosts !== "undefined") {
    const sortedPosts = [...blogPosts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // ✅ generate framework filter automatically
    generateFrameworkFilter(sortedPosts);

    renderTagChips(sortedPosts);
    renderLatestPost(sortedPosts);
    renderBlogPage(sortedPosts, currentPage);
    setupPagination(sortedPosts);

    // Search + Filter listeners
    const searchInput = document.getElementById("blogSearch");
    const frameworkFilter = document.getElementById("frameworkFilter");

    if (searchInput)
      searchInput.addEventListener("input", () => {
        currentPage = 1;
        applyFiltersAndRender(sortedPosts);
      });

    if (frameworkFilter)
      frameworkFilter.addEventListener("change", () => {
        currentPage = 1;
        applyFiltersAndRender(sortedPosts);
      });

    // initial animation
    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll);
  }
});

// ===================== 3D TILT EFFECT FOR BLOG CARDS =====================
function enableTiltEffect() {
  const cards = document.querySelectorAll(".blog-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `translateY(-10px) scale(1.01) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  enableTiltEffect();
});

