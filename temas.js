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
.flag{flex-shrink:1;min-width:0}#a11yDlg .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}#a11yDlg .btn{min-height:44px}#a11yDlg h3{margin:14px 0 6px}`;
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
  function janela() {
    let d = document.getElementById("a11yDlg");
    if (!d) { d = document.createElement("dialog"); d.id = "a11yDlg"; document.body.appendChild(d); d.addEventListener("click", ev => { if (ev.target === d) d.close(); }); }
    const z = Math.round((P.zoom || 1) * 100), grupos = {};
    L.forEach(([id, n, g]) => (grupos[g] = grupos[g] || []).push(`<option value="${id}">${n}</option>`));
    d.innerHTML = `<h2 style="margin-top:0">Aa Acessibilidade e temas</h2>
      <h3>Tamanho da tela: ${z}%</h3>
      <div class="row"><button class="btn" data-a11y="menos" aria-label="Reduzir">A−</button><button class="btn" data-a11y="mais" aria-label="Ampliar">A+</button><button class="btn" data-a11y="restaurar">↺ Restaurar</button></div>
      <h3>Leitura</h3>
      <div class="row"><button class="btn${P.hc ? " pri" : ""}" data-a11y="hc">◐ Alto contraste: ${P.hc ? "ligado" : "desligado"}</button>
      <button class="btn${P.tts ? " pri" : ""}" data-a11y="tts">🔊 Ler botões ao tocar: ${P.tts ? "ligado" : "desligado"}</button></div>
      <h3>Tema</h3>
      <select id="a11yTema" style="width:100%"><option value="">Automático (do aparelho)</option><option value="light">Claro</option><option value="dark">Escuro</option><option value="mes">📅 Tema do mês (muda sozinho)</option>
      ${Object.entries(grupos).map(([g, o]) => `<optgroup label="${g}">${o.join("")}</optgroup>`).join("")}</select>
      <p class="ref" style="margin:6px 0 0">Os temas e a acessibilidade valem só para este aparelho.</p>
      <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn pri" data-a11y="fechar">Fechar</button></div>`;
    d.querySelector("#a11yTema").value = tema();
    d.querySelector("#a11yTema").onchange = ev => escolher(ev.target.value);
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
    if (a === "tts") { P.tts = !P.tts; if (P.tts) falar("Leitura de botões ligada"); }
    if (a !== "open") { salvaP(); aplicar(); }
    janela();
  });
  document.addEventListener("change", e => { if (e.target.id === "cfgTema") escolher(e.target.value); });

  aplicar();
  document.addEventListener("DOMContentLoaded", () => aplicar());
  return { aplicar, opcoes };
})();
