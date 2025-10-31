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

  // 모든 게시물 통합 로드 함수
  async function loadAllPosts() {
    const allFetches = [];
    Object.values(categoryMap).forEach(subCategories => {
      subCategories.forEach(subCat => {
        allFetches.push(fetch(`/category/${subCat}/posts.json`).then(r => r.json()).catch(() => []));
      });
    });
    const allData = await Promise.all(allFetches);
    return allData.flat().filter(p => p.status === "public");
  }

  // 🟢 모든 데이터 한 번만 로드
  const allPosts = await loadAllPosts();

  // section 별 처리
  for (const section of sectionElements) {
    const list = section.querySelector(".z-section__list");
    if (!list) continue;

    const categoryKey = section.dataset.category || "latest";
    let limit = parseInt(section.dataset.limit);
    if (isNaN(limit)) limit = 6;

    let posts = [];

    // ✅ 검색 전용 분기
    if (categoryKey === "search") {
      const urlParams = new URLSearchParams(window.location.search);
      const query = (urlParams.get("q") || "").trim().toLowerCase();

      if (query.length === 0) {
        list.innerHTML = `<div class="z-card empty-message">
          <div class="z-card_wrapper">
            <div class="z-card__content">
              <div class="z-card_title">🔎 검색어를 입력해주세요.</div>
              <div class="z-card_summary">검색어가 비어 있습니다.</div>
            </div>
          </div>
        </div>`;
        continue;
      }

      posts = allPosts.filter(p =>
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(query))
      );

      if (posts.length === 0) {
        list.innerHTML = `<div class="z-card empty-message">
          <div class="z-card_wrapper">
            <div class="z-card__content">
              <div class="z-card_title">📭 검색 결과가 없습니다.</div>
              <div class="z-card_summary">"${query}"에 해당하는 게시물이 없습니다.</div>
            </div>
          </div>
        </div>`;
        continue;
      }

      posts.sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')));
    } else if (categoryKey === "latest") {
      // 최신: allPosts 전체 사용
      posts = [...allPosts];
    } else {
      // 상위/하위 카테고리 구분
      const topCategory = categoryKey.split("/")[0];
      const subCategories = categoryMap[topCategory] || [];

      if (subCategories.includes(categoryKey)) {
        posts = allPosts.filter(p => p.category.startsWith(categoryKey));
      } else {
        posts = allPosts.filter(p => subCategories.some(sc => p.category.startsWith(sc)));
      }
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

    // 게시물이 없는 경우 안내 (검색 이외)
    if (categoryKey !== "search" && pagePosts.length === 0) {
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
