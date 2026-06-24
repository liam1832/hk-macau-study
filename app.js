/* =========================================================
   港澳升学路径规划 · 交互脚本（无依赖）
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 案例数据（按本/硕/博三条主线） ---------- */
  const CASE_GROUPS = [
    [ // 本科线
      { tag: "澳门",        from: "专科在读 / 毕业",        to: "澳门城市大学 · 本科", note: "重构背景与经历，走澳门本科升学通道。" },
      { tag: "香港 · 前五", from: "高考特控线 · 英语 120",  to: "香港前五 · 本科",     note: "卡线分数，精准匹配专业与录取批次。" },
      { tag: "澳门",        from: "本科线下约 20 分",        to: "澳门城市大学 · 本科", note: "差一点的分数，也有正规本科可读。" },
      { tag: "澳门",        from: "本科线上",              to: "澳门科技大学 · 本科", note: "用高考成绩，直接走澳门本科。" },
      { tag: "专升本",      from: "专科学历",              to: "全日制 / 衔接本科",   note: "专科背景，重新拿一个本科学历。" }
    ],
    [ // 硕士线
      { tag: "香港 · 前五", from: "民办本科",              to: "香港前五 · 硕士",     note: "弱本科背景，选校与文书双线突围。" },
      { tag: "香港 · 岭南", from: "民办本科",              to: "香港岭南大学 · 硕士", note: "稳中求进，锁定匹配度更高的院校。" },
      { tag: "香港 · 前五", from: "双非 · 绩点 2.5",        to: "香港前五 · 硕士",     note: "低绩点，靠定位与背景重构翻盘。" },
      { tag: "香港 · 港八", from: "民办 / 二本（不看绩点）", to: "港八 · 硕士",         note: "不卡绩点，按背景匹配院校。" },
      { tag: "香港 · MBA",  from: "单证 / 民办 · 无语言",    to: "港前五 / 前三 · MBA", note: "材料不全、没语言，也能上 MBA。" },
      { tag: "澳门",        from: "单证本科",              to: "澳门科技大学 · 硕士", note: "材料不齐，也能走通的硕士路径。" },
      { tag: "澳门",        from: "单证 / 自考本科",        to: "澳门城市大学 · 硕士", note: "自考、单证背景的硕士通道。" },
      { tag: "专升硕",      from: "专科学历",              to: "港 / 澳 · 硕士",      note: "专科直接读硕士的路径设计。" }
    ],
    [ // 博士线
      { tag: "香港 · 前五", from: "单证本 · QS 1000+ · 普通硕士", to: "香港前五 · 博士", note: "三重短板，靠研究计划与套磁翻盘。" },
      { tag: "香港 · 岭南", from: "SPEED 学院背景",        to: "香港岭南大学 · 博士", note: "非传统背景的博士申请路径设计。" },
      { tag: "香港 · 前五", from: "本科直博",              to: "香港前五 · 博士",     note: "跳过硕士，本科直申博士。" },
      { tag: "香港 · 前五", from: "水硕 / 背景低",          to: "香港前五 · 博士",     note: "低含金量硕士，照样冲博士。" },
      { tag: "香港 · 港八", from: "不看硕士背景",          to: "港八 · 博士",         note: "不看硕士出身的博士录取。" },
      { tag: "澳门",        from: "不看背景",              to: "澳科大 / 澳城大 · 博士", note: "背景不设限的澳门博士。" }
    ],
    [ // 香港身份线
      { tag: "身份",        from: "理工 SPEED · 港大 SPACE · 高科院", to: "无条件录取 + 香港身份", note: "一边读书，一边规划香港身份。" },
      { tag: "身份",        from: "企业主 · 高净值 · 在职",  to: "硕士 / 博士 + 香港身份", note: "给自己或给孩子，一起规划身份。" },
      { tag: "香港 · 前三", from: "均分 70+ · 双一流",      to: "香港前三",            note: "高分高背景，冲刺港前三。" }
    ]
  ];

  const MINI_LINE =
    '<svg class="case-card__line" viewBox="0 0 120 34" aria-hidden="true">' +
      '<polyline class="ml" points="4,28 42,25 74,15 116,6" />' +
      '<circle class="ml-start" cx="4" cy="28" r="3.2" />' +
      '<circle class="ml-end" cx="116" cy="6" r="4.2" />' +
    '</svg>';

  function caseCard(c, i) {
    const el = document.createElement("article");
    el.className = "case-card reveal";
    el.style.setProperty("--d", i);
    el.innerHTML =
      '<span class="case-card__tag">' + c.tag + '</span>' +
      '<div class="case-card__row">' +
        '<span class="case-card__label">背景</span>' +
        '<span class="case-card__from">' + c.from + '</span>' +
      '</div>' +
      MINI_LINE +
      '<div class="case-card__row">' +
        '<span class="case-card__label">录取</span>' +
        '<span class="case-card__to">' + c.to + '</span>' +
      '</div>' +
      '<p class="case-card__note">' + c.note + '</p>';
    return el;
  }

  function injectCases() {
    const grids = document.querySelectorAll(".cases .case-grid");
    CASE_GROUPS.forEach(function (group, gi) {
      const grid = grids[gi];
      if (!grid) return;
      group.forEach(function (c, i) { grid.appendChild(caseCard(c, i)); });
    });
  }

  /* ---------- 真实 Offer 墙（按院校梯度分组） ---------- */
  // 编辑下面的分组即可增删 offer；图片放在 assets/offers/，缺图卡片会自动移除。
  // 注：offer-06 为中大（深圳）、offer-19 为城大（东莞），属内地校区，暂归入对应母校梯度。
  var OFFER_GROUPS = [
    { tier: "香港 · 港前三", note: "港大 / 中大 / 科大", items: [
      { f: "offer-17", s: "香港大学", l: "本科" },
      { f: "offer-20", s: "香港大学", l: "本科" },
      { f: "offer-13", s: "香港大学", l: "硕士" },
      { f: "offer-14", s: "香港大学", l: "硕士" },
      { f: "offer-23", s: "香港大学", l: "硕士" },
      { f: "offer-11", s: "香港中文大学", l: "硕士" },
      { f: "offer-12", s: "香港中文大学", l: "硕士" },
      { f: "offer-27", s: "香港中文大学", l: "硕士" },
      { f: "offer-06", s: "香港中文大学（深圳）", l: "硕士" },
      { f: "offer-18", s: "香港科技大学", l: "硕士" },
      { f: "offer-28", s: "香港科技大学", l: "硕士" }
    ]},
    { tier: "香港 · 港四五", note: "城大 / 理大", items: [
      { f: "offer-10", s: "香港理工大学", l: "博士" },
      { f: "offer-09", s: "香港城市大学", l: "MBA" },
      { f: "offer-21", s: "香港城市大学", l: "硕士" },
      { f: "offer-24", s: "香港城市大学", l: "EMBA" },
      { f: "offer-19", s: "香港城市大学（东莞）", l: "硕士" }
    ]},
    { tier: "香港 · 港六七八", note: "浸大 / 岭南 / 教大", items: [
      { f: "offer-04", s: "香港岭南大学", l: "博士" },
      { f: "offer-26", s: "香港岭南大学", l: "博士" },
      { f: "offer-29", s: "香港岭南大学", l: "硕士" },
      { f: "offer-05", s: "香港教育大学", l: "硕士" },
      { f: "offer-25", s: "香港教育大学", l: "硕士" }
    ]},
    { tier: "香港 · 其他港校", note: "进修 / 自资学院", items: [
      { f: "offer-03", s: "香港大学 SPACE", l: "深造文凭" },
      { f: "offer-08", s: "香港恒生大学", l: "硕士" }
    ]},
    { tier: "澳门", note: "澳科大 / 澳城大", items: [
      { f: "offer-07", s: "澳门科技大学", l: "博士" },
      { f: "offer-15", s: "澳门科技大学", l: "博士" },
      { f: "offer-02", s: "澳门城市大学", l: "硕士" },
      { f: "offer-16", s: "澳门城市大学", l: "硕士" },
      { f: "offer-22", s: "澳门城市大学", l: "硕士" }
    ]}
  ];

  function offerCardHTML(it) {
    var src = "assets/offers/" + it.f + ".jpg";
    return '<figure class="offer reveal">' +
      '<a class="offer__link" href="' + src + '" target="_blank" rel="noopener" aria-label="' + it.s + ' ' + it.l + ' 录取通知大图">' +
        '<img src="' + src + '" alt="' + it.s + ' · ' + it.l + ' 录取通知" loading="lazy" onerror="this.closest(\'.offer\').remove()" />' +
      '</a>' +
      '<figcaption class="offer__cap"><b>' + it.s + '</b> · ' + it.l + '</figcaption>' +
    '</figure>';
  }

  function injectOffers() {
    var wrap = document.getElementById("offerGrid");
    if (!wrap) return;
    var html = "";
    OFFER_GROUPS.forEach(function (g) {
      var cards = g.items.map(offerCardHTML).join("");
      html +=
        '<div class="offer-group">' +
          '<div class="offer-group__head">' +
            '<span class="case-group__line" aria-hidden="true"></span>' +
            '<h3 class="offer-group__title">' + g.tier + '<span>' + g.note + '</span></h3>' +
          '</div>' +
          '<div class="offer-grid">' + cards + '</div>' +
        '</div>';
    });
    wrap.innerHTML = html;
  }

  /* ---------- Hero 天际线（淡） ---------- */
  function buildSkyline() {
    const g = document.querySelector(".hero__skyline");
    if (!g) return;
    const heights = [70, 120, 56, 150, 90, 64, 180, 110, 74, 140, 96, 60, 130, 84, 168, 100, 58, 124];
    const W = 1440, base = 760, bw = W / heights.length;
    let html = "";
    heights.forEach(function (h, i) {
      const x = i * bw + bw * 0.18;
      html += '<rect x="' + x.toFixed(1) + '" y="' + (base - h) + '" width="' + (bw * 0.5).toFixed(1) + '" height="' + h + '" />';
    });
    g.innerHTML = html;
  }

  /* ---------- 导航：滚动态 + 移动菜单 ---------- */
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");

    const onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function closeMenu() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "打开菜单");
    }
    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "关闭菜单");
    }

    toggle.addEventListener("click", function () {
      if (menu.hidden) openMenu(); else closeMenu();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // 切回桌面宽度时复位
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && !menu.hidden) closeMenu();
    });
  }

  /* ---------- 滚动渐显 ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    // 应用 data-reveal-delay → --d
    items.forEach(function (el) {
      const d = el.getAttribute("data-reveal-delay");
      if (d) el.style.setProperty("--d", d);
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 复制微信号 ---------- */
  function initCopy() {
    const toast = document.getElementById("toast");
    let timer = null;

    function showToast(msg) {
      // toast 常驻 DOM（role=status 实时区），只变更文本即可被读屏可靠播报
      toast.textContent = msg;
      void toast.offsetWidth; // 强制回流以触发淡入过渡
      toast.classList.add("is-show");
      clearTimeout(timer);
      timer = setTimeout(function () {
        toast.classList.remove("is-show");
      }, 1900);
    }

    // 兜底：对不稳定的 live region，给触发按钮临时加无障碍标注
    function announce(btn, msg) {
      btn.setAttribute("aria-label", msg);
      setTimeout(function () { btn.removeAttribute("aria-label"); }, 2000);
    }

    function copy(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      // 回退方案
      return new Promise(function (resolve, reject) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); resolve(); }
        catch (err) { reject(err); }
        finally { document.body.removeChild(ta); }
      });
    }

    document.querySelectorAll("[data-wx]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const wx = btn.getAttribute("data-wx");
        copy(wx).then(function () {
          showToast("已复制微信号 " + wx);
          announce(btn, "已复制微信号 " + wx);
        }).catch(function () {
          showToast("微信号：" + wx);
          announce(btn, "微信号 " + wx);
        });
      });
    });
  }

  /* ---------- 启动 ---------- */
  function init() {
    injectCases();
    injectOffers();
    buildSkyline();
    initNav();
    initReveal();
    initCopy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
