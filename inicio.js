/* ============ 🏠 Início: boas-vindas, pesquisa geral e todos os atalhos em quadradinhos ============ */
const INICIO_TILES = [
  ["pacientes", "👥", "Pacientes", () => `${DB.pacientes.length} cadastrados`],
  ["agenda", "📅", "Agenda", () => "atendimentos e lembretes"],
  ["protocolos", "🧭", "Protocolos", () => `${PROTOCOLOS.length} por demanda`],
  ["tecnicas", "🧰", "Técnicas", () => `${TECNICAS.length} com passo a passo`],
  ["caderno", "📓", "Caderno", () => "anotações e áudios"],
  ["estudo", "🎓", "Estudo", () => "casos e glossário"],
  ["literatura", "📚", "Literatura", () => `${Object.keys(REF).length} referências`],
  ["etica", "⚖️", "Ética e CFP", () => "sigilo, prontuário, LGPD"],
  ["dados", "☁️", "Dados e backup", () => "salvamento e Drive"],
  ["config", "⚙️", "Configurações", () => "senha, IA, Drive"]];
function pgInicio() {
  const h = new Date().getHours(), oi = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  return `<div class="ini-hero"><div><h1 style="margin:0">🧠 ${oi}!</h1>
    <p class="muted" style="margin:4px 0 0">O <b>Kit Clínico TCC</b> é seu apoio para registrar atendimentos e conduzir casos com base científica. Tudo criptografado no seu aparelho.</p></div>
    <div class="row" style="gap:6px"><button class="btn sm" data-aj="abrir">❓ Ajuda</button><button class="btn sm" data-aj="bv">👋 Como funciona</button></div></div>
  <div class="ini-busca"><input id="busca" type="search" placeholder="🔍 Pesquisar no kit: técnicas, protocolos, termos, casos, livros, pacientes…" autocomplete="off"><div id="buscaRes"></div></div>
  <div class="ini-tiles">${INICIO_TILES.map(([v, i, n, s]) => `<button class="ini-tile" data-act="nav" data-v="${v}"><span>${i}</span><b>${n}</b><small>${esc(s())}</small></button>`).join("")}
    <button class="ini-tile" data-a11y="temas"><span>🎨</span><b>Temas</b><small>cores e estilo</small></button>
    <button class="ini-tile" data-a11y="open"><span>♿</span><b>Acessibilidade</b><small>tamanho, contraste, voz</small></button></div>`;
}
function buscaGeral(q) {
  q = norm(q).trim(); if (q.length < 2) return "";
  const R = [], ok = s => norm(s).includes(q);
  DB.pacientes.forEach(p => { if (ok(p.codigo || "")) R.push(["👥", p.codigo, "Paciente", `data-act="openP" data-v="${p.id}"`]); });
  TECNICAS.forEach(t => { if (ok(t.nome + " " + t.ind)) R.push(["🧰", t.nome, "Técnica · " + t.ab, `data-act="showTec" data-v="${t.id}"`]); });
  PROTOCOLOS.forEach(p => { if (ok(p.nome + " " + p.kw)) R.push(["🧭", p.nome, "Protocolo", `data-act="nav" data-v="protocolos"`]); });
  CASOS.forEach(c => { if (ok(c.titulo + " " + c.perfil + " " + c.queixa)) R.push(["🗂", c.titulo, "Estudo de caso", `data-act="nav" data-v="casos"`]); });
  glossTodos().forEach((g, i) => { if (!g.cat.startsWith("Técnica") && ok(g.t + " " + g.oq)) R.push(["📖", g.t, g.cat, `data-gl="${esc(g.t)}"`]); });
  Object.entries(REF).forEach(([k, r]) => { if (ok(r)) R.push(["📚", r.slice(0, 90) + (r.length > 90 ? "…" : ""), "Literatura", `data-act="nav" data-v="literatura"`]); });
  if (!R.length) return `<p class="ref" style="padding:8px">Nada encontrado para “${esc(q)}”. Tente outra palavra ou pergunte à 🤖 IA.</p>`;
  return `<div class="ini-res">${R.slice(0, 40).map(([i, t, c, a]) => `<button class="ini-r" ${a}><span>${i}</span><b>${esc(t)}</b><small>${esc(c)}</small></button>`).join("")}</div>${R.length > 40 ? `<p class="ref">Mostrando 40 de ${R.length}. Refine a busca.</p>` : ""}`;
}
(() => {
  const st = document.createElement("style");
  st.textContent = `.ini-hero{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:14px;box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.06))}
.ini-busca{margin-bottom:16px}.ini-busca input{width:100%;padding:13px 16px;border-radius:14px;font-size:15px}
.ini-res{display:grid;gap:8px;margin-top:10px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.ini-r{display:grid;grid-template-columns:28px 1fr;grid-template-rows:auto auto;column-gap:8px;text-align:left;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:12px;padding:10px 12px;cursor:pointer;font:inherit}
.ini-r span{grid-row:1/3;font-size:20px;align-self:center}.ini-r small{color:var(--muted)}
.ini-tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}@media(min-width:620px){.ini-tiles{grid-template-columns:repeat(3,1fr)}}@media(min-width:1000px){.ini-tiles{grid-template-columns:repeat(4,1fr)}}
.ini-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:120px;padding:14px 8px;border:1px solid var(--line);border-radius:16px;background:var(--panel);color:var(--ink);font:inherit;cursor:pointer;box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.06));transition:.15s}
.ini-tile:hover{border-color:var(--accent);transform:translateY(-2px)}.ini-tile span{font-size:32px;line-height:1.1}.ini-tile b{font-size:15px}.ini-tile small{color:var(--muted);font-size:12px;text-align:center}`;
  document.head.appendChild(st);
  document.addEventListener("input", e => { if (e.target.id === "busca") document.getElementById("buscaRes").innerHTML = buscaGeral(e.target.value); });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-gl]"); if (!b) return;
    const g = glossTodos().find(x => x.t === b.dataset.gl); if (!g) return; const d = document.getElementById("dlg");
    d.innerHTML = `<h2 style="margin-top:0">📖 ${esc(g.t)}</h2><p class="ref">${esc(g.cat)}</p><p><b>O que é:</b> ${esc(g.oq)}</p>${g.pq ? `<p><b>Pra que serve:</b> ${esc(g.pq)}</p>` : ""}<p class="ref">${g.refs.map(r => esc(REF[r] || r)).join("<br>")}</p><div class="row" style="justify-content:flex-end"><button class="btn pri" data-aj="fechar">Fechar</button></div>`;
    d.showModal();
  });
  /* menu lateral: recolher/abrir (computador) */
  try { if (localStorage.getItem("navMini") === "1") document.documentElement.classList.add("nav-mini"); } catch {}
  document.addEventListener("click", e => { if (!e.target.closest("[data-navtog]")) return; const m = document.documentElement.classList.toggle("nav-mini"); try { localStorage.setItem("navMini", m ? "1" : ""); } catch {} });
})();
