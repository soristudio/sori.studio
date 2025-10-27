document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/data/posts.json");
  const posts = await res.json();

  // 현재 페이지 쿼리
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;

  document.querySelectorAll(".z-section").forEach(section => {
    const list = section.querySelector(".z-section__list");
    if (!list) return;

    const categoryKey = section.dataset.category || "latest";
    let limit = parseInt(section.dataset.limit);
    if (isNaN(limit)) limit = 6;

    // 게시물 필터링
    let filtered;
    if (categoryKey === "latest") {
      filtered = posts.slice().filter(p => p.status === "public");
    } else {
      filtered = posts.filter(p => p.category.startsWith(categoryKey) && p.status === "public");
    }

    // 🔹 date 기준 정렬
    filtered.sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')));

    // 데이터 리미트가 0이면 페이지네이션 사용
    let paginationEnabled = false;
    let sliceLimit = limit;
    // console.log("Cards limit:", limit);
    if (limit === 0) {
      paginationEnabled = true;
      sliceLimit = 10;
    }

    // slice
    const start = (currentPage - 1) * sliceLimit;
    const end = start + sliceLimit;
    const pagePosts = filtered.slice(start, end);

    // 리스트 초기화
    list.innerHTML = "";

    pagePosts.forEach(post => {
      const thumbSrc = post.thumb && post.thumb.trim() !== "" ? post.thumb : "/assets/images/thumb_bg.png";

      const article = document.createElement("article");
      article.classList.add("z-card");
      article.innerHTML = `
        <div class="z-card_wrapper">
          <div class="z-card__thumb">
            <div class="z-card__thumb_wrapper">
              <div class="z-card__thumb_inset">
                <img loading="lazy" src="${thumbSrc}" class="z-card__thumb_image" role="presentation"
                  onerror="this.onerror=null;this.src='/assets/images/load_error.png';">
              </div>
            </div>
          </div>
          <a href="${post.url}" class="z-card_link"></a>
          <div class="z-card__content">
            <div class="z-card_info">
              <a href="/category/${post.category}" class="z-card__category">
                <div class="z-card__category-text">${post.category}</div>
              </a>
              <div class="z-card__meta-divider"></div>
              <div class="z-card__date">${post.date}</div>
            </div>
            <div class="z-card_title">${post.title}</div>
            ${post.excerpt ? `<div class="z-card_summary">${post.excerpt}</div>` : ""}
          </div>
        </div>
      `;
      list.appendChild(article);
    });

    // 게시물이 없는 경우 안내
    if (pagePosts.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className = "z-card empty-message";
      emptyMessage.innerHTML = `
      <div class="z-card_wrapper">
        <div class="z-card__content">
          <div class="z-card_title">📭 관련 글이 없습니다.</div>
          <div class="z-card_summary">해당 카테고리에 아직 게시물이 등록되지 않았습니다.</div>
        </div>
      </div>
    `;
      list.appendChild(emptyMessage);
    }

    // 페이지네이션
    if (paginationEnabled) {
      const totalPages = Math.ceil(filtered.length / sliceLimit);
      if (totalPages > 1) {
        const existingPagination = section.querySelector(".z-pagination");
        if (existingPagination) existingPagination.remove();

        const pagination = document.createElement("div");
        pagination.className = "z-pagination";

        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("a");
          btn.href = `${window.location.pathname}?page=${i}`;
          btn.textContent = i;
          if (i === currentPage) btn.classList.add("active");
          pagination.appendChild(btn);
        }

        section.appendChild(pagination);
      }
    }
  });
});
