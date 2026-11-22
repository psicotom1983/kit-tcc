/* ============ Temas e acessibilidade (Kit Clínico TCC) ============
   - Temas: cores, fundo e fonte. Preferência por aparelho (localStorage "kitTema").
   - Acessibilidade: tamanho (A− / A+ / Restaurar), alto contraste e "ler botões".
   Tudo isso é só aparência: não toca nos dados do cofre. */
const Temas = (() => {
  const CLARO = { bg: "#f6f5f2", panel: "#fff", ink: "#1f2328", muted: "#5f6670", line: "#e1ded7", accent: "#2f6f6a", "on-accent": "#fff", "accent-soft": "#e3efed", warn: "#8a5200", "warn-soft": "#fff3dc", danger: "#b42318", "danger-soft": "#fde8e8", ok: "#1f7a35", "ok-soft": "#e3f4e6", chip: "#efede8" };
  const ESCURO = { bg: "#15171a", panel: "#1d2024", ink: "#e6e6e3", muted: "#9aa1a9", line: "#30343a", accent: "#6fb8b0", "on-accent": "#0f1a19", "accent-soft": "#1f3432", warn: "#e0a84a", "warn-soft": "#3a2d16", danger: "#ff8a8a", "danger-soft": "#3d1d1d", ok: "#7fd48f", "ok-soft": "#1b331f", chip: "#272b30" };
  const SOMBRA = "0 1px 2px rgba(16,24,40,.07),0 2px 6px rgba(16,24,40,.05)";
  const SERIF = 'Georgia,"Times New Roman",serif';

  /* fundo com desenhos bem leves (só aparece entre os cartões) */
  const fundo = (simbolos, cor, op = 0.07, tam = 140) => {
    const t = simbolos.map((s, i) => `<text x="${[18, 88, 52, 112][i % 4]}" y="${[34, 58, 104, 128][i % 4]}" font-size="${[26, 20, 30, 18][i % 4]}" font-family="Georgia,serif">${s}</text>`).join("");
    return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}"><g fill="${cor}" fill-opacity="${op}">${t}</g></svg>`)}")`;
  };
  const rede = cor => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><g stroke="${cor}" stroke-opacity=".12" fill="${cor}" fill-opacity=".16"><path d="M20 30L80 60L140 25M80 60L60 130L130 115M80 60L130 115" fill="none"/><circle cx="20" cy="30" r="4"/><circle cx="80" cy="60" r="5"/><circle cx="140" cy="25" r="4"/><circle cx="60" cy="130" r="4"/><circle cx="130" cy="115" r="4"/></g></svg>`)}")`;

  /* id, nome, grupo, cores (sobre a base), extras */
  const L = [
    ["consultorio", "Consultório (claro)", "Profissionais", { bg: "#eef1f4", ink: "#1b2733", muted: "#5b6878", line: "#cfd6de", accent: "#1f4e79", "accent-soft": "#e3ecf5", chip: "#e9edf2", shadow: SOMBRA }],
    ["consultorio-escuro", "Consultório (escuro)", "Profissionais", { escuro: 1, bg: "#11161c", panel: "#1a212a", ink: "#e8edf2", muted: "#9aa7b4", line: "#2e3a47", accent: "#5fb3a8", "on-accent": "#0c1a18", "accent-soft": "#1c3330", chip: "#222b35", shadow: "0 1px 3px rgba(0,0,0,.45)" }],
    ["bi", "Painel de BI", "Profissionais", { bg: "#f3f2f1", ink: "#252423", muted: "#605e5c", line: "#d6d4d2", accent: "#1b6ec2", "accent-soft": "#e1edf9", chip: "#edebe9", shadow: SOMBRA },
      `header{background:#1f2d3d;color:#fff;border-color:#1f2d3d}.card,details.item{border-left:4px solid var(--accent)}`],
    ["cafe", "Café / Terra (escuro)", "Profissionais", { escuro: 1, bg: "#1c1814", panel: "#27211b", ink: "#ece3d8", muted: "#b2a392", line: "#3b3229", accent: "#c49a6c", "on-accent": "#24180e", "accent-soft": "#3a2c20", chip: "#30281f", ok: "#9cc28f", warn: "#e0b25e", danger: "#e58a7a", shadow: "0 1px 3px rgba(0,0,0,.45)" }],
    ["cafe-leite", "Café com leite (claro)", "Profissionais", { bg: "#efe7dc", panel: "#faf6f0", ink: "#3b2e22", muted: "#7a6a58", line: "#dccdbb", accent: "#8a5a35", "accent-soft": "#f0e2d2", chip: "#ece1d3", shadow: SOMBRA }],
    ["fosco", "Fosco escuro (cores calmas)", "Profissionais", { escuro: 1, bg: "#1a1d22", panel: "#23272e", ink: "#e4e6ea", muted: "#9da3ad", line: "#343a43", accent: "#7d9cc4", "on-accent": "#111821", "accent-soft": "#2a3442", chip: "#2b3038", ok: "#8fbf9a", warn: "#d8b46a", danger: "#d98b8b", shadow: "0 1px 3px rgba(0,0,0,.4)" }],
    ["cinza", "51 tons de cinza", "Profissionais", { bg: "#ececec", panel: "#fafafa", ink: "#202020", muted: "#666", line: "#cbcbcb", accent: "#3d3d3d", "accent-soft": "#e0e0e0", chip: "#e6e6e6", shadow: SOMBRA }],
    ["colorido", "Colorido", "Divertidos", { bg: "#fff7ef", ink: "#2a1f3d", muted: "#6b5f80", line: "#f0d9c4", accent: "#7b2ff7", "accent-soft": "#efe4ff", chip: "#ffeedd", bgimg: fundo(["●", "●", "●", "●"], "#ff7a59", 0.12) },
      `nav button:nth-child(1){color:#e8590c}nav button:nth-child(2){color:#1c7ed6}nav button:nth-child(3){color:#2b8a3e}nav button:nth-child(4){color:#ae3ec9}nav button:nth-child(5){color:#d6336c}nav button:nth-child(6){color:#0c8599}nav button:nth-child(7){color:#5f3dc4}`],
    ["psicologia", "Psicologia (Ψ de fundo)", "Divertidos", { bg: "#f3f1fa", accent: "#5b4bb7", "accent-soft": "#ebe8f8", line: "#dcd7ee", bgimg: fundo(["Ψ", "♡", "Ψ", "✱"], "#5b4bb7", 0.09) }],
    ["neuro", "Neurociência", "Divertidos", { escuro: 1, bg: "#0d1424", panel: "#141d33", ink: "#e3e9f7", muted: "#9aa8c7", line: "#26324f", accent: "#59b4ff", "on-accent": "#06182b", "accent-soft": "#16304d", chip: "#1b2642", bgimg: rede("#59b4ff") }],
    ["tcc", "TCC (Beck)", "Abordagens", { bg: "#eef6f6", accent: "#0f766e", "accent-soft": "#dcefed", line: "#cfe3e1", bgimg: fundo(["△", "▲", "△", "▲"], "#0f766e", 0.08), shadow: SOMBRA }],
    ["psicanalise", "Psicanálise (Freud)", "Abordagens", { bg: "#efe6d6", panel: "#fbf6ec", ink: "#3a2a1c", muted: "#7a6550", line: "#d8c7aa", accent: "#7a2e2e", "accent-soft": "#f1e0d6", chip: "#f0e6d4", font: SERIF, bgimg: fundo(["Ψ", "∞", "?", "Ψ"], "#7a2e2e", 0.08) }],
    ["junguiana", "Analítica (Jung)", "Abordagens", { bg: "#f1eff8", accent: "#3b3486", "accent-soft": "#e6e3f5", line: "#d9d5ec", font: SERIF, bgimg: fundo(["◎", "☉", "◎", "✶"], "#3b3486", 0.08) }],
    ["comportamental", "Comportamental (Skinner)", "Abordagens", { bg: "#f2f7ee", accent: "#3f7d20", "accent-soft": "#e2f0d9", line: "#d4e4c8", bgimg: fundo(["→", "+", "→", "−"], "#3f7d20", 0.08) }],
    ["humanista", "Humanista (Rogers)", "Abordagens", { bg: "#fbf3ec", accent: "#b5532f", "accent-soft": "#f8e3d8", line: "#ecd8c8", bgimg: fundo(["♡", "☀", "♡", "☀"], "#b5532f", 0.08) }],
    ["gestalt", "Gestalt", "Abordagens", { bg: "#f4f0f8", accent: "#7a3e9d", "accent-soft": "#efe2f6", line: "#e0d3ea", bgimg: fundo(["◐", "○", "◑", "●"], "#7a3e9d", 0.08) }],
    ["sistemica", "Sistêmica (família)", "Abordagens", { bg: "#eef3f8", accent: "#2463a6", "accent-soft": "#e0ebf7", line: "#d1dde9", bgimg: rede("#2463a6") }],
    ["act", "ACT", "Abordagens", { bg: "#eef7f5", accent: "#1f8a70", "accent-soft": "#dcf0ea", line: "#cde5de", bgimg: fundo(["❋", "❀", "❋", "❀"], "#1f8a70", 0.08) }],
    ["dbt", "DBT", "Abordagens", { bg: "#f1f3fb", accent: "#4b5bd6", "accent-soft": "#e4e7fa", line: "#d6daf0", bgimg: fundo(["∿", "⚖", "∿", "∿"], "#4b5bd6", 0.08) }],
  ];
  /* campanhas do mês */
  const MESES = [["Janeiro Branco", "#5c7091"], ["Fevereiro Roxo", "#6a1b9a"], ["Março Lilás", "#8e5ccf"], ["Abril Azul", "#1e78c8"], ["Maio Amarelo", "#b98a00"], ["Junho Vermelho", "#c62828"],
    ["Julho Amarelo", "#b98a00"], ["Agosto Lilás", "#8e5bbf"], ["Setembro Amarelo", "#b98a00"], ["Outubro Rosa", "#d63f7d"], ["Novembro Azul", "#1565c0"], ["Dezembro Vermelho", "#b71c1c"]];
  MESES.forEach(([n, c], i) => L.push([`m${i + 1}`, n, "Campanhas do mês", { accent: c, "accent-soft": c + "1f", line: c + "33", bg: i === 0 ? "#f7f8fb" : "#f8f7f5", bgimg: fundo(["🎗", "", "", ""], c, 0.10, 180) },
    `header{border-bottom:4px solid var(--accent)}`]));

  /* gera o CSS */
  let css = `body{background-image:var(--bgimg,none);font-family:var(--font,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif)}.card,details.item{box-shadow:var(--shadow,none)}`;
  for (const [id, , , v, x] of L) {
    const base = { ...(v.escuro ? ESCURO : CLARO), ...v }; delete base.escuro;
    css += `:root[data-theme="${id}"]{${Object.entries(base).map(([k, val]) => `--${k}:${val}`).join(";")};color-scheme:${v.escuro ? "dark" : "light"}}`;
    if (x) css += x.replace(/(^|})([^{]+)\{/g, (m, a, sel) => `${a}${sel.split(",").map(s => `:root[data-theme="${id}"] ${s.trim()}`).join(",")}{`);
  }
  css += `:root.hc{--bg:#000!important;--panel:#000!important;--ink:#fff!important;--muted:#fff!important;--line:#fff!important;--accent:#ffd400!important;--on-accent:#000!important;--accent-soft:#222!important;--chip:#111!important;--warn:#ffd400!important;--danger:#ff6b6b!important;--ok:#7dff8a!important;--bgimg:none!important;color-scheme:dark}
:root.hc a{text-decoration:underline}:root.hc .card,:root.hc details.item,:root.hc .btn,:root.hc input,:root.hc select,:root.hc textarea{border-width:2px!important}
:root.hc :focus-visible{outline:3px solid #ffd400!important;outline-offset:2px}
.flag{flex-shrink:1;min-width:0}i.ti{font-style:normal}
/* ---- Estilo "quadradinhos" (padrão). O clássico é só não ter a classe ui-cards ---- */
:root.ui-cards main{line-height:1.45}
:root.ui-cards .card,:root.ui-cards details.item{border-radius:16px;box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.08));margin:0 0 12px}
:root.ui-cards details.item>summary{padding:14px 16px;font-weight:600}
:root.ui-cards .btn{border-radius:12px}
:root.ui-cards h1{margin:4px 0 10px}
:root.ui-cards .tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;border:0;overflow:visible;-webkit-mask-image:none;margin:10px 0 16px}
:root.ui-cards .tabs button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;white-space:normal;text-align:center;line-height:1.15;font-size:11.5px;padding:10px 4px;min-height:68px;background:var(--panel);border:1px solid var(--line);border-radius:14px;margin:0;box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.06));color:var(--ink)}
:root.ui-cards .tabs button .ti{font-size:22px}
:root.ui-cards .tabs button.on{border:2px solid var(--accent);background:var(--accent-soft);font-weight:700}
:root.ui-cards main>p.muted{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer;position:relative}
:root.ui-cards main>p.muted.aberto{display:block}
:root.ui-cards .chip,:root.ui-cards .chips button{border-radius:12px}
@media(min-width:761px){:root.ui-cards .tabs{grid-template-columns:repeat(8,1fr)}}
/* ---- Estilo "Painel BI": indicadores no topo + listas em grade de cartões ---- */
.bi-kpis{display:none}
:root.ui-bi .bi-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:10px;margin:4px 0 14px;grid-column:1/-1}
.bi-k{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:14px;padding:10px 12px;box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.06))}
.bi-k b{display:block;font-size:24px;line-height:1.1;color:var(--accent)}.bi-k span{font-size:12px;color:var(--muted)}
@media(max-width:760px){:root.ui-bi .bi-kpis{grid-template-columns:repeat(4,1fr);gap:6px}.bi-k{padding:6px 8px;border-left-width:3px}.bi-k b{font-size:18px}.bi-k span{font-size:10.5px;line-height:1.2;display:block}}
.bi-bars{grid-column:1/-1;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:10px 14px;margin-bottom:14px}
.bi-bars h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.bi-bar{display:grid;grid-template-columns:120px 1fr 30px;gap:8px;align-items:center;font-size:12.5px;margin:4px 0}.bi-bar i{height:10px;border-radius:5px;background:var(--accent);opacity:.8}.bi-bar em{font-style:normal;color:var(--muted);text-align:right}
/* tiles: toda lista de cartões vira grade de quadrados */
:root.ui-bi main{max-width:1400px}
:root.ui-bi main :is(div,section,main):has(>details.item+details.item){display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;align-items:stretch}
@media(min-width:761px){:root.ui-bi main :is(div,section,main):has(>details.item+details.item){grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}}
:root.ui-bi main :has(>details.item+details.item)>details.item{margin:0}
:root.ui-bi main :has(>details.item+details.item)>details.item[open]{grid-column:1/-1}
:root.ui-bi main:has(>details.item+details.item){display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;align-content:start;align-items:stretch}
@media(min-width:761px){:root.ui-bi main:has(>details.item+details.item){grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}}
:root.ui-bi main:has(>details.item+details.item)>:not(details.item){grid-column:1/-1}
:root.ui-bi main:has(>details.item+details.item)>details.item{margin:0}:root.ui-bi main:has(>details.item+details.item)>details.item[open]{grid-column:1/-1}
:root.ui-bi main[data-pg="literatura"] :has(>details.item+details.item),:root.ui-bi main[data-pg="literatura"]:has(>details.item+details.item){grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
:root.ui-bi details.item{border-radius:16px;border-top:4px solid var(--accent);background:var(--panel);box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.08))}
:root.ui-bi details.item>summary{list-style:none;display:flex;flex-direction:column;align-items:flex-start;gap:6px;min-height:92px;padding:14px 16px;font-weight:700;line-height:1.3}
:root.ui-bi details.item>summary::-webkit-details-marker{display:none}
:root.ui-bi details.item>summary::before{content:var(--ic,"▦");font-size:22px;font-weight:400}
:root.ui-bi details.item[open]>summary{min-height:0;flex-direction:row;align-items:center;border-bottom:1px solid var(--line)}
:root.ui-bi details.item>summary .sum-meta,:root.ui-bi details.item>summary .badge{font-weight:400;font-size:12px}
:root.ui-bi main[data-pg="tecnicas"]{--ic:"🧰"}:root.ui-bi main[data-pg="protocolos"]{--ic:"🧭"}:root.ui-bi main[data-pg="casos"]{--ic:"🗂"}:root.ui-bi main[data-pg="glossario"]{--ic:"📖"}
:root.ui-bi main[data-pg="caderno"]{--ic:"📝"}:root.ui-bi main[data-pg="etica"]{--ic:"⚖️"}:root.ui-bi main[data-pg="pacientes"]{--ic:"🗓"}:root.ui-bi main[data-pg="literatura"]{--ic:"📚"}
:root.ui-bi .card{border-radius:16px;border-left:4px solid var(--accent);box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.08))}
:root.ui-bi .plist{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:0}
:root.ui-bi .plist>li{border:1px solid var(--line);border-top:4px solid var(--accent);border-radius:16px;background:var(--panel);padding:12px 14px;list-style:none;box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.08))}
:root.ui-bi h1{font-size:1.35em}
:root.ui-bi main>*{grid-column:1/-1}:root.ui-bi main :is(div,section):has(>details.item+details.item){display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;align-items:start}:root.ui-bi main :is(div,section):has(>details.item+details.item)>details.item{margin:0}:root.ui-bi main :is(div,section):has(>details.item+details.item)>details.item[open]{grid-column:1/-1}:root.ui-bi main>details.item{grid-column:auto;margin:0}:root.ui-bi main>details.item[open]{grid-column:1/-1}}
#a11yDlg .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}#a11yDlg .btn{min-height:44px}#a11yDlg h3{margin:14px 0 6px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- preferências do aparelho ---------- */
  const P = (() => { try { return JSON.parse(localStorage.getItem("kitA11y")) || {}; } catch { return {}; } })();
  const salvaP = () => { try { localStorage.setItem("kitA11y", JSON.stringify(P)); } catch {} };
  const ZOOM = [0.85, 0.9, 1, 1.1, 1.2, 1.35, 1.5, 1.7];
  let temaCfg = "";

  function resolve(t) { return t === "mes" ? `m${new Date().getMonth() + 1}` : t; }
  function tema() { let t = null; try { t = localStorage.getItem("kitTema"); } catch {} return t ?? temaCfg ?? ""; }
  function aplicar(cfgTema) {
    if (cfgTema !== undefined) temaCfg = cfgTema || "";
    const t = resolve(tema()), r = document.documentElement;
    if (t) r.dataset.theme = t; else delete r.dataset.theme;
    r.classList.toggle("hc", !!P.hc);
    r.classList.toggle("ui-cards", P.estilo !== "classico");
    r.classList.toggle("ui-bi", P.estilo === "bi");
    if (document.body) document.body.style.zoom = P.zoom && P.zoom !== 1 ? P.zoom : "";
  }
  function escolher(t) {
    try { localStorage.setItem("kitTema", t); } catch {}
    try { if (typeof DB !== "undefined" && DB && DB.config) DB.config.tema = t; } catch {}
    const s = document.getElementById("cfgTema"); if (s) s.value = t;
    aplicar();
  }
  function opcoes() {
    return [["", "Automático (do aparelho)"], ["light", "Claro"], ["dark", "Escuro"], ["mes", "📅 Tema do mês (muda sozinho)"], ...L.map(([id, n, g]) => [id, `${g} — ${n}`])];
  }

  /* ---------- ler botões em voz alta ---------- */
  function falar(txt) {
    if (!("speechSynthesis" in window) || !txt) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt.replace(/\s+/g, " ").trim().slice(0, 160)); u.lang = "pt-BR"; speechSynthesis.speak(u);
  }
  document.addEventListener("click", e => {
    if (!P.tts) return;
    const el = e.target.closest("button,a,summary,select,[role=button],.chip,label");
    if (el) falar(el.getAttribute("aria-label") || el.title || el.innerText || el.value);
  }, true);

  /* ---------- janela "Aa" ---------- */
  let MODO = "a11y";
  function janela(modo) {
    if (modo) MODO = modo;
    let d = document.getElementById("a11yDlg");
    if (!d) { d = document.createElement("dialog"); d.id = "a11yDlg"; document.body.appendChild(d); d.addEventListener("click", ev => { if (ev.target === d) d.close(); }); }
    const z = Math.round((P.zoom || 1) * 100), grupos = {};
    L.forEach(([id, n, g]) => (grupos[g] = grupos[g] || []).push(`<option value="${id}">${n}</option>`));
    d.innerHTML = MODO === "temas" ? `<h2 style="margin-top:0">🎨 Temas e estilo</h2>
      <h3>Estilo</h3>
      <div class="row"><button class="btn${!P.estilo || P.estilo === "cards" ? " pri" : ""}" data-a11y="cards">▦ Quadradinhos</button><button class="btn${P.estilo === "bi" ? " pri" : ""}" data-a11y="bi">📊 Painel BI</button><button class="btn${P.estilo === "classico" ? " pri" : ""}" data-a11y="classico">☰ Clássico</button></div>
      <h3>Tema</h3>
      <select id="a11yTema" style="width:100%"><option value="">Automático (do aparelho)</option><option value="light">Claro</option><option value="dark">Escuro</option><option value="mes">📅 Tema do mês (muda sozinho)</option>
      ${Object.entries(grupos).map(([g, o]) => `<optgroup label="${g}">${o.join("")}</optgroup>`).join("")}</select>
      <p class="ref" style="margin:6px 0 0">Os temas valem só para este aparelho.</p>
      <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn pri" data-a11y="fechar">Fechar</button></div>`
      : `<h2 style="margin-top:0">♿ Acessibilidade</h2>
      <h3>Tamanho da tela: ${z}%</h3>
      <div class="row"><button class="btn" data-a11y="menos" aria-label="Reduzir">A−</button><button class="btn" data-a11y="mais" aria-label="Ampliar">A+</button><button class="btn" data-a11y="restaurar">↺ Restaurar</button></div>
      <h3>Leitura</h3>
      <div class="row"><button class="btn${P.hc ? " pri" : ""}" data-a11y="hc">◐ Alto contraste: ${P.hc ? "ligado" : "desligado"}</button>
      <button class="btn${P.tts ? " pri" : ""}" data-a11y="tts">🔊 Ler botões ao tocar: ${P.tts ? "ligado" : "desligado"}</button></div>
      <p class="ref" style="margin:6px 0 0">Vale só para este aparelho.</p>
      <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn pri" data-a11y="fechar">Fechar</button></div>`;
    if (MODO === "temas") { d.querySelector("#a11yTema").value = tema(); d.querySelector("#a11yTema").onchange = ev => escolher(ev.target.value); }
    if (!d.open) d.showModal();
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-a11y]"); if (!b) return;
    e.preventDefault();
    const a = b.dataset.a11y, i = ZOOM.indexOf(P.zoom || 1);
    if (a === "fechar") { document.getElementById("a11yDlg").close(); return; }
    if (a === "mais") P.zoom = ZOOM[Math.min(ZOOM.length - 1, (i < 0 ? 2 : i) + 1)];
    if (a === "menos") P.zoom = ZOOM[Math.max(0, (i < 0 ? 2 : i) - 1)];
    if (a === "restaurar") P.zoom = 1;
    if (a === "hc") P.hc = !P.hc;
    if (a === "cards") P.estilo = "cards";
    if (a === "classico") P.estilo = "classico";
    if (a === "bi") P.estilo = "bi";
    if (a === "tts") { P.tts = !P.tts; if (P.tts) falar("Leitura de botões ligada"); }
    if (a !== "open" && a !== "temas") { salvaP(); aplicar(); }
    if (["cards", "bi", "classico"].includes(a) && typeof DB !== "undefined" && DB) { V._keepScroll = true; render(); }
    janela(a === "temas" ? "temas" : a === "open" ? "a11y" : undefined);
  });
  document.addEventListener("change", e => { if (e.target.id === "cfgTema") escolher(e.target.value); });
  /* textos de introdução ficam em 2 linhas; toque para ler tudo */
  document.addEventListener("click", e => { const t = e.target.closest(".ui-cards main>p.muted"); if (t && !e.target.closest("a,button")) t.classList.toggle("aberto"); });

  /* ---------- ＋ / − nos quadrados de texto: fechado mostra 2 linhas; ＋ abre tudo ---------- */
  const ABERTOS = new Set(), chave = ta => (ta.dataset.o || "") + "|" + (ta.dataset.f || ta.id || "");
  const cresce = ta => { ta.style.height = "auto"; ta.style.height = (ta.scrollHeight + 4) + "px"; };
  const stx = document.createElement("style");
  stx.textContent = `.exp-w{position:relative;display:block}textarea.enc{height:3.5em!important;min-height:0!important;overflow:hidden;resize:none}
.exp{position:absolute;right:6px;top:6px;width:30px;height:30px;border-radius:8px;border:1px solid var(--line);background:var(--panel);color:var(--accent);font-weight:700;font-size:17px;line-height:1;cursor:pointer;z-index:2}
.exp-w textarea{padding-right:80px!important}.exp-w .dit{top:6px;bottom:auto;right:42px;width:30px;height:30px;font-size:14px}`;
  document.head.appendChild(stx);
  function prepara() {
    document.querySelectorAll("textarea:not([data-exp]):not(#iaIn)").forEach(ta => {
      ta.dataset.exp = "1";
      const w = document.createElement("span"); w.className = "exp-w"; ta.parentNode.insertBefore(w, ta); w.appendChild(ta);
      const b = document.createElement("button"); b.type = "button"; b.className = "exp"; w.appendChild(b);
      const k = chave(ta);
      if (ABERTOS.has(k)) { b.textContent = "−"; b.title = "Encolher"; requestAnimationFrame(() => cresce(ta)); }
      else { ta.classList.add("enc"); b.textContent = "+"; b.title = "Mostrar todo o texto"; }
      b.setAttribute("aria-label", b.title);
    });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest(".exp"); if (!b) return; e.preventDefault(); e.stopPropagation();
    const ta = b.parentNode.querySelector("textarea"), k = chave(ta);
    if (ta.classList.contains("enc")) { ta.classList.remove("enc"); ABERTOS.add(k); cresce(ta); b.textContent = "−"; b.title = "Encolher"; }
    else { ta.classList.add("enc"); ta.style.height = ""; ABERTOS.delete(k); b.textContent = "+"; b.title = "Mostrar todo o texto"; }
    b.setAttribute("aria-label", b.title);
  }, true);
  document.addEventListener("input", e => { const ta = e.target; if (ta.tagName === "TEXTAREA" && ta.dataset.exp && !ta.classList.contains("enc")) cresce(ta); });
  let tp; new MutationObserver(() => { clearTimeout(tp); tp = setTimeout(prepara, 50); }).observe(document.documentElement, { childList: true, subtree: true });

  aplicar();
  document.addEventListener("DOMContentLoaded", () => aplicar());
  return { aplicar, opcoes };
})();
