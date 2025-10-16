document.addEventListener('DOMContentLoaded', loadPrevNext);

async function loadPrevNext() {
  const res = await fetch('/data/posts.json');
  const posts = await res.json();

  const currentPath = window.location.pathname;
  const currentPost = posts.find(post => post.url === currentPath);
  if (!currentPost) return;

  const filteredPosts = posts
    .filter(post => post.category.startsWith(currentPost.category) && post.status === "public")
    .sort((a, b) => a.id - b.id);

  const prev = filteredPosts
    .filter(post => post.id < currentPost.id)
    .sort((a, b) => b.id - a.id)[0] || null;

  const next = filteredPosts
    .filter(post => post.id > currentPost.id)
    .sort((a, b) => a.id - b.id)[0] || null;

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
