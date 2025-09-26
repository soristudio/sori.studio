  document.addEventListener('DOMContentLoaded', function () {
  // ===== ZM aside Toggle =====
  const toggle = document.getElementById('menu-toggle');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');
const aside = document.getElementById('zm_aside');
const overlay = document.getElementById('aside-overlay');
const body = document.body;

if (toggle && iconOpen && iconClose && aside && overlay) {
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
}

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
  if (typeof useToc !== 'undefined' && useToc !== 'false') {
    let selector = 'h2';
    if (tocDepth === 'depth-limit-2') selector += ', h3';
    else if (tocDepth === 'depth-limit-3') selector += ', h3, h4';

    const container = document.querySelector('.z_article_view');
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
          const header = document.querySelector('.z_header');
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
});