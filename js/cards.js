document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("/data/posts.json");
    const posts = await res.json();

    // 현재 페이지 쿼리
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get("page")) || 1;

    // 모든 섹션 처리
    document.querySelectorAll(".z-section").forEach(section => {
        const list = section.querySelector(".z-section__list");
        if (!list) return;

        const categoryKey = section.dataset.category || "latest";
        const limit = parseInt(section.dataset.limit) || 6;

        // 게시물 필터링
        let filtered;
        if (categoryKey === "latest") {
            filtered = posts.slice(); // 모든 게시물
        } else {
            filtered = posts.filter(p => p.category.startsWith(categoryKey));
        }

        // 페이지 단위 slice
        const start = (currentPage - 1) * limit;
        const end = start + limit;
        const pagePosts = filtered.slice(start, end);

        // 리스트 초기화
        list.innerHTML = "";

        pagePosts.forEach(post => {
            const article = document.createElement("article");
            article.classList.add("z-card");
            article.innerHTML = `
        <div class="z-card_wrapper">
          <div class="z-card__thumb">
            <div class="z-card__thumb_wrapper">
              <div class="z-card__thumb_inset">
                <img loading="lazy" src="${post.thumb}" class="z-card__thumb_image" role="presentation">
              </div>
            </div>
          </div>
          <a href="${post.url}" class="z-card_link"></a>
          <div class="z-card__content">
            <div class="z-card_info">
              <a href="/category/${post.category}" class="z-card__category">
                <div class="z-card__category-text">${post.category.split("/").pop()}</div>
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

        // 페이지 네이션
        const totalPages = Math.ceil(filtered.length / limit);
        const existingPagination = section.querySelector(".z-pagination");
        if (existingPagination) existingPagination.remove();

        if (totalPages > 1) {
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
    });
});
