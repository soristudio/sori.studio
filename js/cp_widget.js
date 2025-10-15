document.addEventListener("DOMContentLoaded", () => {
  // 사이드 광고 HTML
  const sideAdsHTML = `
    <iframe class="cp_left"
      src="https://ads-partners.coupang.com/widgets.html?id=919455&template=carousel&trackingCode=AF6561083&subId=&width=160&height=600&tsource="
      width="160" height="600" frameborder="0" scrolling="no"
      referrerpolicy="unsafe-url" browsingtopics></iframe>
    <div class="cp_side_space"></div>
    <iframe class="cp_right"
      src="https://ads-partners.coupang.com/widgets.html?id=919565&template=carousel&trackingCode=AF6561083&subId=&width=160&height=600&tsource="
      width="160" height="600" frameborder="0" scrolling="no"
      referrerpolicy="unsafe-url" browsingtopics></iframe>
    <div class="cp_side"></div>
  `;

  // 상단 광고 HTML
  const topAdHTML = `
    <div class="cp_top">
      <iframe src="https://ads-partners.coupang.com/widgets.html?id=919568&template=carousel&trackingCode=AF6561083&subId=&width=1280&height=140&tsource="
        frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
    </div>
  `;

  // 하단 광고 HTML
  const bottomAdHTML = `
    <div class="cp_bottom">
      <iframe src="https://ads-partners.coupang.com/widgets.html?id=919569&template=carousel&trackingCode=AF6561083&subId=&width=1280&height=140&tsource="
        frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
    </div>
  `;

  // 1️⃣ z-article__section 아래에 사이드 광고 삽입
  document.querySelectorAll(".z-article__section").forEach(section => {
    // 이미 광고가 있으면 중복 방지
    if (!section.querySelector(".cp_left") && !section.querySelector(".cp_right")) {
      section.insertAdjacentHTML("afterbegin", sideAdsHTML);
    }
  });

  // 2️⃣ z-article__body 상단과 하단에 광고 삽입
  document.querySelectorAll(".z-article__body").forEach(body => {
    // 상단 광고 추가
    if (!body.querySelector(".cp_top")) {
      body.insertAdjacentHTML("afterbegin", topAdHTML);
    }

    // 하단 광고 추가
    if (!body.querySelector(".cp_bottom")) {
      body.insertAdjacentHTML("beforeend", bottomAdHTML);
    }
  });
});
