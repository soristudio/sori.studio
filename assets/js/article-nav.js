document.addEventListener('DOMContentLoaded', loadPrevNext);

async function loadPrevNext() {
  const currentPath = window.location.pathname;
  const categoryParts = currentPath.split('/').filter(Boolean); // ['category','workspace','web','index.html']
  const topCategory = categoryParts[1]; // workspace
  const subCategory = categoryParts.length > 3 ? categoryParts[2] : null; // web (없으면 null)

  let posts = [];

  if (subCategory) {
    // 하위 폴더 글 → 해당 폴더 posts.json만 가져오기
    const res = await fetch(`/category/${topCategory}/${subCategory}/posts.json`);
    posts = await res.json();
  } else {
    // 상위 폴더 글 → 하위 모든 폴더 posts.json 합치기
    const subFolders = {
      creation: ["creation/original", "creation/boardgame"],
      keepsakes: ["keepsakes/archive", "keepsakes/gamelog", "keepsakes/goods", "keepsakes/pick"],
      log: ["log/journal", "log/news", "log/notice", "log/update"],
      mosaic: ["mosaic/moment", "mosaic/place", "mosaic/subculture", "mosaic/wishlist"],
      workspace: ["workspace/system", "workspace/tool", "workspace/web", "workspace/workflow"]
    };

    const folderList = subFolders[topCategory] || [];
    const fetches = folderList.map(f => fetch(`/category/${f}/posts.json`).then(r => r.json()));
    const allData = await Promise.all(fetches);
    posts = allData.flat();
  }

  const currentPost = posts.find(post => post.url === currentPath);
  if (!currentPost) return;

  const filteredPosts = posts
    .filter(post => post.category.startsWith(currentPost.category) && post.status === "public")
    .sort((a, b) => a.id - b.id);

  const prev = filteredPosts.filter(post => post.id < currentPost.id).sort((a, b) => b.id - a.id)[0] || null;
  const next = filteredPosts.filter(post => post.id > currentPost.id).sort((a, b) => a.id - b.id)[0] || null;

  const container = document.querySelector('.z-article__prenext-list');
  if (!container) return;

  function createPrenext(post, empty = false) {
    const thumbSrc = post.thumb && post.thumb.trim() !== "" ? post.thumb : "/assets/images/thumb_bg.png";

    return `
      <div class="z-prenext ${empty ? 'empty' : ''}">
        ${!empty ? `
        <div class="z-prenext__inner">
          <div class="z-prenext__thumb">
            <div class="z-prenext__thumb-wrapper">
              <div class="z-prenext__thumb-inset">
                  <img loading="lazy" src="${thumbSrc}"
                  onerror="this.onerror=null;this.src='/assets/images/load_error.png';"
                  class="z-prenext__image" alt="">
              </div>
            </div>
          </div>
          <a href="${post.url}" class="z-prenext__link"></a>
          <div class="z-prenext__content">
            <div class="z-prenext__meta">
              <a href="/category/${post.category}" class="z-prenext__category">
                <div class="z-prenext__category-text">${post.category}</div>
              </a>
              <div class="z-prenext__meta-divider"></div>
              <div class="date">${post.date}</div>
            </div>
            <div class="z-prenext__title">${post.title}</div>
          </div>
        </div>` : ''}
      </div>`;
  }

  container.innerHTML = `
    ${prev ? createPrenext(prev) : createPrenext({}, true)}
    ${next ? createPrenext(next) : createPrenext({}, true)}
  `;
}
