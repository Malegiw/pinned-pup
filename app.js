(function(){
'use strict';
var $ = function(s, r){ return (r || document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function pad(n){ return String(n).padStart(2, '0'); }
var DAY = 86400000;
var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var fDate = new Intl.DateTimeFormat('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
var fShort = new Intl.DateTimeFormat('id-ID', {day:'numeric', month:'short', year:'numeric'});
var fTime = new Intl.DateTimeFormat('id-ID', {hour:'2-digit', minute:'2-digit', hour12:false});
var fMon = new Intl.DateTimeFormat('id-ID', {month:'short'});
var fMonLong = new Intl.DateTimeFormat('id-ID', {month:'long', year:'numeric'});

var BR = [
  {n:1, name:'Kerikil',  desc:'Butiran keras terpisah, susah keluar', pan:'18-1750', pname:'Viva Magenta', hex:'#BB2649', ink:'#FFFFFF', mood:'oops'},
  {n:2, name:'Gumpal',   desc:'Lonjong tapi bergerindil', pan:'16-1546', pname:'Living Coral', hex:'#FF6F61', ink:'#24214D', mood:'meh'},
  {n:3, name:'Retak',    desc:'Lonjong dengan retakan di permukaan', pan:'15-0343', pname:'Greenery', hex:'#88B04B', ink:'#24214D', mood:'happy'},
  {n:4, name:'Sempurna', desc:'Lembut, mulus, seperti sosis. Ideal!', pan:'15-5519', pname:'Turquoise', hex:'#45B5AA', ink:'#24214D', mood:'happy'},
  {n:5, name:'Lembek',   desc:'Gumpalan lembut dengan tepi jelas', pan:'13-0647', pname:'Illuminating', hex:'#F5DF4D', ink:'#24214D', mood:'happy'},
  {n:6, name:'Bubur',    desc:'Lembek, tepi tidak beraturan', pan:'13-1023', pname:'Peach Fuzz', hex:'#FFBE98', ink:'#24214D', mood:'meh'},
  {n:7, name:'Mencret',  desc:'Cair seperti air, tanpa bentuk', pan:'17-3938', pname:'Very Peri', hex:'#6667AB', ink:'#FFFFFF', mood:'oops'}
];
function br(n){ return BR[Math.min(7, Math.max(1, n || 4)) - 1]; }
var TOILET = [['duduk','Duduk'],['jongkok','Jongkok'],['alam','Alam bebas']];
function toiletName(k){ for (var i = 0; i < TOILET.length; i++) if (TOILET[i][0] === k) return TOILET[i][1]; return 'Duduk'; }

/* ---------- cartoon poop ---------- */
function poop(size, mood, cls){
  mood = mood || 'happy';
  var mouth = mood === 'oops'
    ? '<path d="M26.5 54.5q2.75-3 5.5 0q2.75 3 5.5 0" fill="none" stroke="var(--poop-line)" stroke-width="2.2" stroke-linecap="round"/>'
    : mood === 'meh'
    ? '<path d="M27.5 53.5h9" stroke="var(--poop-line)" stroke-width="2.4" stroke-linecap="round"/>'
    : '<path d="M26.5 51.5Q32 58.5 37.5 51.5Z" fill="var(--poop-line)" stroke="var(--poop-line)" stroke-width="1.6" stroke-linejoin="round"/><path d="M29.5 54.6q2.5 1.6 5 0" fill="none" stroke="#FF8FA3" stroke-width="1.8" stroke-linecap="round"/>';
  var brow = mood === 'oops' ? '<path d="M20 39.5l6 1.6M44 39.5l-6 1.6" stroke="var(--poop-line)" stroke-width="2" stroke-linecap="round"/>' : '';
  return '<svg class="poop ' + (cls || '') + '" viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true">' +
    '<path d="M34.5 5.5c-1.2 4.6 1.4 8 4.6 10.6-4.2 1.8-9.2.8-10.8-2.2-1.9-3.6 1.6-7 6.2-8.4z" fill="var(--poop)" stroke="var(--poop-line)" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<ellipse cx="32" cy="23" rx="12.5" ry="7.8" fill="var(--poop)" stroke="var(--poop-line)" stroke-width="2.4"/>' +
    '<ellipse cx="32" cy="35" rx="19.5" ry="9" fill="var(--poop)" stroke="var(--poop-line)" stroke-width="2.4"/>' +
    '<ellipse cx="32" cy="49" rx="26.5" ry="11" fill="var(--poop)" stroke="var(--poop-line)" stroke-width="2.4"/>' +
    '<path d="M24.5 19.5q2.5-2.4 6-2.6M17.5 31.5q3.2-3 8.5-3.6M11.5 45q4-4.2 10.5-5" fill="none" stroke="var(--poop-hi)" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/>' +
    brow +
    '<ellipse cx="24.5" cy="45" rx="4" ry="4.6" fill="#FFFFFF" stroke="var(--poop-line)" stroke-width="1.4"/>' +
    '<ellipse cx="39.5" cy="45" rx="4" ry="4.6" fill="#FFFFFF" stroke="var(--poop-line)" stroke-width="1.4"/>' +
    '<circle cx="25.4" cy="46" r="2.2" fill="#24140A"/><circle cx="40.4" cy="46" r="2.2" fill="#24140A"/>' +
    '<circle cx="26.2" cy="45" r=".8" fill="#FFFFFF"/><circle cx="41.2" cy="45" r=".8" fill="#FFFFFF"/>' +
    '<ellipse cx="16.5" cy="51.5" rx="3.6" ry="2.1" fill="#FF8FA3" opacity=".8"/><ellipse cx="47.5" cy="51.5" rx="3.6" ry="2.1" fill="#FF8FA3" opacity=".8"/>' +
    mouth + '</svg>';
}
function pinHTML(color, count, mood, drop){
  return '<div class="pin' + (drop ? ' drop' : '') + '"><svg viewBox="0 0 48 60" width="44" height="55" aria-hidden="true">' +
    '<path d="M24 57.5S4.5 37 4.5 22.5a19.5 19.5 0 0 1 39 0C43.5 37 24 57.5 24 57.5z" fill="' + color + '" stroke="var(--pin-stroke)" stroke-width="3"/>' +
    '<circle cx="24" cy="22" r="15" fill="var(--pin-face)"/></svg>' +
    '<span class="pin-poop">' + poop(26, mood) + '</span>' +
    (count > 1 ? '<b class="pin-count">' + count + '</b>' : '') + '</div>';
}
function miniRate(r){
  var s = '<span class="minirate" aria-label="Kenyamanan ' + r + ' dari 5">';
  for (var i = 1; i <= 5; i++) s += poop(14, 'happy', i <= r ? '' : 'off');
  return s + '</span>';
}

/* ---------- state ---------- */
var state = { pins: [], ready: false, view: 'peta', picking: false, draft: null, mode: 'loading', dirty: true, firstFit: false, lastAdded: null };

/* ---------- store ---------- */
var LKEY = 'pinnedpup.v1';
function readLocal(){ try { var v = localStorage.getItem(LKEY); return v ? JSON.parse(v) : []; } catch (e) { return memLocal; } }
var memLocal = [];
function writeLocal(arr){ memLocal = arr; try { localStorage.setItem(LKEY, JSON.stringify(arr)); return true; } catch (e) { return false; } }
function norm(p){
  if (!p) return null;
  var lat = +p.lat, lng = +p.lng, ts = +p.ts;
  if (!isFinite(lat) || !isFinite(lng) || !isFinite(ts)) return null;
  var f = p.fac && typeof p.fac === 'object' ? { spray: !!p.fac.spray, tissue: !!p.fac.tissue, soap: !!p.fac.soap, paid: !!p.fac.paid, fee: Math.max(0, +p.fac.fee || 0) } : null;
  if (f && !(f.spray || f.tissue || f.soap || f.paid)) f = null;
  return { id: String(p.id), ts: ts, lat: lat, lng: lng, place: String(p.place || '').slice(0, 60), bristol: Math.min(7, Math.max(1, +p.bristol || 4)),
    toilet: p.toilet || 'duduk', rating: Math.min(5, Math.max(0, +p.rating || 0)), dur: Math.max(0, +p.dur || 0), note: String(p.note || '').slice(0, 280), area: String(p.area || '').slice(0, 140),
    tags: Array.isArray(p.tags) ? p.tags.filter(function(t){ return typeof t === 'string'; }).slice(0, 12) : [], fac: f, timed: !!p.timed, example: !!p.example };
}
var Store = {
  init: function(){
    state.mode = 'local';
    state.pins = readLocal().map(norm).filter(Boolean);
    state.ready = true; onData();
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  },
  save: function(p){
    var arr = state.pins.filter(function(x){ return x.id !== p.id; }); arr.push(norm(p));
    if (!writeLocal(arr)) return Promise.reject(new Error('Penyimpanan HP penuh atau diblokir. Buat backup lalu hapus pin lama.'));
    state.pins = arr; onData();
    return Promise.resolve();
  },
  remove: function(id){
    state.pins = state.pins.filter(function(x){ return x.id !== id; }); writeLocal(state.pins); onData();
    return Promise.resolve();
  },
  replaceAll: function(arr){ state.pins = arr.map(norm).filter(Boolean); writeLocal(state.pins); onData(); }
};
function newId(){ return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function renderStatus(){
  var el = $('#status'), off = !navigator.onLine;
  el.dataset.mode = off ? 'local' : (state.mode === 'loading' ? 'loading' : 'cloud');
  el.querySelector('span').textContent = state.mode === 'loading' ? 'Memuat…' : off ? 'Offline' : 'Tersimpan di HP';
  el.title = 'Pin tersimpan di HP ini. Buat backup berkala dari tab Riwayat.';
}

/* ---------- toast ---------- */
var toastTimer;

/* ---------- views ---------- */
var VIEWS = ['peta', 'dashboard', 'riwayat', 'saya'];
function setView(v, noHash){
  if (VIEWS.indexOf(v) < 0) v = 'peta';
  state.view = v;
  $$('.view').forEach(function(s){ s.hidden = s.id !== 'view-' + v; });
  $$('.nav button').forEach(function(b){ if (b.dataset.view === v) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  $('#nav').style.setProperty('--i', VIEWS.indexOf(v));
  if (!noHash) { try { history.replaceState(null, '', '#' + v); } catch (e) {} }
  if (v === 'peta' && map) { map.invalidateSize(); if (!state.firstFit && state.pins.length) { state.firstFit = true; fitPins(false); } }
  if (v === 'dashboard') renderDash();
  if (v === 'riwayat') renderLog();
  if (v === 'saya') renderSaya();
}

function onData(){
  renderStatus();
  renderPins();
  renderOverlays();
  if (!state.firstFit && state.pins.length && state.view === 'peta') { state.firstFit = true; fitPins(false); }
  if (state.view === 'dashboard') renderDash();
  if (state.view === 'riwayat') renderLog();
  if (state.view === 'saya') renderSaya();
}

/* ---------- map ---------- */
var map = null, L_ = window.L, pinLayer = null, tiles = null, meMk = null, meCirc = null;
function isDark(){ var t = document.documentElement.getAttribute('data-theme'); if (t) return t === 'dark'; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches; }
function buildMap(){
  if (!L_) { $('#map').innerHTML = '<p style="padding:90px 20px;text-align:center;font-weight:800">Peta gagal dimuat. Dashboard dan riwayat tetap bisa dipakai.</p>'; return; }
  map = L_.map('map', { zoomControl: false, attributionControl: false, minZoom: 3, maxZoom: 20, zoomSnap: 0.5, tap: true });
  pinLayer = L_.layerGroup().addTo(map);
  map.setView([-6.3, 106.95], 11);
  styleMap();
  map.on('move', function(){ if (state.picking) updatePickCoord(); });
  map.on('moveend', function(){ if (state.picking) updatePickArea(); });
  map.on('click', function(e){
    if (state.picking) { map.panTo(e.latlng, { animate: !reduced }); return; }
    var ll = e.latlng;
    var pop = L_.popup({ className: 'pup-popup', maxWidth: 260, minWidth: 200 }).setLatLng(ll);
    var mk = function(){ var a = nearestVillage(ll.lat, ll.lng); return '<div class="pp"><h3>Pup di sini?</h3><p class="sub num">' + ll.lat.toFixed(5) + ', ' + ll.lng.toFixed(5) + '</p>' + (a && a.km < 15 ? '<p class="area">Dekat ' + esc(areaText(a)) + '</p>' : '') + '<div class="acts"><button class="btn sm" data-action="new-at" data-lat="' + ll.lat + '" data-lng="' + ll.lng + '">Tandai pup di sini</button></div></div>'; };
    pop.setContent(mk()).openOn(map);
    if (!GZ && !gzFailed) loadGZ().then(function(){ if (map.hasLayer(pop)) pop.setContent(mk()); }).catch(function(){});
  });
}
function styleMap(){
  if (!map || tiles) return;
  tiles = L_.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, maxNativeZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
}
function showMe(c, fly){
  if (!map) return;
  try {
  var ll = [c.latitude, c.longitude];
  if (!meMk) {
    meCirc = L_.circle(ll, { radius: c.accuracy || 30, color: '#3B82F6', weight: 1, fillColor: '#3B82F6', fillOpacity: 0.12, interactive: false }).addTo(map);
    meMk = L_.marker(ll, { icon: L_.divIcon({ className: 'me-dot', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] }), keyboard: false, interactive: false, zIndexOffset: -100 }).addTo(map);
  } else { meMk.setLatLng(ll); meCirc.setLatLng(ll); meCirc.setRadius(c.accuracy || 30); }
  if (fly) { if (reduced) map.setView(ll, Math.max(map.getZoom(), 17)); else map.flyTo(ll, Math.max(map.getZoom(), 17), { duration: 0.8 }); }
  } catch (e) {}
}
function getGPS(){
  return new Promise(function(res, rej){
    if (!navigator.geolocation) { rej(new Error('GPS tidak tersedia di perangkat ini.')); return; }
    navigator.geolocation.getCurrentPosition(function(p){ res(p.coords); }, function(e){
      rej(new Error(e.code === 1 ? 'Izin lokasi ditolak. Buka Pengaturan > Privasi & Keamanan > Layanan Lokasi > Situs Web Safari, pilih "Saat Digunakan".' : 'Lokasi GPS belum didapat. Coba lagi, atau pilih di peta.'));
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 20000 });
  });
}
function nearPlaceName(lat, lng){
  var best = null, bd = 80;
  state.pins.forEach(function(p){ if (!p.place) return; var dy = (p.lat - lat) * 111000, dx = (p.lng - lng) * 111000 * Math.cos(lat * Math.PI / 180), d = Math.sqrt(dx * dx + dy * dy); if (d < bd) { bd = d; best = p.place; } });
  return best;
}
function gpsIntoDraft(d){
  d.gps = 'loading'; d.gpsErr = '';
  if (state.draft === d) syncForm();
  getGPS().then(function(c){
    if (state.draft !== d) return;
    d.lat = +c.latitude.toFixed(6); d.lng = +c.longitude.toFixed(6); d.acc = Math.round(c.accuracy || 0); d.gps = 'ok';
    var nm = nearPlaceName(d.lat, d.lng); if (nm && !$('#f-place').value.trim()) $('#f-place').value = nm;
    syncForm(); showMe(c, false);
  }).catch(function(e){ if (state.draft !== d) return; d.gps = 'err'; d.gpsErr = e.message; syncForm(); });
}
function groupPins(pins){
  var m = {};
  pins.forEach(function(p){
    var k = p.lat.toFixed(3) + ',' + p.lng.toFixed(3);
    (m[k] = m[k] || { key: k, items: [] }).items.push(p);
  });
  return Object.keys(m).map(function(k){
    var g = m[k]; g.items.sort(function(a, b){ return b.ts - a.ts; });
    g.latest = g.items[0]; g.lat = g.latest.lat; g.lng = g.latest.lng;
    var names = {}; g.items.forEach(function(p){ if (p.place) names[p.place] = (names[p.place] || 0) + 1; });
    var best = ''; Object.keys(names).forEach(function(n){ if (!best || names[n] > names[best]) best = n; });
    g.place = best || 'Tanpa nama';
    return g;
  });
}
function renderPins(){
  if (!map || !pinLayer) return;
  pinLayer.clearLayers();
  groupPins(state.pins).forEach(function(g){
    var b = br(g.latest.bristol);
    var drop = state.lastAdded && g.items.some(function(p){ return p.id === state.lastAdded; });
    var mk = L_.marker([g.lat, g.lng], { icon: L_.divIcon({ className: 'pin-wrap', html: pinHTML(b.hex, g.items.length, b.mood, drop), iconSize: [44, 55], iconAnchor: [22, 54], popupAnchor: [0, -50] }),
      title: g.place + ' · ' + g.items.length + ' pup', riseOnHover: true });
    mk.bindPopup(function(){ return popupHTML(g); }, { className: 'pup-popup', maxWidth: 290, minWidth: 230, autoPanPaddingTopLeft: [16, 70], autoPanPaddingBottomRight: [16, 90] });
    mk.addTo(pinLayer);
  });
  state.lastAdded = null;
  if (heatLayer || heatOn) renderHeat();
}
function fitPins(animate){
  if (!map) return;
  var pts = state.pins.map(function(p){ return [p.lat, p.lng]; });
  if (!pts.length) return;
  if (pts.length === 1) { map.setView(pts[0], 12, { animate: animate && !reduced }); return; }
  map.fitBounds(L_.latLngBounds(pts), { padding: [60, 60], maxZoom: 13, animate: animate && !reduced });
}
function renderOverlays(){
  $('#map-loading').hidden = state.ready;
  $('#map-empty').hidden = !(state.ready && state.pins.length === 0) || state.picking;
  $('#map-banner').hidden = !state.pins.some(function(p){ return p.example; }) || state.picking;
  if (typeof renderInstallBar === 'function' && $('#install-bar')) renderInstallBar();
}

/* ---------- gazetteer: 83 ribu kelurahan/desa (data Kemendagri via paket geografis) ---------- */
var GZ = null, gzPromise = null, gzFailed = false;
function normName(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
var ALIAS = { benhil: 'bendungan hilir', jaksel: 'jakarta selatan', jakpus: 'jakarta pusat', jakbar: 'jakarta barat', jaktim: 'jakarta timur', jakut: 'jakarta utara', jkt: 'jakarta', bdg: 'bandung', bks: 'bekasi', tangsel: 'tangerang selatan' };
var STOP = { di: 1, dekat: 1, kel: 1, kelurahan: 1, desa: 1, kec: 1, kecamatan: 1, kota: 1, kab: 1, kabupaten: 1, sekitar: 1, daerah: 1, area: 1, jl: 1, jalan: 1, dkt: 1 };
function expandAlias(q){ return q.split(' ').map(function(w){ return ALIAS[w] || w; }).join(' '); }
function loadGZ(){
  if (GZ) return Promise.resolve(GZ);
  if (gzPromise) return gzPromise;
  gzPromise = fetch('wilayah.txt').then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(function(t){ GZ = parseGZ(t); gzFailed = false; setTimeout(onGZ, 0); return GZ; })
    .catch(function(e){ gzPromise = null; gzFailed = true; throw e; });
  return gzPromise;
}
function parseGZ(t){
  var L = t.split('\n'), i = 0;
  if (L[i++] !== '#C') throw new Error('format');
  var C = L[i++].split('\t'); i++;
  var D = [], V = [], grid = {}, dgrid = {}, cs = C.map(function(){ return { la: 0, ln: 0, k: 0 }; });
  while (i < L.length && L[i] !== '#V') {
    var p = L[i++].split('\t'), d = { n: p[0], c: +p[1], lat: +p[2] / 1e4, lng: +p[3] / 1e4, k: normName(p[0]) };
    var dk = Math.floor(d.lat * 10) + ':' + Math.floor(d.lng * 10); (dgrid[dk] = dgrid[dk] || []).push(D.length); D.push(d);
    var o = cs[d.c]; o.la += d.lat; o.ln += d.lng; o.k++;
  }
  i++;
  for (; i < L.length; i++) {
    var q = L[i].split('\t'); if (q.length < 4) continue;
    var v = { n: q[0], d: +q[1], lat: +q[2] / 1e4, lng: +q[3] / 1e4, k: normName(q[0]) };
    var key = Math.floor(v.lat * 10) + ':' + Math.floor(v.lng * 10); (grid[key] = grid[key] || []).push(V.length); V.push(v);
  }
  var Cx = C.map(function(c, j){ return { n: c, k: normName(c.replace(/^(Kab\.|Kota)\s+/, '')), lat: cs[j].la / (cs[j].k || 1), lng: cs[j].ln / (cs[j].k || 1) }; });
  return { C: Cx, D: D, V: V, grid: grid, dgrid: dgrid };
}
function nearestVillage(lat, lng){
  if (!GZ || lat == null) return null;
  var cy = Math.floor(lat * 10), cx = Math.floor(lng * 10), best = null, bd = Infinity, cos = Math.cos(lat * Math.PI / 180);
  for (var r = 1; r <= 3 && !best; r++) {
    for (var y = cy - r; y <= cy + r; y++) for (var x = cx - r; x <= cx + r; x++) {
      var cell = GZ.grid[y + ':' + x]; if (!cell) continue;
      for (var j = 0; j < cell.length; j++) { var v = GZ.V[cell[j]], dy = v.lat - lat, dx = (v.lng - lng) * cos, dd = dy * dy + dx * dx; if (dd < bd) { bd = dd; best = v; } }
    }
  }
  if (!best) return null;
  var d = GZ.D[best.d];
  return { vill: best.n, dist: d.n, city: GZ.C[d.c].n, km: Math.sqrt(bd) * 111 };
}
function areaText(a){ return a ? a.vill + ', ' + a.dist + ', ' + a.city : ''; }
function shortArea(s){ return String(s || '').split(', ').slice(0, 2).join(', '); }
function onGZ(){
  if (document.activeElement === $('#map-search')) renderResults();
  if (!$('#scrim').hidden && state.draft) syncForm();
  if (state.picking) updatePickArea();
}

/* ---------- search: tempatmu + OpenStreetMap (Photon, online) + kelurahan (offline) ---------- */
function titleCase(s){ return s.split(' ').filter(Boolean).map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '); }
function restOf(q, keys){
  var r = ' ' + q + ' ';
  keys.forEach(function(k){ if (k) r = r.replace(' ' + k + ' ', ' '); });
  return titleCase(r.trim().split(/\s+/).filter(function(w){ return w && !STOP[w]; }).join(' '));
}
function searchLocal(raw){
  var q = expandAlias(normName(raw)); if (!q) return { mine: [], area: [] };
  var qs = ' ' + q + ' ', mineOut = [], out = [];
  function inQ(k){ return k.length >= 4 && qs.indexOf(' ' + k + ' ') >= 0; }
  var mine = {};
  state.pins.forEach(function(p){ if (!p.place) return; var k = normName(p.place); if (!mine[k] || p.ts > mine[k].ts) mine[k] = { name: p.place, lat: p.lat, lng: p.lng, ts: p.ts, n: (mine[k] ? mine[k].n : 0) + 1, area: p.area }; else mine[k].n++; });
  Object.keys(mine).forEach(function(k){
    var m = mine[k];
    if (k.indexOf(q) >= 0 || inQ(k)) mineOut.push({ name: m.name, tag: 'Tempatmu · ' + m.n + ' pup' + (m.area ? ' · ' + shortArea(m.area) : ''), lat: m.lat, lng: m.lng, z: 18, score: m.n, exact: true, rest: '' });
  });
  mineOut.sort(function(a, b){ return b.score - a.score; });
  if (GZ) {
    var ctr = map ? map.getCenter() : { lat: -6.3, lng: 106.95 }, ccos = Math.cos(ctr.lat * Math.PI / 180);
    var near = function(lat, lng){ var dy = lat - ctr.lat, dx = (lng - ctr.lng) * ccos, km = Math.sqrt(dy * dy + dx * dx) * 111; return 45 * Math.max(0, 1 - km / 600); };
    var urban = function(ci){ return /^Kota /.test(GZ.C[ci].n) ? 15 : 0; };
    var distHit = {}, cityHit = {};
    GZ.D.forEach(function(d, i){ if (inQ(d.k)) distHit[i] = true; });
    GZ.C.forEach(function(c, i){ if (inQ(c.k)) cityHit[i] = true; });
    var vs = [];
    for (var i = 0; i < GZ.V.length; i++) {
      var v = GZ.V[i], s = 0;
      if (inQ(v.k)) s = 300 + v.k.length * 3;
      else if (q.length >= 3 && v.k.indexOf(q) === 0) s = 200 - Math.min(50, v.k.length - q.length);
      else if (q.length >= 4 && v.k.indexOf(q) > 0) s = 110;
      if (!s) continue;
      var dd = GZ.D[v.d], ck = GZ.C[dd.c].k;
      if (distHit[v.d] && dd.k !== v.k) s += 60;
      if (cityHit[dd.c] && ck !== v.k && ck !== dd.k) s += 40;
      s += urban(dd.c) + near(v.lat, v.lng);
      vs.push({ v: v, s: s });
    }
    vs.sort(function(a, b){ return b.s - a.s; });
    vs.slice(0, 10).forEach(function(x){
      var v = x.v, dd = GZ.D[v.d], c = GZ.C[dd.c];
      out.push({ name: v.n, tag: 'Kelurahan/Desa · Kec. ' + dd.n + ', ' + c.n, lat: v.lat, lng: v.lng, z: 16, score: x.s, approx: true,
        rest: restOf(q, [v.k, distHit[v.d] ? dd.k : '', cityHit[dd.c] ? c.k : '']) });
    });
    GZ.D.forEach(function(d, i){
      var s = 0;
      if (distHit[i]) s = 290 + d.k.length * 3; else if (q.length >= 3 && d.k.indexOf(q) === 0) s = 195 - Math.min(50, d.k.length - q.length); else if (q.length >= 4 && d.k.indexOf(q) > 0) s = 100;
      if (!s) return; if (cityHit[d.c] && GZ.C[d.c].k !== d.k) s += 40;
      s += urban(d.c) + near(d.lat, d.lng);
      out.push({ name: 'Kec. ' + d.n, tag: 'Kecamatan · ' + GZ.C[d.c].n, lat: d.lat, lng: d.lng, z: 14, score: s, approx: true, rest: restOf(q, [d.k, cityHit[d.c] ? GZ.C[d.c].k : '']) });
    });
    GZ.C.forEach(function(c, i){
      var s = 0;
      if (cityHit[i]) s = 280 + c.k.length * 3; else if (q.length >= 3 && c.k.indexOf(q) === 0) s = 190; else if (q.length >= 4 && c.k.indexOf(q) > 0) s = 100;
      if (s) s += urban(i) + near(c.lat, c.lng);
      if (s) out.push({ name: c.n, tag: 'Kota/Kabupaten', lat: c.lat, lng: c.lng, z: 12, score: s, approx: true, rest: restOf(q, [c.k]) });
    });
    out.sort(function(a, b){ return b.score - a.score; });
  }
  var seen = {}, area = [];
  out.forEach(function(r){ var key = r.name + '|' + r.lat.toFixed(3); if (seen[key] || area.length >= 5) return; seen[key] = 1; area.push(r); });
  return { mine: mineOut.slice(0, 3), area: area };
}

var POI = { restaurant: 'Restoran', cafe: 'Kafe', fast_food: 'Cepat saji', food_court: 'Food court', fuel: 'SPBU', toilets: 'Toilet umum', mall: 'Mal', supermarket: 'Supermarket', convenience: 'Minimarket', hotel: 'Hotel', hospital: 'Rumah sakit', clinic: 'Klinik', place_of_worship: 'Tempat ibadah', school: 'Sekolah', university: 'Kampus', bank: 'Bank', office: 'Kantor', company: 'Kantor', station: 'Stasiun', bus_station: 'Terminal', aerodrome: 'Bandara', parking: 'Parkir', park: 'Taman', residential: 'Perumahan', house: 'Rumah', apartments: 'Apartemen', marketplace: 'Pasar', bakery: 'Toko roti', pharmacy: 'Apotek', service: 'Rest area', services: 'Rest area', rest_area: 'Rest area' };
var photon = { q: '', res: [], loading: false, err: false, ctl: null, timer: null };
function photonToResult(f){
  var p = f.properties || {}, g = f.geometry && f.geometry.coordinates;
  if (!g) return null;
  var name = p.name || [p.street, p.housenumber].filter(Boolean).join(' ');
  if (!name) return null;
  var kind = POI[p.osm_value] || (p.osm_value ? titleCase(String(p.osm_value).replace(/_/g, ' ')) : 'Tempat');
  var addr = [p.street, p.district || p.locality, p.city || p.county].filter(function(x, i, a){ return x && a.indexOf(x) === i && x !== name; }).join(', ');
  return { name: name, tag: kind + (addr ? ' · ' + addr : ''), lat: g[1], lng: g[0], z: 18, exact: true, rest: '', poi: true };
}
function photonSearch(raw){
  var q = raw.trim();
  clearTimeout(photon.timer);
  if (photon.ctl) { try { photon.ctl.abort(); } catch (e) {} photon.ctl = null; }
  if (q.length < 3 || !navigator.onLine) { photon.q = q; photon.res = []; photon.loading = false; photon.err = false; return; }
  photon.loading = true; photon.err = false;
  photon.timer = setTimeout(function(){
    var ctl = window.AbortController ? new AbortController() : null; photon.ctl = ctl;
    var c = map ? map.getCenter() : { lat: -6.3, lng: 106.95 };
    var url = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(q) + '&limit=10&lat=' + c.lat.toFixed(4) + '&lon=' + c.lng.toFixed(4) + '&bbox=94.5,-11.5,141.5,6.5';
    fetch(url, ctl ? { signal: ctl.signal } : {}).then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); }).then(function(j){
      if (photon.ctl !== ctl) return;
      var seen = {};
      photon.q = q; photon.loading = false;
      photon.res = (j.features || []).map(photonToResult).filter(function(r){ if (!r) return false; var k = r.name + '|' + r.lat.toFixed(4); if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 6);
      renderResults();
    }).catch(function(e){ if (e && e.name === 'AbortError') return; photon.loading = false; photon.err = true; renderResults(); });
  }, 350);
}
var lastResults = [], searchTimer = null;
function gmSearch(q){ return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
function renderResults(){
  var raw = $('#map-search').value, ul = $('#map-results');
  if (!raw.trim()) { ul.hidden = true; lastResults = []; return; }
  if (!GZ && !gzFailed) loadGZ().catch(function(){ renderResults(); });
  var loc = searchLocal(raw);
  var poi = photon.q === raw.trim() ? photon.res : [];
  lastResults = loc.mine.concat(poi, loc.area);
  var idx = 0;
  function rows(list, title){
    if (!list.length) return '';
    return '<li class="src">' + title + '</li>' + list.map(function(r){
      return '<li><button data-res="' + (idx++) + '"><b>' + esc(r.name) + '</b><small>' + esc(r.tag) + (r.rest ? ' · <span class="rest">nama: ' + esc(r.rest) + '</span>' : '') + '</small></button></li>';
    }).join('');
  }
  var html = rows(loc.mine, 'Tempatmu') + rows(poi, 'Tempat (OpenStreetMap)');
  if (photon.loading) html += '<li class="info-row">Mencari restoran dan tempat…</li>';
  else if (photon.err) html += '<li class="info-row">Pencarian tempat sedang gagal. Wilayah tetap bisa dicari.</li>';
  else if (!navigator.onLine) html += '<li class="info-row">Offline: hanya kelurahan dan tempatmu yang bisa dicari.</li>';
  html += rows(loc.area, 'Wilayah');
  if (!GZ) html += '<li class="info-row">' + (gzFailed ? 'Data kelurahan gagal dimuat. Ketik lagi untuk mencoba ulang.' : 'Memuat data kelurahan…') + '</li>';
  html += '<li class="gm-row"><a class="gm" href="' + gmSearch(raw.trim()) + '" target="_blank" rel="noopener">Cari "' + esc(raw.trim()) + '" di Google Maps<small>Kalau tidak ketemu di atas: tekan lama titiknya di Google Maps, salin koordinatnya, lalu tempel di form pup.</small></a></li>';
  ul.innerHTML = html; ul.hidden = false;
}
var searchMk = null;
function goResult(r){
  if (!map || !r) return;
  $('#map-results').hidden = true; $('#map-search').blur();
  if (searchMk) { map.removeLayer(searchMk); searchMk = null; }
  if (!state.picking) {
    searchMk = L_.marker([r.lat, r.lng], { icon: L_.divIcon({ className: 'search-mk', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] }), keyboard: false }).addTo(map);
    var act = r.exact
      ? '<button class="btn sm" data-action="new-at" data-lat="' + r.lat + '" data-lng="' + r.lng + '" data-place="' + esc(r.name) + '">Tandai pup di sini</button>'
      : '<button class="btn sm" data-action="pick-at" data-lat="' + r.lat + '" data-lng="' + r.lng + '" data-place="' + esc(r.rest || '') + '">Tandai pup di sekitar sini</button>';
    searchMk.bindPopup('<div class="pp"><h3>' + esc(r.name) + '</h3><p class="sub">' + esc(r.tag) + '</p>' +
      (r.approx ? '<p class="note">Titik ini pusat wilayah, bukan alamat persis. Kamu bisa menggeser petanya sebelum menyimpan.</p>' : '') +
      '<div class="acts">' + act + '<a class="btn sm ghost" href="' + gmSearch(r.poi ? r.name + ' ' + r.tag.split(' · ').slice(1).join(' ') : ($('#map-search').value || r.name).trim()) + '" target="_blank" rel="noopener">Google Maps</a></div></div>',
      { className: 'pup-popup', maxWidth: 290, minWidth: 230, autoPanPaddingTopLeft: [16, 70], autoPanPaddingBottomRight: [16, 90] });
    map.once('moveend', function(){ if (searchMk) searchMk.openPopup(); });
  }
  if (reduced) map.setView([r.lat, r.lng], r.z); else map.flyTo([r.lat, r.lng], r.z, { duration: 0.9 });
}
function updatePickArea(){
  if (!map) return;
  var el = $('#pick-area'), c = map.getCenter();
  if (!GZ) { el.textContent = gzFailed ? '' : 'Mencari nama wilayah…'; if (!gzFailed) loadGZ().catch(function(){ el.textContent = ''; }); return; }
  var a = nearestVillage(c.lat, c.lng);
  el.textContent = a && a.km < 15 ? 'Dekat ' + areaText(a) : '';
}

/* ---------- pick mode ---------- */
function startPick(){
  state.picking = true; closeSheet(true);
  setView('peta');
  if (map) {
    map.invalidateSize();
    map.closePopup();
    if (state.draft && state.draft.lat != null) map.setView([state.draft.lat, state.draft.lng], Math.max(map.getZoom(), 12), { animate: false });
  }
  $('#pick-center').innerHTML = pinHTML(br(state.draft ? state.draft.bristol : 4).hex, 0, 'happy');
  ['#pick-center', '#pick-dot', '#pick-bar'].forEach(function(s){ $(s).hidden = false; });
  $('#app').classList.add('picking'); $('#map-results').hidden = true; $('#map-search').value = '';
  if (searchMk && map) { map.removeLayer(searchMk); searchMk = null; }
  renderOverlays(); updatePickCoord(); updatePickArea();
}
function endPick(ok){
  state.picking = false;
  ['#pick-center', '#pick-dot', '#pick-bar'].forEach(function(s){ $(s).hidden = true; });
  $('#app').classList.remove('picking'); $('#map-results').hidden = true;
  if (ok && map) { var c = map.getCenter(); state.draft.lat = +c.lat.toFixed(6); state.draft.lng = +c.lng.toFixed(6); }
  if (ok) { state.draft.gps = ''; state.draft.acc = null; }
  renderOverlays();
  openSheet(state.draft, true);
}
function updatePickCoord(){ if (!map) return; var c = map.getCenter(); $('#pick-coord').textContent = '(' + c.lat.toFixed(5) + ', ' + c.lng.toFixed(5) + ')'; }

/* ---------- sheet / form ---------- */
function toInput(ts){ var d = new Date(ts); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function fromInput(v){ var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v || ''); if (!m) return NaN; return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime(); }
function parseCoords(s){
  var g = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/.exec(String(s || ''));
  if (g) return { lat: +g[1], lng: +g[2] };
  var m = /(-?\d{1,2}(?:\.\d+)?)\s*[,\s]\s*(-?\d{1,3}(?:\.\d+)?)/.exec(String(s || '').replace(/%2C/gi, ','));
  if (!m) return null;
  var lat = +m[1], lng = +m[2];
  if (!(lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)) return null;
  if (String(m[1]).indexOf('.') < 0 && String(m[2]).indexOf('.') < 0) return null;
  return { lat: lat, lng: lng };
}
function placeStats(){
  var m = {};
  state.pins.forEach(function(p){ if (!p.place) return; var k = p.place.toLowerCase(); if (!m[k]) m[k] = { name: p.place, lat: p.lat, lng: p.lng, n: 0, ts: 0 }; m[k].n++; if (p.ts > m[k].ts) { m[k].ts = p.ts; m[k].lat = p.lat; m[k].lng = p.lng; m[k].name = p.place; } });
  return Object.keys(m).map(function(k){ return m[k]; }).sort(function(a, b){ return b.n - a.n || b.ts - a.ts; });
}
function buildFormStatic(){
  $('#f-bristol').innerHTML = BR.map(function(b){
    return '<div class="pchip"><input type="radio" name="bristol" id="f-b' + b.n + '" value="' + b.n + '"><label for="f-b' + b.n + '"><span class="sw" style="background:' + b.hex + ';color:' + b.ink + '"><b>' + b.n + '</b>' + poop(34, b.mood) + '</span><span class="lb"><strong>' + b.name + '</strong><small>PANTONE ' + b.pan + '</small></span></label></div>';
  }).join('');
  $('#f-toilet').innerHTML = TOILET.map(function(t){ return '<label><input type="radio" name="toilet" id="f-t-' + t[0] + '" value="' + t[0] + '">' + t[1] + '</label>'; }).join('');
  var r = ''; for (var i = 1; i <= 5; i++) r += '<label title="' + i + ' dari 5"><input type="radio" name="rating" id="f-r' + i + '" value="' + i + '" aria-label="' + i + ' dari 5">' + poop(32, 'happy') + '</label>';
  $('#f-rating').innerHTML = r + '<output id="f-rating-out"></output>';
  $('#f-tags').innerHTML = TAGS.map(function(t){ return '<label><input type="checkbox" name="tag" value="' + t[0] + '" id="f-tag-' + t[0] + '">' + t[1] + ' ' + t[2] + '</label>'; }).join('');
  $('#f-fac').innerHTML = FAC.map(function(f){ return '<label><input type="checkbox" name="fac" value="' + f[0] + '" id="f-fac-' + f[0] + '">' + f[1] + ' ' + f[2] + '</label>'; }).join('');
}
var RATE_TXT = ['', 'Horor', 'Kurang', 'Lumayan', 'Nyaman', 'Istana'];
function syncForm(){
  var d = state.draft;
  $('#f-time-read').textContent = isFinite(d.ts) ? fDate.format(d.ts) + ', pukul ' + fTime.format(d.ts) : 'Isi tanggal dan jam.';
  var c = $('#f-coord');
  if (d.lat != null) { c.textContent = d.lat.toFixed(5) + ', ' + d.lng.toFixed(5) + (d.acc ? ' · ±' + d.acc + ' m' : ''); c.classList.remove('none'); }
  else { c.textContent = d.gps === 'loading' ? 'Mencari lokasi GPS…' : 'Belum ada lokasi'; c.classList.add('none'); }
  var ge = $('#f-gps-err'); ge.hidden = d.gps !== 'err'; ge.textContent = d.gpsErr || '';
  var fa = $('#f-area'), ub = $('#f-use-area'), a = d.lat != null ? nearestVillage(d.lat, d.lng) : null;
  if (d.lat == null) { fa.textContent = ''; ub.hidden = true; }
  else if (!GZ) { fa.textContent = gzFailed ? '' : 'Mencari nama kelurahan…'; ub.hidden = true; if (!gzFailed) loadGZ().catch(function(){ fa.textContent = ''; }); }
  else if (a && a.km < 15) { fa.textContent = 'Dekat ' + areaText(a); ub.hidden = !!$('#f-place').value.trim(); ub.dataset.name = a.vill; }
  else { fa.textContent = 'Di luar wilayah kelurahan yang dikenal.'; ub.hidden = true; }
  var b = br(d.bristol); $('#f-bristol-desc').textContent = 'Tipe ' + b.n + ' · ' + b.name + ': ' + b.desc + (/[.!?]$/.test(b.desc) ? ' ' : '. ') + 'Warna ' + b.pname + '.';
  $$('#f-rating label').forEach(function(l, i){ l.classList.toggle('off', i + 1 > d.rating); });
  $('#f-rating-out').textContent = d.rating ? RATE_TXT[d.rating] : 'Belum dinilai';
  $('#f-fee-row').hidden = !$('#f-fac-paid').checked;
  $$('#f-recent button').forEach(function(btn){
    var on = d.lat != null && Math.abs(+btn.dataset.lat - d.lat) < 0.0006 && Math.abs(+btn.dataset.lng - d.lng) < 0.0006;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
function openSheet(draft, keep){
  state.draft = draft;
  var d = draft, isEdit = !!d.id && state.pins.some(function(p){ return p.id === d.id; });
  $('#sheet-title').textContent = isEdit ? 'Ubah pup' : 'Tandai pup';
  $('#f-time').value = isFinite(d.ts) ? toInput(d.ts) : '';
  $('#f-place').value = d.place || '';
  $('#f-coords').value = ''; $('#f-coords-hint').textContent = 'Di Google Maps: tekan lama titiknya, salin angka koordinat, lalu tempel di sini.';
  $('#f-note').value = d.note || '';
  $('#f-dur').value = d.dur != null ? d.dur : 5;
  var bb = $('#f-b' + d.bristol); if (bb) bb.checked = true;
  var tt = $('#f-t-' + d.toilet); if (tt) tt.checked = true;
  $$('#f-rating input').forEach(function(i){ i.checked = +i.value === d.rating; });
  $$('#f-tags input').forEach(function(i){ i.checked = (d.tags || []).indexOf(i.value) >= 0; });
  var fc = d.fac || {}; $$('#f-fac input').forEach(function(i){ i.checked = !!fc[i.value]; }); $('#f-fee').value = fc.fee ? fc.fee : '';
  $('#f-timed').hidden = !d.timed;
  var ps = placeStats();
  $('#dl-places').innerHTML = ps.map(function(p){ return '<option value="' + esc(p.name) + '">'; }).join('');
  $('#f-recent').innerHTML = ps.slice(0, 6).map(function(p){ return '<button type="button" data-recent data-lat="' + p.lat + '" data-lng="' + p.lng + '" data-name="' + esc(p.name) + '" aria-pressed="false">' + esc(p.name) + ' <small>' + p.n + '×</small></button>'; }).join('');
  $('#f-err').hidden = true;
  renderActions(isEdit, false);
  syncForm();
  $('#scrim').hidden = false;
  document.body.style.overflow = 'hidden';
  if (!keep) $('#sheet').scrollTop = 0;
  setTimeout(function(){ var t = $('#sheet-title'); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }, 30);
}
function renderActions(isEdit){
  $('#sheet-actions').innerHTML = (isEdit ? '<button type="button" class="btn line" data-action="del-now">Hapus</button>' : '') + '<span class="spacer"></span><button type="button" class="btn line" data-action="close">Batal</button><button type="submit" class="btn" id="btn-save">' + (isEdit ? 'Simpan perubahan' : 'Simpan pup') + '</button>';
}
function closeSheet(keepDraft){
  $('#scrim').hidden = true; document.body.style.overflow = '';
  if (!keepDraft) state.draft = null;
}
function newDraft(extra){
  var d = { id: null, ts: Date.now(), lat: null, lng: null, place: '', bristol: 4, toilet: 'duduk', rating: 4, dur: 5, note: '', tags: [], fac: null, timed: false };
  if (extra) for (var k in extra) d[k] = extra[k];
  return d;
}
function readForm(){
  var d = state.draft;
  d.ts = fromInput($('#f-time').value);
  d.place = $('#f-place').value.trim();
  d.note = $('#f-note').value.trim();
  d.dur = Math.max(0, Math.min(240, parseInt($('#f-dur').value, 10) || 0));
  var b = $('input[name=bristol]:checked'); d.bristol = b ? +b.value : 4;
  var t = $('input[name=toilet]:checked'); d.toilet = t ? t.value : 'duduk';
  d.tags = $$('#f-tags input:checked').map(function(i){ return i.value; });
  var fc = {}; $$('#f-fac input').forEach(function(i){ fc[i.value] = i.checked; }); fc.fee = fc.paid ? Math.max(0, parseInt($('#f-fee').value, 10) || 0) : 0; d.fac = fc;
  return d;
}
function submitForm(){
  var d = readForm(); var err = $('#f-err');
  var msg = '';
  if (!isFinite(d.ts)) msg = 'Isi tanggal dan jam dulu.';
  else if (d.ts > Date.now() + 5 * 60000) msg = 'Jamnya ada di masa depan. Cek lagi tanggal dan jamnya.';
  else if (d.lat == null) msg = d.gps === 'loading' ? 'Tunggu sebentar, GPS masih mencari lokasi.' : 'Pilih lokasi dulu: tekan GPS, Peta, tap tempat sebelumnya, atau tempel koordinat.';
  if (msg) { err.textContent = msg; err.hidden = false; err.scrollIntoView({ block: 'nearest' }); return; }
  err.hidden = true;
  var isEdit = !!d.id && state.pins.some(function(p){ return p.id === d.id; });
  var old = isEdit ? state.pins.filter(function(p){ return p.id === d.id; })[0] : null;
  var rec = norm({ id: d.id || newId(), ts: d.ts, lat: d.lat, lng: d.lng, place: d.place, bristol: d.bristol, toilet: d.toilet, rating: d.rating, dur: d.dur, note: d.note, example: old ? old.example : false });
  var body = { id: rec.id, ts: rec.ts, lat: rec.lat, lng: rec.lng, place: rec.place, bristol: rec.bristol, toilet: rec.toilet, rating: rec.rating, dur: rec.dur, note: rec.note };
  var na = nearestVillage(rec.lat, rec.lng);
  if (na && na.km < 15) body.area = areaText(na); else if (old && old.area && old.lat === rec.lat && old.lng === rec.lng) body.area = old.area;
  if (rec.example) body.example = true;
  body.tags = d.tags || [];
  if (d.fac && (d.fac.spray || d.fac.tissue || d.fac.soap || d.fac.paid)) body.fac = d.fac;
  if (d.timed) body.timed = true;
  if (d.acc && d.gps === 'ok') body.acc = d.acc;
  var btn = $('#btn-save'); if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan…'; }
  state.lastAdded = isEdit ? null : rec.id;
  Store.save(body).then(function(){
    closeSheet(); haptic('success');
    if (!rec.example) checkBadges(true);
    toast((isEdit ? 'Perubahan tersimpan · ' : 'Pup tercatat · ') + (rec.place || 'tanpa nama') + ', ' + fShort.format(rec.ts) + ' ' + fTime.format(rec.ts));
    if (!isEdit && map && state.view === 'peta') map.setView([rec.lat, rec.lng], Math.max(map.getZoom(), 11), { animate: !reduced });
  }).catch(function(e){
    if (btn) { btn.disabled = false; btn.textContent = isEdit ? 'Simpan perubahan' : 'Simpan pup'; }
    err.textContent = (e && e.message) || 'Gagal menyimpan. Coba lagi.'; err.hidden = false;
  });
}
function editPin(id){
  var p = state.pins.filter(function(x){ return x.id === id; })[0]; if (!p) return;
  if (map) map.closePopup();
  openSheet({ id: p.id, ts: p.ts, lat: p.lat, lng: p.lng, place: p.place, bristol: p.bristol, toilet: p.toilet, rating: p.rating, dur: p.dur, note: p.note, tags: p.tags, fac: p.fac, timed: p.timed });
}

/* ---------- examples ---------- */
function loadExamples(){
  var ex = makeExamples(Date.now());
  var i = 0;
  toast('Mengisi data contoh…');
  (function next(){
    if (i >= ex.length) { checkBadges(false); toast('Data contoh siap. Hapus kapan saja lewat tombol "Hapus contoh".'); state.firstFit = false; if (state.pins.length) { state.firstFit = true; fitPins(true); } return; }
    Store.save(ex[i++]).then(next).catch(function(e){ toast((e && e.message) || 'Gagal mengisi contoh.'); });
  })();
}
function clearExamples(){
  var ids = state.pins.filter(function(p){ return p.example; }).map(function(p){ return p.id; });
  var i = 0;
  (function next(){
    if (i >= ids.length) { checkBadges(false); toast('Data contoh dihapus. Saatnya pin pup sungguhan!'); return; }
    Store.remove(ids[i++]).then(next).catch(function(){ toast('Gagal menghapus sebagian contoh. Coba lagi.'); });
  })();
}

/* ---------- stats ---------- */
function dkey(ts){ var d = new Date(ts); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function relTime(ts){
  var diff = Date.now() - ts;
  if (diff < 60000) return 'baru saja';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' menit lalu';
  if (dkey(ts) === dkey(Date.now())) return Math.floor(diff / 3600000) + ' jam lalu';
  var y = new Date(); y.setDate(y.getDate() - 1);
  if (dkey(ts) === dkey(y.getTime())) return 'kemarin ' + fTime.format(ts);
  var days = Math.round((startOfDay(Date.now()) - startOfDay(ts)) / DAY);
  if (days < 30) return days + ' hari lalu';
  return fShort.format(ts);
}
function startOfDay(ts){ var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function computeStats(pins){
  var now = Date.now(), S = { total: pins.length };
  var byDay = {}; pins.forEach(function(p){ var k = dkey(p.ts); byDay[k] = (byDay[k] || 0) + 1; });
  S.byDay = byDay;
  var n = new Date();
  S.month = pins.filter(function(p){ var d = new Date(p.ts); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;
  var since30 = startOfDay(now) - 29 * DAY;
  S.last30 = pins.filter(function(p){ return p.ts >= since30; }).length;
  S.avg30 = S.last30 / 30;
  var d = new Date(); d.setHours(12, 0, 0, 0);
  if (!byDay[dkey(d.getTime())]) d.setDate(d.getDate() - 1);
  var st = 0; while (byDay[dkey(d.getTime())]) { st++; d.setDate(d.getDate() - 1); }
  S.streak = st;
  var keys = Object.keys(byDay).sort(), best = 0, run = 0, prev = null;
  keys.forEach(function(k){ var t = new Date(k + 'T12:00:00').getTime(); run = prev != null && Math.round((t - prev) / DAY) === 1 ? run + 1 : 1; prev = t; if (run > best) best = run; });
  S.bestStreak = best;
  S.hours = new Array(24).fill(0); S.wd = new Array(7).fill(0);
  pins.forEach(function(p){ var dt = new Date(p.ts); S.hours[dt.getHours()]++; S.wd[(dt.getDay() + 6) % 7]++; });
  S.br = new Array(8).fill(0); pins.forEach(function(p){ S.br[p.bristol]++; });
  S.ideal = pins.length ? (S.br[3] + S.br[4]) / pins.length : 0;
  S.toilet = { duduk: 0, jongkok: 0, alam: 0 }; pins.forEach(function(p){ S.toilet[p.toilet] = (S.toilet[p.toilet] || 0) + 1; });
  var durs = pins.filter(function(p){ return p.dur > 0; }); S.avgDur = durs.length ? durs.reduce(function(a, p){ return a + p.dur; }, 0) / durs.length : 0;
  S.longest = pins.reduce(function(a, p){ return p.dur > (a ? a.dur : 0) ? p : a; }, null);
  var pl = {}; pins.forEach(function(p){ var k = (p.place || 'Tanpa nama').toLowerCase(); if (!pl[k]) pl[k] = { name: p.place || 'Tanpa nama', n: 0, rs: 0, rn: 0, ts: 0, br: {} }; var o = pl[k]; o.n++; if (p.rating) { o.rs += p.rating; o.rn++; } if (p.ts > o.ts) o.ts = p.ts; o.br[p.bristol] = (o.br[p.bristol] || 0) + 1; });
  S.places = Object.keys(pl).map(function(k){ return pl[k]; }).sort(function(a, b){ return b.n - a.n; });
  S.uniquePlaces = S.places.filter(function(p){ return p.name !== 'Tanpa nama'; }).length;
  S.last = pins.reduce(function(a, p){ return !a || p.ts > a.ts ? p : a; }, null);
  S.months = [];
  for (var i = 5; i >= 0; i--) { var md = new Date(n.getFullYear(), n.getMonth() - i, 1); S.months.push({ d: md, n: 0 }); }
  pins.forEach(function(p){ var dt = new Date(p.ts); S.months.forEach(function(m){ if (m.d.getMonth() === dt.getMonth() && m.d.getFullYear() === dt.getFullYear()) m.n++; }); });
  S.early = pins.filter(function(p){ return new Date(p.ts).getHours() < 6; }).length;
  S.owl = pins.filter(function(p){ var h = new Date(p.ts).getHours(); return h >= 0 && h < 4; }).length;
  S.peakHour = S.hours.indexOf(Math.max.apply(null, S.hours));
  return S;
}

/* ---------- dashboard ---------- */
var WD = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
var WDL = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
function barsHTML(vals, labels, labelEvery, peakIdx, unit){
  var max = Math.max.apply(null, vals.concat([1]));
  var top = Math.max(1, Math.ceil(max));
  var bars = vals.map(function(v, i){
    var h = v / top * 100;
    var lab = (i === peakIdx && v > 0) || (vals.length <= 7 && v > 0) ? '<em style="bottom:calc(' + h + '% + 3px)">' + v + '</em>' : '';
    return '<div class="b' + (i === peakIdx && v > 0 ? ' peak' : '') + '" title="' + esc(labels[i]) + ': ' + v + ' ' + unit + '">' + lab + '<i style="height:' + h + '%"></i></div>';
  }).join('');
  var axis = labels.map(function(l, i){ return '<span>' + (i % labelEvery === 0 ? esc(l) : '') + '</span>'; }).join('');
  return '<div class="bars"><div class="gridline" style="bottom:50%"></div>' + bars + '</div><div class="axis">' + axis + '</div>';
}
function heatHTML(byDay){
  var today = new Date(); today.setHours(12, 0, 0, 0);
  var mon = new Date(today); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7) - 7 * 11);
  var head = '<span></span>';
  var cols = [];
  for (var w = 0; w < 12; w++) { var cd = new Date(mon); cd.setDate(cd.getDate() + w * 7); cols.push(cd); }
  var lastM = -1;
  cols.forEach(function(cd){ var lab = cd.getMonth() !== lastM ? fMon.format(cd) : ''; lastM = cd.getMonth(); head += '<span class="dl" style="font-size:10px">' + esc(lab) + '</span>'; });
  var rows = '';
  for (var r = 0; r < 7; r++) {
    rows += '<span class="dl">' + (r % 2 === 0 ? WD[r] : '') + '</span>';
    cols.forEach(function(cd){
      var x = new Date(cd); x.setDate(x.getDate() + r);
      var k = dkey(x.getTime()), v = byDay[k] || 0;
      var fut = x.getTime() > today.getTime() + DAY / 2;
      var cls = fut ? 'fut' : v === 0 ? '' : v === 1 ? 'l1' : v === 2 ? 'l2' : 'l3';
      if (dkey(x.getTime()) === dkey(today.getTime())) cls += ' today';
      rows += '<span class="c ' + cls + '" title="' + esc(fShort.format(x)) + ': ' + v + ' pup"></span>';
    });
  }
  return '<div class="heat-wrap"><div class="heat">' + head + rows + '</div></div><div class="heat-legend">0 <i style="background:var(--cell-0)"></i><i style="background:var(--cell-1)"></i><i style="background:var(--cell-2)"></i><i style="background:var(--cell-3)"></i> 3+ pup/hari</div>';
}
var MEDAL = {
  first: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 21s-7-6.4-7-11.6a7 7 0 0 1 14 0C19 14.6 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>',
  sun: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg class="ico" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  map: '<svg class="ico" viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  flame: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-5 1-8z"/></svg>',
  star: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
  squat: '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="9" width="14" height="8" rx="4"/><circle cx="12" cy="13" r="1.6"/><path d="M8 20h8"/></svg>',
  hundred: '<b style="font:900 13px/1 var(--font-body)">100</b>'
};
function kpi(k, v, unit, d){ return '<div class="kpi"><div class="k">' + k + '</div><div class="v">' + v + '<small>' + unit + '</small></div><div class="d">' + esc(d || '') + '</div></div>'; }

/* ---------- log ---------- */
function monthKey(ts){ var d = new Date(ts); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
function csvCell(v){ v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
function stamp(){ var n = new Date(); return n.getFullYear() + pad(n.getMonth() + 1) + pad(n.getDate()); }
function shareFile(name, text, mime){
  var blob = text instanceof Blob ? text : new Blob([text], { type: mime });
  var file = null; try { file = new File([blob], name, { type: mime }); } catch (e) {}
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    return navigator.share({ files: [file], title: name }).then(function(){ toast('File ' + name + ' siap disimpan.'); }).catch(function(e){ if (e && e.name !== 'AbortError') fallback(); });
  }
  fallback(); return Promise.resolve();
  function fallback(){ var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 2000); toast('File ' + name + ' diunduh.'); }
}
function backup(){
  shareFile('pinned-pup-backup-' + stamp() + '.json', JSON.stringify({ app: 'Pinned Pup by YMD', v: 1, exported: new Date().toISOString(), pins: state.pins }, null, 1), 'application/json');
}
function restore(file){
  var r = new FileReader();
  r.onload = function(){
    try {
      var j = JSON.parse(r.result), arr = Array.isArray(j) ? j : j.pins;
      if (!Array.isArray(arr)) throw new Error('format');
      var byId = {}; state.pins.forEach(function(p){ byId[p.id] = p; });
      var added = 0; arr.map(norm).filter(Boolean).forEach(function(p){ if (!byId[p.id]) added++; byId[p.id] = p; });
      Store.replaceAll(Object.keys(byId).map(function(k){ return byId[k]; }));
      toast('Backup dipulihkan: ' + added + ' pin baru ditambahkan.');
    } catch (e) { toast('File ini bukan backup Pinned Pup.'); }
  };
  r.readAsText(file);
}

/* ---------- legend ---------- */
function buildLegend(){
  $('#legend').innerHTML = '<h3>Warna pin = tipe Bristol</h3><ul>' + BR.map(function(b){ return '<li><span style="background:' + b.hex + '"></span><span>' + b.n + ' · ' + b.name + '<small>PANTONE ' + b.pan + ' ' + b.pname + '</small></span></li>'; }).join('') + '</ul>';
}

/* ---------- events ---------- */
document.addEventListener('click', function(e){
  if (e.target.closest && e.target.closest('[data-haptic]')) return;
  var t = e.target.closest('[data-action],[data-view],[data-res],[data-recent],[data-step]');
  if (!t) { if (!e.target.closest('.search')) $('#map-results').hidden = true; return; }
  if (t.dataset.view) { e.preventDefault(); if (state.view !== t.dataset.view) haptic('tap'); setView(t.dataset.view); return; }
  if (t.dataset.res != null) { goResult(lastResults[+t.dataset.res]); return; }
  if (t.hasAttribute('data-recent')) {
    state.draft.lat = +t.dataset.lat; state.draft.lng = +t.dataset.lng; state.draft.gps = ''; state.draft.acc = null;
    $('#f-place').value = t.dataset.name; syncForm(); return;
  }
  if (t.dataset.step) { var inp = $('#f-dur'); inp.value = Math.max(0, Math.min(240, (parseInt(inp.value, 10) || 0) + +t.dataset.step)); return; }
  var a = t.dataset.action;
  switch (a) {
    case 'new': haptic('tap'); var nd = newDraft(); openSheet(nd); gpsIntoDraft(nd); break;
    case 'gps': if (state.draft) gpsIntoDraft(state.draft); break;
    case 'locate': getGPS().then(function(c){ showMe(c, true); }).catch(function(e){ toast(e.message); }); break;
    case 'backup': backup(); break;
    case 'install': openInstall(); break;
    case 'install-close': $('#install-scrim').hidden = true; break;
    case 'install-dismiss': try { localStorage.setItem('pp.installDismissed', '1'); } catch (x) {} $('#install-bar').hidden = true; toast('Panduan pasang tetap ada di tab Riwayat.'); break;
    case 'install-android': if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(function(){ deferredPrompt = null; renderInstallBar(); }); } else toast('Pakai menu ⋮ Chrome, lalu Instal aplikasi.'); break;
    case 'restore': $('#restore-file').click(); break;
    case 'new-at': if (map) map.closePopup(); openSheet(newDraft({ lat: +(+t.dataset.lat).toFixed(6), lng: +(+t.dataset.lng).toFixed(6), place: t.dataset.place || '' })); break;
    case 'edit': editPin(t.dataset.id); break;
    case 'pick-at': if (map) map.closePopup(); state.draft = newDraft({ lat: +(+t.dataset.lat).toFixed(6), lng: +(+t.dataset.lng).toFixed(6), place: t.dataset.place || '' }); if (searchMk && map) { map.removeLayer(searchMk); searchMk = null; } startPick(); break;
    case 'use-area': $('#f-place').value = t.dataset.name || ''; t.hidden = true; break;
    case 'close': closeSheet(); break;
    case 'now': $('#f-time').value = toInput(Date.now()); state.draft.ts = Date.now(); syncForm(); break;
    case 'pick': readForm(); startPick(); break;
    case 'pick-ok': endPick(true); break;
    case 'pick-cancel': endPick(false); break;
    case 'del-ask': renderActions(true, true); break;
    case 'del-no': renderActions(true, false); break;
    case 'del-yes':
      var id = state.draft && state.draft.id;
      if (!id) break;
      t.disabled = true;
      Store.remove(id).then(function(){ closeSheet(); toast('Pup dihapus.'); }).catch(function(){ t.disabled = false; toast('Gagal menghapus. Coba lagi.'); });
      break;
    case 'zoom-in': if (map) map.zoomIn(); break;
    case 'zoom-out': if (map) map.zoomOut(); break;
    case 'fit': if (state.pins.length) fitPins(true); else if (map) map.setView([-2.5, 117.5], 5, { animate: !reduced }); break;
    case 'legend': var lg = $('#legend'); lg.hidden = !lg.hidden; t.setAttribute('aria-expanded', String(!lg.hidden)); break;
    case 'load-examples': loadExamples(); break;
    case 'clear-examples': clearExamples(); break;
    case 'export': exportCSV(); break;
  }
});
$('#sheet').addEventListener('submit', function(e){ e.preventDefault(); submitForm(); });
$('#scrim').addEventListener('click', function(e){ if (e.target === this) closeSheet(); });
$('#install-scrim').addEventListener('click', function(e){ if (e.target === this) this.hidden = true; });
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    if (!$('#install-scrim').hidden) $('#install-scrim').hidden = true;
    else if (!$('#scrim').hidden) closeSheet();
    else if (state.picking) endPick(false);
    else { $('#legend').hidden = true; $('#map-results').hidden = true; }
  }
});
$('#f-time').addEventListener('input', function(){ state.draft.ts = fromInput(this.value); syncForm(); });
$('#f-coords').addEventListener('input', function(){
  var v = this.value.trim(), c = parseCoords(v), h = $('#f-coords-hint');
  if (c) { state.draft.lat = +c.lat.toFixed(6); state.draft.lng = +c.lng.toFixed(6); state.draft.gps = ''; state.draft.acc = null; $('#f-err').hidden = true; h.textContent = 'Lokasi diperbarui dari koordinat yang ditempel.'; }
  else if (!v) h.textContent = 'Di Google Maps: tekan lama titiknya, salin angka koordinat, lalu tempel di sini.';
  else if (/goo\.gl|g\.co\//i.test(v)) h.textContent = 'Link pendek tidak berisi koordinat. Buka link itu, lalu salin angka koordinatnya.';
  else h.textContent = 'Format belum terbaca. Contoh: -6.2383, 106.9756';
  syncForm();
});
$('#f-bristol').addEventListener('change', function(e){ state.draft.bristol = +e.target.value; syncForm(); });
$('#f-rating').addEventListener('change', function(e){ state.draft.rating = +e.target.value; syncForm(); });
$('#map-search').addEventListener('input', function(){ gzFailed = false; photonSearch(this.value); clearTimeout(searchTimer); searchTimer = setTimeout(renderResults, 140); });
$('#f-place').addEventListener('input', function(){ if (this.value.trim()) $('#f-use-area').hidden = true; });
$('#map-search').addEventListener('focus', renderResults);
$('#map-search').addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); if (lastResults[0]) goResult(lastResults[0]); } });
$('#log-q').addEventListener('input', renderLog);
$('#restore-file').addEventListener('change', function(){ if (this.files && this.files[0]) restore(this.files[0]); this.value = ''; });
window.addEventListener('online', renderStatus); window.addEventListener('offline', renderStatus);
$('#log-m').addEventListener('change', renderLog);
window.addEventListener('hashchange', function(){ var h = location.hash.slice(1); if (h && h !== state.view) setView(h, true); });

function restyle(){ styleMap(); }
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', restyle); } catch (e) {}
try { new MutationObserver(restyle).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); } catch (e) {}

/* ---------- install helper ---------- */
var IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
var IS_STANDALONE = window.navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
var deferredPrompt = null;
function installDismissed(){ try { return localStorage.getItem('pp.installDismissed') === '1'; } catch (e) { return false; } }
function renderInstallBar(){
  var show = !IS_STANDALONE && !installDismissed() && (IS_IOS || !!deferredPrompt) && !state.picking;
  $('#install-bar').hidden = !show;
}
function openInstall(){
  $('#inst-ios-1').hidden = !IS_IOS; $('#inst-ios-2').hidden = !IS_IOS;
  $('#inst-android').hidden = IS_IOS;
  $('#install-scrim').hidden = false;
}
window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferredPrompt = e; renderInstallBar(); });
window.addEventListener('appinstalled', function(){ deferredPrompt = null; $('#install-bar').hidden = true; toast('Pinned Pup terpasang di Home Screen.'); });

/* ================= v2 modules · © 2026 Yan Malegi Diardi ================= */

/* ---------- small helpers ---------- */
function pct(x){ return Math.round((x || 0) * 100) + '%'; }
function fmt1(x){ return (Math.round((x || 0) * 10) / 10).toFixed(1).replace('.', ','); }
function rupiah(n){ return 'Rp' + Math.round(n || 0).toLocaleString('id-ID'); }
function idealShare(list){ return list.length ? list.filter(function(p){ return p.bristol === 3 || p.bristol === 4; }).length / list.length : 0; }
function fmtDurBig(min){ if (min < 60) return min + ' mnt'; var h = Math.floor(min / 60), m = min % 60; return h + ' j' + (m ? ' ' + m + ' m' : ''); }
var TAGS = [
  ['kopi', '☕', 'Kopi'], ['pedas', '🌶️', 'Pedas'], ['susu', '🥛', 'Susu'], ['serat', '🥦', 'Sayur/buah'], ['gorengan', '🍟', 'Gorengan'],
  ['air', '💧', 'Cukup minum'], ['olahraga', '🏃', 'Olahraga'], ['stres', '😵‍💫', 'Stres'], ['begadang', '🌙', 'Begadang'], ['sakit', '🤒', 'Lagi sakit']
];
var FAC = [['spray', '🚿', 'Semprotan'], ['tissue', '🧻', 'Tisu'], ['soap', '🧼', 'Sabun'], ['paid', '💰', 'Bayar']];
function tagInfo(k){ for (var i = 0; i < TAGS.length; i++) if (TAGS[i][0] === k) return { k: k, e: TAGS[i][1], n: TAGS[i][2] }; return { k: k, e: '•', n: k }; }
function facText(f){ if (!f) return []; var o = []; FAC.forEach(function(x){ if (f[x[0]]) o.push(x[1] + ' ' + (x[0] === 'paid' && f.fee ? rupiah(f.fee) : x[2])); }); return o; }
function placeRatings(){
  var m = {};
  state.pins.forEach(function(p){
    if (!p.place) return; var k = p.place.toLowerCase();
    var o = m[k] || (m[k] = { name: p.place, lat: p.lat, lng: p.lng, ts: 0, n: 0, rs: 0, rn: 0 });
    o.n++; if (p.rating) { o.rs += p.rating; o.rn++; } if (p.ts > o.ts) { o.ts = p.ts; o.lat = p.lat; o.lng = p.lng; o.name = p.place; }
  });
  return Object.keys(m).map(function(k){ var o = m[k]; o.avg = o.rn ? o.rs / o.rn : 0; return o; });
}

/* ---------- settings ---------- */
var SKEY = 'pp.settings';
var settings = (function(){ var d = { theme: 'auto', haptic: true, name: 'Yan' }; try { var s = JSON.parse(localStorage.getItem(SKEY) || '{}'); for (var k in s) d[k] = s[k]; } catch (e) {} return d; })();
function saveSettings(){ try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch (e) {} }
function applyTheme(){
  var r = document.documentElement;
  if (settings.theme === 'light' || settings.theme === 'dark') r.setAttribute('data-theme', settings.theme); else r.removeAttribute('data-theme');
  var m = $('#meta-theme'); if (m) m.setAttribute('content', isDark() ? '#121127' : '#F0EEE9');
}

/* ---------- haptics (iOS 18+ switch trick, Android vibrate) ---------- */
function iosTap(){
  var l = document.createElement('label'); l.setAttribute('aria-hidden', 'true'); l.style.display = 'none'; l.setAttribute('data-haptic', '1');
  var i = document.createElement('input'); i.type = 'checkbox'; i.setAttribute('switch', ''); l.appendChild(i);
  document.head.appendChild(l); l.click(); document.head.removeChild(l);
}
function haptic(kind){
  if (!settings.haptic) return;
  try {
    if (navigator.vibrate) { navigator.vibrate(kind === 'success' ? [10, 60, 18] : kind === 'error' ? [30, 50, 30] : 8); return; }
    if (!IS_IOS) return;
    iosTap();
    if (kind === 'success' || kind === 'error') setTimeout(function(){ try { iosTap(); } catch (e) {} }, 110);
  } catch (e) {}
}

/* ---------- toast with action ---------- */
function toast(msg, opt){
  opt = opt || {};
  var host = $('#toast-host'); host.innerHTML = '';
  var d = document.createElement('div'); d.className = 'toast'; d.setAttribute('role', 'status');
  d.innerHTML = '<span class="tp">' + poop(28, opt.mood || 'happy') + '</span>';
  var s = document.createElement('span'); s.className = 'tt'; s.textContent = msg; d.appendChild(s);
  if (opt.action) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = opt.action;
    b.addEventListener('click', function(ev){ ev.stopPropagation(); host.innerHTML = ''; clearTimeout(toastTimer); if (opt.onAction) opt.onAction(); });
    d.appendChild(b);
  }
  host.appendChild(d);
  clearTimeout(toastTimer); toastTimer = setTimeout(function(){ host.innerHTML = ''; }, opt.ms || 3600);
}

/* ---------- live timer ---------- */
var TKEY = 'pp.timer', timer = null, timerTick = null;
function readTimer(){ try { return JSON.parse(localStorage.getItem(TKEY) || 'null'); } catch (e) { return null; } }
function writeTimer(t){ try { if (t) localStorage.setItem(TKEY, JSON.stringify(t)); else localStorage.removeItem(TKEY); } catch (e) {} }
function fmtElapsed(ms){ var s = Math.max(0, Math.floor(ms / 1000)), m = Math.floor(s / 60); return (m >= 60 ? Math.floor(m / 60) + ':' + pad(m % 60) : pad(m)) + ':' + pad(s % 60); }
function timerPlace(){
  if (!timer) return '';
  if (timer.lat == null) return timer.gpsErr ? 'GPS gagal · pilih lokasi saat selesai' : 'Mencari lokasi GPS…';
  if (timer.place) return timer.place;
  var a = nearestVillage(timer.lat, timer.lng);
  return a && a.km < 15 ? shortArea(areaText(a)) : 'Lokasi GPS tercatat';
}
function renderTimer(){
  var on = !!timer;
  $('#live').hidden = !on; $('#app').classList.toggle('timing', on); $('#timer-btn').hidden = on;
  if (!on) { clearInterval(timerTick); timerTick = null; return; }
  var upd = function(){ if (timer) $('#live-time').textContent = fmtElapsed(Date.now() - timer.start); };
  upd(); $('#live-place').textContent = timerPlace();
  if (!timerTick) timerTick = setInterval(upd, 1000);
}
function startTimer(){
  if (timer) return;
  timer = { start: Date.now(), lat: null, lng: null, acc: null, place: '' };
  writeTimer(timer); haptic('tap'); renderTimer();
  toast('Timer jalan. Tekan Selesai kalau sudah.');
  getGPS().then(function(c){
    if (!timer) return;
    timer.lat = +c.latitude.toFixed(6); timer.lng = +c.longitude.toFixed(6); timer.acc = Math.round(c.accuracy || 0);
    timer.place = nearPlaceName(timer.lat, timer.lng) || ''; writeTimer(timer); renderTimer(); showMe(c, false);
  }).catch(function(e){ if (!timer) return; timer.gpsErr = e.message; writeTimer(timer); renderTimer(); });
}
function finishTimer(){
  if (!timer) return;
  var t = timer, mins = Math.min(240, Math.max(1, Math.round((Date.now() - t.start) / 60000)));
  timer = null; writeTimer(null); renderTimer(); haptic('success');
  var d = newDraft({ ts: t.start, dur: mins, timed: true, lat: t.lat, lng: t.lng, acc: t.acc, gps: t.lat != null ? 'ok' : '', place: t.place || '' });
  openSheet(d);
  if (t.lat == null) gpsIntoDraft(d);
}
function cancelTimer(){
  if (!timer) return;
  var old = timer; timer = null; writeTimer(null); renderTimer(); haptic('tap');
  toast('Timer dibatalkan.', { action: 'Urungkan', ms: 5000, onAction: function(){ timer = old; writeTimer(old); renderTimer(); } });
}

/* ---------- heatmap layer ---------- */
var heatLayer = null, heatOn = false;
function renderHeat(){
  try {
    $('#chip-heat').setAttribute('aria-pressed', String(heatOn));
    if (!map || !L_.heatLayer) return;
    var pts = state.pins.map(function(p){ return [p.lat, p.lng, 1]; });
    if (!heatLayer) heatLayer = L_.heatLayer([], { radius: 30, blur: 22, maxZoom: 15, minOpacity: 0.35, gradient: { 0.2: '#45B5AA', 0.45: '#88B04B', 0.65: '#F5DF4D', 0.82: '#FF6F61', 1: '#BB2649' } });
    if (heatOn) { if (!map.hasLayer(heatLayer)) heatLayer.addTo(map); heatLayer.setLatLngs(pts); if (map.hasLayer(pinLayer)) map.removeLayer(pinLayer); }
    else {
      if (heatLayer._frame) { L_.Util.cancelAnimFrame(heatLayer._frame); heatLayer._frame = null; }
      if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
      if (!map.hasLayer(pinLayer)) pinLayer.addTo(map);
    }
  } catch (e) {}
}

/* ---------- toilet darurat (OpenStreetMap / Overpass) ---------- */
var toiletLayer = null, toiletRes = [];
var TT = {
  toilets: { label: 'Toilet umum', short: 'WC', color: '#45B5AA' },
  fuel: { label: 'SPBU', short: 'SPBU', color: '#BB2649' },
  mosque: { label: 'Masjid/musala', short: 'M', color: '#3E8E5A' },
  mall: { label: 'Mal', short: 'MAL', color: '#6667AB' },
  shop: { label: 'Ada toilet', short: 'WC', color: '#FF6F61' },
  mine: { label: 'Tempatmu', short: '★', color: '#F5DF4D' }
};
function distM(a, b, c, d){ var R = 6371000, r = Math.PI / 180, dLat = (c - a) * r, dLng = (d - b) * r, x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2); return 2 * R * Math.asin(Math.sqrt(x)); }
function fmtDist(m){ return m < 1000 ? Math.max(10, Math.round(m / 10) * 10) + ' m' : fmt1(m / 1000) + ' km'; }
function routeUrl(r){ return IS_IOS ? 'https://maps.apple.com/?daddr=' + r.lat.toFixed(6) + ',' + r.lng.toFixed(6) + '&dirflg=w' : 'https://www.google.com/maps/dir/?api=1&destination=' + r.lat.toFixed(6) + ',' + r.lng.toFixed(6) + '&travelmode=walking'; }
function overpass(lat, lng, radius){
  var ar = '(around:' + radius + ',' + lat.toFixed(5) + ',' + lng.toFixed(5) + ')';
  var q = '[out:json][timeout:20];(nwr' + ar + '["amenity"="toilets"];nwr' + ar + '["amenity"="fuel"];nwr' + ar + '["amenity"="place_of_worship"]["religion"="muslim"];nwr' + ar + '["shop"="mall"];nwr' + ar + '["toilets"="yes"];);out center tags 80;';
  var urls = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'], i = 0;
  function attempt(){
    var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function(){ if (ctl) ctl.abort(); }, 18000);
    return fetch(urls[i] + '?data=' + encodeURIComponent(q), ctl ? { signal: ctl.signal } : {})
      .then(function(r){ clearTimeout(to); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .catch(function(e){ clearTimeout(to); if (++i < urls.length) return attempt(); throw e; });
  }
  return attempt();
}
function classifyOSM(t){ if (t.amenity === 'toilets') return 'toilets'; if (t.amenity === 'fuel') return 'fuel'; if (t.amenity === 'place_of_worship') return 'mosque'; if (t.shop === 'mall') return 'mall'; return 'shop'; }
function osmName(t, k){
  if (k === 'fuel') { var b = String(t.brand || t.operator || t.name || '').replace(/^SPBU\s*/i, '').trim(); return b ? 'SPBU ' + b : 'SPBU'; }
  return t.name || t.brand || TT[k].label;
}
function osmMeta(t){
  var o = [];
  if (t.fee === 'no' || t['toilets:fee'] === 'no') o.push('Gratis'); else if (t.fee === 'yes' || t['toilets:fee'] === 'yes') o.push('Bayar');
  if (t.opening_hours === '24/7') o.push('24 jam');
  if (t.wheelchair === 'yes' || t['toilets:wheelchair'] === 'yes') o.push('Ramah kursi roda');
  return o;
}
function openScrim(sel){ $(sel).hidden = false; }
function findToilets(){
  openScrim('#toilet-scrim');
  var st = $('#toilet-status'), list = $('#toilet-list'), here = null;
  st.textContent = 'Mencari lokasimu…';
  list.innerHTML = '<div class="tskel"></div><div class="tskel"></div><div class="tskel"></div>';
  getGPS().catch(function(e){
    if (map) { var c = map.getCenter(); return { latitude: c.lat, longitude: c.lng, accuracy: 0, fromMap: true, err: e.message }; }
    throw e;
  }).then(function(c){
    here = c; if (!c.fromMap) showMe(c, false);
    st.textContent = c.fromMap ? 'GPS tidak tersedia. Mencari di sekitar tengah peta…' : 'Mencari toilet di sekitarmu…';
    if (!navigator.onLine) throw new Error('offline');
    return overpass(c.latitude, c.longitude, 1500).then(function(j){
      var els = j.elements || [];
      if (els.length >= 4) return els;
      return overpass(c.latitude, c.longitude, 4000).then(function(j2){ return (j2.elements || []).length ? j2.elements : els; }).catch(function(){ return els; });
    });
  }).then(function(els){
    var res = [], seen = {};
    els.forEach(function(el){
      var t = el.tags || {}, lat = el.lat != null ? el.lat : el.center && el.center.lat, lng = el.lon != null ? el.lon : el.center && el.center.lon;
      if (lat == null || lng == null) return;
      var k = classifyOSM(t), name = osmName(t, k), key = name + '|' + lat.toFixed(4) + lng.toFixed(4);
      if (seen[key]) return; seen[key] = 1;
      res.push({ k: k, name: name, lat: lat, lng: lng, d: distM(here.latitude, here.longitude, lat, lng), meta: osmMeta(t) });
    });
    res = res.concat(mineNear(here));
    res.sort(function(a, b){ return a.d - b.d; });
    toiletRes = res.slice(0, 25);
    st.textContent = toiletRes.length ? toiletRes.length + ' tempat terdekat' + (here.fromMap ? ' dari tengah peta' : ' dari posisimu') + '.' : 'Belum ada toilet tercatat di OpenStreetMap sekitar sini. Coba SPBU atau masjid terdekat lewat Google Maps.';
    renderToiletList(); showToiletMarkers();
  }).catch(function(e){
    toiletRes = here ? mineNear(here) : [];
    st.textContent = !navigator.onLine || (e && e.message === 'offline') ? 'Butuh internet untuk mencari toilet. Tempat favoritmu tetap tampil.' : (e && /Izin|GPS/.test(e.message) ? e.message : 'Pencarian toilet sedang gagal. Coba lagi sebentar.');
    renderToiletList(true); showToiletMarkers();
  });
}
function mineNear(here){
  var out = [];
  placeRatings().forEach(function(p){ var d = distM(here.latitude, here.longitude, p.lat, p.lng); if (d < 5000 && (p.avg >= 3.5 || !p.rn)) out.push({ k: 'mine', name: p.name, lat: p.lat, lng: p.lng, d: d, meta: p.rn ? ['★' + fmt1(p.avg) + ' dari ' + p.n + '× pup'] : [p.n + '× pup'] }); });
  return out;
}
function renderToiletList(retry){
  var list = $('#toilet-list');
  var html = toiletRes.map(function(r, i){
    var T = TT[r.k], walk = Math.max(1, Math.round(r.d / 75));
    return '<div class="titem"><button type="button" class="tmain" data-action="toilet-go" data-i="' + i + '" aria-label="' + esc(r.name) + ', lihat di peta"><span class="tic" style="background:' + T.color + (r.k === 'mine' ? ';color:#24214D' : '') + '">' + T.short + '</span><span style="min-width:0"><b>' + esc(r.name) + '</b><span class="tm"><span class="dist">' + fmtDist(r.d) + '</span> · ' + walk + ' mnt jalan · ' + esc(T.label) + (r.meta.length ? ' · ' + esc(r.meta.join(' · ')) : '') + '</span></span></button><a class="btn sm" href="' + routeUrl(r) + '" target="_blank" rel="noopener">Rute</a></div>';
  }).join('');
  if (retry) html += '<button type="button" class="btn ghost" data-action="toilet">Coba lagi</button>';
  list.innerHTML = html;
}
function showToiletMarkers(){
  if (!map) return;
  if (!toiletLayer) toiletLayer = L_.layerGroup().addTo(map);
  toiletLayer.clearLayers();
  toiletRes.forEach(function(r){
    var T = TT[r.k];
    L_.marker([r.lat, r.lng], { icon: L_.divIcon({ className: 'wc-mk', html: '<span style="background:' + T.color + (r.k === 'mine' ? ';color:#24214D' : '') + '">' + T.short + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] }), keyboard: false })
      .bindPopup('<div class="pp"><h3>' + esc(r.name) + '</h3><p class="sub">' + esc(T.label) + ' · ' + fmtDist(r.d) + (r.meta.length ? ' · ' + esc(r.meta.join(' · ')) : '') + '</p><div class="acts"><a class="btn sm" href="' + routeUrl(r) + '" target="_blank" rel="noopener">Rute jalan kaki</a><button class="btn sm ghost" data-action="new-at" data-lat="' + r.lat + '" data-lng="' + r.lng + '" data-place="' + esc(r.name) + '">Pup di sini</button></div></div>', { className: 'pup-popup', maxWidth: 280, minWidth: 220 })
      .addTo(toiletLayer);
  });
  $('#chip-toilet-clear').hidden = !toiletRes.length;
}
function clearToilets(){ if (toiletLayer) toiletLayer.clearLayers(); toiletRes = []; $('#chip-toilet-clear').hidden = true; }
function goToilet(i){
  var r = toiletRes[i]; if (!r || !map) return;
  $('#toilet-scrim').hidden = true; setView('peta');
  map.setView([r.lat, r.lng], 17, { animate: !reduced });
  toiletLayer.eachLayer(function(l){ var ll = l.getLatLng(); if (Math.abs(ll.lat - r.lat) < 1e-7 && Math.abs(ll.lng - r.lng) < 1e-7) setTimeout(function(){ l.openPopup(); }, reduced ? 0 : 350); });
}

/* ---------- gut score & insights ---------- */
var BW = [0, 0, 0.4, 1, 1, 0.7, 0.4, 0];
function gutScore(pins, endTs){
  endTs = endTs || Date.now();
  var start = startOfDay(endTs) - 6 * DAY, list = pins.filter(function(p){ return p.ts >= start && p.ts <= endTs; });
  if (!list.length) return { score: null, n: 0 };
  var q = list.reduce(function(a, p){ return a + BW[p.bristol]; }, 0) / list.length;
  var days = {}; list.forEach(function(p){ days[dkey(p.ts)] = 1; });
  var reg = Object.keys(days).length / 7, f = list.length / 7;
  var fs = f >= 0.7 && f <= 2.5 ? 1 : f < 0.7 ? Math.max(0.2, f / 0.7) : Math.max(0.3, 1 - (f - 2.5) / 3);
  var durs = list.filter(function(p){ return p.dur > 0; }), ad = durs.length ? durs.reduce(function(a, p){ return a + p.dur; }, 0) / durs.length : 0;
  var ds = !durs.length ? 0.8 : ad <= 10 ? 1 : ad <= 15 ? 0.6 : 0.3;
  return { score: Math.round(45 * q + 25 * reg + 15 * fs + 15 * ds), n: list.length, q: q, ideal: idealShare(list), reg: Object.keys(days).length, f: f, ad: ad };
}
function gutLabel(s){ return s >= 80 ? ['Mantap', '#3E8E5A'] : s >= 60 ? ['Oke', '#2F8F86'] : s >= 40 ? ['Perlu perhatian', '#C77700'] : ['Waspada', '#BB2649']; }
function ring(v, col){
  var C = 2 * Math.PI * 44;
  return '<svg viewBox="0 0 104 104" width="104" height="104" aria-hidden="true"><circle cx="52" cy="52" r="44" fill="none" style="stroke:var(--surface-2)" stroke-width="11"/><circle cx="52" cy="52" r="44" fill="none" stroke="' + col + '" stroke-width="11" stroke-linecap="round" stroke-dasharray="' + (C * Math.max(0, Math.min(100, v)) / 100).toFixed(1) + ' ' + C.toFixed(1) + '"/></svg>';
}
function insights(pins, S){
  var out = [], now = Date.now();
  if (S.last && now - S.last.ts >= 3 * DAY) out.push(['⏳', 'Sudah <b>' + Math.floor((now - S.last.ts) / DAY) + ' hari</b> belum pup. Banyak minum air dan makan serat, ya.']);
  var cand = [];
  TAGS.forEach(function(t){
    var w = pins.filter(function(p){ return p.tags && p.tags.indexOf(t[0]) >= 0; });
    if (w.length < 3) return;
    var wo = pins.filter(function(p){ return !(p.tags && p.tags.indexOf(t[0]) >= 0); });
    var rate = function(list, f){ return list.length ? list.filter(f).length / list.length : 0; };
    var isLoose = function(p){ return p.bristol >= 6; }, isHard = function(p){ return p.bristol <= 2; };
    var loose = rate(w, isLoose), hard = rate(w, isHard), looseWo = rate(wo, isLoose), hardWo = rate(wo, isHard);
    var iw = idealShare(w), iwo = wo.length >= 3 ? idealShare(wo) : null, nm = t[2].toLowerCase();
    if (loose >= 0.5 && loose - looseWo >= 0.25) cand.push({ s: loose, x: [t[1], 'Setelah <b>' + nm + '</b>, ' + pct(loose) + ' pup jadi lembek/cair (tipe 6–7).'] });
    else if (hard >= 0.5 && hard - hardWo >= 0.25) cand.push({ s: hard, x: [t[1], 'Saat <b>' + nm + '</b>, ' + pct(hard) + ' pup cenderung keras (tipe 1–2).'] });
    else if (iwo != null && iw - iwo >= 0.2) cand.push({ s: iw - iwo, x: [t[1], 'Dengan <b>' + nm + '</b>, pup ideal ' + pct(iw) + ' (tanpa ' + nm + ': ' + pct(iwo) + ').'] });
    else if (iwo != null && iwo - iw >= 0.2) cand.push({ s: iwo - iw, x: [t[1], 'Saat <b>' + nm + '</b>, pup ideal turun jadi ' + pct(iw) + ' (biasanya ' + pct(iwo) + ').'] });
  });
  cand.sort(function(a, b){ return b.s - a.s; }).slice(0, 2).forEach(function(c){ out.push(c.x); });
  if (S.total >= 5) {
    var best = 0, bh = 0;
    for (var h = 0; h < 24; h++) { var s = S.hours[h] + S.hours[(h + 1) % 24] + S.hours[(h + 2) % 24]; if (s > best) { best = s; bh = h; } }
    if (best / S.total >= 0.4) out.push(['⏰', 'Ritme kamu: <b>' + pad(bh) + '.00–' + pad((bh + 3) % 24) + '.00</b> (' + pct(best / S.total) + ' dari semua pup).']);
  }
  var g = gutScore(pins);
  if (g.n) out.push(['📅', 'Rutin <b>' + g.reg + ' dari 7 hari</b> terakhir.' + (g.reg >= 6 ? ' Usus disiplin!' : g.reg <= 3 ? ' Coba atur jam makan lebih teratur.' : '')]);
  var pr = placeRatings().filter(function(p){ return p.rn >= 2; }).sort(function(a, b){ return b.avg - a.avg; });
  if (pr.length && pr[0].avg >= 4) out.push(['👑', 'Singgasana terbaik: <b>' + esc(pr[0].name) + '</b> (★' + fmt1(pr[0].avg) + ', ' + pr[0].n + '× pup).']);
  if (pr.length > 1 && pr[pr.length - 1].avg <= 2.5) out.push(['🚫', 'Hindari <b>' + esc(pr[pr.length - 1].name) + '</b> (★' + fmt1(pr[pr.length - 1].avg) + ').']);
  if (S.longest && S.longest.dur >= 15) out.push(['📱', 'Rekor terlama <b>' + S.longest.dur + ' menit</b> di ' + esc(S.longest.place || 'tempat tanpa nama') + '. Sambil main HP, ya?']);
  return out.slice(0, 5);
}
function greet(){
  var h = new Date().getHours(), n = settings.name ? ', ' + settings.name : '';
  return (h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam') + n + '. Ini rangkuman ususmu.';
}

/* ---------- dashboard (bento) ---------- */
function renderDash(){
  var el = $('#dash');
  var foot = '<footer class="foot"><span>© 2026 <b>Yan Malegi Diardi</b>. Hak cipta dilindungi.</span><span>Pinned Pup by YMD</span></footer>';
  var title = '<div class="page-title"><div><h1>Dashboard</h1><p>' + esc(greet()) + '</p></div></div>';
  if (!state.ready) { el.innerHTML = title + '<div class="dash-empty">' + poop(64, 'happy') + '<p>Memuat data pup…</p></div>' + foot; return; }
  var pins = state.pins;
  if (!pins.length) {
    el.innerHTML = title + '<div class="dash-empty">' + poop(84, 'happy') + '<h2>Dashboard masih kosong</h2><p>Gut Score, insight, Pup Wrapped, jam favorit, dan lencana muncul setelah pin pertama.</p><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><button class="btn" data-action="new">Tandai pup pertama</button><button class="btn ghost" data-action="load-examples">Coba data contoh</button></div></div>' + foot;
    return;
  }
  var S = computeStats(pins), g = gutScore(pins), gp = gutScore(pins, startOfDay(Date.now()) - 6 * DAY - 1);
  var last = S.last, lb = br(last.bristol);
  var exBanner = pins.some(function(p){ return p.example; }) ? '<div class="banner card" style="grid-column:1/-1;padding:6px 6px 6px 12px;border-radius:999px;justify-self:start"><span class="tag">Contoh</span><span>Ada data contoh</span><button class="btn sm ghost" data-action="clear-examples">Hapus</button></div>' : '';
  var hero = '<div class="hero sticker"><div><div class="k">Total pup di-pin</div><div class="big">' + S.total + '<small>pup</small></div><p>Terakhir ' + esc(relTime(last.ts)) + ' di ' + esc(last.place || 'tempat tanpa nama') + ' · Tipe ' + lb.n + ' ' + lb.name + '</p></div><div class="art">' + poop(130, 'happy') + '</div></div>';
  var gut;
  if (g.score == null) gut = '<div class="card gut"><div class="ring">' + ring(0, 'var(--line)') + '<b>–</b></div><div><h2>Gut Score</h2><p class="cap" style="margin:0">Belum ada pup 7 hari terakhir. Catat pup untuk melihat skornya.</p></div></div>';
  else {
    var L = gutLabel(g.score), dl = gp.score == null ? null : g.score - gp.score;
    gut = '<div class="card gut"><div class="ring">' + ring(g.score, L[1]) + '<b>' + g.score + '</b></div><div><h2>Gut Score <span class="pill" style="background:' + L[1] + '">' + L[0] + '</span></h2>' + (dl == null ? '' : '<p class="delta" style="margin:2px 0 0">' + (dl > 0 ? '▲ Naik ' + dl + ' poin' : dl < 0 ? '▼ Turun ' + (-dl) + ' poin' : 'Sama') + ' dibanding minggu lalu</p>') + '<ul><li>Bentuk ideal <b>' + pct(g.ideal) + '</b></li><li>Rutin <b>' + g.reg + ' dari 7 hari</b></li><li>Rata-rata <b>' + (g.ad ? fmt1(g.ad) + ' menit' : '–') + '</b></li></ul><p class="disc">Skor hiburan dari 7 hari terakhir, bukan diagnosis medis.</p></div></div>';
  }
  var kpis = '<div class="kpis">' + kpi('Bulan ini', S.month, 'pup', fMonLong.format(new Date())) + kpi('Rata-rata', fmt1(S.avg30), '/hari', '30 hari terakhir') + kpi('Streak', S.streak, 'hari', 'Rekor ' + S.bestStreak + ' hari') + kpi('Durasi', S.avgDur ? fmt1(S.avgDur) : '–', 'mnt', S.longest ? 'Terlama ' + S.longest.dur + ' mnt' : '') + '</div>';
  var ins = insights(pins, S);
  var insCard = '<div class="card c-7"><h2>Insight</h2><p class="cap">Pola otomatis dari catatanmu.</p>' + (ins.length ? '<ul class="insights">' + ins.map(function(x){ return '<li><span class="em">' + x[0] + '</span><span>' + x[1] + '</span></li>'; }).join('') + '</ul>' : '<p class="cap">Catat beberapa pup lagi, lengkap dengan pemicu, supaya polanya mulai terlihat.</p>') + '</div>';
  var yr = new Date().getFullYear();
  var wrapped = '<div class="wrapped c-5"><span class="lbl" style="color:#fff;opacity:.9">Rekap ala story</span><h2>Pup Wrapped</h2><p>Total, jam favorit, singgasana, tipe andalan, sampai Gut Score. Bisa dibagikan jadi gambar.</p><div class="row"><button class="btn sm" data-action="wrapped" data-period="month">Bulan ini</button><button class="btn sm ghost" data-action="wrapped" data-period="prev">Bulan lalu</button><button class="btn sm ghost" data-action="wrapped" data-period="year">Tahun ' + yr + '</button></div><span class="wart" aria-hidden="true">' + poop(86, 'happy') + '</span></div>';
  var bestHour = S.peakHour, hourLabels = []; for (var h = 0; h < 24; h++) hourLabels.push(pad(h));
  var hourCard = '<div class="card c-7"><h2>Jam favorit</h2><p class="cap">Paling sering jam <b>' + pad(bestHour) + '.00–' + pad(bestHour) + '.59</b> (' + S.hours[bestHour] + ' pup).</p>' + barsHTML(S.hours, hourLabels, 3, bestHour, 'pup') + '</div>';
  var wdPeak = S.wd.indexOf(Math.max.apply(null, S.wd));
  var wdCard = '<div class="card c-5"><h2>Hari dalam seminggu</h2><p class="cap">Hari paling produktif: <b>' + WDL[wdPeak] + '</b>.</p>' + barsHTML(S.wd, WD, 1, wdPeak, 'pup') + '</div>';
  var stack = '<div class="stack" role="img" aria-label="Distribusi tipe Bristol">' + BR.map(function(b){ var w = S.br[b.n] / S.total * 100; return w ? '<span style="width:' + w + '%;background:' + b.hex + '" title="Tipe ' + b.n + ': ' + S.br[b.n] + '"></span>' : ''; }).join('') + '</div>';
  var blist = '<ul class="blist">' + BR.map(function(b){ return '<li><span class="sq" style="background:' + b.hex + ';color:' + b.ink + '">' + b.n + '</span><span>' + b.name + '<small>PANTONE ' + b.pan + '</small></span><b>' + S.br[b.n] + '</b></li>'; }).join('') + '</ul>';
  var brCard = '<div class="card c-7"><h2>Skala Bristol</h2><div class="ideal"><b>' + Math.round(S.ideal * 100) + '%</b><span>tipe 3–4 (bentuk ideal)</span></div>' + stack + blist + '</div>';
  var tsum = S.total || 1;
  var tCard = '<div class="card c-5"><h2>Gaya toilet</h2><p class="cap">Proporsi dari semua pup.</p><div class="tsplit">' + TOILET.map(function(t){ var v = S.toilet[t[0]] || 0; return '<div><b>' + Math.round(v / tsum * 100) + '%</b><span>' + t[1] + ' · ' + v + '</span></div>'; }).join('') + '</div><h2 style="margin-top:18px">Tren 6 bulan</h2><p class="cap">Jumlah pup per bulan.</p>' + barsHTML(S.months.map(function(m){ return m.n; }), S.months.map(function(m){ return fMon.format(m.d); }), 1, 5, 'pup') + '</div>';
  var used = TAGS.map(function(t){ return { t: t, w: pins.filter(function(p){ return p.tags && p.tags.indexOf(t[0]) >= 0; }) }; }).filter(function(x){ return x.w.length; }).sort(function(a, b){ return b.w.length - a.w.length; });
  var tagCard = '<div class="card c-7"><h2>Pemicu</h2>' + (used.length ? '<p class="cap">Sebaran tipe Bristol untuk tiap pemicu.</p><ul class="tagstat">' + used.slice(0, 6).map(function(x){
    var n = x.w.length, cnt = [0, 0, 0, 0, 0, 0, 0, 0]; x.w.forEach(function(p){ cnt[p.bristol]++; });
    return '<li><span>' + x.t[1] + ' ' + x.t[2] + ' <small>· ' + n + '×</small></span><span>ideal ' + pct(idealShare(x.w)) + '</span><span class="tr">' + BR.map(function(b){ return cnt[b.n] ? '<i style="width:' + (cnt[b.n] / n * 100) + '%;background:' + b.hex + '"></i>' : ''; }).join('') + '</span></li>';
  }).join('') + '</ul>' : '<p class="cap">Tandai pemicu seperti kopi atau pedas saat mencatat pup. Pengaruhnya ke bentuk pup akan muncul di sini.</p>') + '</div>';
  var fp = pins.filter(function(p){ return p.fac; });
  var facCard;
  if (!fp.length) facCard = '<div class="card c-5"><h2>Fasilitas toilet</h2><p class="cap">Centang semprotan, tisu, sabun, atau bayar saat mencatat. Ringkasannya muncul di sini.</p></div>';
  else {
    var fc = function(k){ return fp.filter(function(p){ return p.fac[k]; }).length / fp.length; };
    var paid = fp.filter(function(p){ return p.fac.paid; }), spent = paid.reduce(function(a, p){ return a + (p.fac.fee || 0); }, 0);
    facCard = '<div class="card c-5"><h2>Fasilitas toilet</h2><p class="cap">Dari ' + fp.length + ' kunjungan yang kamu nilai.</p><div class="tsplit"><div><b>' + pct(fc('spray')) + '</b><span>🚿 Semprotan</span></div><div><b>' + pct(fc('tissue')) + '</b><span>🧻 Tisu</span></div><div><b>' + pct(fc('soap')) + '</b><span>🧼 Sabun</span></div></div><p class="cap" style="margin:12px 0 0">Bayar toilet <b>' + paid.length + '×</b>, total <b>' + rupiah(spent) + '</b>.</p></div>';
  }
  var heatCard = '<div class="card c-7"><h2>Kalender 12 minggu</h2><p class="cap">Setiap kotak satu hari. Kotak bergaris = hari ini.</p>' + heatHTML(S.byDay) + '</div>';
  var maxN = S.places.length ? S.places[0].n : 1;
  var placeCard = '<div class="card c-5"><h2>Tempat favorit</h2><p class="cap">' + S.uniquePlaces + ' tempat berbeda.</p><ul class="places">' + S.places.slice(0, 5).map(function(p, i){
    var col = ['#FF6F61', '#45B5AA', '#6667AB', '#88B04B', '#F5DF4D'][i], avg = p.rn ? p.rs / p.rn : 0;
    return '<li><span class="nm">' + esc(p.name) + '</span><span class="ct">' + p.n + '×</span><span class="track"><i style="width:' + (p.n / maxN * 100) + '%;background:' + col + '"></i></span><span class="meta">' + (avg ? miniRate(Math.round(avg)) + ' ' + fmt1(avg) : 'Belum dinilai') + ' · terakhir ' + esc(relTime(p.ts)) + '</span></li>';
  }).join('') + '</ul></div>';
  var bd = badges(S), got = bd.filter(function(b){ return b.v >= b.t; }).length;
  var badgeCard = '<div class="card"><h2>Lencana</h2><p class="cap">' + got + ' dari ' + bd.length + ' terbuka.</p><div class="badges">' + bd.map(function(b){
    var ok = b.v >= b.t;
    return '<div class="badge' + (ok ? '' : ' locked') + '"><span class="medal" style="background:' + b.c + ';color:' + (b.c === '#6667AB' || b.c === '#BB2649' ? '#FFFFFF' : '#24214D') + '">' + MEDAL[b.k] + '</span><strong>' + b.name + '</strong><span>' + b.txt + '</span><span class="prog"><i style="width:' + Math.min(100, b.v / b.t * 100) + '%"></i></span><span class="num">' + Math.min(b.v, b.t) + ' / ' + b.t + '</span></div>';
  }).join('') + '</div></div>';
  el.innerHTML = title + '<div class="dash">' + exBanner + hero + gut + kpis + insCard + wrapped + hourCard + wdCard + brCard + tCard + tagCard + facCard + heatCard + placeCard + badgeCard + '</div>' + foot;
}

/* ---------- badges (extended) ---------- */
MEDAL.timer = '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2h5"/></svg>';
MEDAL.tag = '<svg class="ico" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.6-4.6"/></svg>';
MEDAL.review = '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>';
MEDAL.city = '<svg class="ico" viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l6-4v17M11 21V10h8v11M8 10h.01M8 14h.01M15 14h.01M15 17h.01"/></svg>';
function badges(S){
  var pins = state.pins, cities = {};
  pins.forEach(function(p){ var c = String(p.area || '').split(', ')[2]; if (c) cities[c] = 1; });
  return [
    { k: 'first', c: '#FF6F61', name: 'Pup Perdana', txt: 'Pin pup pertama', v: S.total, t: 1 },
    { k: 'sun', c: '#F5DF4D', name: 'Ayam Jago', txt: 'Pup sebelum jam 06.00', v: S.early, t: 1 },
    { k: 'moon', c: '#6667AB', name: 'Burung Hantu', txt: 'Pup jam 00.00–03.59', v: S.owl, t: 1 },
    { k: 'map', c: '#45B5AA', name: 'Penjelajah', txt: '5 tempat berbeda', v: S.uniquePlaces, t: 5 },
    { k: 'flame', c: '#FFBE98', name: 'Rutin Jaya', txt: '7 hari beruntun', v: S.bestStreak, t: 7 },
    { k: 'star', c: '#88B04B', name: 'Sang Sempurna', txt: '10× tipe 4', v: S.br[4], t: 10 },
    { k: 'squat', c: '#FF6F61', name: 'Jongkok Pro', txt: '10× di toilet jongkok', v: S.toilet.jongkok || 0, t: 10 },
    { k: 'timer', c: '#45B5AA', name: 'Tepat Waktu', txt: '5 pup pakai timer', v: pins.filter(function(p){ return p.timed; }).length, t: 5 },
    { k: 'tag', c: '#F5DF4D', name: 'Detektif Usus', txt: '20 pup dengan pemicu', v: pins.filter(function(p){ return p.tags && p.tags.length; }).length, t: 20 },
    { k: 'review', c: '#FFBE98', name: 'Kritikus Toilet', txt: '10 toilet dinilai fasilitasnya', v: pins.filter(function(p){ return p.fac; }).length, t: 10 },
    { k: 'city', c: '#6667AB', name: 'Turis Toilet', txt: 'Pup di 3 kota berbeda', v: Object.keys(cities).length, t: 3 },
    { k: 'hundred', c: '#BB2649', name: 'Seratus Pup', txt: '100 pin pup', v: S.total, t: 100 }
  ];
}
var BKEY = 'pp.badges';
function unlockedNow(){ if (!state.pins.length) return {}; var o = {}; badges(computeStats(state.pins)).forEach(function(b){ if (b.v >= b.t) o[b.k] = b.name; }); return o; }
function checkBadges(celebrate){
  var now = unlockedNow(), prev = null;
  try { prev = JSON.parse(localStorage.getItem(BKEY) || 'null'); } catch (e) {}
  try { localStorage.setItem(BKEY, JSON.stringify(Object.keys(now))); } catch (e) {}
  if (!prev || !celebrate) return;
  var fresh = Object.keys(now).filter(function(k){ return prev.indexOf(k) < 0; });
  if (fresh.length) { confetti(); haptic('success'); setTimeout(function(){ toast('Lencana baru: ' + now[fresh[0]] + '!', { ms: 4500 }); }, 400); }
}
function confetti(){
  if (reduced) return;
  var cv = $('#confetti'), ctx = cv.getContext ? (function(){ try { return cv.getContext('2d'); } catch (e) { return null; } })() : null;
  if (!ctx) return;
  cv.hidden = false;
  var dpr = Math.min(2, window.devicePixelRatio || 1), W = window.innerWidth, H = window.innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var cols = ['#BB2649', '#FF6F61', '#88B04B', '#45B5AA', '#F5DF4D', '#FFBE98', '#6667AB', '#8D5524'], P = [];
  for (var i = 0; i < 150; i++) P.push({ x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.32, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 5, r: Math.random() * 7 + 5, a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.35, c: cols[i % cols.length], s: Math.random() < 0.55 });
  var t0 = performance.now();
  (function frame(t){
    ctx.clearRect(0, 0, W, H);
    P.forEach(function(p){ p.vy += 0.38; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; if (p.s) ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2.4, 0, 6.283); ctx.fill(); } ctx.restore(); });
    if (t - t0 < 2800) requestAnimationFrame(frame); else { ctx.clearRect(0, 0, W, H); cv.hidden = true; }
  })(t0);
}

/* ---------- riwayat: list + calendar ---------- */
var logMode = 'list', calMonth = null, calSel = null;
function entryHTML(p){
  var b = br(p.bristol), meta = [];
  if (p.area) meta.push(shortArea(p.area));
  meta.push('Tipe ' + b.n + ' · ' + b.name, toiletName(p.toilet));
  if (p.dur) meta.push(p.dur + ' mnt' + (p.timed ? ' ⏱' : ''));
  if (p.note) meta.push(p.note);
  var tg = (p.tags || []).map(function(k){ return tagInfo(k).e; }).join('');
  return '<button class="entry" data-action="edit" data-id="' + esc(p.id) + '"><span class="t">' + fTime.format(p.ts) + '</span><span style="min-width:0"><span class="nm">' + esc(p.place || 'Tanpa nama') + (p.example ? '<span class="ex">contoh</span>' : '') + (tg ? '<span class="tg">' + tg + '</span>' : '') + '</span><span class="mt">' + esc(meta.join(' · ')) + '</span>' + (p.rating ? miniRate(p.rating) : '') + '</span><span class="sw"><i style="background:' + b.hex + '"></i><b>' + b.n + '</b></span></button>';
}
function groupsHTML(list){
  var groups = [], gm = {};
  list.forEach(function(p){ var k = dkey(p.ts); if (!gm[k]) { gm[k] = { ts: p.ts, items: [] }; groups.push(gm[k]); } gm[k].items.push(p); });
  return groups.map(function(g){ return '<section class="day"><h2><span>' + esc(fDate.format(g.ts)) + '</span><span>' + g.items.length + ' pup</span></h2><div class="entries">' + g.items.map(entryHTML).join('') + '</div></section>'; }).join('');
}
function renderCal(){
  var el = $('#cal');
  if (logMode !== 'cal') { el.hidden = true; return; }
  el.hidden = false;
  var base = calMonth || new Date(), y = base.getFullYear(), m = base.getMonth();
  var startOff = (new Date(y, m, 1).getDay() + 6) % 7, daysIn = new Date(y, m + 1, 0).getDate(), today = dkey(Date.now());
  var by = {}, cnt = 0;
  state.pins.forEach(function(p){ var k = dkey(p.ts); (by[k] = by[k] || []).push(p); var d = new Date(p.ts); if (d.getFullYear() === y && d.getMonth() === m) cnt++; });
  var cells = WD.map(function(w){ return '<span class="cal-wd">' + w + '</span>'; }).join('');
  var total = Math.ceil((startOff + daysIn) / 7) * 7;
  for (var i = 0; i < total; i++) {
    var d = new Date(y, m, 1 - startOff + i), k = dkey(d.getTime()), list = (by[k] || []).slice().sort(function(a, b){ return a.ts - b.ts; });
    var dots = list.slice(0, 4).map(function(p){ return '<i style="background:' + br(p.bristol).hex + '"></i>'; }).join('') + (list.length > 4 ? '<span class="more">+' + (list.length - 4) + '</span>' : '');
    var cls = 'cal-d' + (d.getMonth() !== m ? ' out' : '') + (list.length ? '' : ' none') + (k === today ? ' today' : '') + (k === calSel ? ' sel' : '');
    cells += '<button type="button" class="' + cls + '" data-action="cal-day" data-day="' + k + '" aria-label="' + esc(fDate.format(d)) + ', ' + list.length + ' pup"><span class="dn">' + d.getDate() + '</span><span class="dots">' + dots + '</span></button>';
  }
  el.innerHTML = '<div class="cal"><div class="cal-head"><button type="button" data-action="cal-prev" aria-label="Bulan sebelumnya"><svg class="ico" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><h2>' + esc(fMonLong.format(new Date(y, m, 1))) + ' <span class="hint" style="font-size:13px">· ' + cnt + ' pup</span></h2><button type="button" data-action="cal-next" aria-label="Bulan berikutnya"><svg class="ico" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button></div><div class="cal-grid">' + cells + '</div></div>';
}
function renderLog(){
  var sel = $('#log-m'), cur = sel.value || 'all';
  var months = {}; state.pins.forEach(function(p){ months[monthKey(p.ts)] = (months[monthKey(p.ts)] || 0) + 1; });
  var mk = Object.keys(months).sort().reverse();
  sel.innerHTML = '<option value="all">Semua bulan</option>' + mk.map(function(k){ var p = k.split('-'); return '<option value="' + k + '">' + esc(fMonLong.format(new Date(+p[0], +p[1] - 1, 1))) + ' (' + months[k] + ')</option>'; }).join('');
  sel.value = mk.indexOf(cur) >= 0 ? cur : 'all';
  var isCal = logMode === 'cal';
  $('#log-tools').hidden = isCal;
  renderCal();
  var el = $('#log');
  if (!state.ready) { el.innerHTML = '<p class="log-empty">Memuat riwayat…</p>'; return; }
  if (!state.pins.length) { $('#log-sub').textContent = 'Belum ada pin.'; el.innerHTML = '<div class="dash-empty">' + poop(72, 'happy') + '<h2>Riwayat kosong</h2><p>Setiap pup yang kamu pin akan tercatat di sini lengkap dengan tanggal, jam, dan lokasinya.</p><button class="btn" data-action="new">Tandai pup pertama</button></div>'; return; }
  var list;
  if (isCal) {
    var k = calSel || dkey(Date.now());
    list = state.pins.filter(function(p){ return dkey(p.ts) === k; }).sort(function(a, b){ return b.ts - a.ts; });
    $('#log-sub').textContent = fDate.format(new Date(k + 'T12:00:00')) + ' · ' + list.length + ' pup';
    el.innerHTML = list.length ? groupsHTML(list) : '<p class="log-empty">Tidak ada pup pada tanggal ini.</p>';
    return;
  }
  var q = $('#log-q').value.trim().toLowerCase();
  list = state.pins.filter(function(p){
    if (sel.value !== 'all' && monthKey(p.ts) !== sel.value) return false;
    if (!q) return true;
    var hay = [p.place, p.area, p.note, br(p.bristol).name, toiletName(p.toilet)].concat((p.tags || []).map(function(t){ return tagInfo(t).n; }), facText(p.fac)).join(' ').toLowerCase();
    return hay.indexOf(q) >= 0;
  }).sort(function(a, b){ return b.ts - a.ts; });
  $('#log-sub').textContent = list.length + ' pup ditampilkan, terbaru di atas.';
  el.innerHTML = list.length ? groupsHTML(list) : '<p class="log-empty">Tidak ada pup yang cocok dengan filter ini.</p>';
}

/* ---------- popup with facilities + share ---------- */
function popupHTML(g){
  var items = g.items.slice(0, 6).map(function(p){
    var b = br(p.bristol), tg = (p.tags || []).map(function(k){ return tagInfo(k).e; }).join('');
    return '<li><i style="background:' + b.hex + '"></i><span><b class="num">' + fTime.format(p.ts) + '</b> · ' + esc(fShort.format(p.ts)) + ' ' + tg + '<br><small style="color:var(--muted);font-weight:700">Tipe ' + b.n + ' · ' + b.name + (p.dur ? ' · ' + p.dur + ' mnt' : '') + (p.example ? ' · contoh' : '') + '</small></span><button data-action="edit" data-id="' + esc(p.id) + '">Ubah</button></li>';
  }).join('');
  var withFac = g.items.filter(function(p){ return p.fac; })[0], facs = withFac ? facText(withFac.fac) : [];
  var more = g.items.length > 6 ? '<p class="sub">+' + (g.items.length - 6) + ' pup lain di tab Riwayat</p>' : '';
  var gm = 'https://www.google.com/maps?q=' + g.lat.toFixed(6) + ',' + g.lng.toFixed(6);
  return '<div class="pp"><h3>' + esc(g.place) + '</h3><p class="sub">' + g.items.length + ' pup · terakhir ' + esc(relTime(g.latest.ts)) + '</p>' + (g.latest.area ? '<p class="area">' + esc(shortArea(g.latest.area)) + '</p>' : '') + (facs.length ? '<div class="facs">' + facs.map(function(f){ return '<span>' + esc(f) + '</span>'; }).join('') + '</div>' : '') + '<ul>' + items + '</ul>' + more +
    '<div class="acts"><button class="btn sm" data-action="new-at" data-lat="' + g.lat + '" data-lng="' + g.lng + '" data-place="' + esc(g.place === 'Tanpa nama' ? '' : g.place) + '">+ Pup di sini lagi</button>' +
    '<button class="btn sm ghost" data-action="share-pin" data-lat="' + g.lat + '" data-lng="' + g.lng + '" data-place="' + esc(g.place) + '">Bagikan</button>' +
    '<a class="btn sm ghost" href="' + gm + '" target="_blank" rel="noopener">Maps</a></div></div>';
}
function sharePin(lat, lng, place){
  var txt = 'Baru saja pup di ' + (place && place !== 'Tanpa nama' ? place : 'sini') + ' 💩 (dicatat pakai Pinned Pup by YMD)', url = 'https://www.google.com/maps?q=' + (+lat).toFixed(6) + ',' + (+lng).toFixed(6);
  if (navigator.share) { navigator.share({ title: 'Pinned Pup', text: txt, url: url }).catch(function(){}); return; }
  var full = txt + ' ' + url;
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(full).then(function(){ toast('Teks disalin. Tinggal tempel.'); }).catch(function(){ toast(full, { ms: 6000 }); });
  else toast(full, { ms: 6000 });
}

/* ---------- CSV with new columns ---------- */
function exportCSV(){
  if (!state.pins.length) { toast('Belum ada pin untuk diekspor.'); return; }
  var rows = [['Tanggal', 'Jam', 'Tempat', 'Wilayah', 'Latitude', 'Longitude', 'Tipe Bristol', 'Kondisi', 'Toilet', 'Kenyamanan (1-5)', 'Durasi (menit)', 'Pakai timer', 'Pemicu', 'Fasilitas', 'Bayar (Rp)', 'Catatan', 'Contoh']];
  state.pins.slice().sort(function(a, b){ return a.ts - b.ts; }).forEach(function(p){
    var d = new Date(p.ts), b = br(p.bristol), f = p.fac || {};
    rows.push([d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()), pad(d.getHours()) + ':' + pad(d.getMinutes()), p.place, p.area, p.lat, p.lng, b.n, b.name, toiletName(p.toilet), p.rating || '', p.dur || '', p.timed ? 'ya' : '', (p.tags || []).map(function(t){ return tagInfo(t).n; }).join('; '), FAC.filter(function(x){ return x[0] !== 'paid' && f[x[0]]; }).map(function(x){ return x[2]; }).join('; '), f.paid ? (f.fee || 'ya') : '', p.note, p.example ? 'ya' : '']);
  });
  shareFile('pinned-pup-' + stamp() + '.csv', '﻿' + rows.map(function(r){ return r.map(csvCell).join(','); }).join('\r\n'), 'text/csv');
}

/* ---------- Pup Wrapped (story) ---------- */
var story = { slides: [], i: 0, t0: 0, raf: 0, paused: false, pauseAt: 0, data: null, blob: null, making: null };
var SLIDE_MS = 5200;
function periodRange(kind){
  var n = new Date();
  if (kind === 'prev') { var s = new Date(n.getFullYear(), n.getMonth() - 1, 1); return { s: +s, e: +new Date(n.getFullYear(), n.getMonth(), 1), label: fMonLong.format(s) }; }
  if (kind === 'year') return { s: +new Date(n.getFullYear(), 0, 1), e: +new Date(n.getFullYear() + 1, 0, 1), label: 'Tahun ' + n.getFullYear() };
  var s2 = new Date(n.getFullYear(), n.getMonth(), 1); return { s: +s2, e: +new Date(n.getFullYear(), n.getMonth() + 1, 1), label: fMonLong.format(s2) };
}
function openWrapped(kind){
  var R = periodRange(kind), pins = state.pins.filter(function(p){ return p.ts >= R.s && p.ts < R.e; });
  if (!pins.length) { toast('Belum ada pup di ' + R.label + '.'); return; }
  var S = computeStats(pins), endTs = Math.min(Date.now(), R.e - 1);
  var days = Math.max(1, Math.ceil((endTs - R.s) / DAY));
  var top = S.places[0], bt = 1; for (var i = 2; i <= 7; i++) if (S.br[i] > S.br[bt]) bt = i;
  var B = br(bt), totalMin = pins.reduce(function(a, p){ return a + (p.dur || 0); }, 0), g = gutScore(pins, endTs), h = S.peakHour;
  var mood = h < 9 ? 'Pagi banget! Ususmu bangun duluan.' : h < 12 ? 'Pup menjelang siang, santai.' : h < 17 ? 'Pup siang, di sela kesibukan.' : h < 21 ? 'Pup sore, penutup hari.' : 'Pup malam, si burung hantu.';
  var name = settings.name || '';
  story.data = { R: R, n: pins.length, h: h, top: top, B: B, bt: S.br[bt], totalMin: totalMin, g: g, streak: S.bestStreak, ideal: idealShare(pins), name: name };
  story.blob = null; story.making = null;
  story.slides = [
    { bg: '#6667AB', html: '<span class="s-k">' + esc(R.label) + '</span><div class="s-mid">Pup Wrapped' + (name ? '<br>' + esc(name) : '') + '</div><p class="s-txt">Rekap perjalanan ususmu. Siap?</p><span class="s-art">' + poop(150, 'happy') + '</span>' },
    { bg: '#FF6F61', html: '<span class="s-k">Total pup</span><div class="s-big">' + pins.length + '×</div><p class="s-txt">Rata-rata ' + fmt1(pins.length / days) + ' kali sehari selama ' + days + ' hari.</p>' },
    { bg: '#F5DF4D', ink: '#24214D', html: '<span class="s-k">Jam favorit</span><div class="s-big">' + pad(h) + '.00</div><p class="s-txt">' + mood + '</p>' },
    { bg: '#45B5AA', ink: '#24214D', html: '<span class="s-k">Singgasana favorit</span><div class="s-mid">' + esc(top.name) + '</div><p class="s-txt">' + top.n + ' kali di sini' + (top.rn ? ', nyamannya ★' + fmt1(top.rs / top.rn) : '') + '.</p>' },
    { bg: B.hex, ink: B.ink, html: '<span class="s-k">Tipe andalan</span><div class="s-big">Tipe ' + B.n + '</div><p class="s-txt">' + B.name + ', ' + S.br[bt] + ' kali. Warnanya PANTONE ' + B.pan + ' ' + B.pname + '.</p><span class="s-art">' + poop(110, B.mood) + '</span>' },
    { bg: '#FFBE98', ink: '#24214D', html: '<span class="s-k">Waktu di toilet</span><div class="s-big">' + fmtDurBig(totalMin) + '</div><p class="s-txt">Streak terpanjang ' + S.bestStreak + ' hari berturut-turut.</p>' },
    { bg: '#BB2649', html: '<span class="s-k">Gut Score</span><div class="s-big">' + (g.score == null ? '–' : g.score) + '</div><p class="s-txt">' + (g.score == null ? 'Data minggu terakhir periode ini belum cukup.' : gutLabel(g.score)[0] + '. Bentuk ideal ' + pct(story.data.ideal) + ' sepanjang periode.') + '</p><p class="s-copy">Skor hiburan, bukan diagnosis medis.</p>' },
    { bg: '#24214D', html: '<span class="s-k">Pup Wrapped · ' + esc(R.label) + '</span><div class="s-mid">Rangkuman</div><div class="s-sum">' + sumCells().map(function(c){ return '<div><span>' + c[0] + '</span><b>' + esc(c[1]) + '</b></div>'; }).join('') + '</div><div class="s-act"><button class="btn" data-action="story-share">Bagikan gambar</button><button class="btn" style="background:rgba(255,255,255,.18);color:#fff" data-action="story-restart">Ulang</button></div><p class="s-copy">© 2026 Yan Malegi Diardi · Pinned Pup by YMD</p>' }
  ];
  $('#story-bars').innerHTML = story.slides.map(function(){ return '<span><i></i></span>'; }).join('');
  $('#story').hidden = false; haptic('tap');
  storyGo(0);
  cancelAnimationFrame(story.raf); story.raf = requestAnimationFrame(storyTick);
}
function sumCells(){
  var D = story.data;
  return [['Total', D.n + '×'], ['Jam favorit', pad(D.h) + '.00'], ['Singgasana', D.top.name], ['Tipe andalan', D.B.n + ' · ' + D.B.name], ['Waktu di toilet', fmtDurBig(D.totalMin)], ['Gut Score', D.g.score == null ? '–' : String(D.g.score)]];
}
function storyGo(i){
  if (i < 0) i = 0;
  if (i >= story.slides.length) { closeStory(); return; }
  story.i = i; story.t0 = performance.now();
  var s = story.slides[i], root = $('#story');
  root.style.background = s.bg; root.style.color = s.ink || '#fff';
  $('#story-stage').innerHTML = s.html;
  $$('#story-bars i').forEach(function(b, j){ b.style.width = j < i ? '100%' : '0%'; });
  if (i === story.slides.length - 1) { $$('#story-bars i')[i].style.width = '100%'; prepareShare(); }
}
function storyTick(t){
  if ($('#story').hidden) return;
  if (!story.paused && story.i < story.slides.length - 1) {
    var p = (t - story.t0) / SLIDE_MS, bar = $$('#story-bars i')[story.i];
    if (bar) bar.style.width = Math.min(100, p * 100) + '%';
    if (p >= 1) storyGo(story.i + 1);
  }
  story.raf = requestAnimationFrame(storyTick);
}
function closeStory(){ $('#story').hidden = true; cancelAnimationFrame(story.raf); }
function literalPoop(size, mood){ return poop(size, mood).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(/var\(--poop\)/g, '#8D5524').replace(/var\(--poop-line\)/g, '#4A2A10').replace(/var\(--poop-hi\)/g, '#FFFFFF'); }
function loadImg(src){ return new Promise(function(res, rej){ var im = new Image(); im.onload = function(){ res(im); }; im.onerror = rej; im.src = src; }); }
function prepareShare(){
  if (story.blob) return Promise.resolve(story.blob);
  if (story.making) return story.making;
  var D = story.data, W = 1080, H = 1920;
  var fontsReady = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('400 100px Shrikhand'), document.fonts.load('900 40px Nunito'), document.fonts.load('700 30px "Archivo Narrow"')]).catch(function(){}) : Promise.resolve();
  story.making = fontsReady.then(function(){ return loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(literalPoop(64, 'happy'))); }).then(function(img){
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H; var c = cv.getContext('2d');
    c.fillStyle = '#24214D'; c.fillRect(0, 0, W, H);
    [[140, 220, 560, '#FF6F61'], [980, 420, 520, '#F5DF4D'], [540, 1780, 760, '#6667AB'], [40, 1180, 420, '#45B5AA']].forEach(function(b){ var gr = c.createRadialGradient(b[0], b[1], 0, b[0], b[1], b[2]); gr.addColorStop(0, b[3] + 'CC'); gr.addColorStop(1, b[3] + '00'); c.fillStyle = gr; c.fillRect(0, 0, W, H); });
    ['#BB2649', '#FF6F61', '#88B04B', '#45B5AA', '#F5DF4D', '#FFBE98', '#6667AB'].forEach(function(col, i){ c.fillStyle = col; c.fillRect(i * W / 7, 0, W / 7 + 1, 22); });
    c.drawImage(img, 700, 110, 300, 300);
    c.fillStyle = '#FFFFFF'; c.textBaseline = 'alphabetic';
    c.font = '700 34px "Archivo Narrow", "Arial Narrow", sans-serif'; c.fillText(D.R.label.toUpperCase(), 84, 170);
    c.font = '400 128px Shrikhand, Georgia, serif'; c.fillText('Pup', 80, 320); c.fillText('Wrapped', 80, 450);
    if (D.name) { c.font = '900 52px Nunito, sans-serif'; c.fillText(D.name, 84, 530); }
    sumCells().forEach(function(cell, i){
      var x = 80 + (i % 2) * 470, y = 620 + Math.floor(i / 2) * 330, w = 450, h = 300;
      c.fillStyle = 'rgba(255,255,255,0.14)'; rr(c, x, y, w, h, 44); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.8)'; c.font = '900 32px Nunito, sans-serif'; c.fillText(cell[0].toUpperCase(), x + 36, y + 70);
      c.fillStyle = '#FFFFFF'; fitText(c, cell[1], w - 72, 104, 'Shrikhand, Georgia, serif'); c.fillText(cell[1], x + 36, y + 210);
    });
    c.fillStyle = 'rgba(255,255,255,0.85)'; c.font = '800 34px Nunito, sans-serif';
    c.fillText('© 2026 Yan Malegi Diardi · Pinned Pup by YMD', 84, H - 110);
    return new Promise(function(res){ cv.toBlob(function(b){ story.blob = b; res(b); }, 'image/png'); });
  }).catch(function(){ story.making = null; return null; });
  return story.making;
}
function rr(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function fitText(c, txt, maxW, size, fam){ var s = size; do { c.font = '400 ' + s + 'px ' + fam; s -= 4; } while (c.measureText(txt).width > maxW && s > 30); }
function storyShare(){
  var name = 'pup-wrapped-' + stamp() + '.png';
  if (story.blob) { shareFile(name, story.blob, 'image/png'); return; }
  toast('Menyiapkan gambar…');
  prepareShare().then(function(b){ if (b) toast('Gambar siap.', { action: 'Bagikan', ms: 8000, onAction: function(){ shareFile(name, b, 'image/png'); } }); else toast('Gambar gagal dibuat di perangkat ini.'); });
}

/* ---------- saya (settings) ---------- */
var wipeAsk = false;
var SI = {
  user: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  theme: '<svg class="ico" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  vibe: '<svg class="ico" viewBox="0 0 24 24"><rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 8v8M20 8v8"/></svg>',
  lock: '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  key: '<svg class="ico" viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/></svg>',
  save: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M4 20h16"/></svg>',
  up: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 20V9M7 14l5-5 5 5M4 4h16"/></svg>',
  table: '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>',
  spark: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>',
  trash: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  phone: '<svg class="ico" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  refresh: '<svg class="ico" viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>'
};
function setRow(col, ic, title, sub, right, action, cls){
  var inner = '<span class="si" style="background:' + col + '">' + ic + '</span><span class="st">' + title + (sub ? '<small>' + sub + '</small>' : '') + '</span>' + (right || '');
  return action ? '<button type="button" class="set-row' + (cls ? ' ' + cls : '') + '" data-action="' + action + '">' + inner + '<svg class="ico chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>' : '<div class="set-row' + (cls ? ' ' + cls : '') + '">' + inner + '</div>';
}
function setSec(title, rows){ return '<section class="set-sec"><h2>' + title + '</h2><div class="set-group">' + rows + '</div></section>'; }
function renderSaya(){
  var el = $('#saya'), n = state.pins.length, ex = state.pins.some(function(p){ return p.example; }), lk = lockCfg();
  var th = settings.theme;
  var themeSeg = '<div class="seg seg-sm" role="radiogroup" aria-label="Tema">' + [['auto', 'Otomatis'], ['light', 'Terang'], ['dark', 'Gelap']].map(function(o){ return '<label><input type="radio" name="set-theme" id="set-theme-' + o[0] + '" value="' + o[0] + '"' + (th === o[0] ? ' checked' : '') + '>' + o[1] + '</label>'; }).join('') + '</div>';
  el.innerHTML =
    '<div class="me-head"><span class="av">' + poop(48, 'happy') + '</span><div><h1>Halo, ' + esc(settings.name || 'kamu') + '</h1><p>' + n + ' pup tercatat · Pinned Pup 2.0</p></div></div>' +
    setSec('Profil', setRow('#6667AB', SI.user, 'Nama panggilan', 'Muncul di sapaan dan Pup Wrapped', '<input type="text" id="set-name" maxlength="20" value="' + esc(settings.name) + '" aria-label="Nama panggilan" style="max-width:150px">')) +
    setSec('Tampilan', setRow('#FF6F61', SI.theme, 'Tema', '', '') + '<div class="set-row" style="padding-top:0;border-top:0">' + themeSeg + '</div>' + setRow('#45B5AA', SI.vibe, 'Getaran', 'Getar halus saat menekan tombol (iPhone iOS 18+)', '<input type="checkbox" class="tgl" id="set-haptic" aria-label="Getaran"' + (settings.haptic ? ' checked' : '') + '>')) +
    setSec('Privasi', setRow('#BB2649', SI.lock, 'Kunci app', lk.on ? 'Aktif · PIN' + (lk.cred ? ' + Face ID' : '') : 'Minta PIN atau Face ID saat app dibuka', '<input type="checkbox" class="tgl" id="set-lock" aria-label="Kunci app"' + (lk.on ? ' checked' : '') + '>') + (lk.on ? setRow('#BB2649', SI.key, 'Ubah PIN / Face ID', '', '', 'lock-change') : '')) +
    setSec('Data', setRow('#88B04B', SI.save, 'Backup', 'Simpan semua pin ke Files/iCloud', '', 'backup') + setRow('#88B04B', SI.up, 'Pulihkan', 'Gabungkan pin dari file backup', '', 'restore') + setRow('#45B5AA', SI.table, 'Ekspor CSV', 'Buka di Excel atau Google Sheets', '', 'export') +
      (ex ? setRow('#F5DF4D', SI.spark, 'Hapus data contoh', '', '', 'clear-examples') : setRow('#F5DF4D', SI.spark, 'Isi data contoh', 'Untuk mencoba dashboard', '', 'load-examples')) +
      setRow('#BB2649', SI.trash, 'Hapus semua data', 'Tidak bisa dibatalkan. Buat backup dulu.', '', 'wipe-ask', 'danger') +
      (wipeAsk ? '<div class="set-confirm"><span class="hint" style="flex:1 1 100%">Hapus ' + n + ' pin dari HP ini?</span><button type="button" class="btn sm line" data-action="wipe-no">Batal</button><button type="button" class="btn sm danger" data-action="wipe-yes">Ya, hapus semua</button></div>' : '')) +
    setSec('App', (IS_STANDALONE ? setRow('#6667AB', SI.phone, 'Terpasang di Home Screen', 'Berjalan sebagai app', '') : setRow('#6667AB', SI.phone, 'Pasang di Home Screen', 'Ikon sendiri, layar penuh', '', 'install')) + setRow('#6667AB', SI.refresh, 'Cek pembaruan', 'Muat ulang ke versi terbaru', '', 'reload')) +
    setSec('Tentang', '<div class="credits"><b>Pinned Pup by YMD</b> versi 2.0 · November 2026<br>© 2026 <b>Yan Malegi Diardi</b>. Hak cipta dilindungi.<br>Peta © OpenStreetMap contributors · Pencarian tempat: Photon (komoot) · Toilet terdekat: Overpass API · Data kelurahan: Kemendagri.<br>Warna Pantone Color of the Year; latar Cloud Dancer 11-4201 (2026).</div>') +
    '<footer class="foot"><span>© 2026 <b>Yan Malegi Diardi</b>. Hak cipta dilindungi.</span><span>Pinned Pup by YMD</span></footer>';
}

/* ---------- app lock (PIN + passkey/Face ID) ---------- */
var LOCKK = 'pp.lock', lockBuf = '', isLocked = false, hiddenAt = 0;
function lockCfg(){ try { return JSON.parse(localStorage.getItem(LOCKK) || '{}') || {}; } catch (e) { return {}; } }
function saveLock(c){ try { localStorage.setItem(LOCKK, JSON.stringify(c)); } catch (e) {} }
function b64(buf){ var u = new Uint8Array(buf), s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }
function unb64(s){ var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
function rnd(n){ var a = new Uint8Array(n); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function(_, i){ a[i] = Math.random() * 256 | 0; }); return a; }
function hashPin(pin, salt){
  var s = salt + ':' + pin + ':pinnedpup';
  if (!(window.crypto && crypto.subtle && window.TextEncoder)) return Promise.resolve('p:' + s);
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(b64);
}
function bioAvailable(){
  try { if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(function(){ return false; }); } catch (e) {}
  return Promise.resolve(false);
}
function registerBio(){
  return navigator.credentials.create({ publicKey: { challenge: rnd(32), rp: { name: 'Pinned Pup' }, user: { id: rnd(16), name: 'pinnedpup', displayName: 'Pinned Pup' + (settings.name ? ' · ' + settings.name : '') }, pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }], authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' }, timeout: 60000, attestation: 'none' } })
    .then(function(cred){ return b64(cred.rawId); });
}
function verifyBio(id){
  return navigator.credentials.get({ publicKey: { challenge: rnd(32), allowCredentials: [{ type: 'public-key', id: unb64(id), transports: ['internal'] }], userVerification: 'required', timeout: 60000 } });
}
function keypadHTML(action){
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(function(k){
    if (!k) return '<button type="button" class="blank" tabindex="-1" aria-hidden="true"></button>';
    return '<button type="button" data-action="' + action + '" data-k="' + k + '"' + (k === 'del' ? ' class="del" aria-label="Hapus angka"' : '') + '>' + (k === 'del' ? 'Hapus' : k) + '</button>';
  }).join('');
}
function dotsHTML(n){ var s = ''; for (var i = 0; i < 4; i++) s += '<i' + (i < n ? ' class="on"' : '') + '></i>'; return s; }
function shake(el){ el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
function showLock(){
  var c = lockCfg();
  if (!c.on || !c.pin) { unlockDone(); return; }
  isLocked = true; lockBuf = '';
  document.documentElement.classList.add('locked'); $('#lock').hidden = false;
  $('#lock-faceid').hidden = !c.cred;
  var m = $('#lock-msg'); m.textContent = c.cred ? 'Pakai Face ID atau masukkan PIN.' : 'Masukkan PIN untuk membuka.'; m.className = '';
  $('#lock-dots').innerHTML = dotsHTML(0);
}
function unlockDone(){ isLocked = false; $('#lock').hidden = true; document.documentElement.classList.remove('locked'); if (map) setTimeout(function(){ map.invalidateSize(); }, 60); }
function lockKey(k){
  if (k === 'del') lockBuf = lockBuf.slice(0, -1); else if (lockBuf.length < 4) lockBuf += k;
  $('#lock-dots').innerHTML = dotsHTML(lockBuf.length); haptic('tap');
  if (lockBuf.length < 4) return;
  var c = lockCfg(), tryPin = lockBuf;
  hashPin(tryPin, c.salt).then(function(h){
    if (h === c.pin) { haptic('success'); unlockDone(); return; }
    haptic('error'); shake($('#lock-dots'));
    var m = $('#lock-msg'); m.textContent = 'PIN salah. Coba lagi.'; m.className = 'err';
    lockBuf = ''; setTimeout(function(){ $('#lock-dots').innerHTML = dotsHTML(0); }, 300);
  });
}
function unlockBio(){
  var c = lockCfg(); if (!c.cred) return;
  verifyBio(c.cred).then(function(){ haptic('success'); unlockDone(); }).catch(function(){ var m = $('#lock-msg'); m.textContent = 'Face ID batal atau gagal. Masukkan PIN.'; m.className = 'err'; });
}
var ls = { step: 'pin1', a: '', b: '', msg: '' };
function openLockSetup(){ ls = { step: 'pin1', a: '', b: '', msg: '' }; renderLockSet(); $('#lockset-scrim').hidden = false; }
function closeLockSet(){ $('#lockset-scrim').hidden = true; if (state.view === 'saya') renderSaya(); }
function renderLockSet(){
  var body = $('#lockset-body');
  if (ls.step === 'pin1' || ls.step === 'pin2') {
    var buf = ls.step === 'pin1' ? ls.a : ls.b;
    body.innerHTML = '<div class="lock-card" style="margin:0 auto 8px"><p' + (ls.msg ? ' class="err"' : '') + '>' + (ls.msg || (ls.step === 'pin1' ? 'Buat PIN 4 angka.' : 'Ketik ulang PIN untuk konfirmasi.')) + '</p><div class="pin-dots" id="ls-dots">' + dotsHTML(buf.length) + '</div><div class="keypad">' + keypadHTML('ls-key') + '</div></div>';
  } else if (ls.step === 'bio') {
    body.innerHTML = '<p class="hint">PIN tersimpan. Mau buka app pakai Face ID juga? iPhone akan menawarkan menyimpan passkey "Pinned Pup".</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn" data-action="ls-bio">Tambah Face ID</button><button type="button" class="btn ghost" data-action="ls-done">Pakai PIN saja</button></div>' + (ls.msg ? '<p class="form-err">' + esc(ls.msg) + '</p>' : '');
  } else {
    body.innerHTML = '<p class="hint">Kunci aktif' + (lockCfg().cred ? ' dengan PIN dan Face ID' : ' dengan PIN') + '. App terkunci saat dibuka atau setelah ditinggal 30 detik.</p><button type="button" class="btn" data-action="lockset-close">Selesai</button>';
  }
}
function lsKey(k){
  var key = ls.step === 'pin1' ? 'a' : 'b';
  if (k === 'del') ls[key] = ls[key].slice(0, -1); else if (ls[key].length < 4) ls[key] += k;
  haptic('tap'); ls.msg = '';
  if (ls[key].length < 4) { renderLockSet(); return; }
  if (ls.step === 'pin1') { ls.step = 'pin2'; renderLockSet(); return; }
  if (ls.a !== ls.b) { ls = { step: 'pin1', a: '', b: '', msg: 'PIN tidak sama. Ulangi dari awal.' }; renderLockSet(); haptic('error'); shake($('#ls-dots')); return; }
  var salt = b64(rnd(12)), pin = ls.a;
  hashPin(pin, salt).then(function(h){
    var old = lockCfg();
    saveLock({ on: true, pin: h, salt: salt, cred: old.cred || null });
    haptic('success');
    return bioAvailable();
  }).then(function(av){ ls.step = av ? 'bio' : 'done'; renderLockSet(); if (state.view === 'saya') renderSaya(); });
}
function lsBio(){
  registerBio().then(function(id){ var c = lockCfg(); c.cred = id; saveLock(c); ls.step = 'done'; ls.msg = ''; renderLockSet(); haptic('success'); if (state.view === 'saya') renderSaya(); })
    .catch(function(){ ls.msg = 'Face ID belum bisa ditambahkan. Kunci tetap aktif dengan PIN.'; renderLockSet(); });
}

/* ---------- wipe / reload ---------- */
function wipeAll(){
  Store.replaceAll([]); wipeAsk = false;
  try { localStorage.removeItem(BKEY); } catch (e) {}
  state.firstFit = false; renderSaya(); toast('Semua data dihapus.');
}
function checkUpdate(){
  toast('Memeriksa pembaruan…');
  var go = function(){ location.reload(); };
  if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) navigator.serviceWorker.getRegistration().then(function(r){ return r && r.update(); }).then(function(){ setTimeout(go, 600); }).catch(go);
  else go();
}

/* ---------- v2 event wiring ---------- */
document.addEventListener('click', function(e){
  var t = e.target.closest && e.target.closest('[data-action]'); if (!t) return;
  switch (t.dataset.action) {
    case 'timer-start': startTimer(); break;
    case 'timer-done': finishTimer(); break;
    case 'timer-cancel': cancelTimer(); break;
    case 'toilet': haptic('tap'); findToilets(); break;
    case 'toilet-close': $('#toilet-scrim').hidden = true; break;
    case 'toilet-clear': clearToilets(); break;
    case 'toilet-go': goToilet(+t.dataset.i); break;
    case 'heat': heatOn = !heatOn; haptic('tap'); renderHeat(); if (heatOn && state.pins.length) fitPins(true); break;
    case 'wrapped': openWrapped(t.dataset.period); break;
    case 'story-close': closeStory(); break;
    case 'story-prev': storyGo(story.i - 1); break;
    case 'story-next': storyGo(story.i + 1); break;
    case 'story-share': storyShare(); break;
    case 'story-restart': storyGo(0); break;
    case 'cal-prev': case 'cal-next':
      var b = calMonth || new Date(); calMonth = new Date(b.getFullYear(), b.getMonth() + (t.dataset.action === 'cal-next' ? 1 : -1), 1); haptic('tap'); renderLog(); break;
    case 'cal-day': calSel = t.dataset.day; haptic('tap'); renderLog(); break;
    case 'del-now':
      var id = state.draft && state.draft.id, old = state.pins.filter(function(p){ return p.id === id; })[0];
      if (!old) break;
      Store.remove(id); closeSheet(); haptic('tap');
      toast('Pup dihapus.', { action: 'Batalkan', ms: 6000, onAction: function(){ Store.save(old); toast('Pup dikembalikan.'); } });
      break;
    case 'share-pin': sharePin(t.dataset.lat, t.dataset.lng, t.dataset.place); break;
    case 'lock-key': lockKey(t.dataset.k); break;
    case 'unlock-bio': unlockBio(); break;
    case 'ls-key': lsKey(t.dataset.k); break;
    case 'ls-bio': lsBio(); break;
    case 'ls-done': ls.step = 'done'; renderLockSet(); break;
    case 'lockset-close': closeLockSet(); break;
    case 'lock-change': openLockSetup(); break;
    case 'wipe-ask': wipeAsk = true; renderSaya(); break;
    case 'wipe-no': wipeAsk = false; renderSaya(); break;
    case 'wipe-yes': wipeAll(); break;
    case 'reload': checkUpdate(); break;
  }
});
$('#saya').addEventListener('change', function(e){
  var t = e.target;
  if (t.name === 'set-theme') { settings.theme = t.value; saveSettings(); applyTheme(); haptic('tap'); }
  else if (t.id === 'set-haptic') { settings.haptic = t.checked; saveSettings(); if (t.checked) haptic('tap'); }
  else if (t.id === 'set-lock') {
    if (t.checked) { t.checked = false; openLockSetup(); }
    else { var c = lockCfg(); c.on = false; saveLock(c); toast('Kunci app dimatikan.'); renderSaya(); }
  }
});
$('#saya').addEventListener('input', function(e){ if (e.target.id === 'set-name') { settings.name = e.target.value.trim().slice(0, 20); saveSettings(); } });
$$('input[name=logmode]').forEach(function(i){ i.addEventListener('change', function(){ logMode = this.value; if (logMode === 'cal' && !calSel) calSel = dkey(Date.now()); haptic('tap'); renderLog(); }); });
$('#f-fac').addEventListener('change', function(){ $('#f-fee-row').hidden = !$('#f-fac-paid').checked; if ($('#f-fac-paid').checked && !$('#f-fee').value) $('#f-fee').value = 2000; });
['#toilet-scrim', '#lockset-scrim'].forEach(function(s){ $(s).addEventListener('click', function(e){ if (e.target === this) { if (s === '#lockset-scrim') closeLockSet(); else this.hidden = true; } }); });
$('#story').addEventListener('pointerdown', function(e){ if (e.target.closest('.s-act,.story-x')) return; story.paused = true; story.pauseAt = performance.now(); });
['pointerup', 'pointercancel', 'pointerleave'].forEach(function(ev){ $('#story').addEventListener(ev, function(){ if (story.paused) { story.t0 += performance.now() - story.pauseAt; story.paused = false; } }); });
document.addEventListener('keydown', function(e){
  if (isLocked) { if (/^[0-9]$/.test(e.key)) lockKey(e.key); else if (e.key === 'Backspace') lockKey('del'); return; }
  if (!$('#story').hidden) { if (e.key === 'Escape') closeStory(); else if (e.key === 'ArrowRight') storyGo(story.i + 1); else if (e.key === 'ArrowLeft') storyGo(story.i - 1); return; }
  if (e.key === 'Escape') { if (!$('#toilet-scrim').hidden) $('#toilet-scrim').hidden = true; if (!$('#lockset-scrim').hidden) closeLockSet(); }
});
document.addEventListener('visibilitychange', function(){
  if (document.hidden) { hiddenAt = Date.now(); return; }
  if (lockCfg().on && !isLocked && hiddenAt && Date.now() - hiddenAt > 30000) showLock();
  if (timer) renderTimer();
});

/* ---------- boot ---------- */
function miniMark(w){ var k = w / 44; return pinHTML('#FF6F61', 0, 'happy').replace('width="44" height="55"', 'width="' + w + '" height="' + Math.round(w * 55 / 44) + '"').replace('class="pin"', 'class="pin" style="width:' + w + 'px;height:' + Math.round(w * 55 / 44) + 'px;filter:none"').replace('class="pin-poop"', 'class="pin-poop" style="left:' + (9 * k).toFixed(1) + 'px;top:' + (7 * k).toFixed(1) + 'px;transform:scale(' + k.toFixed(3) + ');transform-origin:0 0"'); }
applyTheme();
$('#brand-mark').innerHTML = miniMark(30);
$('#lock-mark').innerHTML = miniMark(72);
$('#live-poop').innerHTML = poop(36, 'meh');
$('#lock-keypad').innerHTML = keypadHTML('lock-key');
$('#fab-ic').innerHTML = poop(30, 'happy');
$('#loading-poop').innerHTML = poop(26, 'happy');
$('#empty-poop').innerHTML = poop(84, 'happy');
buildFormStatic(); buildLegend();
try { buildMap(); } catch (e) { $('#map').innerHTML = '<p style="padding:90px 20px;text-align:center;font-weight:800">Peta gagal dimuat. Dashboard dan riwayat tetap bisa dipakai.</p>'; map = null; }
var h0 = (location.hash || '').slice(1);
setView(VIEWS.indexOf(h0) >= 0 ? h0 : 'peta', true);
renderStatus(); renderOverlays();
if (lockCfg().on) showLock(); else document.documentElement.classList.remove('locked');
Store.init();
checkBadges(false);
timer = readTimer(); renderTimer();
renderInstallBar();
if ('serviceWorker' in navigator && location.protocol === 'https:') { window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); }); var swReloaded = false; navigator.serviceWorker.addEventListener('controllerchange', function(){ if (swReloaded) return; swReloaded = true; location.reload(); }); }
setTimeout(function(){ loadGZ().catch(function(){}); }, 1500);
setInterval(function(){ if (state.view === 'dashboard' && state.ready && $('#scrim').hidden) renderDash(); }, 60000);
})();
