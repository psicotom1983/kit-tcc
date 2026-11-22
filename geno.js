/* ============ 🌳 Família: genograma + leitura sistêmica ============
   Símbolos padrão de McGoldrick, Gerson e Petry (2012): □ homem, ○ mulher, ◇ não informado, X falecido,
   contorno duplo = paciente; uniões com / (separação) e // (divórcio); linhas de relação emocional. */
const GERS = [["-2", "Avós"], ["-1", "Pais / tios"], ["0", "Paciente / irmãos / cônjuge"], ["1", "Filhos / sobrinhos"], ["2", "Netos"]];
const UNIAO = ["Casados", "União estável", "Namoro", "Separados", "Divorciados"];
const RELS = [["proxima", "💚 Próxima"], ["fusionada", "🟢 Muito próxima / fusionada"], ["distante", "⋯ Distante"], ["conflito", "⚡ Conflituosa"], ["rompida", "✂ Rompimento"], ["violencia", "⛔ Violência / abuso"]];
const FASES = ["", "Jovem adulto saindo de casa", "Formação do casal", "Família com filhos pequenos", "Família com adolescentes", "Lançando os filhos (ninho vazio)", "Família no estágio tardio da vida"];

function genoNorm(p) {
  p.geno = p.geno || {}; const g = p.geno;
  g.pessoas = g.pessoas || []; g.rels = g.rels || [];
  if (!g.pessoas.length) g.pessoas.push({ id: uid(), nome: p.codigo || "Paciente", sexo: "?", ger: "0", idade: p.idade || "", falecido: false, paciente: true, pai: "", mae: "", parceiro: "", uniao: "Casados", obs: "" });
  return g;
}
function genoNome(g, id) { const x = g.pessoas.find(q => q.id === id); return x ? x.nome || "?" : "?"; }
function genoSVG(g) {
  const W = 96, H = 120, top = 40, rows = {};
  g.pessoas.forEach(x => (rows[x.ger] = rows[x.ger] || []).push(x));
  const pos = {}, gers = Object.keys(rows).map(Number).sort((a, b) => a - b);
  const ger0 = gers[0] ?? 0; let maxX = 0;
  gers.forEach(gn => {
    /* ordena pelos pais (quem tem pais mais à esquerda vem antes) e junta casais */
    const L = rows[gn].slice().sort((a, b) => ((pos[a.pai] || pos[a.mae] || { x: 1e4 }).x) - ((pos[b.pai] || pos[b.mae] || { x: 1e4 }).x));
    const ord = [];
    L.forEach(x => { if (ord.includes(x)) return; ord.push(x); const pa = L.find(y => y.id === x.parceiro || y.parceiro === x.id); if (pa && !ord.includes(pa)) ord.push(pa); });
    ord.forEach((x, i) => { pos[x.id] = { x: 50 + i * W, y: top + (gn - ger0) * H }; maxX = Math.max(maxX, 50 + i * W); });
  });
  const S = 34, h2 = S / 2; let s = "";
  /* relações emocionais (atrás) */
  g.rels.forEach(r => {
    const a = pos[r.a], b = pos[r.b]; if (!a || !b || r.a === r.b) return;
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len * 4, ny = dx / len * 4;
    const ln = (o, st) => `<line x1="${a.x + nx * o}" y1="${a.y + ny * o}" x2="${b.x + nx * o}" y2="${b.y + ny * o}" ${st}/>`;
    if (r.tipo === "proxima") s += ln(-0.5, 'stroke="#3f9a5a" stroke-width="1.6"') + ln(0.5, 'stroke="#3f9a5a" stroke-width="1.6"');
    else if (r.tipo === "fusionada") s += ln(-1, 'stroke="#3f9a5a" stroke-width="1.4"') + ln(0, 'stroke="#3f9a5a" stroke-width="1.4"') + ln(1, 'stroke="#3f9a5a" stroke-width="1.4"');
    else if (r.tipo === "distante") s += ln(0, 'stroke="#8a8a8a" stroke-width="1.6" stroke-dasharray="4 5"');
    else if (r.tipo === "rompida") { s += ln(0, 'stroke="#8a8a8a" stroke-width="1.6"'); const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; s += `<line x1="${mx - nx * 2 - dx / len * 4}" y1="${my - ny * 2 - dy / len * 4}" x2="${mx + nx * 2 - dx / len * 4}" y2="${my + ny * 2 - dy / len * 4}" stroke="#8a8a8a" stroke-width="2"/><line x1="${mx - nx * 2 + dx / len * 4}" y1="${my - ny * 2 + dy / len * 4}" x2="${mx + nx * 2 + dx / len * 4}" y2="${my + ny * 2 + dy / len * 4}" stroke="#8a8a8a" stroke-width="2"/>`; }
    else { const n = Math.max(4, Math.round(len / 9)); let d = `M${a.x} ${a.y}`; for (let i = 1; i < n; i++) d += ` L${a.x + dx * i / n + nx * (i % 2 ? 1.2 : -1.2)} ${a.y + dy * i / n + ny * (i % 2 ? 1.2 : -1.2)}`; d += ` L${b.x} ${b.y}`;
      s += `<path d="${d}" fill="none" stroke="${r.tipo === "violencia" ? "#7a1f1f" : "#c0392b"}" stroke-width="${r.tipo === "violencia" ? 2.4 : 1.6}"/>`; }
  });
  /* uniões e filhos */
  const casais = new Set();
  g.pessoas.forEach(x => { const pa = g.pessoas.find(y => y.id === x.parceiro); if (!pa || !pos[x.id] || !pos[pa.id]) return;
    const k = [x.id, pa.id].sort().join("|"); if (casais.has(k)) return; casais.add(k);
    const a = pos[x.id], b = pos[pa.id], y = a.y + h2 + 14;
    s += `<path d="M${a.x} ${a.y + h2} V${y} H${b.x} V${b.y + h2}" fill="none" stroke="var(--ink,#333)" stroke-width="1.6" ${x.uniao === "Namoro" ? 'stroke-dasharray="5 4"' : ""}/>`;
    const mx = (a.x + b.x) / 2;
    if (x.uniao === "Separados" || x.uniao === "Divorciados") s += `<line x1="${mx - 4}" y1="${y + 7}" x2="${mx + 4}" y2="${y - 7}" stroke="var(--ink,#333)" stroke-width="1.6"/>`;
    if (x.uniao === "Divorciados") s += `<line x1="${mx + 2}" y1="${y + 7}" x2="${mx + 10}" y2="${y - 7}" stroke="var(--ink,#333)" stroke-width="1.6"/>`;
  });
  const grupos = {};
  g.pessoas.forEach(c => { if (!c.pai && !c.mae) return; const k = [c.pai, c.mae].filter(Boolean).sort().join("|"); (grupos[k] = grupos[k] || []).push(c); });
  Object.entries(grupos).forEach(([k, filhos]) => {
    const pais = k.split("|").map(id => pos[id]).filter(Boolean); if (!pais.length) return;
    const px = pais.reduce((n, q) => n + q.x, 0) / pais.length, py = pais.length > 1 ? pais[0].y + h2 + 14 : pais[0].y + h2;
    const fs = filhos.map(f => pos[f.id]).filter(Boolean); if (!fs.length) return;
    const by = fs[0].y - h2 - 18, xs = fs.map(f => f.x).concat(px);
    s += `<path d="M${px} ${py} V${by}" stroke="var(--ink,#333)" stroke-width="1.6"/><path d="M${Math.min(...xs)} ${by} H${Math.max(...xs)}" stroke="var(--ink,#333)" stroke-width="1.6"/>`;
    fs.forEach(f => s += `<path d="M${f.x} ${by} V${f.y - h2}" stroke="var(--ink,#333)" stroke-width="1.6"/>`);
  });
  /* pessoas */
  g.pessoas.forEach(x => {
    const { x: cx, y: cy } = pos[x.id]; if (cx === undefined) return;
    const st = 'fill="var(--panel,#fff)" stroke="var(--ink,#333)" stroke-width="1.8"';
    const forma = (d) => x.sexo === "M" ? `<rect x="${cx - h2 - d}" y="${cy - h2 - d}" width="${S + 2 * d}" height="${S + 2 * d}" ${st}/>` : x.sexo === "F" ? `<circle cx="${cx}" cy="${cy}" r="${h2 + d}" ${st}/>` : `<path d="M${cx} ${cy - h2 - d - 4} L${cx + h2 + d + 4} ${cy} L${cx} ${cy + h2 + d + 4} L${cx - h2 - d - 4} ${cy}Z" ${st}/>`;
    s += (x.paciente ? forma(5) : "") + forma(0);
    if (x.falecido) s += `<path d="M${cx - h2} ${cy - h2} L${cx + h2} ${cy + h2} M${cx + h2} ${cy - h2} L${cx - h2} ${cy + h2}" stroke="var(--ink,#333)" stroke-width="1.6"/>`;
    if (x.idade !== "" && x.idade != null) s += `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink,#333)">${esc(String(x.idade))}</text>`;
    s += `<text x="${cx}" y="${cy + h2 + 16 + (x.paciente ? 5 : 0)}" text-anchor="middle" font-size="11" fill="var(--ink,#333)">${esc((x.nome || "?").slice(0, 14))}</text>`;
  });
  const hgt = top + (gers.length ? (gers[gers.length - 1] - ger0) : 0) * H + 60;
  return `<svg viewBox="0 0 ${maxX + 60} ${hgt}" width="${maxX + 60}" height="${hgt}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;font-family:system-ui,sans-serif">${s}</svg>`;
}
const GENO_LEG = `<p class="ref" style="margin:6px 0 0">□ homem · ○ mulher · ◇ não informado · ✕ falecido · contorno duplo = paciente · número = idade · / separados · // divorciados · tracejado = namoro<br>
Relações: <span style="color:#3f9a5a">═ próxima ≡ fusionada</span> · ⋯ distante · <span style="color:#c0392b">⚡ conflito</span> · ✂ rompimento · <span style="color:#7a1f1f">⚡ violência</span></p>`;
function tabFamilia(p) {
  const g = genoNorm(p), op = [["", "—"], ...g.pessoas.map(x => [x.id, x.nome || "?"])];
  return `<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">🌳 Genograma</h3>
    <span class="row" style="gap:6px"><button class="btn sm" data-gen="print">🖨 Imprimir</button><button class="btn sm" data-act="nav" data-v="tecnicas" title="Técnicas sistêmicas">🧰 Técnicas</button></span></div>
    <div class="geno-wrap">${genoSVG(g)}</div>${GENO_LEG}</div>
  <div class="card" id="geno-form"><div class="row" style="justify-content:space-between"><h3 style="margin:0">👥 Pessoas</h3><button class="btn pri sm" data-gen="add">+ Pessoa</button></div>
    ${g.pessoas.map(x => `<details class="item" ${x.id === GENO_ABERTO ? "open" : ""}><summary>${x.sexo === "M" ? "□" : x.sexo === "F" ? "○" : "◇"} ${esc(x.nome || "?")}${x.paciente ? " ⭐" : ""} <span class="sum-meta">${esc((GERS.find(q => q[0] === String(x.ger)) || [, ""])[1])}</span></summary><div class="body">
      <div class="g3">${fld(x, "nome", "Nome ou papel (ex.: mãe, avô materno)", "text")}${fld(x, "sexo", "Sexo", "select", { options: [["?", "Não informado"], ["M", "Masculino □"], ["F", "Feminino ○"]] })}${fld(x, "ger", "Geração", "select", { options: GERS })}</div>
      <div class="g3">${fld(x, "idade", "Idade", "number")}${fld(x, "pai", "Pai", "select", { options: op.filter(o => o[0] !== x.id) })}${fld(x, "mae", "Mãe", "select", { options: op.filter(o => o[0] !== x.id) })}</div>
      <div class="g3">${fld(x, "parceiro", "Parceiro(a)", "select", { options: op.filter(o => o[0] !== x.id) })}${fld(x, "uniao", "Tipo de união", "select", { options: UNIAO })}<div>${fld(x, "falecido", "Falecido(a)", "check")}${fld(x, "paciente", "É o paciente", "check")}</div></div>
      ${fld(x, "obs", "Observações (doenças, padrões, eventos marcantes)", "area", { rows: 2 })}
      <div class="row" style="justify-content:flex-end"><button class="btn sm del" data-gen="del" data-v="${x.id}">🗑 Tirar pessoa</button></div></div></details>`).join("")}</div>
  <div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">💞 Relações emocionais</h3><button class="btn sm" data-gen="rel">+ Relação</button></div>
    ${g.rels.map((r, i) => `<div class="g3" style="align-items:end">${fld(r, "a", "Entre", "select", { options: op })}${fld(r, "b", "e", "select", { options: op })}<div class="row" style="gap:6px;align-items:end">${fld(r, "tipo", "Tipo", "select", { options: RELS })}<button class="btn sm del" data-gen="delrel" data-v="${i}" aria-label="Tirar relação">✕</button></div></div>`).join("") || `<p class="ref">Nenhuma relação marcada.</p>`}</div>
  <div class="card"><h3 style="margin-top:0">🔄 Leitura sistêmica</h3>
    ${fld(g, "fase", "Fase do ciclo de vida familiar", "select", { options: FASES, hint: "Carter e McGoldrick (1995): cada fase tem tarefas e crises esperadas." })}
    ${fld(g, "padroes", "Padrões que se repetem entre gerações", "area", { rows: 2, ph: "ex.: alcoolismo, separações, filhos parentalizados, segredos" })}
    ${fld(g, "triangulos", "Triângulos e alianças", "area", { rows: 2, ph: "ex.: mãe e filho contra o pai; filho no meio do conflito do casal" })}
    ${fld(g, "fronteiras", "Fronteiras e hierarquia (rígidas, difusas, claras)", "area", { rows: 2 })}
    ${fld(g, "rede", "Rede de apoio fora da família (ecomapa: escola, trabalho, igreja, amigos, serviços)", "area", { rows: 2 })}
    ${fld(g, "hipotese", "Hipótese sistêmica: para que serve o sintoma nesta família?", "area", { rows: 2 })}
    <p class="ref">${esc(REF.MGP || "")}</p></div>`;
}
let GENO_ABERTO = null;
(() => {
  const st = document.createElement("style");
  st.textContent = `.geno-wrap{overflow-x:auto;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:8px;margin-top:10px;text-align:center}`;
  document.head.appendChild(st);
  document.addEventListener("change", e => { if (e.target.closest && e.target.closest("#geno-form, .card") && document.querySelector(".geno-wrap") && e.target.dataset && e.target.dataset.o) setTimeout(() => { V._keepScroll = true; render(); }, 0); });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-gen]"); if (!b || !DB) return;
    const p = DB.pacientes.find(x => x.id === V.pid); if (!p) return; const g = genoNorm(p), a = b.dataset.gen;
    if (a === "print") return printDoc(`Genograma — ${p.codigo || ""}`, `${genoSVG(g)}${GENO_LEG}
      ${g.fase ? `<p><b>Fase do ciclo de vida:</b> ${esc(g.fase)}</p>` : ""}${g.padroes ? `<p><b>Padrões transgeracionais:</b> ${esc(g.padroes)}</p>` : ""}${g.triangulos ? `<p><b>Triângulos e alianças:</b> ${esc(g.triangulos)}</p>` : ""}${g.fronteiras ? `<p><b>Fronteiras:</b> ${esc(g.fronteiras)}</p>` : ""}${g.rede ? `<p><b>Rede de apoio:</b> ${esc(g.rede)}</p>` : ""}${g.hipotese ? `<p><b>Hipótese sistêmica:</b> ${esc(g.hipotese)}</p>` : ""}
      <p class="ref">${esc(REF.MGP || "")}</p>`, "Documento sigiloso");
    if (a === "add") { const n = { id: uid(), nome: "", sexo: "?", ger: "0", idade: "", falecido: false, paciente: false, pai: "", mae: "", parceiro: "", uniao: "Casados", obs: "" }; g.pessoas.push(n); GENO_ABERTO = n.id; }
    if (a === "del") { const x = g.pessoas.find(q => q.id === b.dataset.v); if (!x || !confirm(`Tirar ${x.nome || "esta pessoa"} do genograma?`) || !confirm("Tem certeza? As ligações com ela também saem.")) return;
      g.pessoas = g.pessoas.filter(q => q !== x); g.pessoas.forEach(q => { ["pai", "mae", "parceiro"].forEach(k => { if (q[k] === x.id) q[k] = ""; }); }); g.rels = g.rels.filter(r => r.a !== x.id && r.b !== x.id); }
    if (a === "rel") g.rels.push({ a: "", b: "", tipo: "proxima" });
    if (a === "delrel") g.rels.splice(+b.dataset.v, 1);
    touch(); V._keepScroll = true; render();
  });
})();
