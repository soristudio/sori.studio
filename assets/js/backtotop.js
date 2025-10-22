document.addEventListener('DOMContentLoaded', function () {
  // ===== 1. backtotop 요소 생성 및 footer 위에 삽입 =====
  const footer = document.getElementById('z-footer');
  if (!footer) return;

  const backtotopHTML = `
    <div class="backtotop active-progress">
      <svg class="backtotop-progress" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"></path>
      </svg>
      <span class="progress-count">0%</span>
    </div>
  `;
  footer.insertAdjacentHTML('beforebegin', backtotopHTML);

  const backtotop = document.querySelector('.backtotop');
  const prgsPath = backtotop.querySelector('path');
  const progressCount = backtotop.querySelector('.progress-count');

  // ===== 2. path 초기화 =====
  const pathLength = prgsPath.getTotalLength();
  prgsPath.style.transition = 'none';
  prgsPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
  prgsPath.style.strokeDashoffset = pathLength;
  prgsPath.getBoundingClientRect();
  prgsPath.style.transition = 'stroke-dashoffset 0.01s linear';

  // ===== 3. 스크롤 이벤트 처리 =====
  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = (scrollTop / pageHeight) * 100;

    const prgs = pathLength - (scrollTop * pathLength) / pageHeight;
    prgsPath.style.strokeDashoffset = prgs;

    const textColor = percentage > 99 ? '#2b2b2e' : '#a5a5a5';
    progressCount.textContent = Math.round(percentage) + '%';
    progressCount.style.color = textColor;

    if (scrollTop > 50) {
      backtotop.classList.add('active-progress');
    } else {
      backtotop.classList.remove('active-progress');
    }
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress(); // 초기 상태 업데이트

  // ===== 4. 클릭 시 스크롤 탑 =====
  backtotop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
