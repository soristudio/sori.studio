document.addEventListener('DOMContentLoaded', function () {
  // console.log('DOM 로드 완료');

  // 헤더 초기화 (header.js에서 제공)
  if (typeof initializeHeader === 'function') {
    const headerSuccess = initializeHeader();
    if (headerSuccess) {
      // console.log('헤더 초기화 완료');
      // 헤더가 삽입된 후 검색 이벤트 연결
      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            const query = encodeURIComponent(searchInput.value.trim());
            if (query) {
              window.location.href = `/search.html?q=${query}`;
              searchInput.value = '';
            }
          }
        });
      }
      updateCategoryCounts();
    } else {
      // console.error('헤더 초기화 실패');
    }
  } else {
    console.error('initializeHeader 함수를 찾을 수 없습니다. header.js가 로드되었는지 확인하세요.');
  }

  // 푸터 초기화 (footer.js에서 제공)
  if (typeof initializeFooter === 'function') {
    const footerSuccess = initializeFooter();
    if (footerSuccess) {
      // console.log('푸터 초기화 완료');
    } else {
      // console.error('푸터 초기화 실패');
    }
  } else {
    console.error('initializeFooter 함수를 찾을 수 없습니다. footer.js가 로드되었는지 확인하세요.');
  }

  // 기존 스크립트 실행
  initializeScripts();
});

function initializeScripts() {

  // ===== Masonry Grid =====
  const grids = document.querySelectorAll('.zc1_list');
  const masonryInstances = [];

  if (typeof imagesLoaded !== 'undefined' && typeof Masonry !== 'undefined') {
    grids.forEach(grid => {
      imagesLoaded(grid, function () {
        const msnry = new Masonry(grid, {
          itemSelector: '.zc1_item',
          columnWidth: '.zc1_item',
          percentPosition: true,
          gutter: 16,
        });
        masonryInstances.push(msnry);
      });
    });

    window.addEventListener('resize', () => {
      masonryInstances.forEach(msnry => msnry.layout());
    });
  }

  // ===== Table of Contents (TOC) =====

  const useToc = 'true';
  const tocDepth = 'depth-limit-3';
  const tocPosition = 'position_before_heading';
  const tocCounter = 'counter_decimal';
  let isCollapsed = 'toc-opend';

  if (typeof useToc !== 'undefined' && useToc !== 'false') {
    let selector = 'h2';
    if (tocDepth === 'depth-limit-2') selector += ', h3';
    else if (tocDepth === 'depth-limit-3') selector += ', h3, h4';

    const container = document.querySelector('.z-article__body');
    if (container) {
      const headings = container.querySelectorAll(selector);
      const tocContainer = document.createElement('div');
      tocContainer.id = 'toc';

      const tocHeader = document.createElement('div');
      tocHeader.classList.add('toc__header');

      const tocTitle = document.createElement('div');
      tocTitle.classList.add('toc__title');
      tocTitle.textContent = '목차';

      const tocToggle = document.createElement('div');
      tocToggle.classList.add('toc__toggle');

      const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgIcon.setAttribute('width', '25');
      svgIcon.setAttribute('height', '25');
      svgIcon.setAttribute('viewBox', '0 0 25 25');
      svgIcon.setAttribute('fill', 'none');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M19.8868 9.05811L12.8868 16.0581L5.88684 9.05811');
      path.setAttribute('stroke', 'black');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');

      svgIcon.appendChild(path);
      tocToggle.appendChild(svgIcon);

      let collapsed = isCollapsed === 'toc-collapsed';
      function updateToggleIcon() {
        svgIcon.style.transform = collapsed ? 'rotate(0deg)' : 'rotate(180deg)';
      }
      updateToggleIcon();

      tocToggle.addEventListener('click', () => {
        collapsed = !collapsed;
        tocContainer.classList.toggle('toc__collapsed');
        updateToggleIcon();
      });

      tocHeader.appendChild(tocTitle);
      tocHeader.appendChild(tocToggle);
      tocContainer.appendChild(tocHeader);

      if (collapsed) tocContainer.classList.add('toc__collapsed');

      if (tocPosition === 'position_top') {
        container.insertBefore(tocContainer, container.firstChild);
      } else {
        const firstHeading = container.querySelector(selector);
        if (firstHeading) {
          firstHeading.parentNode.insertBefore(tocContainer, firstHeading);
        }
      }

      let counterLevels = [0, 0, 0];
      headings.forEach(function (heading) {
        const level = parseInt(heading.tagName.charAt(1)) - 2;
        for (let i = level + 1; i < counterLevels.length; i++) counterLevels[i] = 0;
        counterLevels[level]++;
        let counterText = '';
        if (tocCounter === 'counter_decimal') {
          for (let i = 0; i <= level; i++) {
            if (counterLevels[i]) counterText += counterLevels[i] + '.';
          }
        }

        const listItem = document.createElement('div');
        listItem.classList.add('toc__item', `toc__level-${level + 2}`);

        if (tocCounter === 'counter_decimal') {
          const counterSpan = document.createElement('span');
          counterSpan.classList.add('toc__counter');
          counterSpan.textContent = counterText;
          listItem.appendChild(counterSpan);
        }

        const titleSpan = document.createElement('span');
        titleSpan.textContent = heading.textContent;
        listItem.appendChild(titleSpan);

        listItem.addEventListener('click', function () {
          const header = document.querySelector('.z-header');
          const offsetTop = heading.offsetTop - (header.offsetHeight + 10);
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });

        tocContainer.appendChild(listItem);
      });
    }
  }

  // hightlight.js
  hljs.highlightAll();

  // lenis.js
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}