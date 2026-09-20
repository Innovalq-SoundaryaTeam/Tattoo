/* ==========================================================================
   INKBLOOD — shared front-end behaviour
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if(!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
    toTop && toTop.classList.toggle('show', window.scrollY > 500);
  };
  const toTop = document.querySelector('.to-top');
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- theme + RTL toggles ----------
     Selected by class, not id: the header keeps one copy of each button
     for desktop and a second copy inside the mobile slide-out menu (see
     .mobile-nav-extra), so every click handler has to work for however
     many matching buttons exist on the page, not just the first one. */
  const root = document.documentElement;
  const themeBtns = document.querySelectorAll('.js-theme-toggle');
  const dirBtns = document.querySelectorAll('.js-dir-toggle');

  const syncDirLabels = () => {
    const isRtl = root.getAttribute('dir') === 'rtl';
    document.querySelectorAll('.dir-label').forEach(el => {
      el.textContent = isRtl ? 'LTR' : 'RTL';
    });
  };
  syncDirLabels();

  themeBtns.forEach(btn => btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if(isLight){
      root.removeAttribute('data-theme');
      try{ localStorage.setItem('ib-theme','dark'); }catch(e){}
    } else {
      root.setAttribute('data-theme','light');
      try{ localStorage.setItem('ib-theme','light'); }catch(e){}
    }
  }));

  dirBtns.forEach(btn => btn.addEventListener('click', () => {
    const isRtl = root.getAttribute('dir') === 'rtl';
    if(isRtl){
      root.removeAttribute('dir');
      try{ localStorage.setItem('ib-dir','ltr'); }catch(e){}
    } else {
      root.setAttribute('dir','rtl');
      try{ localStorage.setItem('ib-dir','rtl'); }catch(e){}
    }
    syncDirLabels();
  }));

  /* ---------- mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle && navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks && navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---------- active nav link ----------
     Compared without the .html extension, because some static-file
     servers (including whatever's serving this site right now) rewrite
     "/artists.html" down to a clean "/artists" URL in the address bar —
     comparing the raw extensioned filename against that would never
     match, and the nav link would silently never light up. */
  const stripHtml = (s) => s.replace(/\.html$/i, '');
  const rawPath = window.location.pathname.split('/').pop() || 'index.html';
  const path = stripHtml(rawPath) || 'index';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    const pages = a.dataset.page.split(',').map(stripHtml);
    if(pages.includes(path)) a.classList.add('active');
  });

  /* ---------- nav dropdown (tap to open on touch/mobile) ---------- */
  document.querySelectorAll('.nav-item').forEach(item => {
    const trigger = item.querySelector(':scope > a');
    trigger && trigger.addEventListener('click', (e) => {
      if(window.innerWidth <= 880){
        e.preventDefault();
        item.classList.toggle('dd-open');
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1600;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target < 10 ? (target * eased).toFixed(1) : Math.floor(target * eased);
          el.textContent = val + suffix;
          if(p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    }, { threshold:.6 });
    counters.forEach(c => countIO.observe(c));
  }

  /* ---------- hero heading letter/word intro ---------- */
  document.querySelectorAll('.hero h1 .line span').forEach((el, i) => {
    el.style.animation = `lineUp .9s cubic-bezier(.16,.84,.44,1) ${0.15 + i * 0.12}s both`;
  });

  /* ---------- filter pills (artists / services) ---------- */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const pills = group.querySelectorAll('.pill');
    const targetSelector = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSelector);
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const val = pill.dataset.filter;
        items.forEach(item => {
          const show = val === 'all' || item.dataset.category === val;
          item.style.display = show ? '' : 'none';
          if(show){
            item.animate([{ opacity:0, transform:'translateY(14px)' }, { opacity:1, transform:'translateY(0)' }], { duration:400, easing:'ease' });
          }
        });
      });
    });
  });

  /* ---------- accordion ---------- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const btn = item.querySelector('button');
    const panel = item.querySelector('.accordion-panel');
    btn && btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item.open').forEach(other => {
        if(other !== item){
          other.classList.remove('open');
          other.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* ---------- testimonial slider ---------- */
  const track = document.querySelector('.testi-track');
  if(track){
    const cards = track.children.length;
    let perView = window.innerWidth <= 760 ? 1 : 3;
    let index = 0;
    const move = () => { track.style.transform = `translateX(-${index * (100 / perView)}%)`; };
    document.querySelector('[data-testi="next"]')?.addEventListener('click', () => {
      index = (index + 1) % Math.max(cards - perView + 1, 1);
      move();
    });
    document.querySelector('[data-testi="prev"]')?.addEventListener('click', () => {
      index = index === 0 ? Math.max(cards - perView, 0) : index - 1;
      move();
    });
    window.addEventListener('resize', () => {
      perView = window.innerWidth <= 760 ? 1 : 3;
      index = 0; move();
    });
  }

  /* ---------- magnetic hover on primary buttons ---------- */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ---------- generic contact / consultation form ---------- */
  document.querySelectorAll('form[data-toast-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const wrap = field.closest('.form-field');
        if(!field.value.trim()){ wrap && wrap.classList.add('error'); valid = false; }
        else { wrap && wrap.classList.remove('error'); }
      });
      if(!valid) return;
      showToast('Request received', "We'll confirm your consultation within 24 hours.");
      form.reset();
    });
  });

  window.showToast = (title, msg) => {
    let wrap = document.querySelector('.toast-wrap');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<b>${title}</b><p>${msg}</p>`;
    wrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 3800);
  };

});

/* keyframes injected via JS-created style tag (line-up intro) */
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes lineUp{from{opacity:0;transform:translateY(100%) rotate(2deg);}to{opacity:1;transform:translateY(0) rotate(0);}}`;
document.head.appendChild(styleTag);
