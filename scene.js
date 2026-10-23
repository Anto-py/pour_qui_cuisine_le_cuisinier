'use strict';
// Le restaurant, sa caméra et ses états. Le texte vient de contenu.js (construire.py), jamais d'ici.

const $ = id => document.getElementById(id);
const svg = $('svg');
const REDUIT = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DUREE = REDUIT ? 0 : 1000;
const NS = 'http://www.w3.org/2000/svg';
const ENTIER = [60, 40, 1480, 880];

// ---------- États : chaque pas décrit ce qui change ; l'état complet s'accumule dans l'ordre ----------
// position : où est le bâtiment (bas, place, haut) ; grand : la couche d'image large (foule, eau, bistrot, rue)
const DEPART = {
  regime: 'colonne', scene: false, position: 'bas', cadre: [90, 590, 330, 320], sujets: [], grand: null,
  fissure: false, filL: 'non', filV: false, cloison: 'non', voisin: false, sushis: 1,
  panCuisine: true, panBureau: true, carnet: 'aucun', fourneaux: false, pages: false,
  cuisinier: false, cuisX: 'poste', nuage: false, etiquettes: false, accolade: false,
  icones: false, lasagnes: 1, lueur: false, affichage: false, lien: false, dessert: false,
  halos: false, haloCuis: false,
  ombre: false, enveloppe: false, gris: false,
  comptoir: false, bulle: false, encart: false, porte: 'close', copie: 0, apprenti: false, interrupteur: false,
  rideau: false, cam: 'rue', facades: 0, superpose: false,
  haloM: null, menu: 0
};
const CHANGEMENTS = {
  'avant.1': {}, 'avant.2': {}, 'avant.3': {}, 'avant.4': {},
  '1.1': { regime: 'restaurant', scene: true, position: 'place', cadre: [90, 590, 330, 320], sujets: ['assLecteur', 'tableLecteur'] },
  '1.2': { fissure: true, cadre: [80, 516, 1440, 400], sujets: ['fissure'] },
  '1.3': { cadre: [40, 40, 1520, 880], sujets: ['enseigne'] },
  '2.1': { cadre: [200, 600, 160, 190], filL: 'defile', sujets: ['assLecteur', 'filLecteur'] },
  '2.2': { cadre: [80, 580, 730, 330], filL: 'non', cloison: 'basse', voisin: true, sujets: ['convive1', 'convive2', 'assLecteur', 'assVoisin'] },
  '2.3': { filL: 'fixe', filV: true, sujets: ['assLecteur', 'assVoisin', 'filLecteur', 'filVoisin'] },
  '2.4': { cloison: 'haute', sujets: ['cloison', 'convive1', 'convive2'] },
  '3.1': { panCuisine: false, filL: 'non', filV: false, cadre: [800, 516, 720, 390], sujets: ['fourneaux', 'planTravail'] },
  '3.2': { carnet: 'code1', cadre: [830, 600, 660, 300], sujets: ['carnetOuvert', 'fourneaux'] },
  '3.3': { carnet: 'code2', fourneaux: true, sujets: ['carnetOuvert', 'fourneaux'] },
  '3.4': { carnet: 'eclate', pages: true, cadre: [820, 520, 690, 400], sujets: ['pages'] },
  '4.1': { carnet: 'ferme', cuisinier: true, sujets: ['cuisinier', 'carnetFerme'] },
  '4.2': { regime: 'large', grand: 'foule' },
  '4.3': { regime: 'restaurant', grand: null, pages: false, carnet: 'ouvert', nuage: true, etiquettes: true, cadre: [1000, 515, 500, 400], sujets: ['cuisinier', 'carnetOuvert', 'nuage'] },
  '4.4': { accolade: true, cadre: [1000, 515, 500, 490], sujets: ['cuisinier', 'carnetOuvert', 'accolade'] },
  '5.1': { etiquettes: false, accolade: false, nuage: false, cuisX: 'passe', cloison: 'basse', cadre: [80, 560, 880, 350], sujets: ['cuisinier', 'convive1', 'assLecteur'] },
  '5.2': { icones: true, sujets: ['assLecteur', 'cuisinier'] },
  '5.3': { lasagnes: 3, sushis: 0.08, sujets: ['assLecteur', 'lasagnes2', 'lasagnes3', 'assVoisin'] },
  '5.4': { sushis: 1, sujets: ['assLecteur', 'assVoisin', 'cloison'] },
  '5.5': { lueur: true, cadre: [800, 145, 720, 360], sujets: ['porte'] },
  '6.1': { ombre: true, cadre: [1040, 230, 240, 290], sujets: ['porte', 'ombre'] },
  '6.2': { enveloppe: true, cloison: 'non', cadre: [60, 140, 1480, 780], sujets: ['enveloppe', 'cuisinier', 'convive1', 'convive2'] },
  '6.3': { gris: true, cadre: ENTIER, sujets: ['lueurHaut'] },
  '7.1': { regime: 'colonne', scene: false, position: 'haut' },
  '7.2': {}, '7.3': {},
  '8.1': { regime: 'restaurant', scene: true, position: 'place', gris: false, ombre: false, enveloppe: false, cuisX: 'poste', sushis: 1,
    cadre: [800, 145, 720, 360], sujets: ['porte'] },
  '8.2': { panBureau: false, affichage: true, sujets: ['patron', 'affichage', 'compteur'] },
  '8.3': { cadre: [1110, 180, 400, 290], sujets: ['affichage', 'compteur'] },
  '8.4': { lien: true, haloCuis: true, cadre: [860, 170, 640, 740], sujets: ['cuisinier', 'lien', 'compteur'] },
  '8.5': { lien: false, haloCuis: false, dessert: true, cadre: ENTIER, sujets: ['dessert', 'convive1', 'affichage'] },
  '8.6': { halos: true, sujets: ['patron', 'cuisinier', 'convive1'] },
  '9.1': { halos: false, dessert: false, panBureau: true, carnet: 'aucun', cuisX: 'passe', comptoir: true, bulle: true,
    cadre: [340, 520, 640, 390], sujets: ['convive1', 'bulle', 'comptoir', 'cuisinier', 'plat'] },
  '9.2': { porte: 'entrouverte', encart: true, cadre: [340, 200, 940, 710], sujets: ['porte', 'encart', 'plat'] },
  '10.1': { copie: 1, cadre: [370, 520, 1140, 390], sujets: ['bulle', 'copie'] },
  '10.2': { copie: 2, apprenti: true, interrupteur: true, cadre: [210, 520, 1300, 390], sujets: ['apprenti', 'pile', 'interrupteur'] },
  '10.3': { cadre: [220, 560, 380, 340], sujets: ['convive1', 'interrupteur'] },
  '11.1': { regime: 'colonne', scene: false, position: 'bas' },
  '11.2': {}, '11.3': {},
  '11.4': { regime: 'large', grand: 'eau' },
  '11.5': { grand: 'bistrot', rideau: true, cam: 'bistrot' },
  '12.1': { grand: 'rue', cam: 'rue' },
  '12.2': { facades: 1 },
  '12.3': { facades: 2 },
  '12.4': { facades: 3, superpose: true },
  '13.1': { regime: 'restaurant', grand: null, scene: true, position: 'place',
    comptoir: false, bulle: false, encart: false, copie: 0, interrupteur: false, apprenti: false, porte: 'close',
    panBureau: false, carnet: 'ouvert', cuisX: 'poste', voisin: true, haloM: 'cuisinier', cadre: ENTIER, sujets: ['cuisinier', 'haloMobile'] },
  '13.2': { haloM: 'patron', sujets: ['patron', 'compteur', 'haloMobile'] },
  '13.3': { menu: 1, haloM: null, cadre: [250, 120, 1100, 760], sujets: ['menu'] },
  '13.4': { menu: 2 },
  '13.5': { menu: 3 },
  '13.6': { regime: 'colonne', scene: false, position: 'haut' }
};

const PAS = window.PAS;
const ETATS = [];
PAS.reduce((acc, p) => { const e = { ...acc, ...CHANGEMENTS[p.id] }; ETATS.push(e); return e; }, DEPART);
// Image large : l'animation se joue seule, la carte vient ensuite (millisecondes avant la carte)
const DELAI_CARTE = { '11.4': 3200, '11.5': 2700, '12.1': 1300, '12.2': 1000, '12.3': 1000, '12.4': 2200 };

// ---------- Les pas dans la page ----------
const brut = html => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
function construirePas() {
  $('pas').innerHTML = PAS.map((p, i) => {
    const e = ETATS[i];
    let html = (p.surtitre ? `<p class="surtitre">${p.surtitre}</p>` : '') +
      (window.ILLUS[p.id] || '') + p.html +
      (p.sources ? `<p class="sources">Sources : ${p.sources}</p>` : '');
    if (p.id === 'avant.1') html = html.replace('<p>', '<p class="mention">') +
      '<svg class="fleche-bas" viewBox="0 0 56 80"><path d="M28 4v58M8 44l20 24l20-24" fill="none" stroke="#E4632E" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const classes = ['etape', e.regime, window.ILLUS[p.id] ? 'illustre' : '', p.id === '1.1' ? 'citation' : ''].join(' ');
    return `<section class="${classes}" data-i="${i}" data-id="${p.id}"><div class="carte">${html}</div></section>`;
  }).join('');
}

// ---------- Décor généré ----------
function decor() {
  const lignes = $('lignesSi');
  for (let i = 0; i < 64; i++) {
    const t = document.createElementNS(NS, 'text');
    const page = i % 2, rang = Math.floor(i / 2);
    t.setAttribute('x', page ? 1316 : 1160);
    t.setAttribute('y', 650 + rang * 3.6);
    t.textContent = `si convive n°${1000 + i * 37} : ${['retirer', 'ajouter', 'doubler', 'servir'][i % 4]}(…)`;
    t.style.transitionDelay = `${(i * 18)}ms`;
    lignes.appendChild(t);
  }
  const pages = $('pages');
  [[-420, 175, -38], [-330, 190, 22], [-250, 168, -12], [-140, 185, 47], [-40, 172, -25], [60, 188, 15], [140, 170, -55], [-470, 160, 70], [100, 160, 33]]
    .forEach(([tx, ty, r]) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'page');
      g.style.setProperty('--tx', tx + 'px'); g.style.setProperty('--ty', ty + 'px'); g.style.setProperty('--r', r + 'deg');
      g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
      g.innerHTML = '<rect x="1290" y="676" width="40" height="52" fill="#FFFDF7" stroke="#0D1617" stroke-width="2"/><path d="M1296 688h28M1296 698h24M1296 708h28M1296 718h18" stroke="#0D1617" stroke-width="1.5"/>';
      pages.appendChild(g);
    });
  const nuage = $('nuage');
  [[-46, -6], [-16, -20], [16, -22], [46, -8], [-30, 16], [0, 4], [30, 16], [62, 14], [-60, 18]].forEach(([dx, dy], i) => {
    const im = document.createElementNS(NS, 'image');
    im.setAttribute('href', `images/visages/visage_${String(i * 9 + 3).padStart(2, '0')}.png`);
    im.setAttribute('x', 1086 + dx - 15); im.setAttribute('y', 556 + dy - 15);
    im.setAttribute('width', 30); im.setAttribute('height', 30);
    nuage.appendChild(im);
  });
  // La carte à emporter : les trois questions viennent du texte des pas 13.3 à 13.5, coupées en lignes
  ['13.3', '13.4', '13.5'].forEach((id, k) => {
    const p = PAS.find(x => x.id === id), el = $(`menuQ${k + 1}`);
    const mots = brut(p.html).split(' '), lignes = [''];
    mots.forEach(m => { if ((lignes.at(-1) + ' ' + m).trim().length > 48) lignes.push(m); else lignes[lignes.length - 1] = (lignes.at(-1) + ' ' + m).trim(); });
    el.innerHTML = lignes.map((l, j) => `<tspan x="480" dy="${j ? 30 : 0}">${l}</tspan>`).join('');
    el.dataset.texte = JSON.stringify(lignes);
  });
  ['filLecteur', 'filVoisin', 'voisin', 'flammes', 'carnetOuvert', 'carnetFerme', 'nuage', 'etqEcrit', 'etqAppris',
    'accolade', 'affichage', 'lien', 'dessert', 'haloPatron', 'haloCuisinier', 'haloConvive', 'assVoisin', 'carnet',
    'ombre', 'comptoir', 'plat', 'encart', 'interrupteur', 'pile', 'apprenti', 'bulle', 'menu', 'haloMobile',
    'facNous', 'menuQ1', 'menuQ2', 'menuQ3']
    .forEach(id => $(id).classList.add('fondu'));
}

// ---------- Caméra : le sujet tient dans la zone que la colonne de cartes laisse libre ----------
function largeurColonne() { return Math.min(innerWidth * 0.4, 540); }
function cadre(t) {
  const W = innerWidth, H = innerHeight, col = largeurColonne(), m = 28;
  const zx = col + m, zw = W - col - 2 * m, zy = m, zh = H - 2 * m;
  const s = Math.min(zw / t[2], zh / t[3]);
  return [t[0] - (zx + (zw - t[2] * s) / 2) / s, t[1] - (zy + (zh - t[3] * s) / 2) / s, W / s, H / s];
}
let affiche = null, cible = DEPART.cadre, anim = null;
function allerVers(c, instantane, fin) {
  cancelAnimationFrame(anim);
  cible = c;
  const depart = affiche || c, d = instantane ? 0 : DUREE, t0 = performance.now();
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const tick = now => {
    const p = d ? Math.min(1, (now - t0) / d) : 1;
    affiche = depart.map((v, i) => v + (c[i] - v) * ease(p));
    svg.setAttribute('viewBox', cadre(affiche).join(' '));
    if (p < 1) anim = requestAnimationFrame(tick); else if (fin) fin();
  };
  tick(t0);
}

// Une figure-sujet qui entrerait par le côté de la carte apparaît en fondu, une fois la caméra posée (charte).
function sujetsEnAttente(ids) {
  const col = largeurColonne();
  // une caméra interrompue par le pas suivant n'a pas libéré ses figures : on les rend d'abord
  document.querySelectorAll('.attente').forEach(el => el.classList.remove('attente'));
  const attente = ids.map($).filter(el => {
    if (!el || el.closest('.cache')) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.left < col;
  });
  attente.forEach(el => el.classList.add('attente'));
  return () => attente.forEach(el => el.classList.remove('attente'));
}

// ---------- Petites mécaniques réutilisées ----------
const bascule = (id, cls, oui) => $(id).classList.toggle(cls, !!oui);
// Un objet qui fait un trajet : il le joue en avançant, il se pose directement en revenant en arrière.
function trajet(id, actif, avantActif) {
  const joue = actif && !avantActif && !REDUIT;
  bascule(id, 'joue', joue);
  bascule(id, 'pose', actif && !joue);
  bascule(id, 'cache', !actif);
}
// Écrire un texte lettre à lettre dans des lignes (tspan) ; sans animation, tout s'écrit d'un coup.
const frappes = new Map();
function taper(el, lignes, delai = 0, vitesse = 38) {
  clearTimeout(frappes.get(el));
  const tspans = el.querySelectorAll('tspan');
  const cibles = tspans.length ? [...tspans] : [el];
  if (REDUIT) { cibles.forEach((t, j) => { t.textContent = lignes[j]; }); return; }
  cibles.forEach(t => { t.textContent = ''; });
  let j = 0, k = 0;
  const pas = () => {
    if (j >= lignes.length) return;
    k++;
    cibles[j].textContent = lignes[j].slice(0, k);
    if (k >= lignes[j].length) { j++; k = 0; }
    frappes.set(el, setTimeout(pas, vitesse));
  };
  frappes.set(el, setTimeout(pas, delai));
}
function ecrireToutDeSuite(el, lignes) {
  clearTimeout(frappes.get(el));
  const tspans = el.querySelectorAll('tspan');
  (tspans.length ? [...tspans] : [el]).forEach((t, j) => { t.textContent = lignes[j]; });
}
const COMMANDE = ['Un plat végé, vite fait ?'];

// ---------- Appliquer un état ----------
let courant = -1;
function appliquer(i) {
  if (i === courant) return;
  const avant = ETATS[courant] || DEPART;
  const recule = i < courant;
  courant = i;
  const e = ETATS[i];
  document.body.classList.toggle('sans-scene', !e.scene);
  document.body.classList.toggle('large', e.regime === 'large');
  document.body.dataset.grand = e.grand || '';
  document.body.dataset.position = e.position;
  document.querySelectorAll('.etape').forEach(s => s.classList.toggle('actif', +s.dataset.i === i));
  document.querySelector(`.etape[data-i="${i}"]`).classList.add('vu');

  bascule('fissure', 'on', e.fissure);
  bascule('filLecteur', 'cache', e.filL === 'non');
  bascule('filLecteur', 'defile', e.filL === 'defile');
  bascule('filVoisin', 'cache', !e.filV);
  bascule('cloison', 'basse', e.cloison === 'basse');
  bascule('cloison', 'haute', e.cloison === 'haute');
  bascule('voisin', 'cache', !e.voisin);
  $('assVoisin').style.opacity = e.sushis;
  bascule('panCuisine', 'tombe', !e.panCuisine);
  bascule('panBureau', 'tombe', !e.panBureau);

  const ouvert = ['code1', 'code2', 'eclate', 'ouvert'].includes(e.carnet);
  bascule('carnet', 'cache', e.carnet === 'aucun');
  bascule('carnetOuvert', 'cache', !ouvert || (REDUIT && e.carnet === 'eclate'));
  bascule('carnetFerme', 'cache', e.carnet !== 'ferme');
  bascule('carnet', 'code1', e.carnet === 'code1');
  bascule('carnet', 'code2', ['code2', 'eclate', 'ouvert'].includes(e.carnet));
  bascule('carnet', 'deborde', e.carnet === 'eclate' && !REDUIT);
  const vole = e.carnet === 'eclate' && avant.carnet !== 'eclate' && !REDUIT;
  bascule('pages', 'vole', vole);
  bascule('pages', 'pose', e.pages && !vole);
  bascule('pages', 'cache', !e.pages);
  bascule('flammes', 'cache', !e.fourneaux);
  bascule('flammes', 'on', e.fourneaux);

  bascule('cuisinier', 'cache', !e.cuisinier);
  bascule('cuisinier', 'passe', e.cuisX === 'passe');
  bascule('nuage', 'cache', !e.nuage);
  bascule('etqEcrit', 'cache', !e.etiquettes);
  bascule('etqAppris', 'cache', !e.etiquettes);
  bascule('accolade', 'cache', !e.accolade);
  bascule('icones', 'vole', e.icones);
  svg.classList.toggle('trois', e.lasagnes === 3);
  bascule('lueur', 'pulse', e.lueur);

  bascule('affichage', 'cache', !e.affichage);
  bascule('lien', 'cache', !e.lien);
  bascule('dessert', 'cache', !e.dessert);
  if (e.dessert) setTimeout(() => bascule('dessert', 'sert', ETATS[courant].dessert), 60);
  else bascule('dessert', 'sert', false);
  if (e.dessert) dessertServi();
  bascule('haloPatron', 'cache', !e.halos);
  bascule('haloConvive', 'cache', !e.halos);
  bascule('haloCuisinier', 'cache', !(e.halos || e.haloCuis));

  // Séquence 6 : l'ombre sous la porte, l'enveloppe, le gris
  bascule('ombre', 'cache', !e.ombre);
  trajet('enveloppe', e.enveloppe, avant.enveloppe);
  svg.classList.toggle('gris', e.gris);

  // Séquences 9 et 10 : le comptoir
  svg.classList.toggle('comptoir', e.comptoir);
  bascule('comptoir', 'cache', !e.comptoir);
  trajet('bulle', e.bulle, avant.bulle);
  if (e.bulle && !avant.bulle) taper($('bulleTexte'), COMMANDE, 300, 45);
  else if (e.bulle) ecrireToutDeSuite($('bulleTexte'), COMMANDE);
  bascule('plat', 'cache', !e.comptoir);
  bascule('plat', 'tard', e.comptoir && !avant.comptoir);
  bascule('encart', 'cache', !e.encart);
  bascule('battant', 'entrouverte', e.porte === 'entrouverte');
  trajet('copie', e.copie >= 1, avant.copie >= 1);
  bascule('copie', 'range', e.copie === 2);
  bascule('apprenti', 'cache', !e.apprenti);
  bascule('pile', 'cache', !e.apprenti);
  bascule('interrupteur', 'cache', !e.interrupteur);

  // Séquence 13 : le halo qui glisse, la carte à emporter
  bascule('haloMobile', 'cache', !e.haloM);
  bascule('haloMobile', 'patron', e.haloM === 'patron');
  bascule('menu', 'cache', !e.menu);
  [1, 2, 3].forEach(k => {
    const el = $(`menuQ${k}`), lignes = JSON.parse(el.dataset.texte);
    bascule(`menuQ${k}`, 'cache', e.menu < k);
    if (e.menu === k && avant.menu < k && !recule) taper(el, lignes, k === 1 ? 700 : 150, 28);
    else if (e.menu >= k) ecrireToutDeSuite(el, lignes);
  });

  // Image large
  bascule('rideau', 'baisse', e.rideau && e.grand !== 'eau');
  bascule('rueCam', 'bistrot', e.cam === 'bistrot');
  ['facEtoile', 'facEchoppe', 'facFast'].forEach((id, k) => bascule(id, 'on', e.facades > k));
  bascule('facNous', 'cache', !e.superpose);
  bascule('facFast', 'clignote', e.facades === 3 && avant.facades < 3 && !REDUIT);

  document.querySelectorAll('.etape.montre').forEach(x => x.classList.remove('montre'));
  if (e.regime === 'large') {
    const pas = document.querySelector(`.etape[data-i="${i}"]`), carte = pas.querySelector('.carte');
    const montrer = () => { if (courant === i) pas.classList.add('montre'); };
    if (e.grand === 'foule') foule(carte, montrer);
    else {
      $('grand').style.setProperty('--bande', `${carte.getBoundingClientRect().bottom + 24}px`);
      setTimeout(montrer, REDUIT ? 0 : DELAI_CARTE[PAS[i].id]);
    }
  }
  const cachee = !e.scene || !avant.scene || e.regime !== 'restaurant';
  if (cachee) document.querySelectorAll('.attente').forEach(el => el.classList.remove('attente'));
  const liberer = cachee ? () => {} : sujetsEnAttente(e.sujets);
  allerVers(e.cadre, cachee, liberer);
}

// ---------- Compteur : avance avec le temps passé à table, de 8.3 à la fin de la séquence ; ne redescend jamais ----------
const A_TABLE = ['8.3', '8.4', '8.5', '8.6'];
let minutes = 0, servi = false;
function afficherCompteur() { $('chiffre').textContent = String(Math.round(minutes)).padStart(3, '0'); }
setInterval(() => {
  if (document.hidden || courant < 0 || !A_TABLE.includes(PAS[courant].id)) return;
  minutes += 1;
  afficherCompteur();
}, 500);
// Le dessert : un bond de neuf minutes d'un coup, une seule fois
function dessertServi() {
  if (servi) return;
  servi = true;
  const depart = minutes, d = REDUIT ? 0 : 1200, t0 = performance.now() + 500;
  let fait = 0;
  const tick = now => {
    const p = d ? Math.max(0, Math.min(1, (now - t0) / d)) : 1;
    const v = Math.round(9 * p);
    minutes += v - fait; fait = v;
    afficherCompteur();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ---------- Séquence 4, pas 2 : le flot des anciens convives ----------
const VISAGES = Array.from({ length: 89 }, (_, i) => { const im = new Image(); im.src = `images/visages/visage_${String(i + 1).padStart(2, '0')}.png`; return im; });
const CUISINIER = Object.assign(new Image(), { src: 'images/cuisinier_ciseaux.png' });
let animFoule = null;
function foule(carte, fin) {
  const cv = $('foule'), dpr = devicePixelRatio || 1;
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr, ctx = cv.getContext('2d');
  // la bande haute garde la place de la carte qui viendra : rien ne s'y dessine
  const bande = (carte.getBoundingClientRect().bottom + 24) * dpr;
  const ch = Math.min(H * 0.3, (H - bande) * 0.5), cx = W * 0.5, pied = H * 0.96, tete = pied - ch * 0.92;
  const hasard = (a, b) => a + Math.random() * (b - a);
  const N = 420, NUAGE = 70;
  const parts = Array.from({ length: N }, (_, k) => {
    const bord = k % 3, y0 = hasard(bande + 20 * dpr, H);
    const x0 = bord === 0 ? -40 * dpr : bord === 1 ? W + 40 * dpr : hasard(0, W);
    const reste = k < NUAGE, a = (k / NUAGE) * Math.PI * 2;
    return {
      x0, y0: bord === 2 ? H + 40 * dpr : y0, im: VISAGES[k % VISAGES.length], r: hasard(13, 22) * dpr,
      t0: hasard(0, 1700), d: hasard(1100, 1500), reste,
      x1: reste ? cx + Math.cos(a) * hasard(30, 120) * dpr : cx, y1: reste ? tete - 70 * dpr + Math.sin(a) * hasard(14, 46) * dpr : tete
    };
  });
  const morceaux = Array.from({ length: 15 }, (_, k) => ({
    x0: cx + hasard(-320, 320) * dpr, y0: hasard(bande + 60 * dpr, pied), r0: hasard(-2, 2),
    x1: cx + 150 * dpr + ((k % 5) - 2) * 16 * dpr, y1: pied - 26 * dpr - Math.floor(k / 5) * 13 * dpr,
    c: ['#E4632E', '#F7E3B5', '#E3A535'][Math.floor(k / 5)]
  }));
  const ease = x => 1 - Math.pow(1 - x, 3);
  const debut = performance.now(), total = REDUIT ? 0 : 3400;
  cancelAnimationFrame(animFoule);
  const dessiner = now => {
    const t = REDUIT ? 1e9 : now - debut;
    ctx.clearRect(0, 0, W, H);
    // l'assiette : du hasard à la lasagne, au rythme du flot
    const pa = Math.min(1, t / total || 1);
    ctx.fillStyle = '#ECE5D3'; ctx.strokeStyle = '#0D1617'; ctx.lineWidth = 3 * dpr;
    ctx.beginPath(); ctx.ellipse(cx + 150 * dpr, pied - 8 * dpr, 70 * dpr, 14 * dpr, 0, 0, 7); ctx.fill(); ctx.stroke();
    morceaux.forEach(m => {
      const e = ease(pa), x = m.x0 + (m.x1 - m.x0) * e, y = m.y0 + (m.y1 - m.y0) * e;
      ctx.save(); ctx.translate(x, y); ctx.rotate(m.r0 * (1 - e)); ctx.fillStyle = m.c;
      ctx.fillRect(-8 * dpr, -6 * dpr, 16 * dpr, 12 * dpr); ctx.restore();
    });
    // le cuisinier
    if (CUISINIER.complete) ctx.drawImage(CUISINIER, cx - ch * 0.19, pied - ch, ch * 0.38, ch);
    // les visages
    parts.forEach(p => {
      const q = Math.max(0, Math.min(1, (t - p.t0) / p.d));
      if (q <= 0) return;
      const e = ease(q), x = p.x0 + (p.x1 - p.x0) * e, y = p.y0 + (p.y1 - p.y0) * e;
      const r = p.reste ? p.r * (1 - 0.35 * e) : p.r * (1 - e);
      if (r < 0.5 || y < bande || !p.im.complete) return;
      ctx.drawImage(p.im, x - r, y - r, r * 2, r * 2);
    });
    if (t >= total && fin) { fin(); fin = null; }
    if (t < total + 1800) animFoule = requestAnimationFrame(dessiner);
  };
  if (REDUIT) { requestAnimationFrame(dessiner); fin(); return; }
  animFoule = requestAnimationFrame(dessiner);
}

// ---------- Défilement et clavier ----------
function demarrer() {
  construirePas();
  decor();
  const obs = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) appliquer(+x.target.dataset.i); }),
    { rootMargin: '-50% 0px -50% 0px' });
  document.querySelectorAll('.etape').forEach(s => obs.observe(s));
  addEventListener('resize', () => { affiche = null; allerVers(cible, true); });
  addEventListener('keydown', ev => {
    if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
    if (ev.target.closest && ev.target.closest('input,textarea,select')) return;
    ev.preventDefault();
    const i = Math.max(0, Math.min(PAS.length - 1, courant + (ev.key === 'ArrowRight' ? 1 : -1)));
    document.querySelector(`.etape[data-i="${i}"]`).scrollIntoView({ block: 'center', behavior: REDUIT ? 'auto' : 'smooth' });
  });
  appliquer(0);
  allerVers(DEPART.cadre, true);
}
window.__explainer = { PAS, ETATS, appliquer: i => appliquer(i), courant: () => courant };
demarrer();
