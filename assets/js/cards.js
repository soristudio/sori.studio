document.addEventListener("DOMContentLoaded", async () => {
  const sectionElements = document.querySelectorAll(".z-section");

  // 대분류별 JSON 매핑
  const categoryMap = {
    mosaic: "/data/posts-mosaic.json",
    creation: "/data/posts-creation.json",
    keepsakes: "/data/posts-keepsakes.json",
    log: "/data/posts-log.json",
    workspace: "/data/posts-workspace.json"
  };

  // section 별로 처리
  for (const section of sectionElements) {
    const list = section.querySelector(".z-section__list");
    if (!list) continue;

    const categoryKey = section.dataset.category || "latest";
    let limit = parseInt(section.dataset.limit);
    if (isNaN(limit)) limit = 6;

    let posts = [];

    if (categoryKey === "latest") {
      // 최신은 모든 대분류 JSON을 합쳐서
      const fetches = Object.values(categoryMap).map(f => fetch(f).then(r => r.json()));
      const allData = await Promise.all(fetches);
      posts = allData.flat();
    } else {
      // 특정 카테고리일 경우 상위 카테고리 추출
      const topCategory = categoryKey.split("/")[0];
      console.log(topCategory)
      const dataFile = categoryMap[topCategory];
      if (dataFile) {
        posts = await fetch(dataFile).then(r => r.json());
      }
    }

    // 공개 상태만 필터링
    posts = posts.filter(p => p.status === "public");

    // 하위카테고리 필터링
    if (categoryKey !== "latest") {
      posts = posts.filter(p => p.category.startsWith(categoryKey));
    }

    // 🔹 date 기준 정렬 (최신순)
    posts.sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')));

    // 페이지네이션 처리
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
