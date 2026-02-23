/* Vardanyan & Co. Textiles — clean-room Silusi-style interactions */

const $ = (sel, root=document) => root.querySelector(sel)
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)]

/** Intro animation: show overlay, then fly logo to top-left and fade overlay */
function runIntro(){
  const intro = $('#intro')
  if(!intro) return

  // Keep intro visible for a moment, then animate
  setTimeout(() => intro.classList.add('fly'), 450)
  setTimeout(() => intro.classList.add('done'), 1500)
  setTimeout(() => intro.remove(), 1900)
}
runIntro()

/** Header behavior: solid on scroll; hide logo when scrolling down */
const header = $('#header')
let lastY = window.scrollY
let ticking = false

function onScroll(){
  const y = window.scrollY
  header?.classList.toggle('solid', y > 10)

  // hide logo if scrolling down (and not at top)
  const goingDown = y > lastY + 2
  const goingUp = y < lastY - 2
  if (goingDown && y > 120) header?.classList.add('hide-logo')
  if (goingUp) header?.classList.remove('hide-logo')

  lastY = y
  ticking = false
}
window.addEventListener('scroll', () => {
  if(!ticking){
    window.requestAnimationFrame(onScroll)
    ticking = true
  }
}, { passive: true })

/** Menu overlay */
const burger = $('#burger')
const menu = $('#menu')
const menuClose = $('#menuClose')

function openMenu(){
  menu?.classList.add('open')
  burger?.classList.add('open')
  burger?.setAttribute('aria-expanded', 'true')
  menu?.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
  // stagger-like feel: add small delay per link using transition-delay
  $$('.menu-link').forEach((el, i) => { el.style.transitionDelay = (80 + i*70) + 'ms' })
}
function closeMenu(){
  menu?.classList.remove('open')
  burger?.classList.remove('open')
  burger?.setAttribute('aria-expanded', 'false')
  menu?.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
  $$('.menu-link').forEach((el) => { el.style.transitionDelay = '' })
}
burger?.addEventListener('click', () => (menu?.classList.contains('open') ? closeMenu() : openMenu()))
menuClose?.addEventListener('click', closeMenu)
menu?.addEventListener('click', (e) => {
  if(e.target === menu) closeMenu()
})
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && menu?.classList.contains('open')) closeMenu()
})

/** Smooth scroll from menu buttons */
$$('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-scroll')
    if(!target) return
    closeMenu()
    const el = document.querySelector(target)
    if(!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

/** Simple reveal-on-scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show')
      io.unobserve(entry.target)
    }
  })
}, { threshold: 0.12 })

$$('.reveal').forEach(el => io.observe(el))

/** Parallax (lightweight) */
const parallax = $('.parallax-media')
function parallaxTick(){
  if(!parallax) return
  const y = window.scrollY
  // subtle parallax only
  parallax.style.transform = `translateY(${Math.min(0, -140 + y * 0.08)}px)`
}
window.addEventListener('scroll', () => window.requestAnimationFrame(parallaxTick), { passive:true })
parallaxTick()

/** i18n (EN default) */
const dict = {
  EN: {
    heroKicker: "TEXTILE MANUFACTURE • PRIVATE LABEL",
    heroTitle: "We manufacture textiles for brands that don’t shout.",
    heroSub: "Private label production. Controlled volumes. Consistent quality.",
    ctaPrimary: "Request a quote",
    ctaSecondary: "Explore",
    aboutKicker: "ABOUT",
    aboutTitle: "A partner for high‑quality textile production.",
    aboutText: "We combine craftsmanship with modern equipment to deliver stable quality, clean finishing, and reliable timelines.",
    aboutMeta: "Design • Cutting • Sewing • Finishing • Packaging",
    
    galleryKicker: "FACTORY",
    galleryTitle: "Inside our production.",
    galleryText: "A controlled process, consistent teams, and real output — photographed on the floor.",
card1Title: "Quality",
    card1Text: "Consistent standards, inspection at every stage.",
    card2Title: "Reliability",
    card2Text: "Clear process, predictable delivery, honest communication.",
    card3Title: "Know‑how",
    card3Text: "We optimize materials and construction for your target market.",
    parallaxTitle: "Modern technology. Elegant textiles. Minimal waste.",
    parallaxText: "Replace this with your real story — and we’ll tune the motion, spacing, and typography until it’s pixel‑perfect.",
    parallaxCta: "See materials",
    qualityKicker: "QUALITY",
    qualityTitle: "Certified thinking — measurable quality.",
    qualityText: "Add your certificates and compliance badges here. We’ll style them like Silusi’s list section.",
    li1: "Quality management system",
    li2: "Textile safety for products",
    li3: "Chemical compliance",
    contactKicker: "CONTACT",
    contactTitle: "Tell us what you’re producing.",
    contactText: "This is a placeholder. Later we can wire a real form (Formspree/Getform) or your own backend.",
    contactCta: "Email us",
    footerAddr: "Armenia • Premium textiles",
    footerNote: "Replace all text and contacts later.",
    menuTitle: "Navigation",
    navAbout: "About",
    navMaterials: "Materials",
    navWork: "Work",
    navMarkets: "Markets",
    navQuality: "Quality",
    navContact: "Contact",
    menuSmall: "Luxury textiles, crafted with precision. Replace these sections later with your real content.",
    
materialsKicker: "MATERIALS",
materialsTitle: "Fabrics selected for repeatability.",
materialsText: "Cotton, blends, knits, and custom sourcing — chosen for stable color, feel, and performance across runs.",
materialsMeta: "Cotton • Blends • Knits • Custom sourcing",
mat1Title: "Sampling",
mat1Text: "Swatches, lab dips, and approvals before bulk.",
mat2Title: "Consistency",
mat2Text: "Same hand-feel and shade across repeated orders.",
mat3Title: "Finishing",
mat3Text: "Clean finishing options tailored to your market.",
marketsKicker: "MARKETS",
marketsTitle: "Built for brands, not the mass market.",
marketsText: "We support private labels and studios that value calm design, measured production, and reliable repeats.",
marketsMeta: "Private labels • Boutique brands • Interior studios",
mk1Title: "Private label",
mk1Text: "Your label, your specs — we deliver the execution.",
mk2Title: "Boutique brands",
mk2Text: "Controlled volumes with premium finishing.",
mk3Title: "Studios",
mk3Text: "Textiles for interiors, uniforms, and custom runs.",
trustKicker: "TRUST",
trustTitle: "Built for repeat business.",
trustText: "Private labels. Boutique brands. Interior studios.",
copyright: "© 2026 Vardanyan & Co. Textiles. All rights reserved."
  },
  HY: {
    heroKicker: "ՏԵՔՍՏԻԼ • PRIVATE LABEL ԱՐՏԱԴՐՈՒԹՅՈՒՆ",
    heroTitle: "Մենք արտադրում ենք տեքստիլ՝ բրենդների համար, որոնք չեն գոռում։",
    heroSub: "Private label արտադրություն։ Կառավարվող ծավալներ։ Կայուն որակ։",
    ctaPrimary: "Պատվիրել հաշվարկ",
    ctaSecondary: "Դիտել",
    aboutKicker: "ՄԵՐ ՄԱՍԻՆ",
    aboutTitle: "Գործընկեր՝ բարձրորակ տեքստիլի արտադրության համար։",
    aboutText: "Կոմբինացնում ենք ձեռքի վարպետությունն ու ժամանակակից սարքավորումները՝ կայուն որակի և վստահելի ժամկետների համար։",
    aboutMeta: "Դիզայն • Կտրվածք • Կարում • Մշակում • Փաթեթավորում",
    
    galleryKicker: "ԱՐՏԱԴՐՈՒԹՅՈՒՆ",
    galleryTitle: "Մեր արտադրության ներսում։",
    galleryText: "Կարգավորված գործընթաց, կայուն թիմ և իրական արդյունք՝ նկարահանված արտադրամասում։",
card1Title: "Որակ",
    card1Text: "Վերահսկում՝ յուրաքանչյուր փուլում։",
    card2Title: "Վստահելիություն",
    card2Text: "Հստակ գործընթաց և ազնիվ հաղորդակցություն։",
    card3Title: "Փորձ",
    card3Text: "Օպտիմալ լուծումներ՝ շուկայի պահանջներին համապատասխան։",
    parallaxTitle: "Ժամանակակից տեխնոլոգիա։ Էլեգանտ տեքստիլ։ Քիչ թափոն։",
    parallaxText: "Սա տեղապահ տեքստ է։ Հետո կփոխենք քոնով ու կհղկենք մինչև 1:1։",
    parallaxCta: "Տեսնել նյութերը",
    qualityKicker: "ՈՐԱԿ",
    qualityTitle: "Սերտիֆիկացված մտածելակերպ՝ չափելի արդյունք։",
    qualityText: "Ավելացրու սերտիֆիկատները այստեղ։ Մենք կստիլավորենք պրոֆեսիոնալ։",
    li1: "Որակի կառավարման համակարգ",
    li2: "Տեքստիլի անվտանգություն",
    li3: "Քիմիական համապատասխանություն",
    contactKicker: "ԿԱՊ",
    contactTitle: "Ասա՝ ինչ ես արտադրում։",
    contactText: "Տեղապահ բլոկ։ Հետո կկապենք իրական ֆորմայի հետ։",
    contactCta: "Գրել նամակ",
    footerAddr: "Հայաստան • Պրեմիում տեքստիլ",
    footerNote: "Հետո կփոխենք բոլոր տեքստերը։",
    menuTitle: "Մենյու",
    navAbout: "Մեր մասին",
    navMaterials: "Նյութեր",
    navWork: "Արտադրություն",
    navMarkets: "Շուկաներ",
    navQuality: "Որակ",
    navContact: "Կապ",
    menuSmall: "Պրեմիում տեքստիլ՝ ճշգրտությամբ։ Հետո կփոխենք իրական կոնտենտով։",
    
materialsKicker: "ՆՅՈՒԹԵՐ",
materialsTitle: "Գործվածք՝ ընտրված կրկնելիության համար։",
materialsText: "Բամբակ, խառնուրդներ, տրիկոտաժ և հատուկ մատակարարում՝ կայուն գույնի ու հպման համար՝ յուրաքանչյուր սերիայում։",
materialsMeta: "Բամբակ • Խառնուրդներ • Տրիկոտաժ • Հատուկ մատակարարում",
mat1Title: "Նմուշավորում",
mat1Text: "Սվոչեր, lab dip-եր և հաստատում՝ մինչև հիմնական քանակը։",
mat2Title: "Կայունություն",
mat2Text: "Նույն հպում և երանգ՝ կրկնվող պատվերներում։",
mat3Title: "Վերջնական մշակում",
mat3Text: "Մաքուր finishing՝ հարմարեցված քո շուկային։",
marketsKicker: "ՇՈՒԿԱՆԵՐ",
marketsTitle: "Բրենդների համար՝ ոչ թե զանգվածային շուկայի։",
marketsText: "Աջակցում ենք private label-ներին և ստուդիաներին, որոնք գնահատում են հանգիստ դիզայնն ու կանխատեսելի արտադրությունը։",
marketsMeta: "Private label • Բուտիկ բրենդներ • Ինտերիեր ստուդիաներ",
mk1Title: "Private label",
mk1Text: "Քո պիտակը, քո չափորոշիչը — մենք անում ենք իրականացումը։",
mk2Title: "Բուտիկ բրենդներ",
mk2Text: "Կառավարվող ծավալներ՝ պրեմիում մշակումով։",
mk3Title: "Ստուդիաներ",
mk3Text: "Տեքստիլ ինտերիերի, համազգեստների և հատուկ սերիաների համար։",
trustKicker: "ՎՍՏԱՀՈՒԹՅՈՒՆ",
trustTitle: "Կառուցված՝ երկար համագործակցության համար։",
trustText: "Private label-ներ։ Բուտիկ բրենդներ։ Ինտերիեր ստուդիաներ։",
copyright: "© 2026 Vardanyan & Co. Textiles. Բոլոր իրավունքները պաշտպանված են։"
  },
  RU: {
    heroKicker: "ТЕКСТИЛЬ • PRIVATE LABEL",
    heroTitle: "Мы производим текстиль для брендов, которые не кричат.",
    heroSub: "Private label производство. Контролируемые объёмы. Стабильное качество.",
    ctaPrimary: "Запросить расчёт",
    ctaSecondary: "Посмотреть",
    aboutKicker: "О НАС",
    aboutTitle: "Партнёр для качественного текстильного производства.",
    aboutText: "Сочетаем мастерство и современное оборудование, чтобы обеспечить стабильное качество и сроки.",
    aboutMeta: "Дизайн • Раскрой • Пошив • Отделка • Упаковка",
    
    galleryKicker: "ПРОИЗВОДСТВО",
    galleryTitle: "Внутри нашего производства.",
    galleryText: "Контролируемый процесс, стабильная команда и реальный результат — кадры прямо из цеха.",
card1Title: "Качество",
    card1Text: "Контроль на каждом этапе.",
    card2Title: "Надёжность",
    card2Text: "Прозрачный процесс и честная коммуникация.",
    card3Title: "Опыт",
    card3Text: "Оптимизация материалов под ваш рынок.",
    parallaxTitle: "Современные технологии. Элегантный текстиль. Меньше отходов.",
    parallaxText: "Замените текст на ваш — мы доведём до пиксель‑в‑пиксель.",
    parallaxCta: "Материалы",
    qualityKicker: "КАЧЕСТВО",
    qualityTitle: "Сертифицированный подход — измеримое качество.",
    qualityText: "Добавьте ваши сертификаты — мы оформим в стиле.",
    li1: "Система менеджмента качества",
    li2: "Безопасность текстиля",
    li3: "Химическое соответствие",
    contactKicker: "КОНТАКТЫ",
    contactTitle: "Расскажите, что вы производите.",
    contactText: "Это заглушка. Позже подключим форму или бекенд.",
    contactCta: "Написать",
    footerAddr: "Армения • Премиальный текстиль",
    footerNote: "Позже заменим все тексты.",
    menuTitle: "Навигация",
    navAbout: "О нас",
    navMaterials: "Материалы",
    navWork: "Производство",
    navMarkets: "Рынки",
    navQuality: "Качество",
    navContact: "Контакты",
    menuSmall: "Премиальный текстиль с точностью. Позже заменим контент.",
    
materialsKicker: "МАТЕРИАЛЫ",
materialsTitle: "Ткани, выбранные ради повторяемости.",
materialsText: "Хлопок, смеси, трикотаж и индивидуальные поставки — стабильный цвет, тактильность и качество в каждом тираже.",
materialsMeta: "Хлопок • Смеси • Трикотаж • Индивидуальные поставки",
mat1Title: "Образцы",
mat1Text: "Свотчи, lab dip и согласования до запуска партии.",
mat2Title: "Стабильность",
mat2Text: "Одинаковая фактура и оттенок при повторных заказах.",
mat3Title: "Финиш",
mat3Text: "Чистая отделка под ваш рынок.",
marketsKicker: "РЫНКИ",
marketsTitle: "Для брендов, а не для масс-маркета.",
marketsText: "Мы работаем с private label и студиями, которым важны спокойный дизайн, точные объёмы и повторяемость.",
marketsMeta: "Private label • Бутик-бренды • Интерьерные студии",
mk1Title: "Private label",
mk1Text: "Ваш ярлык, ваши требования — мы обеспечиваем исполнение.",
mk2Title: "Бутик-бренды",
mk2Text: "Контролируемые объёмы и премиальная отделка.",
mk3Title: "Студии",
mk3Text: "Текстиль для интерьеров, униформы и специальных серий.",
trustKicker: "ДОВЕРИЕ",
trustTitle: "Сделано для долгого сотрудничества.",
trustText: "Private label. Бутик-бренды. Интерьерные студии.",
copyright: "© 2026 Vardanyan & Co. Textiles. Все права защищены."
  },
  IT: {
    heroKicker: "TESSILE • PRIVATE LABEL",
    heroTitle: "Produciamo tessuti per brand che non gridano.",
    heroSub: "Produzione private label. Volumi controllati. Qualità costante.",
    ctaPrimary: "Richiedi un preventivo",
    ctaSecondary: "Esplora",
    aboutKicker: "CHI SIAMO",
    aboutTitle: "Il tuo partner per una produzione tessile di alta qualità.",
    aboutText: "Uniamo artigianalità e tecnologia per garantire qualità stabile e consegne affidabili.",
    aboutMeta: "Design • Taglio • Cucito • Finitura • Packaging",
    
    galleryKicker: "PRODUZIONE",
    galleryTitle: "Dentro la nostra produzione.",
    galleryText: "Processo controllato, team stabile e risultati reali — scatti direttamente dal reparto.",
card1Title: "Qualità",
    card1Text: "Controllo e standard in ogni fase.",
    card2Title: "Affidabilità",
    card2Text: "Processo chiaro, consegne prevedibili.",
    card3Title: "Know‑how",
    card3Text: "Ottimizziamo materiali e costruzione per il tuo mercato.",
    parallaxTitle: "Tecnologie moderne. Tessuti eleganti. Meno sprechi.",
    parallaxText: "Sostituisci questo testo con la tua storia: lo rifiniremo fino al pixel‑perfect.",
    parallaxCta: "Materiali",
    qualityKicker: "QUALITÀ",
    qualityTitle: "Approccio certificato — qualità misurabile.",
    qualityText: "Aggiungi certificazioni e badge: li imposteremo nello stile.",
    li1: "Sistema di gestione qualità",
    li2: "Sicurezza tessile",
    li3: "Conformità chimica",
    contactKicker: "CONTATTI",
    contactTitle: "Raccontaci cosa produci.",
    contactText: "Segnaposto. Più avanti colleghiamo un form reale o backend.",
    contactCta: "Email",
    footerAddr: "Armenia • Tessile premium",
    footerNote: "Sostituire testi e contatti in seguito.",
    menuTitle: "Menu",
    navAbout: "Azienda",
    navMaterials: "Materiali",
    navWork: "Lavorazioni",
    navMarkets: "Mercati",
    navQuality: "Qualità",
    navContact: "Contatti",
    menuSmall: "Tessile premium con precisione. Sostituisci con contenuti reali.",
    
materialsKicker: "MATERIALI",
materialsTitle: "Tessuti scelti per la ripetibilità.",
materialsText: "Cotone, mischie, jersey e sourcing su misura — colore, mano e performance costanti in ogni lotto.",
materialsMeta: "Cotone • Mischie • Jersey • Sourcing su misura",
mat1Title: "Campionatura",
mat1Text: "Swatch, lab dip e approvazioni prima della produzione.",
mat2Title: "Costanza",
mat2Text: "Stessa mano e stessa tonalità negli ordini ripetuti.",
mat3Title: "Finiture",
mat3Text: "Finiture pulite, tarate sul tuo mercato.",
marketsKicker: "MERCATI",
marketsTitle: "Per i brand, non per il mass market.",
marketsText: "Supportiamo private label e studi che apprezzano design sobrio, volumi misurati e riordini affidabili.",
marketsMeta: "Private label • Brand boutique • Studi di interior",
mk1Title: "Private label",
mk1Text: "La tua etichetta, le tue specifiche — noi eseguiamo.",
mk2Title: "Brand boutique",
mk2Text: "Volumi controllati con finiture premium.",
mk3Title: "Studi",
mk3Text: "Tessili per interior, uniformi e produzioni speciali.",
trustKicker: "FIDUCIA",
trustTitle: "Pensato per lavorare a lungo.",
trustText: "Private label. Brand boutique. Studi di interior.",
copyright: "© 2026 Vardanyan & Co. Textiles. Tutti i diritti riservati."
  }
}

function setLang(lang){
  $$('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang))
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    const value = dict[lang]?.[key]
    if(typeof value === 'string') el.textContent = value
  })
  document.documentElement.lang = (lang === 'HY') ? 'hy' : (lang === 'RU') ? 'ru' : (lang === 'IT') ? 'it' : 'en'
}

$$('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang))
})
setLang('EN')


// Big hero banner animation (curtain reveal) – run once
window.addEventListener('load', () => {
  const hero = document.querySelector('.hero');
  if(!hero) return;
  setTimeout(() => hero.classList.add('run-hero-anim'), 120);
});


// Seamless-looking loop: crossfade two identical videos (hides the loop jump)
window.addEventListener('load', async () => {
  const a = document.getElementById('v1');
  const b = document.getElementById('v2');
  if(!a || !b) return;

  const FADE = 0.55;  // seconds
  const LEAD = 0.20;  // seconds (start back video a bit early)

  // prevent native loop jump
  a.loop = false;
  b.loop = false;

  const ready = (v) => new Promise(res => {
    if (v.readyState >= 1) return res();
    v.addEventListener('loadedmetadata', () => res(), { once:true });
  });

  await Promise.all([ready(a), ready(b)]);

  // show first
  a.classList.add('on');
  try { await a.play(); } catch(e){ /* autoplay might be blocked in some contexts */ }

  let front = a, back = b;
  let swapping = false;

  const prepBack = async () => {
    back.currentTime = 0;
    back.classList.add('on');
    try { await back.play(); } catch(e){}
  };

  const swap = () => {
    const old = front;
    front = back;
    back = old;
    swapping = false;

    // hide the old one and reset it (keeps it ready for next swap)
    back.classList.remove('on');
    back.pause();
    back.currentTime = 0;
  };

  const tick = async () => {
    if(front.duration && !swapping){
      const remaining = front.duration - front.currentTime;
      if(remaining <= (FADE + LEAD)){
        swapping = true;
        await prepBack();
        // finish swap after fade
        setTimeout(swap, Math.round(FADE * 1000));
      }
    }
    requestAnimationFrame(tick);
  };
  tick();
});




// luxCursor: subtle cursor glow + spotlight positions
(() => {
  const root = document.body;
  if(!root) return;

  let raf = 0;
  let x = window.innerWidth * 0.5;
  let y = window.innerHeight * 0.35;

  const apply = () => {
    raf = 0;
    root.style.setProperty('--cx', x + 'px');
    root.style.setProperty('--cy', y + 'px');
  };

  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    if(!raf) raf = requestAnimationFrame(apply);
  }, { passive:true });

  const setSpot = (el, e) => {
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--mx', mx.toFixed(2) + '%');
    el.style.setProperty('--my', my.toFixed(2) + '%');
  };

  const spotEls = () => [...document.querySelectorAll('.card, .gitem')];

  window.addEventListener('mousemove', (e) => {
    // Update only the hovered element for performance
    const t = e.target.closest('.card, .gitem');
    if(t) setSpot(t, e);
  }, { passive:true });
})();


// Gallery lightbox
window.addEventListener('load', () => {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  if(!lb || !lbImg) return;

  const open = (src, alt='') => {
    lbImg.src = src;
    lbImg.alt = alt || 'Image';
    lb.classList.add('on');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const close = () => {
    lb.classList.remove('on');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.classList.remove('no-scroll');
  };

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gitem');
    if(item){
      const src = item.getAttribute('data-full') || item.querySelector('img')?.src;
      const alt = item.querySelector('img')?.alt || '';
      if(src) open(src, alt);
      return;
    }
    if(e.target.closest('[data-close="true"]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && lb.classList.contains('on')) close();
  });
});
