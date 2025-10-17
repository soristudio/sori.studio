document.addEventListener("DOMContentLoaded", () => {
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

  const topAdHTML = `
    <div class="cp_top">
      <iframe src="https://ads-partners.coupang.com/widgets.html?id=919568&template=carousel&trackingCode=AF6561083&subId=&width=1280&height=140&tsource="
        frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
    </div>
  `;

  const bottomAdHTML = `
    <div class="cp_bottom">
      <iframe src="https://ads-partners.coupang.com/widgets.html?id=919569&template=carousel&trackingCode=AF6561083&subId=&width=1280&height=140&tsource="
        frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
    </div>
  `;

  document.querySelectorAll(".z-article__section").forEach(section => {
    if (!section.querySelector(".cp_left") && !section.querySelector(".cp_right")) {
      section.insertAdjacentHTML("afterbegin", sideAdsHTML);
    }
  });

  document.querySelectorAll(".z-article__body").forEach(body => {
    if (!body.querySelector(".cp_top")) {
      body.insertAdjacentHTML("afterbegin", topAdHTML);
    }

    if (!body.querySelector(".cp_bottom")) {
      body.insertAdjacentHTML("beforeend", bottomAdHTML);
    }
  });
});
