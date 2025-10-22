const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync('../data/posts.json', 'utf8')); // 스크립트 기준 경로
const siteRoot = '../'; // HTML 파일들이 있는 루트 경로

// HTML 파일 경로 가져오기
function getHtmlFilePath(url) {
  return path.join(siteRoot, url);
}

// 메타 태그 생성
function generateMeta(post) {
  const thumbSrc = post.thumb && post.thumb.trim() !== "" ? post.thumb : "/assets/images/thumb_bg.png";

  return `
    <title>${post.title}</title>
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:image" content="https://sori.studio${thumbSrc}">
    <meta property="og:url" content="https://sori.studio${post.url}">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.excerpt}">
    <meta name="twitter:image" content="https://sori.studio${thumbSrc}">
  `;
}

// 기존 OG/Twitter 메타 제거
function removeOldMeta(html) {
  // <head> 안쪽 내용만 선택
  const headMatch = html.match(/<head[^>]*>[\s\S]*?<\/head>/i);
  if (!headMatch) return html;

  let headContent = headMatch[0];

  // 기존 OG/Twitter 메타와 <title> 제거
  headContent = headContent
    .replace(/<meta\s+property="og:[^"]*"\s+content="[^"]*"\s*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"\s+content="[^"]*"\s*\/?>/gi, '')
    .replace(/<title>.*<\/title>/gi, '');

  // 연속된 공백/줄바꿈 제거
  headContent = headContent.replace(/(\r?\n\s*)+/g, '\n');

  // 원본 html에 교체
  return html.replace(/<head[^>]*>[\s\S]*?<\/head>/i, headContent);
}


// 메타 갱신 적용
posts.forEach(post => {
  const filePath = getHtmlFilePath(post.url);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found for post: ${post.url}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  html = removeOldMeta(html);

  html = html.replace('</head>', generateMeta(post) + '\n</head>');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Meta tags updated: ${post.url}`);
});
