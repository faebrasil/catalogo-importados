/* ============================================================================
   PRODUTOS ORIGINAIS IMPORTADOS - lógica do catálogo
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------- Configuração ----------------------------- */
  var WHATSAPP = '5531999952023'; // +55 31 99995-2023
  var MSG_GERAL = 'Olá, tenho interesse em um produto do catálogo.';
  var MSG_PRODUTO = 'Olá, tenho interesse neste produto'; // nome é anexado depois

  function linkWhats(texto) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  }

  /* -------------------------------- Ícones -------------------------------- */
  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.659zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>'
  };

  /* ------------------------------ Utilidades ------------------------------ */
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* --------------------------- Render do catálogo --------------------------- */
  var DATA = window.CATALOGO || {};
  var ORDEM = ['perfumes-masculinos', 'perfumes-femininos', 'eletronicos', 'promocoes'];
  var container = $('#catalogo');
  var totalProdutos = 0;

  ORDEM.forEach(function (catId) {
    var cat = DATA[catId];
    if (!cat) return;
    var itens = cat.itens || [];
    totalProdutos += itens.length;

    var section = el(
      '<section class="cat-section" id="' + catId + '" data-cat="' + catId + '">' +
        '<div class="cat-head">' +
          '<div class="titles">' +
            '<span class="kicker">Coleção</span>' +
            '<h2>' + cat.titulo + '</h2>' +
          '</div>' +
          '<div class="line"></div>' +
          '<span class="count">' + itens.length + ' ' + (itens.length === 1 ? 'produto' : 'produtos') + '</span>' +
        '</div>' +
        '<div class="grid"></div>' +
        '<div class="empty"></div>' +
      '</section>'
    );

    var grid = $('.grid', section);
    var empty = $('.empty', section);

    if (itens.length === 0) {
      empty.classList.add('show');
      empty.innerHTML = ICON.empty +
        '<h3>Em breve novos produtos</h3>' +
        '<p>Adicione as fotos em <code>imagens/' + catId + '/</code> e atualize o catálogo.</p>';
    }

    itens.forEach(function (item) {
      var nome = item.nome || '';
      var card = el(
        '<article class="card reveal" data-nome="' + norm(nome) + '">' +
          '<div class="thumb" role="button" tabindex="0" aria-label="Ampliar imagem do produto">' +
            '<img alt="' + escAttr(nome) + '" loading="lazy" decoding="async" src="' + escAttr(item.img) + '">' +
            '<span class="shine"></span>' +
            '<span class="zoom-hint">' + ICON.zoom + '</span>' +
          '</div>' +
          '<button class="reservar" type="button">Reservar ' + ICON.arrow + '</button>' +
        '</article>'
      );

      // Lazy fade: marca como carregada
      var img = $('img', card);
      var thumb = $('.thumb', card);
      function done() { img.classList.add('loaded'); thumb.classList.add('ready'); }
      if (img.complete && img.naturalWidth) { done(); }
      else { img.addEventListener('load', done); img.addEventListener('error', function () { thumb.classList.add('ready'); img.style.opacity = 1; }); }

      // Clique na imagem → abre o lightbox com zoom
      thumb.addEventListener('click', function () { openLightbox(card); });
      thumb.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(card); } });

      // Reservar → WhatsApp com o nome do produto
      $('.reservar', card).addEventListener('click', function () {
        var texto = MSG_PRODUTO + (nome ? ': ' + nome : '') + '.';
        window.open(linkWhats(texto), '_blank', 'noopener');
      });

      grid.appendChild(card);
    });

    container.appendChild(section);
  });

  function escAttr(s) { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  /* ----------------------- Busca + Filtros (dinâmicos) ---------------------- */
  var searchBox = $('.search');
  var input = $('#busca');
  var chips = $all('.chip');
  var noResults = $('#sem-resultados');
  var estado = { q: '', filtro: 'todos' };

  function aplicar() {
    var q = norm(estado.q.trim());
    var algumVisivel = false;

    $all('.cat-section').forEach(function (sec) {
      var cat = sec.getAttribute('data-cat');
      var passaFiltro = (estado.filtro === 'todos' || estado.filtro === cat);
      var visiveisNaSecao = 0;

      $all('.card', sec).forEach(function (card) {
        var bateBusca = !q || card.getAttribute('data-nome').indexOf(q) !== -1;
        var mostra = passaFiltro && bateBusca;
        card.style.display = mostra ? '' : 'none';
        if (mostra) visiveisNaSecao++;
      });

      // Esconde a seção inteira se vazia (sem filtro/sem resultado)
      var temItens = $all('.card', sec).length > 0;
      var mostraSecao = passaFiltro && (visiveisNaSecao > 0 || (!q && temItens));
      sec.style.display = mostraSecao ? '' : 'none';
      if (mostraSecao && visiveisNaSecao > 0) algumVisivel = true;

      // Atualiza contagem visível ao buscar
      var count = $('.count', sec);
      if (count) {
        var n = q ? visiveisNaSecao : $all('.card', sec).length;
        count.textContent = n + ' ' + (n === 1 ? 'produto' : 'produtos');
      }
    });

    noResults.classList.toggle('show', !algumVisivel && !!q);
  }

  // Busca em tempo real
  input.addEventListener('input', function () {
    estado.q = input.value;
    searchBox.classList.toggle('has-value', input.value.length > 0);
    aplicar();
  });
  $('.search .clear').addEventListener('click', function () {
    input.value = ''; estado.q = ''; searchBox.classList.remove('has-value'); input.focus(); aplicar();
  });

  // Filtros
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('active'); chip.setAttribute('aria-pressed', 'true');
      estado.filtro = chip.getAttribute('data-filtro');
      aplicar();
      // rola até o catálogo se filtrou por categoria
      if (estado.filtro !== 'todos') {
        var alvo = $('#' + estado.filtro);
        if (alvo) scrollToEl(alvo);
      }
    });
  });

  /* ----------------------- Navegação / scroll suave ------------------------ */
  function scrollToEl(target) {
    var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70;
    var toolbar = $('.toolbar');
    var offset = headerH + (toolbar ? toolbar.offsetHeight : 0) + 12;
    var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  $all('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('data-scroll');
      var target = id === 'inicio' ? document.body : $('#' + id);
      if (!target) return;
      e.preventDefault();
      // Se há filtro de categoria, sincroniza
      var chip = $('.chip[data-filtro="' + id + '"]');
      if (chip) chip.click();
      else if (id === 'inicio') { window.scrollTo({ top: 0, behavior: 'smooth' }); var t = $('.chip[data-filtro="todos"]'); if (t) { chips.forEach(function (c) { c.classList.remove('active'); }); t.classList.add('active'); estado.filtro = 'todos'; aplicar(); } }
      else scrollToEl(target);
      fecharDrawer();
    });
  });

  /* ------------------------- Header scrolled / nav ------------------------- */
  var header = $('.site-header');
  var backTop = $('.back-top');
  function onScroll() {
    var y = window.pageYOffset;
    header.classList.toggle('scrolled', y > 30);
    backTop.classList.toggle('show', y > 600);
    // nav ativa
    var atual = 'inicio';
    $all('.cat-section').forEach(function (sec) {
      if (sec.style.display === 'none') return;
      var r = sec.getBoundingClientRect();
      if (r.top <= 160) atual = sec.id;
    });
    $all('.main-nav a[data-scroll]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-scroll') === atual);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('.back-top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* --------------------------- Animação de entrada -------------------------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    $all('.reveal').forEach(function (n, i) {
      n.style.transitionDelay = (Math.min(i % 4, 4) * 60) + 'ms';
      io.observe(n);
    });
  } else {
    $all('.reveal').forEach(function (n) { n.classList.add('in'); });
  }

  /* ----------------------------- Menu mobile ------------------------------ */
  var drawer = $('.mobile-drawer');
  var scrim = $('.scrim');
  function abrirDrawer() { drawer.classList.add('open'); scrim.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function fecharDrawer() { drawer.classList.remove('open'); scrim.classList.remove('open'); document.body.style.overflow = ''; }
  $('.menu-toggle').addEventListener('click', abrirDrawer);
  $('.close-drawer').addEventListener('click', fecharDrawer);
  scrim.addEventListener('click', fecharDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharDrawer(); });

  /* ---------------- Impressão / PDF: garante imagens carregadas ------------- */
  function carregarTodasImagens() {
    $all('img[loading="lazy"]').forEach(function (img) {
      img.loading = 'eager';
      if (!img.complete) { var s = img.getAttribute('src'); if (s) img.setAttribute('src', s); }
    });
  }
  window.addEventListener('beforeprint', carregarTodasImagens);
  // Alguns navegadores só expõem via matchMedia
  if (window.matchMedia) {
    try { window.matchMedia('print').addEventListener('change', function (e) { if (e.matches) carregarTodasImagens(); }); } catch (_) {}
  }

  /* --------------------------- Links de WhatsApp --------------------------- */
  $all('[data-wa-geral]').forEach(function (a) {
    a.setAttribute('href', linkWhats(MSG_GERAL));
    a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
  });

  /* ====================== LIGHTBOX / ZOOM (e-commerce) ===================== */
  var LB = $('#lightbox');
  var lbImg = LB && $('.lb-img', LB);
  var lbStage = LB && $('.lb-stage', LB);
  var lbLevel = LB && $('.lb-zoom-level', LB);
  var lbCur = LB && $('.lb-cur', LB), lbTotal = LB && $('.lb-total', LB);
  var lbReservar = LB && $('.lb-reservar', LB);

  var lbList = [];          // [{src, nome}]
  var lbIndex = 0;
  var lbScale = 1, lbTx = 0, lbTy = 0;
  var LB_MIN = 1, LB_MAX = 4.5;

  // Aberta a partir de um card; navega pelos produtos VISÍVEIS (respeita filtro/busca)
  function openLightbox(card) {
    if (!LB) return;
    var visiveis = $all('.card').filter(function (c) { return c.style.display !== 'none'; });
    if (visiveis.indexOf(card) === -1) visiveis = $all('.card');
    lbList = visiveis.map(function (c) {
      var im = $('img', c);
      return { src: im.getAttribute('src'), nome: im.getAttribute('alt') || '' };
    });
    var i = visiveis.indexOf(card); if (i < 0) i = 0;
    LB.classList.add('open'); LB.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbShow(i);
  }
  function lbClose() {
    LB.classList.remove('open', 'is-zoomed');
    LB.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { if (!LB.classList.contains('open')) lbImg.removeAttribute('src'); }, 220);
  }
  function lbShow(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    var p = lbList[lbIndex];
    lbImg.src = p.src; lbImg.alt = p.nome;
    lbReservar.href = linkWhats(MSG_PRODUTO + (p.nome ? ': ' + p.nome : '') + '.');
    lbCur.textContent = lbIndex + 1; lbTotal.textContent = lbList.length;
    LB.classList.toggle('has-nav', lbList.length > 1);
    lbResetZoom(false);
  }
  function lbNext() { lbShow(lbIndex + 1); }
  function lbPrev() { lbShow(lbIndex - 1); }

  function lbApply(animate) {
    lbImg.style.transition = animate ? 'transform .25s var(--ease)' : 'none';
    lbImg.style.transform = 'translate(' + lbTx + 'px,' + lbTy + 'px) scale(' + lbScale + ')';
    lbLevel.textContent = Math.round(lbScale * 100) + '%';
    LB.classList.toggle('is-zoomed', lbScale > 1.01);
  }
  function lbClampPan() {
    var mx = Math.max(0, (lbImg.clientWidth * lbScale - lbStage.clientWidth) / 2);
    var my = Math.max(0, (lbImg.clientHeight * lbScale - lbStage.clientHeight) / 2);
    lbTx = Math.min(mx, Math.max(-mx, lbTx));
    lbTy = Math.min(my, Math.max(-my, lbTy));
  }
  function lbResetZoom(animate) { lbScale = 1; lbTx = 0; lbTy = 0; lbApply(animate !== false); }
  function lbZoomTo(ns, px, py) {
    ns = Math.min(LB_MAX, Math.max(LB_MIN, ns));
    var k = ns / lbScale;
    lbTx = px - k * (px - lbTx);
    lbTy = py - k * (py - lbTy);
    lbScale = ns; lbClampPan(); lbApply(true);
  }
  function lbCenterZoom(ns) { lbZoomTo(ns, 0, 0); }

  if (LB) {
    $('.lb-close', LB).addEventListener('click', lbClose);
    $('.lb-prev', LB).addEventListener('click', function (e) { e.stopPropagation(); lbPrev(); });
    $('.lb-next', LB).addEventListener('click', function (e) { e.stopPropagation(); lbNext(); });
    $('.lb-zoom-in', LB).addEventListener('click', function () { lbCenterZoom(lbScale + 0.7); });
    $('.lb-zoom-out', LB).addEventListener('click', function () { lbCenterZoom(lbScale - 0.7); });
    LB.addEventListener('click', function (e) { if (e.target === LB) lbClose(); });

    lbStage.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = lbStage.getBoundingClientRect();
      lbZoomTo(lbScale * (e.deltaY < 0 ? 1.25 : 0.8), e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    }, { passive: false });

    var ptrs = new Map(), drag = null, pinch = null, moved = false, sw = null;
    lbStage.addEventListener('pointerdown', function (e) {
      lbStage.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 1) { drag = { x: e.clientX, y: e.clientY, tx: lbTx, ty: lbTy }; moved = false; sw = { dx: 0, dy: 0 }; }
      else if (ptrs.size === 2) {
        var p = Array.from(ptrs.values()), r = lbStage.getBoundingClientRect();
        pinch = { dist: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), scale: lbScale,
          mx: (p[0].x + p[1].x) / 2 - r.left - r.width / 2, my: (p[0].y + p[1].y) / 2 - r.top - r.height / 2, tx: lbTx, ty: lbTy };
      }
    });
    lbStage.addEventListener('pointermove', function (e) {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2 && pinch) {
        var p = Array.from(ptrs.values());
        var d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        var ns = Math.min(LB_MAX, Math.max(LB_MIN, pinch.scale * d / pinch.dist)), k = ns / pinch.scale;
        lbTx = pinch.mx - k * (pinch.mx - pinch.tx); lbTy = pinch.my - k * (pinch.my - pinch.ty);
        lbScale = ns; lbClampPan(); lbApply(false); moved = true;
      } else if (ptrs.size === 1 && drag) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        sw = { dx: dx, dy: dy };
        if (lbScale > 1.01) { lbTx = drag.tx + dx; lbTy = drag.ty + dy; lbClampPan(); lbApply(false); }
      }
    });
    function lbEnd(e) {
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch = null;
      if (ptrs.size === 0) {
        if (!moved) {
          var ir = lbImg.getBoundingClientRect();
          var dentro = e.clientX >= ir.left && e.clientX <= ir.right && e.clientY >= ir.top && e.clientY <= ir.bottom;
          if (!dentro) { lbClose(); }
          else {
            var r = lbStage.getBoundingClientRect();
            if (lbScale > 1.01) lbResetZoom(true);
            else lbZoomTo(2.6, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
          }
        } else if (lbScale <= 1.01 && sw && Math.abs(sw.dx) > 60 && Math.abs(sw.dx) > Math.abs(sw.dy)) {
          if (sw.dx < 0) lbNext(); else lbPrev();
        }
        drag = null;
      }
    }
    lbStage.addEventListener('pointerup', lbEnd);
    lbStage.addEventListener('pointercancel', lbEnd);

    document.addEventListener('keydown', function (e) {
      if (!LB.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowRight') lbNext();
      else if (e.key === 'ArrowLeft') lbPrev();
      else if (e.key === '+' || e.key === '=') lbCenterZoom(lbScale + 0.7);
      else if (e.key === '-' || e.key === '_') lbCenterZoom(lbScale - 0.7);
    });
  }

  /* ----------------------- SEO: dados estruturados ------------------------ */
  try {
    var ld = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'Produtos Originais Importados',
      description: 'Perfumes exclusivos e eletrônicos premium originais importados.',
      telephone: '+55 31 99995-2023',
      currenciesAccepted: 'BRL',
      makesOffer: { '@type': 'Offer', itemOffered: { '@type': 'Product', category: 'Perfumes e Eletrônicos' } }
    };
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  } catch (e) {}

  console.log('%cCatálogo carregado - ' + totalProdutos + ' produto(s).', 'color:#d4af37');
})();
