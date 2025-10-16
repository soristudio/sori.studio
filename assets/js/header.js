// ===== Header Component Loader =====
function loadHeader() {
  // console.log('헤더 컴포넌트 로드 시작');

  // 헤더 HTML을 직접 정의
  const headerHTML = `
<header class="z-header">
    <div class="z-header__blog-title">
        <a href="/" title="sori.studio" class="z-header__blog-title-link"></a>
        sori.studio
    </div>
    <div class="z-header__contents">
        <!-- 모바일 메뉴 - 아이콘 -->
        <div class="z-header__navigation">
            <div id="menu-toggle" class="z-header__icon-wrapper">
                <div id="icon-open" class="icon visible">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect x="13.0909" y="13.0908" width="10.9091" height="10.9091" rx="5" fill="black">
                        </rect>
                        <rect width="10.9091" height="10.9091" rx="5" fill="black"></rect>
                        <circle cx="18.5455" cy="5.45455" r="5.45455" fill="#00C6C5"></circle>
                        <circle cx="5.45455" cy="18.5454" r="5.45455" fill="#00C6C5"></circle>
                    </svg>
                </div>
                <div id="icon-close" class="icon hidden">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect x="-7.62939e-06" y="22.5686" width="31.9169" height="1.99481" rx="0.997404"
                            transform="rotate(-45 -7.62939e-06 22.5686)" fill="#00C6C5"></rect>
                        <rect x="1.43133" y="0.020752" width="31.9169" height="1.99481" rx="0.997404"
                            transform="rotate(45 1.43133 0.020752)" fill="black"></rect>
                    </svg>
                </div>
            </div>
        </div>
        <!-- 모바일 사이드 메뉴 -->
        <div id="z-header__aside" class="z-header__aside">
        
            <!-- 검색 -->
       <div class="widget search text-center">
    <label for="search" class="screen_out">블로그 내 검색</label>
    <input id="search" class="search" placeholder="press enter to search…" type="text" name="search">
</div>
            <!-- 카테고리 목록 -->
            <nav class="">
                <ul class="z-header__category">
                    <li class=""><a href="/category" class="z-header__category-title"> 분류 전체보기 </a>
                        <ul class="z-header__category-list">
                            <li class=""><a href="/category/workspace" class="z-header__category-item"> workspace </a>
                                <ul class="z-header__sub-category-list">
                                    <li class=""><a href="/category/workspace/web" class="z-header__sub-category-item"> web
                                        </a></li>
                                    <li class=""><a href="/category/workspace/tools" class="z-header__sub-category-item">
                                            tools </a></li>
                                    <li class=""><a href="/category/workspace/system" class="z-header__sub-category-item">
                                            system </a></li>
                                    <li class=""><a href="/category/workspace/workflow" class="z-header__sub-category-item">
                                            workflow </a></li>
                                </ul>
                            </li>
                            <li class=""><a href="/category/creation" class="z-header__category-item"> creation </a>
                                <ul class="z-header__sub-category-list">
                                    <li class=""><a href="/category/creation/original" class="z-header__sub-category-item">
                                            original </a></li>
                                    <li class=""><a href="/category/creation/boardgames" class="z-header__sub-category-item">
                                            boardgames </a></li>
                                </ul>
                            </li>
                            <li class=""><a href="/category/keepsakes" class="z-header__category-item"> keepsakes </a>
                                <ul class="z-header__sub-category-list">
                                    <li class=""><a href="/category/keepsakes/clearlog" class="z-header__sub-category-item">
                                            clearlog </a></li>
                                    <li class=""><a href="/category/keepsakes/goods" class="z-header__sub-category-item">
                                            goods </a></li>
                                    <li class=""><a href="/category/keepsakes/pick" class="z-header__sub-category-item">
                                            pick </a></li>
                                    <li class=""><a href="/category/keepsakes/archive" class="z-header__sub-category-item">
                                            archive </a></li>
                                </ul>
                            </li>
                            <li class=""><a href="/category/mosaic" class="z-header__category-item"> mosaic </a>
                                <ul class="z-header__sub-category-list">
                                    <li class=""><a href="/category/mosaic/moment" class="z-header__sub-category-item">
                                            moment </a></li>
                                    <li class=""><a href="/category/mosaic/place" class="z-header__sub-category-item"> place
                                        </a></li>
                                    <li class=""><a href="/category/mosaic/subculture" class="z-header__sub-category-item">
                                            subculture </a></li>
                                    <li class=""><a href="/category/mosaic/wishlist" class="z-header__sub-category-item">
                                            wishlist </a></li>
                                </ul>
                            </li>
                            <li class=""><a href="/category/log" class="z-header__category-item"> log </a>
                                <ul class="z-header__sub-category-list">
                                    <li class=""><a href="/category/log/updates" class="z-header__sub-category-item"> updates
                                        </a></li>
                                    <li class=""><a href="/category/log/notice" class="z-header__sub-category-item"> notice
                                        </a></li>
                                    <li class=""><a href="/category/log/news" class="z-header__sub-category-item"> news </a>
                                    </li>
                                    <li class=""><a href="/category/log/journal" class="z-header__sub-category-item"> journal
                                        </a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
        <div id="z-header__aside-overlay" class="hidden"></div>
    </div>
</header>`;

  // z-header가 있는 경우에만 로드
  const placeholder = document.getElementById('z-header');
  if (placeholder) {
    // console.log('placeholder 찾음, HTML 삽입 중...');
    placeholder.innerHTML = headerHTML;
    // console.log('헤더 HTML 삽입 완료');

    // 헤더가 제대로 로드되었는지 확인
    const testElement = document.getElementById('z-header__aside-overlay');
    // console.log('z-header__aside-overlay 확인:', testElement);

    return true; // 성공적으로 로드됨
  } else {
    console.error('z-header를 찾을 수 없습니다');
    return false;
  }
}

// ===== ZM aside Toggle 초기화 함수 =====
function initializeToggleMenu() {
  // console.log('토글 메뉴 초기화 시작');

  const toggle = document.getElementById('menu-toggle');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');
  const aside = document.getElementById('z-header__aside');
  const overlay = document.getElementById('z-header__aside-overlay');
  const body = document.body;

  // console.log('찾은 요소들:', { toggle, iconOpen, iconClose, aside, overlay });

  if (toggle && iconOpen && iconClose && aside && overlay) {
    // console.log('토글 메뉴 이벤트 리스너 등록');
    const openMenu = () => {
      iconOpen.classList.add('hidden');
      iconOpen.classList.remove('visible');
      iconClose.classList.add('visible');
      iconClose.classList.remove('hidden');

      aside.classList.add('open');
      overlay.classList.remove('hidden');
      body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      iconOpen.classList.add('visible');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      iconClose.classList.remove('visible');

      aside.classList.remove('open');
      overlay.classList.add('hidden');
      body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const isMenuOpen = aside.classList.contains('open');
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // 오버레이 클릭 시 닫기
    overlay.addEventListener('click', closeMenu);
  } else {
    console.warn('토글 메뉴 요소들을 찾을 수 없습니다:', { toggle, iconOpen, iconClose, aside, overlay });
  }
}

// ===== Header 초기화 함수 =====
function initializeHeader() {
  // console.log('헤더 초기화 시작');

  // 헤더 로드 (이제 동기적)
  const success = loadHeader();
  if (success) {
    // console.log('헤더 로드 완료');
    // 토글 메뉴 초기화 (이제 동기적으로 실행)
    initializeToggleMenu();
    return true;
  } else {
    console.error('헤더 로드 실패, 토글 메뉴 초기화 건너뜀');
    return false;
  }
}

async function updateCategoryCounts() {
  const res = await fetch('/data/posts.json');
  const posts = await res.json();

  // 모든 li에 대해 반복
  document.querySelectorAll('.z-header__sub-category-item, .z-header__category-item').forEach(item => {
    const link = item.querySelector('a');
    if (!link) return;

    const href = link.getAttribute('href'); // /category/creation/original 같은 형식
    if (!href) return;

    // posts.json에서 해당 카테고리 시작하는 글만 카운트
    const count = posts.filter(p => p.status === 'public' && p.category.startsWith(href.replace('/category/', ''))).length;

    // 기존 텍스트에 게시물 수 추가
    link.textContent = `${link.textContent.trim()} (${count})`;
  });
}
