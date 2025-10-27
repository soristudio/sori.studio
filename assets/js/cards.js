document.addEventListener("DOMContentLoaded", async () => {
  const sectionElements = document.querySelectorAll(".z-section");

  // 상위 카테고리별 하위 폴더 매핑
  const categoryMap = {
    creation: ["creation/original", "creation/boardgame"],
    keepsakes: ["keepsakes/archive", "keepsakes/gamelog", "keepsakes/goods", "keepsakes/pick"],
    log: ["log/journal", "log/news", "log/notice", "log/update"],
    mosaic: ["mosaic/moment", "mosaic/place", "mosaic/subculture", "mosaic/wishlist"],
    workspace: ["workspace/system", "workspace/tool", "workspace/web", "workspace/workflow"],
  };

  // section 별 처리
  for (const section of sectionElements) {
    const list = section.querySelector(".z-section__list");
    if (!list) continue;

    const categoryKey = section.dataset.category || "latest";
    let limit = parseInt(section.dataset.limit);
    if (isNaN(limit)) limit = 6;

    let posts = [];

    if (categoryKey === "latest") {
      // 최신: 모든 대분류 하위 폴더 합치기
      const allFetches = [];
      Object.values(categoryMap).forEach(subCategories => {
        subCategories.forEach(subCat => {
          allFetches.push(fetch(`/category/${subCat}/posts.json`).then(r => r.json()).catch(() => []));
        });
      });
      const allData = await Promise.all(allFetches);
      posts = allData.flat();
    } else {
      // 상위/하위 카테고리 구분
      const topCategory = categoryKey.split("/")[0];
      const subCategories = categoryMap[topCategory] || [];

      if (subCategories.includes(categoryKey)) {
        // 하위 카테고리 선택: 해당 JSON만 fetch
        try {
          posts = await fetch(`/category/${categoryKey}/posts.json`).then(r => r.json());
        } catch {
          posts = [];
        }
      } else {
        // 상위 카테고리 선택: 모든 하위 폴더 JSON 합치기
        const fetches = subCategories.map(subCat =>
          fetch(`/category/${subCat}/posts.json`).then(r => r.json()).catch(() => [])
        );
        const allData = await Promise.all(fetches);
        posts = allData.flat();
      }
    }

    // 공개 상태만 필터링
    posts = posts.filter(p => p.status === "public");

    // 하위카테고리 필터링 (정확한 카테고리 표시용)
    if (categoryKey !== "latest") {
      posts = posts.filter(p => p.category.startsWith(categoryKey));
    }

    // 최신순 정렬
    posts.sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')));

    // 페이지네이션
    let paginationEnabled = false;
    let sliceLimit = limit;
    if (limit === 0) {
      paginationEnabled = true;
      sliceLimit = 10;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get("page")) || 1;
    const start = (currentPage - 1) * sliceLimit;
    const end = start + sliceLimit;
    const pagePosts = posts.slice(start, end);

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
      const totalPages = Math.ceil(posts.length / sliceLimit);
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
  }
});
