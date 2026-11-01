/* Pinned Pup by YMD · data contoh · © 2026 Yan Malegi Diardi */
function makeExamples(now){
  var s = 20261101;
  function rnd(){ s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }
  function pick(arr){ return arr[Math.floor(rnd() * arr.length)]; }
  var PLACES = [
    { name: 'Rumah', lat: -6.2383, lng: 106.9756, w: 0.5, toilet: ['duduk', 'duduk', 'jongkok'], rate: [5, 5, 4], area: 'Kayuringinjaya, Bekasi Selatan, Kota Bekasi', fac: { spray: 1, tissue: 1, soap: 1 } },
    { name: 'Kantor', lat: -6.2297, lng: 106.8277, w: 0.22, toilet: ['duduk'], rate: [4, 3, 4], area: 'Kuningan Timur, Setiabudi, Kota Jakarta Selatan', fac: { spray: 1, tissue: 1, soap: 1 } },
    { name: 'Rest Area KM 57', lat: -6.3790, lng: 107.3440, w: 0.07, toilet: ['jongkok'], rate: [2, 3, 2], area: 'Kutamekar, Ciampel, Kab. Karawang', fac: { spray: 1, paid: 1, fee: 2000 } },
    { name: 'Rumah Bandung', lat: -6.9147, lng: 107.6098, w: 0.1, toilet: ['jongkok', 'duduk'], rate: [4, 5], area: 'Babakan Ciamis, Sumur Bandung, Kota Bandung', fac: { spray: 1, soap: 1 } },
    { name: 'Mal', lat: -6.2265, lng: 107.0010, w: 0.07, toilet: ['duduk'], rate: [5, 4], area: 'Margamulya, Bekasi Utara, Kota Bekasi', fac: { spray: 1, tissue: 1, soap: 1 } },
    { name: 'SPBU Cibubur', lat: -6.3700, lng: 106.8930, w: 0.04, toilet: ['jongkok'], rate: [1, 2], area: 'Harjamukti, Cimanggis, Kota Depok', fac: { paid: 1, fee: 2000 } }
  ];
  var NOTES = ['Lega banget', 'Sambil baca berita', 'Antre dua orang', 'Tisu habis, untung bawa', '', '', '', ''];
  var out = [], day = 86400000;
  for (var i = 0; i < 44; i++) {
    var r = rnd(), acc = 0, P = PLACES[0];
    for (var j = 0; j < PLACES.length; j++) { acc += PLACES[j].w; if (r <= acc) { P = PLACES[j]; break; } }
    var daysAgo = i < 9 ? i % 7 : Math.floor(rnd() * 50);
    var h = rnd(), hour = h < 0.5 ? 5 + Math.floor(rnd() * 3) : h < 0.78 ? 12 + Math.floor(rnd() * 3) : 19 + Math.floor(rnd() * 4);
    if (P.name === 'Kantor') hour = 9 + Math.floor(rnd() * 7);
    var d = new Date(now - daysAgo * day); d.setHours(hour, Math.floor(rnd() * 60), 0, 0);
    var ts = d.getTime(); if (ts > now) ts = now - Math.floor(rnd() * 5 + 1) * 3600000;
    var tags = [], t = rnd();
    if (t < 0.35) tags.push('kopi');
    if (rnd() < 0.2) tags.push('pedas');
    if (rnd() < 0.25) tags.push('serat');
    if (rnd() < 0.12) tags.push('begadang');
    if (tags.indexOf('pedas') < 0 && rnd() < 0.25) tags.push('air');
    var bristol = pick([3, 4, 4, 4, 5, 3, 4, 2, 5]);
    if (tags.indexOf('pedas') >= 0) bristol = pick([6, 7, 6, 5]);
    else if (tags.indexOf('begadang') >= 0) bristol = pick([2, 1, 2, 3]);
    else if (tags.indexOf('serat') >= 0 || tags.indexOf('air') >= 0) bristol = pick([4, 4, 3, 4]);
    var timed = rnd() < 0.3;
    var p = {
      id: 'contoh-' + String(i + 1).padStart(2, '0'), ts: ts, place: P.name, area: P.area,
      lat: +(P.lat + (rnd() - 0.5) * 0.0006).toFixed(5), lng: +(P.lng + (rnd() - 0.5) * 0.0006).toFixed(5),
      bristol: bristol, toilet: pick(P.toilet), rating: pick(P.rate), dur: timed ? 3 + Math.floor(rnd() * 9) : 2 + Math.floor(rnd() * 14),
      note: pick(NOTES), tags: tags, timed: timed, example: true
    };
    if (rnd() < 0.6) p.fac = { spray: !!P.fac.spray, tissue: !!P.fac.tissue, soap: !!P.fac.soap, paid: !!P.fac.paid, fee: P.fac.fee || 0 };
    out.push(p);
  }
  return out;
}
