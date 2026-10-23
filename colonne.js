'use strict';
// Les illustrations des blocs en colonne (séquences 7 et 11), une par pas, posées au-dessus du texte.
// Elles jouent une fois, quand le pas devient actif (classe .vu), puis tiennent leur dernière image.
// Aucun texte lu ici : seulement ce qui est écrit dans l'image (ticket, étiquettes), avec les liens vers les sources des chiffres.

(() => {
  const DIXK = 'https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/meta-20251231.htm';
  const AIE = 'https://www.iea.org/reports/energy-and-ai/executive-summary';
  const lien = (url, x, y, texte, cls = 't-ligne') =>
    `<a href="${url}" target="_blank" rel="noopener"><text class="${cls} t-lien" x="${x}" y="${y}">${texte}</text></a>`;

  const caisse = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <g class="tiroir">
        <rect x="10" y="150" width="260" height="58" fill="#0B4E4E" stroke="#0D1617" stroke-width="5"/>
        <rect x="26" y="156" width="68" height="28" fill="#F7F2E6" stroke="#0D1617" stroke-width="2"/>
        <rect x="106" y="156" width="68" height="28" fill="#F7F2E6" stroke="#0D1617" stroke-width="2"/>
        <rect x="186" y="156" width="68" height="28" fill="#F7F2E6" stroke="#0D1617" stroke-width="2"/>
        <rect x="120" y="194" width="40" height="6" rx="3" fill="#E3A535"/>
      </g>
      <rect x="20" y="0" width="240" height="160" rx="14" fill="#127676" stroke="#0D1617" stroke-width="5"/>
      <rect x="44" y="20" width="192" height="46" rx="6" fill="#0D1617"/>
      <text class="t-ecran" x="222" y="54" text-anchor="end">0,00</text>
      ${[0, 1, 2].map(r => [0, 1, 2, 3].map(c =>
        `<rect x="${52 + c * 46}" y="${82 + r * 24}" width="34" height="16" rx="4" fill="#FFFDF7" stroke="#0D1617" stroke-width="2"/>`).join('')).join('')}
      <rect x="0" y="146" width="280" height="10" fill="#0D1617"/>
    </g>`;

  // 98 pièces orange sur 100, allumées rangée par rangée
  const pieces = (x0, y0) => Array.from({ length: 100 }, (_, i) => {
    const r = Math.floor(i / 10), c = i % 10;
    return `<circle class="piece${i < 98 ? ' on' : ''}" style="--d:${0.9 + r * 0.16}s" cx="${x0 + c * 22}" cy="${y0 + r * 22}" r="8"/>`;
  }).join('');

  const ticketFace = `
    <text class="t-entete" x="150" y="62" text-anchor="middle">META · RECETTES 2025</text>
    <path d="M70 76h160" class="t-tirets"/>
    <text class="t-ligne" x="74" y="104">recettes</text>
    <text class="t-ligne" x="74" y="132">201 milliards $</text>
    <text class="t-ligne" x="74" y="168">dont publicité</text>
    <text class="t-ligne" x="74" y="196">196 milliards $</text>
    <path d="M70 214h160" class="t-tirets"/>
    <text class="t-ligne" x="150" y="244" text-anchor="middle">* * *</text>`;

  // Japon : une barre à sa consommation actuelle, un peu sous 945 TWh, marquée d'un disque comme un drapeau
  const japon = `
    <g class="japon"><rect x="456" y="50" width="66" height="266" fill="#FFFDF7" stroke="#0D1617" stroke-width="3"/>
      <circle cx="489" cy="183" r="20" fill="#E4632E"/></g>`;

  window.ILLUS = {
    '7.1': `<svg class="illus" viewBox="0 0 360 260" role="img" aria-label="Une caisse enregistreuse, tiroir ouvert et vide">
      ${caisse(40, 10)}</svg>`,

    '7.2': `<svg class="illus" viewBox="0 0 560 330" role="img" aria-label="Le ticket de Meta pour 2025, et cent pièces dont quatre-vingt-dix-huit allumées">
      <rect x="30" y="8" width="240" height="26" rx="6" fill="#127676" stroke="#0D1617" stroke-width="4"/>
      <g class="ticket-imprime">
        <path d="M60 30h180v260l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10z" transform="translate(0 0)" fill="#FFFDF7" stroke="#0D1617" stroke-width="3"/>
        <text class="t-entete l-1" x="150" y="62" text-anchor="middle">META · RECETTES 2025</text>
        <path d="M70 76h160" class="t-tirets l-1"/>
        <text class="t-ligne l-2" x="74" y="104">recettes</text>
        <g class="l-2">${lien(DIXK, 74, 132, '201 milliards $')}</g>
        <text class="t-ligne l-3" x="74" y="168">dont publicité</text>
        <g class="l-3">${lien(DIXK, 74, 196, '196 milliards $')}</g>
        <path d="M70 214h160" class="t-tirets l-3"/>
      </g>
      <g class="grille">${pieces(330, 70)}</g>
      <text class="t-legende l-4" x="429" y="300" text-anchor="middle">98 sur 100</text>
    </svg>`,

    '7.3': `<svg class="illus" viewBox="0 0 560 470" role="img" aria-label="Une annonceuse pose une liasse sur la caisse ; temps à table, publicité vue, argent">
      <g class="caisse-ouverte">${caisse(30, 110, 0.62)}</g>
      <g class="liasse"><rect x="104" y="214" width="38" height="16" fill="#127676" stroke="#0D1617" stroke-width="2"/><rect x="104" y="208" width="38" height="8" fill="#E3A535" stroke="#0D1617" stroke-width="2"/></g>
      <image class="annonceur" href="images/annonceur_paie_ciseaux.png" x="196" y="0" width="185" height="322"/>
      <g class="chaine">
        <g class="c1"><circle cx="110" cy="400" r="30" class="c-rond"/><circle cx="110" cy="400" r="16" fill="none" stroke="#0D1617" stroke-width="3"/><path d="M110 390v10l7 5" fill="none" stroke="#0D1617" stroke-width="3" stroke-linecap="round"/><text class="t-legende" x="110" y="456" text-anchor="middle">temps à table</text></g>
        <path class="c-fleche f1" d="M150 400h70" marker-end="url(#flecheCol)"/>
        <g class="c2"><circle cx="280" cy="400" r="30" class="c-rond"/><path d="M258 400q22-20 44 0q-22 20-44 0z" fill="#FFFDF7" stroke="#0D1617" stroke-width="3"/><circle cx="280" cy="400" r="6" fill="#127676"/><text class="t-legende" x="280" y="456" text-anchor="middle">publicité vue</text></g>
        <path class="c-fleche f2" d="M320 400h70" marker-end="url(#flecheCol)"/>
        <g class="c3"><circle cx="450" cy="400" r="30" class="c-rond"/><circle cx="450" cy="400" r="15" fill="#E3A535" stroke="#0D1617" stroke-width="3"/><circle cx="450" cy="400" r="8" fill="none" stroke="#0D1617" stroke-width="2"/><text class="t-legende" x="450" y="456" text-anchor="middle">argent</text></g>
      </g>
      <defs><marker id="flecheCol" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#E4632E"/></marker></defs>
    </svg>`,

    '11.1': `<svg class="illus" viewBox="0 0 300 300" role="img" aria-label="Le ticket se retourne : son dos est vierge">
      <g class="recto"><path d="M60 20h180v250l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10z" fill="#FFFDF7" stroke="#0D1617" stroke-width="3"/>${ticketFace.replace(/y="(\d+)"/g, (m, y) => `y="${+y - 10}"`).replace(/M70 (\d+)h160/g, (m, y) => `M70 ${+y - 10}h160`)}</g>
      <g class="verso"><path d="M60 20h180v250l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10l-15 10l-15-10z" fill="#FFFDF7" stroke="#0D1617" stroke-width="3"/></g>
    </svg>`,

    '11.2': `<svg class="illus" viewBox="0 0 560 320" role="img" aria-label="Un centre de données en coupe, rempli d'armoires d'ordinateurs">
      <path d="M0 236h70" stroke="#0D1617" stroke-width="14" stroke-linecap="round"/><path d="M0 236h70" stroke="#E3A535" stroke-width="4"/>
      <rect x="70" y="30" width="440" height="270" fill="#F7F2E6" stroke="#0D1617" stroke-width="5"/>
      <rect x="60" y="18" width="460" height="16" fill="#0B4E4E" stroke="#0D1617" stroke-width="4"/>
      ${Array.from({ length: 5 }, (_, a) => `
        <rect x="${96 + a * 82}" y="60" width="60" height="220" rx="4" fill="#127676" stroke="#0D1617" stroke-width="4"/>
        ${Array.from({ length: 8 }, (_, r) => `
          <rect x="${104 + a * 82}" y="${72 + r * 26}" width="44" height="14" fill="#0B4E4E"/>
          <circle class="voyant" style="--d:${0.2 + r * 0.18}s;--b:${(a * 7 + r * 3) % 10 / 10 + 1.4}s" cx="${140 + a * 82}" cy="${79 + r * 26}" r="3.5"/>`).join('')}`).join('')}
    </svg>`,

    '11.3': `<svg class="illus" viewBox="0 0 580 350" role="img" aria-label="Électricité des centres de données : 415 térawattheures en 2024, 945 en 2030, plus que le Japon aujourd'hui">
      <g class="dos"><path d="M10 10h170v300l-14 10l-14-10l-14 10l-14-10l-14 10l-14-10l-14 10l-14-10l-14 10l-14-10l-14 10l-14-10z" fill="#FFFDF7" stroke="#0D1617" stroke-width="3"/>
        <text class="t-entete l-1" x="95" y="44" text-anchor="middle">2e ADDITION</text>
        <path d="M24 58h142" class="t-tirets l-1"/>
        <text class="t-ligne l-1" x="24" y="88">électricité</text>
        <text class="t-ligne l-1" x="24" y="110">des centres</text>
        <text class="t-ligne l-1" x="24" y="132">de données</text>
      </g>
      <path d="M220 316h350" stroke="#0D1617" stroke-width="4"/>
      <rect class="barre b1" x="240" y="196" width="66" height="120" fill="#127676" stroke="#0D1617" stroke-width="3"/>
      <rect class="barre b2" x="336" y="42" width="66" height="274" fill="#E4632E" stroke="#0D1617" stroke-width="3"/>
      <g class="b1-t">${lien(AIE, 273, 186, '415 TWh', 't-legende t-centre')}</g>
      <g class="b2-t">${lien(AIE, 369, 32, '945 TWh', 't-legende t-centre')}</g>
      <text class="t-legende" x="273" y="340" text-anchor="middle">2024</text>
      <text class="t-legende" x="369" y="340" text-anchor="middle">2030</text>
      ${japon}
      <text class="t-legende japon-t" x="489" y="340" text-anchor="middle">Japon, aujourd'hui</text>
    </svg>`
  };
})();
