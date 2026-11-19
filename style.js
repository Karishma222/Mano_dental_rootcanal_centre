const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
document.body.classList.add('js');
const WA = '919677755087';

// Mobile menu
$('#menu')?.addEventListener('click', () => {
  const o = $('#links').classList.toggle('open');
  $('#menu').setAttribute('aria-expanded', o);
});
$('#yr') && ($('#yr').textContent = new Date().getFullYear());

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));

// Treatment finder
const FIND = {
  'Toothache or night pain': ['Root canal treatment', 'Deep, throbbing or night-time pain often means the nerve inside the tooth is infected. A root canal can relieve the pain and save the tooth.', 'root-canal.html'],
  'Cold / hot sensitivity': ['Check-up and tooth-coloured filling', 'Sensitivity can come from early decay or worn enamel. An exam shows whether a simple filling or preventive care is enough.', 'services.html'],
  'Broken or chipped tooth': ['Tooth-coloured filling or restoration', 'Small breaks can be rebuilt to look and feel natural. Deeper breaks may need root canal care first.', 'services.html'],
  'My child’s teeth': ['Pediatric dentistry', 'Gentle check-ups, cavity care, fluoride, sealants and habit counseling for children.', 'pediatric.html'],
  'Crooked teeth / braces': ['Orthodontic treatment', 'We assess spacing and bite, then explain your options and timeline in plain words.', 'services.html'],
  'Swelling or injury': ['Emergency dental care', 'Facial swelling, a knocked-out tooth or sudden severe pain needs quick care. Call us now.', 'contact.html']
};
const fc = $('#fchips');
if (fc) {
  Object.keys(FIND).forEach(k => { const b = document.createElement('button'); b.className = 'chip'; b.type = 'button'; b.textContent = k; fc.append(b); });
  fc.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', fc).forEach(c => c.classList.toggle('on', c === b));
    const [t, d, l] = FIND[b.textContent];
    $('#fres').innerHTML = `<h4>${t}</h4><p>${d}</p><a class="btn" href="contact.html">Book appointment</a><a class="more light-res" href="${l}" style="margin-left:14px;font-weight:800;color:var(--vio);text-decoration:none">Learn more</a><small>This is a guide, not a diagnosis. Please visit us for an exam.</small>`;
  });
}

// Tooth anatomy
const LAY = {
  enamel: ['Enamel', 'The hard white outer shell of the crown. It protects the tooth, but acid from bacteria and sugar can wear it down and start a cavity.', '#t-enamel'],
  dentin: ['Dentin', 'The softer layer under the enamel. When decay reaches dentin, you feel sensitivity to hot, cold and sweet food.', '#t-dentin'],
  pulp: ['Pulp chamber', 'The living centre of the tooth with nerves and blood vessels. Deep decay or injury can inflame or infect it, causing strong pain.', '#t-chamber'],
  canal: ['Root canals', 'Narrow channels inside the roots. In a root canal treatment we clean them, disinfect them and seal them to save your natural tooth.', '#t-canal'],
  infection: ['Infection at the root tip', 'When bacteria reach the end of the root, an abscess can form. This causes swelling and pain, and root canal treatment stops it from spreading.', '#t-inf']
};
if ($('#layers')) {
  const show = k => {
    $$('#layers .layer').forEach(b => b.classList.toggle('on', b.dataset.k === k));
    $$('.tooth-box .on').forEach(x => x.classList.remove('on'));
    $$(LAY[k][2]).forEach(x => x.classList.add('on'));
    $('#linfo').innerHTML = `<h4>${LAY[k][0]}</h4><p>${LAY[k][1]}</p>`;
  };
  $('#layers').addEventListener('click', e => { const b = e.target.closest('.layer'); if (b) show(b.dataset.k); });
  show('enamel');
}

// Service tabs
$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.classList.toggle('on', x === t));
  $$('.svc').forEach(s => s.classList.toggle('hide', t.dataset.f !== 'all' && s.dataset.c !== t.dataset.f));
}));

// Booking wizard
const bk = $('#book');
if (bk) {
  let step = 0, treat = '', slot = '';
  const panes = $$('.pane', bk), bars = $$('.prog i', bk);
  const go = n => { step = n; panes.forEach((p, i) => p.classList.toggle('on', i === n)); bars.forEach((b, i) => b.classList.toggle('on', i <= n)); };
  const err = (id, m) => { $('#e-' + id).textContent = m || ''; return !m; };
  const pick = (box, cb) => box.addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return; $$('.chip', box).forEach(x => x.classList.toggle('on', x === c)); cb(c.textContent); });
  pick($('#tchips'), v => treat = v);
  const times = ['10:00 AM', '11:00 AM', '12:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
  times.forEach(t => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = t; $('#schips').append(b); });
  pick($('#schips'), v => slot = v);
  $('#date').min = new Date().toISOString().split('T')[0];
  $('#n1').onclick = () => {
    const a = err('name', $('#name').value.trim().length < 2 ? 'Enter the patient’s name.' : '');
    const b = err('phone', /^[6-9]\d{9}$/.test($('#phone').value) ? '' : 'Enter a valid 10-digit mobile number.');
    if (a && b) go(1);
  };
  $('#n2').onclick = () => err('treat', treat ? '' : 'Choose a treatment to continue.') && go(2);
  $('#n3').onclick = () => {
    const d = $('#date').value;
    const a = err('date', !d ? 'Choose a date.' : new Date(d + 'T00:00').getDay() === 0 ? 'Please choose Monday to Saturday.' : '');
    const b = err('slot', slot ? '' : 'Choose a time.');
    if (!(a && b)) return;
    $('#sum').innerHTML = `<b>${$('#name').value.trim()}</b><span>📞 ${$('#phone').value}</span><span>🦷 ${treat} (${$('#who').value})</span><span>📅 ${d}, ${slot}</span>`;
    go(3);
  };
  $$('.back', bk).forEach(b => b.onclick = () => go(step - 1));
  $('#send').onclick = () => {
    const m = `Hello Mano Dental, I would like to book an appointment.\nName: ${$('#name').value.trim()}\nPhone: ${$('#phone').value}\nPatient: ${$('#who').value}\nTreatment: ${treat}\nDate: ${$('#date').value}\nTime: ${slot}\n${$('#note').value.trim()}`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`, '_blank');
  };
}