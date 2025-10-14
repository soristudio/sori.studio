// ===== Footer Component Loader =====
function loadFooter() {
  // console.log('푸터 컴포넌트 로드 시작');
  
  // 푸터 HTML을 직접 정의
  const footerHTML = `
<footer id="z-footer">
    <div class="z-footer__wrapper">
        <div class="z-footer__copyright">
            Powered by
            <a href="https://x.com/zenless_x" target="_blank" rel="noopener noreferrer"
                class="z-footer__powered-link">
                zenn
            </a>
        </div>
    </div>
</footer>`;
  
  // z-footer가 있는 경우에만 로드
  const placeholder = document.getElementById('z-footer');
  if (placeholder) {
    // console.log('푸터 placeholder 찾음, HTML 삽입 중...');
    placeholder.innerHTML = footerHTML;
    // console.log('푸터 HTML 삽입 완료');
    
    // 푸터가 제대로 로드되었는지 확인
    const testElement = document.getElementById('z-footer');
    // console.log('z-footer 확인:', testElement);
    
    return true; // 성공적으로 로드됨
  } else {
    console.error('z-footer를 찾을 수 없습니다');
    return false;
  }
}

// ===== Footer 초기화 함수 =====
function initializeFooter() {
  // console.log('푸터 초기화 시작');
  
  // 푸터 로드 (동기적)
  const success = loadFooter();
  if (success) {
    // console.log('푸터 로드 완료');
    return true;
  } else {
    console.error('푸터 로드 실패');
    return false;
  }
}
