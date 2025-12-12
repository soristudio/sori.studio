const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync('../data/posts.json', 'utf8'));
const siteRoot = '../';

// HTML 파일 경로
function getHtmlFilePath(url) {
  return path.join(siteRoot, url);
}

// 새 메타 생성
function generateMeta(post) {
  const thumbSrc = post.thumb && post.thumb.trim() !== "" ? post.thumb : "/assets/images/thumb_bg.png";
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${post.title}</title>
    <meta name="description" content="${post.excerpt}">

    <!-- Open Graph / SNS 미리보기 -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:image" content="https://sori.studio${thumbSrc}">
    <meta property="og:url" content="https://sori.studio${post.url}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.excerpt}">
    <meta name="twitter:image" content="https://sori.studio${thumbSrc}">

    <!-- Favicon -->
    <link rel="icon" href="/assets/images/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">

    <!-- Adsense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4516420168710424" crossorigin="anonymous"></script>

    <!-- Styles & Scripts -->
    <link rel="stylesheet" href="/assets/css/style.css">
    <script src="/assets/js/lib/highlight.min.js"></script>
    <link rel="stylesheet" href="/assets/css/lib/highlight.min.css">
    <script src="/assets/js/lib/lenis.min.js"></script>
  `;
}

// <head> 내부 전체 교체
function replaceHeadContent(html, newHeadContent) {
  return html.replace(
    /<head[^>]*>[\s\S]*?<\/head>/i,
    `<head>\n${newHeadContent.trim()}\n</head>`
  );
}

// 실행
posts.forEach(post => {
  const filePath = getHtmlFilePath(post.url);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found for post: ${post.url}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const newMeta = generateMeta(post);
  html = replaceHeadContent(html, newMeta);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Meta updated: ${post.url}`);
});
