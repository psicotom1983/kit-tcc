/* ============ RPD em cartões (Greenberger & Padesky, 2017; J. Beck, 2022) ============
   Colunas: 1 Situação · 2 Pensamentos · 3 Emoções · 4 Comportamento · 5 Respostas alternativas · 6 Resultado.
   Evidências a favor/contra ficam escondidas no "＋" (opcional). Registros antigos continuam abrindo. */
const EMOCOES = ["Alegria", "Felicidade", "Contentamento", "Calma", "Tranquilidade", "Serenidade", "Paz", "Alívio", "Gratidão", "Esperança", "Orgulho", "Entusiasmo", "Empolgação", "Euforia", "Amor", "Carinho", "Ternura", "Compaixão", "Confiança", "Segurança", "Satisfação", "Diversão", "Curiosidade", "Interesse", "Coragem", "Admiração", "Surpresa",
  "Tristeza", "Melancolia", "Saudade", "Pesar", "Desânimo", "Apatia", "Tédio", "Solidão", "Desamparo", "Desesperança", "Decepção", "Mágoa", "Rejeição", "Abandono",
  "Ansiedade", "Preocupação", "Nervosismo", "Tensão", "Insegurança", "Medo", "Pavor", "Pânico", "Angústia", "Susto", "Confusão",
  "Raiva", "Irritação", "Frustração", "Impaciência", "Indignação", "Ressentimento", "Rancor", "Ciúme", "Inveja", "Nojo", "Desprezo",
  "Culpa", "Vergonha", "Constrangimento", "Humilhação", "Arrependimento", "Timidez"];
/* exemplos só de emoções agradáveis, para não induzir a resposta */
const EMO_EX = "ex.: alegria, calma…";
const RPD_PERG = [
  ["q1", "Que evidências mostram que o pensamento é verdadeiro? E quais mostram que não é?"],
  ["q2", "Existe outra explicação para o que aconteceu?"],
  ["q3", "Se o pior acontecesse, como eu lidaria? Qual o melhor que poderia acontecer? E o mais realista?"],
  ["q4", "Qual o efeito de eu acreditar nesse pensamento? E qual seria o efeito de mudar meu jeito de pensar?"],
  ["q6", "O que seria bom fazer agora?"]];
let RPD_OPEN = null;

function rpdNorm(r) { if (!Array.isArray(r.emocoes)) r.emocoes = r.emocao ? String(r.emocao).split(/[,;]/).map(s => s.trim()).filter(Boolean).map(n => ({ n, i: r.intens || "" })) : []; return r; }
function rpdSync(r) { r.emocao = r.emocoes.map(e => e.n).join(", "); r.intens = r.emocoes.length ? Math.max(...r.emocoes.map(e => +e.i || 0)) : ""; }
function rpdPct(o, f, label) {
  const v = o[f] === "" || o[f] == null ? 50 : o[f];
  return `<label class="f rpd-pct"><span>${label} <b>${o[f] === "" || o[f] == null ? "—" : o[f] + "%"}</b></span><input type="range" min="0" max="100" step="5" data-o="${reg(o)}" data-f="${f}" value="${v}"></label>`;
}
function rpdBox(n, ic, tit, cor, corpo) { return `<section class="rpd-box" style="--c:${cor}"><h3><span class="rpd-n">${n}</span> ${ic} ${tit}</h3>${corpo}</section>`; }
function rpdEmo(r, campo) {
  const L = r[campo];
  return `<div class="rpd-chips">${L.map((e, i) => `<div class="rpd-chip"><b>${esc(e.n)}</b>
    <input type="range" min="0" max="100" step="5" value="${e.i === "" ? 50 : e.i}" data-rpd="int" data-id="${r.id}" data-c="${campo}" data-i="${i}" aria-label="Intensidade de ${esc(e.n)}"><span>${e.i === "" ? "—" : e.i + "%"}</span>
    <button class="btn sm" data-rpd="rm" data-id="${r.id}" data-c="${campo}" data-i="${i}" aria-label="Tirar ${esc(e.n)}">✕</button></div>`).join("")}</div>
    <div class="rpd-add"><input type="text" placeholder="Digite (${EMO_EX})" data-rpd="busca" data-id="${r.id}" data-c="${campo}" autocomplete="off"><div class="rpd-sug"></div></div>`;
}
function rpdForm(r) {
  rpdNorm(r); r.emoc2 = r.emoc2 || [];
  const quem = r.pessoa ? esc(r.pessoa) : "alguém de quem você gosta muito";
  const temEv = r.evA || r.evC, temQ = RPD_PERG.some(([k]) => r[k]);
  return `<div class="rpd">
  <div class="row" style="align-items:flex-end;gap:10px">${fld(r, "data", "Data", "date")}<p class="ref" style="margin:0 0 10px">Deslize para o lado → para ver as colunas</p></div>
  <div class="rpd-row">
  ${rpdBox(1, "📋", "Situação", "#c9a227", fld(r, "situacao", "O que aconteceu?", "area", { rows: 3, hint: "Com quem você estava? O que estava fazendo? Quando? Onde?" }))}
  ${rpdBox(2, "💭", "Pensamentos automáticos", "#b0607a", fld(r, "pa", "O que passou pela sua cabeça?", "area", { rows: 3, hint: "Que pensamentos ou imagens vieram? O que isso diz sobre você, sua vida, seu futuro? O que você temia que acontecesse?" }) + rpdPct(r, "credPA", "Quanto acreditou nesses pensamentos?"))}
  ${rpdBox(3, "🎭", "Emoções", "#4f8a6b", `<p class="ref" style="margin:0 0 6px">Uma palavra para cada emoção, e quanto ela foi forte (0 a 100%).</p>${rpdEmo(r, "emocoes")}
    <button class="btn sm" data-rpd="ajudaEmo" style="margin-top:8px">❓ Você sabe diferenciar emoções de pensamentos?</button>`)}
  ${rpdBox(4, "🚶", "Comportamento", "#4f74a8", fld(r, "comport", "O que você fez?", "area", { rows: 2, hint: "Que ações você tomou quando se sentiu ou pensou dessa forma?" }))}
  <details class="rpd-mais rpd-ev" ${temEv ? "open" : ""}><summary><b>＋</b> <span>Evidências (opcional)</span></summary>
    <div>${fld(r, "evA", "✔ Evidências que apoiam o pensamento", "area", { rows: 3 })}${fld(r, "evC", "✖ Evidências que não apoiam o pensamento", "area", { rows: 3 })}</div></details>
  ${rpdBox(5, "💡", "Respostas alternativas", "#8a6bb0", `
    <div class="rpd-foco"><p style="margin:0 0 6px"><b>💛 Se ${quem} estivesse nessa mesma situação e tivesse esse pensamento, o que você diria para essa pessoa?</b></p>
      ${fld(r, "pessoa", "Pense em alguém próximo (nome ou apelido, opcional)", "text", { ph: "ex.: minha irmã, meu melhor amigo" })}
      ${fld(r, "q5", "O que você diria a essa pessoa?", "area", { rows: 3, ph: "Fale com o mesmo carinho que usaria com ela" })}
      <p class="ref" style="margin:0">Agora, que tal dizer isso para você mesmo(a)?</p></div>
    <details class="rpd-mais" ${temQ ? "open" : ""}><summary>＋ Outras perguntas que ajudam</summary>${RPD_PERG.map(([k, q]) => fld(r, k, q, "area", { rows: 2 })).join("")}</details>
    ${fld(r, "distorcao", "Distorção cognitiva (se houver)", "select", { options: ["", ...DISTORCOES.map(d => d[0])] })}
    ${fld(r, "resposta", "Minha resposta alternativa", "area", { rows: 3, hint: "Junte o que você descobriu em uma ou mais frases mais equilibradas." })}
    ${rpdPct(r, "credResp", "Quanto acredita nessa resposta?")}`)}
  ${rpdBox(6, "🌱", "Resultado", "#5f8f9a", `${rpdPct(r, "credPA2", "Quanto acredita agora no pensamento automático?")}
    <p class="ref" style="margin:8px 0 6px">Que emoções você sente agora, e com que força?</p>${rpdEmo(r, "emoc2")}
    ${fld(r, "fazer", "O que seria bom fazer?", "area", { rows: 2 })}
    ${r.resultado ? fld(r, "resultado", "Anotações do resultado", "area", { rows: 2 }) : ""}`)}
  </div>
  <p class="ref">Baseado em Greenberger e Padesky (2017) e J. Beck (2022).</p></div>`;
}
const RPD_AJUDA = `<h2 style="margin-top:0">Emoção ou pensamento?</h2>
<p><b>🎭 Emoção</b> costuma caber em <b>uma palavra</b>: triste, ansioso, com raiva, envergonhado, alegre, calmo.</p>
<p><b>💭 Pensamento</b> é uma <b>frase</b>, uma ideia sobre você, os outros ou o futuro: “ela não gosta de mim”, “vou falhar”.</p>
<p>⚠️ Dica: quando dizemos <b>“eu senti que…”</b>, quase sempre o que vem depois é um <b>pensamento</b>. “Senti que ninguém ligava para mim” → o pensamento é “ninguém liga para mim”; a emoção pode ser tristeza ou solidão.</p>
<p>Pergunta que ajuda: <b>“Consigo dizer isso em uma palavra?”</b> Se sim, provavelmente é emoção. Se precisa de uma frase, é pensamento.</p>
<p class="ref">Greenberger, D.; Padesky, C. A. A mente vencendo o humor. 2. ed. Porto Alegre: Artmed, 2017. · Beck, J. S. Terapia cognitivo-comportamental: teoria e prática. 3. ed. Porto Alegre: Artmed, 2022.</p>
<div class="row" style="justify-content:flex-end"><button class="btn pri" data-rpd="fechar">Entendi</button></div>`;

(() => {
  const st = document.createElement("style");
  st.textContent = `.rpd{display:grid;gap:8px;margin-top:10px}
.rpd-row{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 10px;align-items:stretch}
.rpd-row>*{flex:0 0 min(84vw,310px);scroll-snap-align:start;margin:0}
.rpd-row>.rpd-ev:not([open]){flex:0 0 54px;display:flex;align-items:stretch}
.rpd-ev:not([open]) summary{writing-mode:vertical-rl;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;list-style:none;font-size:.9em}
.rpd-ev summary::-webkit-details-marker{display:none}.rpd-ev summary b{font-size:1.4em}
.rpd-box{border:1px solid var(--line);border-top:5px solid var(--c);border-radius:14px;padding:12px 14px;background:var(--panel)}
.rpd-box h3{margin:0 0 8px;font-size:1.02em;display:flex;align-items:center;gap:6px}.rpd-n{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--c);color:#fff;font-size:.8em}
.rpd-pct input{width:100%;accent-color:var(--accent)}.rpd-pct b{color:var(--accent)}
.rpd-chips{display:grid;gap:6px}.rpd-chip{display:grid;grid-template-columns:minmax(80px,auto) 1fr 44px auto;align-items:center;gap:8px;background:var(--chip);border-radius:10px;padding:4px 8px}
.rpd-chip input{width:100%;accent-color:var(--accent)}.rpd-add{position:relative;margin-top:6px}.rpd-add input{width:100%}
.rpd-sug{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.rpd-sug button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:6px 12px;cursor:pointer}
.rpd-mais{border:1px dashed var(--line);border-radius:12px;padding:8px 12px}.rpd-mais summary{cursor:pointer;color:var(--accent);font-weight:600}
.rpd-foco{background:var(--accent-soft);border-radius:12px;padding:10px 12px;margin-bottom:10px}`;
  document.head.appendChild(st);
  const achar = id => { for (const p of DB.pacientes) { const r = (p.rpd || []).find(x => x.id === id); if (r) return r; } };
  const redesenha = id => { RPD_OPEN = id; V._keepScroll = true; render(); };
  document.addEventListener("input", e => {
    const el = e.target;
    if (el.closest && el.closest(".rpd-pct") && el.type === "range") { const b = el.closest(".rpd-pct").querySelector("b"); if (b) b.textContent = el.value + "%"; }
    if (!el.dataset || !el.dataset.rpd || !DB) return;
    const r = achar(el.dataset.id); if (!r) return; rpdNorm(r); r.emoc2 = r.emoc2 || [];
    if (el.dataset.rpd === "int") { r[el.dataset.c][+el.dataset.i].i = +el.value; el.nextElementSibling.textContent = el.value + "%"; rpdSync(r); touch(); }
    if (el.dataset.rpd === "busca") {
      const q = el.value.trim().toLowerCase(), box = el.nextElementSibling, ja = r[el.dataset.c].map(x => x.n);
      const m = q ? EMOCOES.filter(n => n.toLowerCase().startsWith(q) && !ja.includes(n)).slice(0, 8) : [];
      if (q && !m.length) m.push(el.value.trim());
      box.innerHTML = m.map(n => `<button type="button" data-rpd="add" data-id="${r.id}" data-c="${el.dataset.c}" data-v="${esc(n)}">+ ${esc(n)}</button>`).join("");
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter" || !e.target.dataset || e.target.dataset.rpd !== "busca") return;
    e.preventDefault(); const b = e.target.nextElementSibling.querySelector("button"); if (b) b.click();
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-rpd]"); if (!b || !DB || b.tagName === "INPUT") return;
    const a = b.dataset.rpd;
    if (a === "ajudaEmo") { const d = document.getElementById("dlg"); d.innerHTML = RPD_AJUDA; d.showModal(); return; }
    if (a === "fechar") { document.getElementById("dlg").close(); return; }
    const r = achar(b.dataset.id); if (!r) return; rpdNorm(r); r.emoc2 = r.emoc2 || [];
    if (a === "add") { const n = b.dataset.v.charAt(0).toUpperCase() + b.dataset.v.slice(1); if (!r[b.dataset.c].some(x => x.n === n)) r[b.dataset.c].push({ n, i: 50 }); }
    if (a === "rm") r[b.dataset.c].splice(+b.dataset.i, 1);
    rpdSync(r); touch(); redesenha(r.id);
    if (a === "add") setTimeout(() => { const i = document.querySelector(`[data-rpd="busca"][data-id="${r.id}"][data-c="${b.dataset.c}"]`); if (i) i.focus(); }, 30);
  });
})();
