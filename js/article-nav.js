// 전체 게시물 인덱스 기준
// async function loadPrevNext() {
//     const res = await fetch('/data/posts.json');
//     const posts = await res.json();

//     const currentPath = window.location.pathname;
//     const currentIndex = posts.findIndex(post => post.url === currentPath);
//     if (currentIndex === -1) return;

//     const prev = posts[currentIndex - 1];
//     const next = posts[currentIndex + 1];

//     const container = document.querySelector('.z-article__prenext-list');
//     if (!container) return;

//     let html = '';

//     function createPrenext(post) {
//         return `
//         <div class="z-prenext">
//             <div class="z-prenext__inner">
//                 <div class="z-prenext__thumb">
//                     <div class="z-prenext__thumb-wrapper">
//                         <div class="z-prenext__thumb-inset">
//                             <img loading="lazy" src="${post.thumb}" class="z-prenext__image" alt="">
//                         </div>
//                     </div>
//                 </div>
//                 <a href="${post.url}" class="z-prenext__link"></a>
//                 <div class="z-prenext__content">
//                     <div class="z-prenext__meta">
//                         <a href="/category/${post.category}" class="z-prenext__category">
//                             <div class="z-prenext__category-text">${post.category}</div>
//                         </a>
//                         <div class="z-prenext__meta-divider"></div>
//                         <div class="date">${post.date}</div>
//                     </div>
//                     <div class="z-prenext__title">${post.title}</div>
//                 </div>
//             </div>
//         </div>`;
//     }

//     if (prev) html += createPrenext(prev);
//     if (next) html += createPrenext(next);

//     container.innerHTML = html;
// }

document.addEventListener('DOMContentLoaded', loadPrevNext);



// 카테고리별 이전/다음 글 로드
async function loadPrevNext() {
    const res = await fetch('/data/posts.json');
    const posts = await res.json();

    const currentPath = window.location.pathname;
    const currentPost = posts.find(post => post.url === currentPath);
    if (!currentPost) return;

    // 같은 카테고리(하위 포함) 게시물만 필터
    const filteredPosts = posts.filter(post =>
        post.category.startsWith(currentPost.category)
    );

    const currentIndex = filteredPosts.findIndex(post => post.url === currentPath);
    if (currentIndex === -1) return;

    const prev = filteredPosts[currentIndex - 1];
    const next = filteredPosts[currentIndex + 1];

    const container = document.querySelector('.z-article__prenext-list');
    if (!container) return;

    function createPrenext(post) {
        return `
        <div class="z-prenext">
            <div class="z-prenext__inner">
                <div class="z-prenext__thumb">
                    <div class="z-prenext__thumb-wrapper">
                        <div class="z-prenext__thumb-inset">
                            <img loading="lazy" src="${post.thumb}" class="z-prenext__image" alt="">
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
            </div>
        </div>`;
    }

    let html = '';
    if (prev) html += createPrenext(prev);
    if (next) html += createPrenext(next);

    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadPrevNext);
