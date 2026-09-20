/* ==========================================================================
   INKBLOOD — Client Dashboard logic (localStorage-backed demo data)
   ========================================================================== */
(function(){

  const LS_PROFILE = 'ib_profile';
  const LS_APPTS = 'ib_appointments';
  const LS_REFS = 'ib_references';
  const LS_PAY = 'ib_payments';
  const LS_SEEDED = 'ib_seeded';
  let currentView = 'overview';

  const todayISO = () => new Date().toISOString().slice(0,10);
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
  const fmtDay = (iso) => new Date(iso+'T00:00:00').toLocaleDateString('en-US',{ day:'2-digit' });
  const fmtMon = (iso) => new Date(iso+'T00:00:00').toLocaleDateString('en-US',{ month:'short' }).toUpperCase();
  const fmtFull = (iso) => new Date(iso+'T00:00:00').toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric', year:'numeric' });

  function readJSON(key, fallback){
    try{ const v = JSON.parse(localStorage.getItem(key)); return v || fallback; }catch(e){ return fallback; }
  }
  function writeJSON(key, val){
    try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){}
  }

  /* demo references reuse three distinct photos from the studio's actual
     recent-work gallery (images/home/) — one per tile — instead of the same
     photo repeated three times (that looked wrong: every "recent design
     reference" showed an identical picture) or a plain sketch-icon
     placeholder. Each file is picked to actually match its label:
       - forearm-placement.jpg -> gallery-4.png (script lettering, forearm shot)
       - linework-ref.png      -> gallery-3.png (fine-detail geometric linework sleeve)
       - botanical-sketch.jpg  -> gallery-6.png (colorful floral bouquet piece) */
  const DEMO_REFS = [
    { id:1, name:'forearm-placement.jpg', img:'images/home/gallery-4.png', icon:'i-wave', color:'#4dd0ff' },
    { id:2, name:'linework-ref.png', img:'images/home/gallery-3.png', icon:'i-rose', color:'var(--ink-red-2)' },
    { id:3, name:'botanical-sketch.jpg', img:'images/home/gallery-6.png', icon:'i-lotus', color:'#7ee787' }
  ];
  /* older demo-ref shapes this migrates away from, so a browser seeded
     under an earlier version of this file still gets upgraded */
  const PRIOR_DEMO_IMGS = [
    null, // very first version had no img field at all (icon-only)
    ['images/home/gallery-1.png', 'images/home/gallery-3.png', 'images/home/gallery-5.png'], // v1 gallery reuse (gallery-5 mismatched its "botanical-sketch" label)
    ['images/artists/artist-7.png', 'images/artists/artist-7.png', 'images/artists/artist-7.png'], // the same photo repeated on all 3 tiles
  ];

  /* upgrades a browser that was already seeded (before this change, or the
     change before that) so its demo references pick up the current photo
     too, without touching any references the client actually uploaded
     themselves */
  function migrateDemoRefs(){
    const refs = readJSON(LS_REFS, []);
    if(refs.length !== DEMO_REFS.length) return;
    const namesMatch = refs.every((r, i) => r.name === DEMO_REFS[i].name && !r.data);
    if(!namesMatch) return;
    const isCurrent = refs.every((r, i) => r.img === DEMO_REFS[i].img);
    if(isCurrent) return;
    const isKnownPriorShape = PRIOR_DEMO_IMGS.some(imgs =>
      refs.every((r, i) => (imgs ? r.img === imgs[i] : !r.img))
    );
    if(!isKnownPriorShape) return; // don't clobber a shape we don't recognize
    writeJSON(LS_REFS, DEMO_REFS.map(r => ({ ...r })));
  }

  /* ---------- seed demo data on first visit ---------- */
  function seed(){
    if(!localStorage.getItem(LS_PROFILE)){
      writeJSON(LS_PROFILE, { name:'Guest Client', email:'guest@inkblood.studio', initials:'GC' });
    }

    if(localStorage.getItem(LS_SEEDED)){
      migrateDemoRefs();
      return;
    }

    writeJSON(LS_APPTS, [
      { id:1, service:'Fine Line Forearm — Session 2', artist:'Priya Nandan', date:addDays(6), time:'2:30 PM', status:'confirmed' },
      { id:2, service:'Consultation — Sleeve Concept', artist:'Marisol Reyes', date:addDays(14), time:'5:00 PM', status:'pending' },
      { id:3, service:'Septum Piercing', artist:'Sasha Okafor', date:addDays(-10), time:'1:00 PM', status:'completed' },
      { id:4, service:'Fine Line Forearm — Session 1', artist:'Priya Nandan', date:addDays(-24), time:'3:00 PM', status:'completed' }
    ]);

    writeJSON(LS_REFS, DEMO_REFS.map(r => ({ ...r })));

    writeJSON(LS_PAY, [
      { date:addDays(-24), service:'Fine Line Forearm — Session 1', artist:'Priya Nandan', amount:240, status:'paid' },
      { date:addDays(-10), service:'Septum Piercing', artist:'Sasha Okafor', amount:55, status:'paid' },
      { date:addDays(6), service:'Fine Line Forearm — Session 2', artist:'Priya Nandan', amount:260, status:'due' }
    ]);

    localStorage.setItem(LS_SEEDED, '1');
  }

  /* ---------- profile ---------- */
  function loadProfile(){
    const p = readJSON(LS_PROFILE, { name:'Guest Client', email:'guest@inkblood.studio' });
    const initials = (p.name || 'GC').trim().split(/\s+/).map(s=>s[0]).join('').slice(0,2).toUpperCase();
    document.getElementById('user-name').textContent = p.name;
    document.getElementById('user-email').textContent = p.email;
    const avText = document.getElementById('user-avatar-text');
    if(avText) avText.textContent = initials;
    const titleEl = document.getElementById('topbar-title');
    if(titleEl && (!currentView || currentView === 'overview')) titleEl.textContent = 'Welcome back, ' + p.name.split(' ')[0] + ' 👋';
    const pfName = document.getElementById('pf-name'); if(pfName) pfName.value = p.name;
    const pfEmail = document.getElementById('pf-email'); if(pfEmail) pfEmail.value = p.email;
  }

  /* ---------- status badge helper ---------- */
  function badge(status){
    const map = { confirmed:'Confirmed', pending:'Pending', completed:'Completed', cancelled:'Cancelled' };
    return `<span class="status-badge status-${status}">${map[status]||status}</span>`;
  }

  /* ---------- render appointments ---------- */
  function apptRow(a){
    return `<div class="appt-item appt-row" data-category="${a.status}">
      <div class="appt-date"><b>${fmtDay(a.date)}</b><span>${fmtMon(a.date)}</span></div>
      <div class="appt-info"><b>${a.service}</b><span>${a.artist} · ${a.time}</span></div>
      ${badge(a.status)}
      <div class="appt-actions">
        <button class="icon-btn" title="Reschedule" data-resched="${a.id}">✎</button>
        <button class="icon-btn" title="Cancel" data-cancel="${a.id}">✕</button>
      </div>
    </div>`;
  }

  function renderAppointments(){
    const appts = readJSON(LS_APPTS, []).slice().sort((a,b)=> new Date(a.date) - new Date(b.date));
    const upcoming = appts.filter(a => a.status === 'confirmed' || a.status === 'pending');

    const overviewList = document.getElementById('overview-appt-list');
    if(overviewList){
      overviewList.innerHTML = upcoming.length
        ? upcoming.slice(0,3).map(apptRow).join('')
        : `<div class="empty-state"><div class="ic">📅</div><p>No upcoming appointments yet.</p></div>`;
    }

    const fullList = document.getElementById('full-appt-list');
    if(fullList){
      fullList.innerHTML = appts.length
        ? appts.map(apptRow).join('')
        : `<div class="empty-state"><div class="ic">📅</div><p>No appointments yet — book your first session.</p></div>`;
    }

    document.getElementById('stat-upcoming').textContent = upcoming.length;
    document.getElementById('stat-completed').textContent = appts.filter(a=>a.status==='completed').length;
    const trend = document.getElementById('stat-upcoming-trend');
    if(trend) trend.textContent = upcoming.length ? 'Next: ' + fmtMon(upcoming[0].date) + ' ' + fmtDay(upcoming[0].date) : '';

    // action handlers
    fullList && fullList.querySelectorAll('[data-cancel]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.cancel);
        const list = readJSON(LS_APPTS, []).map(a => a.id === id ? { ...a, status:'cancelled' } : a);
        writeJSON(LS_APPTS, list);
        renderAppointments();
        window.showToast('Appointment cancelled', 'We’ve cancelled that booking. Book anytime from the calendar.');
      });
    });
    fullList && fullList.querySelectorAll('[data-resched]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchView('book');
        window.showToast('Reschedule', 'Pick a new date and time below to reschedule.');
      });
    });

    renderMiniCal(appts);
  }

  /* ---------- mini calendar ---------- */
  function renderMiniCal(appts){
    const cal = document.getElementById('mini-cal');
    if(!cal) return;
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const apptDates = new Set(appts.map(a=>a.date));
    const todayStr = todayISO();

    let html = ['S','M','T','W','T','F','S'].map(d=>`<div class="dow">${d}</div>`).join('');
    for(let i=0;i<startOffset;i++) html += `<div class="day muted"></div>`;
    for(let d=1; d<=daysInMonth; d++){
      const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const classes = ['day'];
      if(apptDates.has(iso)) classes.push('has-appt');
      if(iso === todayStr) classes.push('today');
      html += `<div class="${classes.join(' ')}">${d}</div>`;
    }
    cal.innerHTML = html;
  }

  /* ---------- references ---------- */
  function refThumb(r){
    const iconSvg = `<svg viewBox="0 0 100 100" style="width:56%;color:${r.color||'var(--ink-red-2)'}"><use href="#${r.icon||'i-rose'}"/></svg>`;
    const fallbackStyle = (shown) =>
      `width:100%;height:100%;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 20%,#1c1c22,#0a0a0c);display:${shown ? 'flex' : 'none'};`;
    const isDataUrl = r.data && r.data.startsWith('data:image');
    let inner;
    if(isDataUrl){
      /* a real file the client uploaded through the drop-zone */
      inner = `<img src="${r.data}" alt="${r.name}">`;
    } else if(r.img){
      /* a demo reference reusing one of the studio's real portfolio photos
         (same files dropped into images/home/) instead of an abstract
         sketch icon — falls back to the icon tile if that photo hasn't
         been dropped in yet */
      inner = `<img src="${r.img}" alt="${r.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
        + `<div class="ref-fallback" style="${fallbackStyle(false)}">${iconSvg}</div>`;
    } else {
      inner = `<div class="ref-fallback" style="${fallbackStyle(true)}">${iconSvg}</div>`;
    }
    return `<div class="ref-item" data-ref="${r.id}">
      ${inner}
      <button class="remove" data-remove-ref="${r.id}">✕</button>
      <div class="name">${r.name}</div>
    </div>`;
  }

  function renderReferences(){
    const refs = readJSON(LS_REFS, []);
    const overviewGrid = document.getElementById('overview-ref-grid');
    if(overviewGrid) overviewGrid.innerHTML = refs.slice(0,4).map(refThumb).join('') || `<div class="empty-state"><p>No references uploaded yet.</p></div>`;
    const fullGrid = document.getElementById('full-ref-grid');
    if(fullGrid) fullGrid.innerHTML = refs.map(refThumb).join('');
    document.getElementById('stat-refs').textContent = refs.length;

    document.querySelectorAll('[data-remove-ref]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.removeRef);
        writeJSON(LS_REFS, readJSON(LS_REFS, []).filter(r => r.id !== id));
        renderReferences();
      });
    });
  }

  function handleFiles(fileList){
    const refs = readJSON(LS_REFS, []);
    const icons = ['i-rose','i-dagger','i-snake','i-swallow','i-lotus','i-wave','i-anchor'];
    const colors = ['var(--ink-red-2)','var(--ink-violet)','var(--ink-gold)','#4dd0ff','#7ee787'];
    let remaining = fileList.length;
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        refs.push({ id: Date.now() + Math.random(), name:file.name, data:e.target.result });
        writeJSON(LS_REFS, refs);
        renderReferences();
      };
      reader.onerror = () => {
        refs.push({ id: Date.now() + Math.random(), name:file.name, icon:icons[Math.floor(Math.random()*icons.length)], color:colors[Math.floor(Math.random()*colors.length)] });
        writeJSON(LS_REFS, refs);
        renderReferences();
      };
      if(file.type && file.type.startsWith('image/')) reader.readAsDataURL(file);
      else reader.onerror();
    });
    window.showToast('Reference uploaded', fileList.length + ' file(s) added to your gallery.');
  }

  /* ---------- payments ---------- */
  function renderPayments(){
    const pays = readJSON(LS_PAY, []).slice().sort((a,b)=> new Date(b.date) - new Date(a.date));
    const tbody = document.getElementById('pay-table-body');
    if(tbody){
      tbody.innerHTML = pays.map(p => `<tr>
        <td>${fmtFull(p.date)}</td>
        <td>${p.service}</td>
        <td>${p.artist}</td>
        <td>$${p.amount}</td>
        <td><span class="pay-status ${p.status}">${p.status === 'paid' ? 'Paid' : 'Due'}</span></td>
      </tr>`).join('') || `<tr><td colspan="5"><div class="empty-state"><p>No transactions yet.</p></div></td></tr>`;
    }
    const total = pays.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);
    const due = pays.filter(p=>p.status==='due').reduce((s,p)=>s+p.amount,0);
    document.getElementById('stat-spent') && (document.getElementById('stat-spent').textContent = '$' + total);
    document.getElementById('pay-total') && (document.getElementById('pay-total').textContent = '$' + total);
    document.getElementById('pay-due') && (document.getElementById('pay-due').textContent = '$' + due);
    document.getElementById('pay-count') && (document.getElementById('pay-count').textContent = pays.length);
  }

  /* ---------- view switching ---------- */
  function switchView(view){
    currentView = view;
    document.querySelectorAll('.dash-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.dash-nav a').forEach(a => a.classList.remove('active'));
    const target = document.getElementById('view-' + view);
    const nav = document.querySelector(`.dash-nav a[data-view="${view}"]`);
    if(target) target.classList.add('active');
    if(nav) nav.classList.add('active');
    document.getElementById('dash-sidebar').classList.remove('open');
    window.scrollTo({ top:0, behavior:'smooth' });

    const titles = {
      overview:['Welcome back','Here’s what’s happening with your ink journey.'],
      book:['Book Your Session','Choose a service, artist and time that works for you.'],
      appointments:['My Appointments','Every past and upcoming session in one place.'],
      references:['Design References','Upload inspiration so your artist can prep before your session.'],
      aftercare:['Aftercare Guide','Personalized healing instructions for your current piece.'],
      payments:['Payment History','Track invoices, deposits and balances.'],
      profile:['Profile & Settings','Manage your account details and notification preferences.']
    };
    if(titles[view] && view !== 'overview'){
      document.getElementById('topbar-title').textContent = titles[view][0];
      document.getElementById('topbar-sub').textContent = titles[view][1];
    } else {
      document.getElementById('topbar-sub').textContent = titles.overview[1];
      loadProfile();
    }
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    seed();
    loadProfile();
    renderAppointments();
    renderReferences();
    renderPayments();

    // progress ring
    const circle = document.getElementById('progress-circle');
    if(circle){
      const pct = 0.28;
      const r = 40, c = 2*Math.PI*r;
      circle.setAttribute('stroke-dasharray', c.toFixed(1));
      circle.setAttribute('stroke-dashoffset', (c*(1-pct)).toFixed(1));
    }

    // nav
    document.querySelectorAll('.dash-nav a[data-view]').forEach(a => {
      a.addEventListener('click', (e) => { e.preventDefault(); switchView(a.dataset.view); });
    });
    document.querySelectorAll('[data-goto]').forEach(a => {
      a.addEventListener('click', (e) => { e.preventDefault(); switchView(a.dataset.goto); });
    });

    // mobile sidebar toggle
    document.getElementById('mobile-toggle')?.addEventListener('click', () => {
      document.getElementById('dash-sidebar').classList.toggle('open');
    });

    // logout
    ['logout-btn','profile-logout'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        if(id === 'profile-logout') e.preventDefault();
        window.location.href = 'login.html';
      });
    });

    // booking tabs
    document.querySelectorAll('#book-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#book-tabs .tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // slot picker
    document.querySelectorAll('.avail-slot:not(.taken)').forEach(slot => {
      slot.addEventListener('click', () => {
        document.querySelectorAll('.avail-slot').forEach(s=>s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });

    // booking form submit
    document.getElementById('booking-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('bk-date').value;
      const selectedSlot = document.querySelector('.avail-slot.selected');
      if(!date){ document.getElementById('bk-date').closest('.form-field').classList.add('error'); return; }
      if(!selectedSlot){ window.showToast('Pick a time', 'Please select an available time slot.'); return; }
      const service = document.querySelector('#book-tabs .tab-btn.active').textContent;
      const artist = document.getElementById('bk-artist').value;
      const placement = document.getElementById('bk-placement').value;

      const appts = readJSON(LS_APPTS, []);
      appts.push({
        id: Date.now(),
        service: service + (placement ? ' — ' + placement : ''),
        artist: artist === 'No preference' ? 'To be assigned' : artist.split(' — ')[0],
        date, time: selectedSlot.textContent, status:'pending'
      });
      writeJSON(LS_APPTS, appts);
      renderAppointments();
      e.target.reset();
      document.querySelectorAll('.avail-slot').forEach(s=>s.classList.remove('selected'));
      window.showToast('Booking requested', 'Your appointment is pending studio confirmation.');
      switchView('appointments');
    });

    // upload drop zone
    const drop = document.getElementById('upload-drop');
    const fileInput = document.getElementById('file-input');
    if(drop && fileInput){
      drop.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => { if(fileInput.files.length) handleFiles(fileInput.files); fileInput.value=''; });
      ['dragenter','dragover'].forEach(evt => drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.add('dragover'); }));
      ['dragleave','drop'].forEach(evt => drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.remove('dragover'); }));
      drop.addEventListener('drop', (e) => { if(e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); });
    }

    // download aftercare (mock)
    document.getElementById('download-aftercare')?.addEventListener('click', () => {
      window.showToast('Preparing PDF', 'Your aftercare guide will download shortly (demo).');
    });

    // profile form
    document.getElementById('profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pf-name').value || 'Guest Client';
      const email = document.getElementById('pf-email').value || 'guest@inkblood.studio';
      writeJSON(LS_PROFILE, { name, email });
      loadProfile();
      window.showToast('Profile updated', 'Your changes have been saved.');
    });

    // deep-link via hash
    const hash = window.location.hash.replace('#','');
    if(hash && document.getElementById('view-' + hash)) switchView(hash);
  });

})();
