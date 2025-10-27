const fs = require('fs');
const path = require('path');

const indexPages = JSON.parse(fs.readFileSync('../data/index-pages.json', 'utf8'));
const siteRoot = '../'; // HTML 루트 경로

// 메타 태그 생성
function generateMeta(page) {
  const thumbSrc = page.thumb || '/assets/images/og-image.png';
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${page.title}</title>
    <meta name="description" content="${page.excerpt}">
    <meta name="robots" content="noindex, nofollow">

    <!-- Open Graph / SNS 미리보기 -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.excerpt}">
    <meta property="og:image" content="https://sori.studio${thumbSrc}">
    <meta property="og:url" content="https://sori.studio/${page.url}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.excerpt}">
    <meta name="twitter:image" content="https://sori.studio${thumbSrc}">

    <!-- Favicon -->
    <link rel="icon" href="/assets/images/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">

    <!-- Styles & Scripts -->
    <link rel="stylesheet" href="/assets/css/style.css">
    <script src="/assets/js/lib/highlight.min.js"></script>
    <link rel="stylesheet" href="/assets/css/lib/highlight.min.css">
    <script src="/assets/js/lib/lenis.min.js"></script>
  `;
}

// 기존 head 내용 제거 후 새 메타 삽입
function replaceHeadContent(html, newHeadContent) {
  return html.replace(/<head[^>]*>[\s\S]*?<\/head>/i, `<head>\n${newHeadContent.trim()}\n</head>`);
}

// 모든 index 페이지 처리
indexPages.forEach(page => {
  const filePath = path.join(siteRoot, page.url);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${page.url}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  html = replaceHeadContent(html, generateMeta(page));
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Index meta updated: ${page.url}`);
});
