/* =====================================================================
   Kit Clínico TCC — APLICATIVO (v2)
   ===================================================================== */
"use strict";
const APP_VER = "2.0";
/* ============================== utilidades ============================== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nl = s => esc(s).replace(/\n/g, "<br>");
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const fmt = d => d ? String(d).slice(0, 10).split("-").reverse().join("/") : "—";
const fmtDT = iso => iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";
const hhmm = t => t ? new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";
const nowISO = () => new Date().toISOString();
const fmtSize = n => n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
const norm = x => String(x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const TEC = Object.fromEntries(TECNICAS.map(t => [t.id, t]));
const PRO = Object.fromEntries(PROTOCOLOS.map(p => [p.id, p]));
const allTec = () => [...TECNICAS, ...((DB && DB.tecCustom) || [])];
const tecById = id => TEC[id] || ((DB && DB.tecCustom) || []).find(t => t.id === id) || { id, nome: id, ab: "?", custom: true, descricao: "", passos: "" };
const tecNome = id => tecById(id).nome;
function download(name, data, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: type || "application/json" })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
const isMobile = () => matchMedia("(max-width: 760px)").matches;

/* ============================== estado ============================== */
let DB = null, LAST_BLOB = null, VAULT_BLOB = null, LOCK_MSG = "";
let V = { page: "pacientes", pid: null, tab: "direcao" };
const R = {}; let rc = 0;
const reg = o => { const k = "o" + (rc++); R[k] = o; return k; };
const SYNC = { local: { st: "ok", t: 0 }, drive: { st: "off", t: 0 }, pasta: { st: "off", t: 0 } };
let DEFER_INSTALL = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); DEFER_INSTALL = e; });

/* ============================== modelo de dados ============================== */
const sit = () => ({ situacao: "", pa: "", significado: "", emocao: "", comportamento: "" });
function novoPaciente() {
  return { id: uid(), codigo: "", idade: "", genero: "", inicio: today(), contexto: "Clínica-escola", supervisor: "", queixa: "", historia: "", medicacao: "", metas: "", obs: "", demandas: [],
    conc: { infancia: "", crencaCentral: "", categoria: "", regras: "", estrategias: "", eu: "", mundo: "", futuro: "", situacoes: [sit(), sit(), sit()] },
    sessoes: [], rpd: [], setas: [], aware: [], pend: {}, abordar: [], log: [], lixeira: [], docs: [],
    risco: { avaliacoes: [], plano: { sinais: "", internas: "", social: "", ajuda: "", profissionais: "CVV — 188 (24 h, gratuito)\nSAMU — 192\nCAPS / UPA mais próximo: \nClínica-escola / terapeuta: ", ambiente: "", razoes: "" } } };
}
function fill(t, d) { for (const k in d) { if (t[k] === undefined) t[k] = d[k]; else if (d[k] && typeof d[k] === "object" && !Array.isArray(d[k]) && typeof t[k] === "object") fill(t[k], d[k]); } return t; }
function normDB() {
  DB.app = "kit-tcc"; DB.lixeira = DB.lixeira || []; DB.pacientes = DB.pacientes || []; DB.config = DB.config || {}; DB.tecCustom = DB.tecCustom || []; DB.chats = DB.chats || []; DB.literatura = DB.literatura || []; DB.agenda = DB.agenda || [];
  DB.pacientes.forEach(p => { fill(p, novoPaciente()); p.sessoes.forEach(s => { if (s.transcricao === undefined) s.transcricao = ""; }); });
}
const P = () => DB.pacientes.find(p => p.id === V.pid);
function logP(p, txt) { p.log.push({ quando: nowISO(), txt }); }
const LIX_T = { sessoes: "Sessão", rpd: "RPD", setas: "Seta descendente", aware: "Registro AWARE", "risco.avaliacoes": "Avaliação de risco", abordar: "Item para abordar", docs: "Documento" };
function allDocs() {
  const out = [];
  DB.pacientes.forEach(p => { p.docs.forEach(d => out.push(d)); p.lixeira.forEach(L => { if (L.from === "docs") out.push(L.item); }); });
  DB.lixeira.forEach(L => (L.item.docs || []).forEach(d => out.push(d)));
  DB.lixeira.forEach(L => (L.item.lixeira || []).forEach(X => { if (X.from === "docs") out.push(X.item); }));
  return out;
}

/* ============================== salvar + sincronizar ============================== */
let saveT = null, saving = false, saveAgain = false;
function touch() { SYNC.local.st = "pend"; if (DB && DB.config.driveOn && SYNC.drive.st !== "disc") SYNC.drive.st = "pend"; renderFlag(); clearTimeout(saveT); saveT = setTimeout(save, 600); }
async function save() {
  clearTimeout(saveT); saveT = null; if (!DB) return;
  if (saving) { saveAgain = true; return; } saving = true;
  try {
    DB.updated = nowISO();
    const blob = await Vault.encrypt(DB); LAST_BLOB = blob;
    await Store.saveVault(blob);
    SYNC.local = { st: "ok", t: Date.now() };
    if (DB.config.driveOn) { try { await IDB.put("kv", "drivePend", true); } catch (e) {} }
    scheduleSync();
  } catch (e) { SYNC.local = { st: "err", t: SYNC.local.t, msg: e.message }; }
  finally { saving = false; renderFlag(); if (saveAgain) { saveAgain = false; save(); } }
}
let syncT = null, syncing = false, syncAgain = false, FLAGS_DIRTY = false;
function scheduleSync(ms) { clearTimeout(syncT); syncT = setTimeout(syncExternal, ms == null ? 2500 : ms); }
const docsPendDrive = () => DB ? allDocs().filter(d => !d.gravando && !(d.sync || {}).drive).length : 0;
async function syncExternal() {
  if (!DB) return; if (syncing) { syncAgain = true; return; } syncing = true;
  try {
    const blob = LAST_BLOB || await Vault.encrypt(DB);
    if (Folder.dir) {
      try {
        if (await Folder.ok(false)) {
          await Folder.write("kit-tcc.tcc", blob); await Folder.write(`kit-tcc-${today()}.tcc`, blob, "historico");
          for (const d of allDocs()) if (!d.gravando && (d.sync || {}).pasta !== Folder.dir.name) { const r = await Store.getFileEnc(d.id); if (r) { await Folder.write(d.id + ".bin", packEnc(r), "anexos"); (d.sync = d.sync || {}).pasta = Folder.dir.name; FLAGS_DIRTY = true; } }
          SYNC.pasta = { st: "ok", t: Date.now() };
        } else SYNC.pasta = { st: "disc", t: SYNC.pasta.t, msg: "toque para renovar a permissão da pasta" };
      } catch (e) { SYNC.pasta = { st: "err", t: SYNC.pasta.t, msg: e.message }; }
    } else SYNC.pasta = { st: "off", t: 0 };
    if (DB.config.driveOn) {
      if (!GDrive.live() && !(await GDrive.renew())) SYNC.drive = { st: "disc", t: SYNC.drive.t, msg: "toque para reconectar ao Google" };
      else {
        try {
          SYNC.drive.st = "pend"; renderFlag();
          await GDrive.pushVault(blob, DB.updated);
          for (const d of allDocs()) if (!d.gravando && !(d.sync || {}).drive) { const r = await Store.getFileEnc(d.id); if (r) { await GDrive.pushFile(d.id, packEnc(r)); (d.sync = d.sync || {}).drive = true; FLAGS_DIRTY = true; renderFlag(); } }
          SYNC.drive = { st: "ok", t: Date.now() }; DB.config.driveUltimo = nowISO();
          if (!FLAGS_DIRTY) await IDB.put("kv", "drivePend", false);
        } catch (e) { SYNC.drive = { st: GDrive.live() ? "err" : "disc", t: SYNC.drive.t, msg: e.message }; }
      }
    }
  } finally {
    syncing = false; renderFlag();
    if (FLAGS_DIRTY) { FLAGS_DIRTY = false; save(); } else if (syncAgain) { syncAgain = false; scheduleSync(300); }
  }
}
/* [classe, ícone, texto] — ✓ verde = tudo salvo · ✗ vermelho = problema · ⟳ âmbar = em andamento */
function flagState() {
  if (!DB) return null;
  if (SYNC.local.st === "err") return ["bad", "✗", "Erro ao salvar"];
  if (SYNC.local.st === "pend") return ["saving", "⟳", "Salvando…"];
  if (DB.config.driveOn) {
    const n = docsPendDrive();
    if (SYNC.drive.st === "ok" && !n) return ["ok", "✓", "Salvo no Drive " + hhmm(SYNC.drive.t)];
    if (SYNC.drive.st === "disc") return ["bad", "✗", "Salvo só no aparelho · Drive desconectado"];
    if (SYNC.drive.st === "err") return ["bad", "✗", "Salvo só no aparelho · falha no Drive"];
    return ["saving", "⟳", "Salvo no aparelho · enviando ao Drive" + (n ? ` (${n})` : "")];
  }
  if (SYNC.pasta.st === "ok") return ["ok", "✓", "Salvo na pasta " + hhmm(SYNC.pasta.t)];
  return ["warn", "✓", "Salvo só neste aparelho"];
}
function renderFlag() { const el = $("#flag"); if (!el) return; const f = flagState(); if (!f) return; el.className = "flag " + f[0]; el.innerHTML = `<span class="fi">${f[1]}</span><span class="ft">${esc(f[2])}</span>`; const b = $("#gBanner"); if (b) b.hidden = !(DB.config.driveOn && SYNC.drive.st === "disc"); }

/* confirmação dupla para excluir: duas janelas em posições diferentes, com o botão de excluir trocando de lado */
function ask(msg, okLabel, pos, okLeft) {
  return new Promise(res => {
    const d = $("#cdlg"); let done = false; const fin = v => { if (done) return; done = true; if (d.open) d.close(); res(v); };
    d.className = "cdlg " + pos;
    const ok = `<button class="btn del" data-c="1">${okLabel}</button>`, no = `<button class="btn" data-c="0">Cancelar</button>`;
    d.innerHTML = `<p style="margin-top:0">${msg}</p><div class="row" style="justify-content:space-between">${okLeft ? ok + no : no + ok}</div>`;
    d.onclick = e => { const b = e.target.closest("[data-c]"); if (b) fin(b.dataset.c === "1"); };
    d.oncancel = () => fin(false); d.onclose = () => fin(false);
    d.showModal();
  });
}
async function confirmDel(what) {
  if (!(await ask(`Excluir ${what}?`, "Excluir", "pos-top", true))) return false;
  await new Promise(r => setTimeout(r, 250));
  return ask(`<b>Confirme de novo:</b> excluir ${what}?<br><span class="ref">O item vai para a lixeira e pode ser restaurado.</span>`, "Sim, excluir", "pos-bottom", false);
}

/* ============================== campos ligados (autosave) ============================== */
function fld(o, f, label, type = "text", x = {}) {
  const k = reg(o), v = o[f] ?? "", hint = x.hint ? `<small>${x.hint}</small>` : "", id = x.id ? `id="${x.id}"` : "";
  if (type === "area") return `<label class="f ${x.cls || ""}"><span>${label}</span><textarea ${id} data-o="${k}" data-f="${f}" rows="${x.rows || 3}" placeholder="${esc(x.ph || "")}">${esc(v)}</textarea>${hint}</label>`;
  if (type === "select") return `<label class="f"><span>${label}</span><select ${id} data-o="${k}" data-f="${f}">${x.options.map(op => { const [val, t] = Array.isArray(op) ? op : [op, op]; return `<option value="${esc(val)}" ${String(v) === String(val) ? "selected" : ""}>${esc(t)}</option>`; }).join("")}</select>${hint}</label>`;
  if (type === "check") return `<label class="chk"><input type="checkbox" data-o="${k}" data-f="${f}" ${v ? "checked" : ""}> ${label}</label>`;
  return `<label class="f ${x.cls || ""}"><span>${label}</span><input ${id} type="${type}" data-o="${k}" data-f="${f}" value="${esc(v)}" ${x.min != null ? `min="${x.min}"` : ""} ${x.max != null ? `max="${x.max}"` : ""} ${type === "number" ? 'inputmode="decimal"' : ""} placeholder="${esc(x.ph || "")}">${hint}</label>`;
}
function onField(e) {
  const el = e.target; if (!el.dataset || !el.dataset.o) return;
  const o = R[el.dataset.o]; if (!o) return;
  let v = el.type === "checkbox" ? el.checked : el.value;
  if (el.type === "number") v = el.value === "" ? "" : Number(el.value);
  if (o[el.dataset.f] === v) return;
  o[el.dataset.f] = v; touch();
  if (el.dataset.sc) { const i = el.closest("label").querySelector(".interp"); if (i) i.textContent = v === "" ? "" : faixaEsc(el.dataset.sc, v); }
  if (el.dataset.f === "codigo" && $("#pTitle")) $("#pTitle").textContent = v || "(sem código)";
}
document.addEventListener("input", onField);
document.addEventListener("change", onField);
function chips(arr, items) { const k = reg(arr); return `<div>${items.map(([id, t]) => `<button type="button" class="chip ${arr.includes(id) ? "on" : ""}" data-act="toggle" data-o="${k}" data-v="${esc(id)}">${esc(t)}</button>`).join("")}</div>`; }
const refList = keys => `<ol class="refs">${keys.map(k => `<li>${esc(REF[k] || k)}</li>`).join("")}</ol>`;

/* ============================== render ============================== */
function render() {
  for (const k in R) delete R[k]; rc = 0;
  const app = $("#app");
  if (!DB) { document.body.classList.remove("ia-open"); app.innerHTML = lockScreen(); setTimeout(() => $("#pw") && !isMobile() && $("#pw").focus(), 30); return; }
  const y = window.scrollY, keep = V._keepScroll; V._keepScroll = false;
  const nav = [["pacientes", "👥 Pacientes"], ["agenda", "📅 Agenda"], ["protocolos", "🧭 Protocolos"], ["tecnicas", "🧰 Técnicas"], ["literatura", "📚 Literatura Científica"], ["etica", "⚖ Ética e CFP"], ["dados", "☁ Dados e backup"], ["config", "⚙ Configurações"]];
  const cur = V.page === "paciente" ? "pacientes" : V.page;
  applyPrefs();
  app.innerHTML = `<header><span class="brand">🧠<span class="bt"> Kit Clínico TCC</span></span><span class="sp"></span>
    <button id="flag" class="flag" data-act="flag" title="Situação do salvamento — toque para detalhes"></button><span class="sp"></span>
    <button class="btn sm" data-act="iaToggle" title="Assistente de IA">🤖<span class="bt"> IA</span></button>
    <button class="btn sm" data-act="nav" data-v="config" title="Configurações" aria-label="Configurações">⚙</button>
    <button class="btn sm" data-act="lock" title="Bloquear">🔒</button></header>
  <button id="gBanner" class="banner bad" data-act="gConnect" title="Tudo continua salvo neste aparelho" hidden>↻ Reconectar Google</button>
  <div class="wrap"><nav>${nav.map(([id, t]) => `<button class="${cur === id ? "on" : ""}" data-act="nav" data-v="${id}">${t}</button>`).join("")}</nav>
  <main>${page()}</main></div>
  <button class="fab" data-act="saveNow" title="Salvar agora (Ctrl+S) — o kit também salva sozinho">💾 Salvar</button>`;
  renderFlag(); renderRecBar();
  if (IA.open) iaRender();
  window.scrollTo(0, keep ? y : 0);
}
function page() {
  switch (V.page) {
    case "paciente": return pgPaciente();
    case "protocolos": return pgProtocolos();
    case "tecnicas": return pgTecnicas();
    case "etica": return pgEtica();
    case "dados": return pgDados();
    case "config": return pgConfig();
    case "agenda": return pgAgenda();
    case "literatura": return pgLiteratura();
    default: return pgPacientes();
  }
}

/* ---------- tela de bloqueio ---------- */
let LOCK_MODE = "senha"; // senha | criar | recuperar
function lockScreen() {
  const has = !!VAULT_BLOB, g = GDrive.clientId();
  if (!has && LOCK_MODE !== "recuperar") LOCK_MODE = "criar";
  if (has && LOCK_MODE === "criar") LOCK_MODE = "senha";
  let form = "";
  if (LOCK_MODE === "senha") form = `<label class="f"><span>Senha do cofre</span><input type="password" id="pw" autocomplete="current-password"></label>
    <button class="btn pri big" data-act="unlock">Desbloquear</button>
    <p style="margin:10px 0 0;text-align:center"><a href="#" data-act="lockMode" data-v="recuperar">Esqueci minha senha</a></p>`;
  else if (LOCK_MODE === "criar") form = `<p class="muted" style="margin-top:0">Primeiro acesso neste aparelho. Crie uma senha — ou, se já usa o kit em outro aparelho, entre com Google ou abra seu backup abaixo.</p>
    <label class="f"><span>Crie uma senha (mínimo 8 caracteres)</span><input type="password" id="pw" autocomplete="new-password"></label>
    <label class="f"><span>Repita a senha</span><input type="password" id="pw2" autocomplete="new-password"></label>
    <button class="btn pri big" data-act="create">Criar cofre</button>`;
  else form = `<p class="muted" style="margin-top:0">Digite o <b>código de recuperação</b> (24 caracteres, recebido ao criar o cofre) e escolha uma nova senha.</p>
    <label class="f"><span>Código de recuperação</span><input id="rc" autocomplete="off" autocapitalize="characters" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"></label>
    <label class="f"><span>Nova senha</span><input type="password" id="pw" autocomplete="new-password"></label>
    <label class="f"><span>Repita a nova senha</span><input type="password" id="pw2" autocomplete="new-password"></label>
    <button class="btn pri big" data-act="recover">Redefinir senha</button>
    <p style="margin:10px 0 0;text-align:center"><a href="#" data-act="lockMode" data-v="senha">Voltar</a></p>`;
  return `<div class="lock"><div class="lockbox">
  <h1>🧠 Kit Clínico TCC</h1>
  <p class="muted">Prontuário de apoio com direcionamento clínico. Tudo fica <b>criptografado</b> com a sua senha.</p>
  ${LOCK_MSG ? `<div class="alert info">${LOCK_MSG}</div>` : ""}
  ${form}<p class="err" id="err"></p>
  <hr>
  ${GDrive.live() ? `<p class="ref" style="text-align:center">☁ Google conectado</p>` : `<button class="btn big" data-act="gLoginLock" ${g ? "" : "disabled"}>☁ Entrar com Google</button>`}
  ${g ? "" : `<p class="ref" style="margin:4px 0 0">O login com Google precisa ser configurado uma vez (⚙ Configurações). <a href="#" data-act="gCfgLock">Configurar agora</a></p>`}
  <button class="btn big" data-act="openFile" style="margin-top:8px">📂 Abrir arquivo / backup (.tcc)</button>
  <p class="ref" style="margin-top:14px">Esqueceu a senha? Use o código de recuperação. Sem senha <i>e</i> sem código, ninguém consegue ler os dados — nem você.</p>
  <p class="ref">v${APP_VER}</p></div></div>`;
}
const err = m => { const e = $("#err"); if (e) e.textContent = m; };
async function afterUnlock(db, legacyPw) {
  DB = db; normDB();
  let code = null; if (legacyPw) code = await Vault.create(legacyPw);
  LOCK_MSG = ""; LOCK_MODE = "senha";
  try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
  await Folder.restore();
  try { if (await IDB.get("kv", "drivePend") && DB.config.driveOn) SYNC.drive.st = "pend"; } catch (e) {}
  if (DB.config.driveOn) SYNC.drive.st = "disc";
  await save(); render(); resetIdle(); agTick();
  if (code) showRecovery(code, true);
  if (DB.config.driveOn && GDrive.clientId() && GDrive.originOk()) { try { await GDrive.login(); await driveReconcile(); scheduleSync(0); } catch (e) { SYNC.drive = { st: "disc", t: 0, msg: e.message }; render(); } }
}
async function doUnlock() {
  const pw = $("#pw").value; if (!pw) return err("Digite a senha.");
  err("Abrindo…");
  try { const r = await Vault.open(VAULT_BLOB, pw, "pw"); await afterUnlock(r.db, r.legacy ? pw : null); }
  catch (e) { err(e.message && e.message.includes("versão 1") ? e.message : "Senha incorreta."); }
}
async function doCreate() {
  const a = $("#pw").value, b = $("#pw2").value;
  if (a.length < 8) return err("A senha precisa ter pelo menos 8 caracteres.");
  if (a !== b) return err("As senhas não conferem.");
  err("Criando…");
  const code = await Vault.create(a);
  DB = { app: "kit-tcc", v: 2, created: nowISO(), pacientes: [] }; normDB();
  if (GDrive.live()) { DB.config.driveOn = true; SYNC.drive.st = "pend"; } // entrou com Google antes de criar a senha
  await save(); render(); resetIdle(); showRecovery(code, true);
}
async function doRecover() {
  const c = $("#rc").value, a = $("#pw").value, b = $("#pw2").value;
  if (normCode(c).length !== 24) return err("O código tem 24 letras/números.");
  if (a.length < 8) return err("A nova senha precisa ter pelo menos 8 caracteres.");
  if (a !== b) return err("As senhas não conferem.");
  err("Verificando…");
  try { const r = await Vault.open(VAULT_BLOB, c, "rec"); await Vault.setPassword(a); await afterUnlock(r.db); alert("Senha redefinida. Use a nova senha a partir de agora."); }
  catch (e) { err(e.message && e.message.includes("versão 1") ? e.message : "Código de recuperação incorreto."); }
}
function showRecovery(code, first) {
  const d = $("#dlg");
  d.innerHTML = `<h2 style="margin-top:0">🔑 Seu código de recuperação</h2>
  <p>Se você esquecer a senha, este código é a <b>única forma</b> de abrir o cofre. Guarde em lugar seguro: imprima, anote num caderno ou salve num gerenciador de senhas. Não guarde junto com o celular desbloqueado.</p>
  <div class="reccode">${esc(code)}</div>
  <div class="row"><button class="btn" data-act="recCopy" data-v="${esc(code)}">Copiar</button><button class="btn" data-act="recTxt" data-v="${esc(code)}">Baixar .txt</button><button class="btn" data-act="recPrint" data-v="${esc(code)}">Imprimir</button></div>
  <label class="chk" style="margin-top:14px"><input type="checkbox" id="recOk"> Guardei o código em local seguro</label>
  <div class="row" style="justify-content:flex-end"><button class="btn pri" id="recClose" disabled data-act="recClose">Continuar</button></div>`;
  d.dataset.locked = "1"; d.showModal();
  $("#recOk").onchange = e => { $("#recClose").disabled = !e.target.checked; };
  DB.config.recConfirmado = false;
}
async function doOpenFile() {
  const inp = $("#fileIn");
  inp.onchange = async () => {
    const f = inp.files[0]; inp.value = ""; if (!f) return;
    try { await importBlobText(await f.text(), true); } catch (e) { alert("Arquivo inválido: " + e.message); }
  };
  inp.click();
}
/* aceita: cofre .tcc (v1/v2) ou backup completo (v2) */
async function importBlobText(text, fromLock) {
  const o = JSON.parse(text);
  let vault, files = null;
  if (o.app === "kit-tcc-backup") { vault = o.vault; files = o.files || {}; }
  else if (o.app === "kit-tcc") vault = text;
  else throw new Error("não é um arquivo do Kit TCC");
  const cur = await Store.loadVault();
  if (!fromLock && !confirm("Substituir os dados deste aparelho pelos do arquivo? Os atuais ficam guardados em “Versões”. Depois será pedida a senha do arquivo.")) return;
  if (cur) await Store.snap(cur, true, "antes de importar arquivo");
  if (files) for (const [id, r] of Object.entries(files)) await Store.putFileEnc(id, { iv: ub64(r.iv), data: ub64(r.data).buffer });
  await IDB.put("kv", "vault", vault); lsSet(LS2, vault.length < 4.5e6 ? vault : "");
  VAULT_BLOB = vault; DB = null; Vault.lock(); LOCK_MODE = "senha";
  LOCK_MSG = `Arquivo carregado${files ? ` com ${Object.keys(files).length} anexo(s)` : ""}. Digite a senha <b>desse arquivo</b>.`; render();
}
async function lock() {
  if (REC.on && !confirm("Há uma gravação em andamento. Parar a gravação e bloquear?")) return;
  if (REC.on) await recStop();
  if (saveT || saving) await save();
  DB = null; LAST_BLOB = null; Vault.lock(); IA.open = false; LOCK_MSG = ""; LOCK_MODE = "senha";
  VAULT_BLOB = await Store.loadVault(); render(); agTick();
}
let idle;
function resetIdle() { const min = Number((DB && DB.config.bloqueioMin) || 20); clearTimeout(idle); idle = setTimeout(() => { if (DB && !REC.on) lock(); else resetIdle(); }, min * 60000); }
["pointerdown", "keydown", "touchstart"].forEach(ev => document.addEventListener(ev, () => { if (DB) resetIdle(); }, { passive: true }));
window.addEventListener("beforeunload", e => { if (REC.on || saveT || saving || syncing) { if (saveT) save(); e.preventDefault(); e.returnValue = ""; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && DB && saveT) save(); });

/* ---------- Google Drive ---------- */
async function driveReconcile() {
  const rem = await GDrive.remoteVault(); if (!rem) return;
  const rs = (rem.appProperties || {}).savedAt || rem.modifiedTime;
  if (!(rs > (DB.updated || ""))) return;
  const blob = await GDrive.download(rem.id, true);
  let db = null; try { db = await Vault.decryptWithDEK(blob); } catch (e) {}
  if (db) {
    if (confirm(`O Google Drive tem uma versão mais recente (${fmtDT(rs)}) do que a deste aparelho (${fmtDT(DB.updated)}).\n\nUsar a versão do Drive? A deste aparelho fica guardada em “Versões”.`)) {
      await Store.snap(LAST_BLOB || await Vault.encrypt(DB), true, "antes de usar a versão do Drive");
      DB = db; normDB(); LAST_BLOB = blob; await Store.saveVault(blob); render();
    }
  } else {
    alert("O Drive tem um cofre criado em OUTRO aparelho (com outra chave). Para não misturar dados:\n\n• Para usar o do Drive: faça um Backup completo deste aparelho, bloqueie e use “Entrar com Google”.\n• Para manter o deste aparelho: confirme a seguir — ele será enviado ao Drive e o anterior continua no histórico do Drive.");
    if (!confirm("Enviar o cofre DESTE aparelho para o Drive?")) { DB.config.driveOn = false; throw new Error("sincronização com o Drive desligada"); }
  }
}
async function gConnect() {
  try { await GDrive.login(); await driveReconcile(); DB.config.driveOn = true; SYNC.drive.st = "pend"; await save(); scheduleSync(0); V._keepScroll = true; render(); }
  catch (e) { alert("Não foi possível conectar ao Google: " + e.message); }
}
async function gLoginLock() {
  try {
    err("Conectando ao Google…"); await GDrive.login();
    const rem = await GDrive.remoteVault();
    if (!rem) { LOCK_MODE = VAULT_BLOB ? "senha" : "criar"; LOCK_MSG = VAULT_BLOB ? "✓ Conectado ao Google. Digite sua senha — o backup no Drive fica automático." : "✓ Conectado ao Google. Agora crie sua senha — o backup no Drive (pasta “Kit TCC - Backups”) fica automático."; return render(); }
    const blob = await GDrive.download(rem.id, true), cur = await Store.loadVault();
    if (cur && cur !== blob) await Store.snap(cur, true, "antes de baixar do Drive");
    await IDB.put("kv", "vault", blob); VAULT_BLOB = blob; LOCK_MODE = "senha";
    LOCK_MSG = `Cofre baixado do Google Drive${GDrive.email ? " (" + esc(GDrive.email) + ")" : ""}, salvo em ${fmtDT((rem.appProperties || {}).savedAt || rem.modifiedTime)}. Digite sua senha.`;
    render();
  } catch (e) { err("Google: " + e.message); }
}
async function getDocBytes(d) {
  let buf = await Store.getFile(d.id);
  if (!buf && GDrive.live()) { const raw = await GDrive.pullFile(d.id); if (raw) { await Store.putFileEnc(d.id, unpackEnc(raw)); buf = await Store.getFile(d.id); } }
  if (!buf && Folder.dir && await Folder.ok(true)) { const raw = await Folder.read(d.id + ".bin", "anexos"); if (raw) { await Store.putFileEnc(d.id, unpackEnc(raw)); buf = await Store.getFile(d.id); } }
  return buf;
}

/* ---------- lista de pacientes ---------- */
function pgPacientes() {
  const ps = DB.pacientes;
  const recWarn = !DB.config.driveOn && !Folder.dir ? `<div class="alert warn">💾 Seus dados estão <b>só neste aparelho</b>. Para não perder nada, conecte o Google Drive em <a href="#" data-act="nav" data-v="config">⚙ Configurações</a>.</div>` : "";
  return `${recWarn}${agProximos()}<div class="ph"><h1>Pacientes</h1><span class="sp"></span><button class="btn pri" data-act="newP">+ Novo paciente</button></div>
  <p class="muted">Identifique por <b>código ou iniciais</b> (ex.: “P07 – M.S.”). Evite nome completo, CPF, endereço e telefone.</p>
  ${ps.length ? `<div class="grid">${ps.map(p => {
    const al = openRisk(p), last = p.sessoes.at(-1), ab = p.abordar.filter(a => a.status !== "abordado").length;
    return `<div class="card pcard" data-act="openP" data-v="${p.id}">
      <div class="row" style="justify-content:space-between"><b>${esc(p.codigo || "(sem código)")}</b>${al.length ? `<span class="badge danger">⚠ risco</span>` : ""}</div>
      <div class="muted" style="font-size:13px;margin:2px 0 8px">${p.idade ? esc(p.idade) + " anos · " : ""}${p.sessoes.length} sessão(ões) · última: ${fmt(last && last.data)}${ab ? ` · 💬 ${ab} p/ abordar` : ""}${p.docs.length ? ` · 📎 ${p.docs.length}` : ""}</div>
      <div>${p.demandas.map(d => PRO[d] ? `<span class="badge ${PRO[d].cor}">${esc(PRO[d].nome)}</span>` : "").join("") || `<span class="badge">sem demanda marcada</span>`}</div></div>`;
  }).join("")}</div>` : `<div class="card"><p>Nenhum paciente ainda. Toque em <b>+ Novo paciente</b> para começar.</p></div>`}`;
}

/* ---------- paciente ---------- */
function pgPaciente() {
  const p = P(); if (!p) { V.page = "pacientes"; return pgPacientes(); }
  const tabs = [["direcao", "🧭 Direcionamento"], ["sessoes", `Sessões (${p.sessoes.length})`], ["conc", "Conceituação"], ["registros", "RPD · Seta · AWARE"], ["risco", "Risco"], ["docs", `📎 Documentos (${p.docs.length})`], ["evol", "Evolução"], ["dados", "Cadastro"]];
  const body = { direcao: tabDirecao, sessoes: tabSessoes, conc: tabConc, registros: tabRegistros, risco: tabRisco, docs: tabDocs, evol: tabEvol, dados: tabCadastro }[V.tab] || tabDirecao;
  return `<div class="ph"><button class="btn sm" data-act="nav" data-v="pacientes">← Pacientes</button><h1 id="pTitle">${esc(p.codigo || "(sem código)")}</h1>
  ${p.demandas.map(d => PRO[d] ? `<span class="badge ${PRO[d].cor}">${esc(PRO[d].nome)}</span>` : "").join("")}<span class="sp"></span><button class="btn sm" data-act="agNovo" data-v="${today()}" data-pid="${p.id}">📅 Agendar</button></div>
  ${(() => { const now = new Date(), o = agOcc(now, new Date(now.getTime() + 60 * 86400000)).find(x => x.ev.pid === p.id); return o ? `<p class="ref" style="margin:-4px 0 6px">Próximo atendimento: <b>${DSEM[o.start.getDay()]} ${fmt(o.date)} às ${esc(o.ev.hora)}</b></p>` : ""; })()}
  <div class="tabs">${tabs.map(([id, t]) => `<button class="${V.tab === id ? "on" : ""}" data-act="tab" data-v="${id}">${t}</button>`).join("")}</div>
  ${body(p)}`;
}
function sessText(s) { return [s.ponte, s.agenda, s.conteudo, s.obs, s.resumo, s.tarefaRev, s.supervisao, s.transcricao].join(" "); }
function riskAlerts(p) {
  const a = [];
  if (p.demandas.includes("suicidio")) a.push({ key: "risk:demanda", txt: "Demanda “Risco de suicídio / autolesão” marcada no cadastro." });
  p.sessoes.slice(-3).forEach(s => {
    if (RISCO_RE.test(sessText(s))) a.push({ key: "risk:txt:" + s.id, txt: `Sessão ${s.num} (${fmt(s.data)}): as anotações contêm termos relacionados a risco.` });
    if (Number(s.phq9i9) > 0) a.push({ key: "risk:i9:" + s.id, txt: `Sessão ${s.num}: PHQ-9 item 9 = ${s.phq9i9} (pensamentos de morte ou de se ferir).` });
  });
  const ra = p.risco.avaliacoes.at(-1);
  if (ra && (ra.nivel === "alto" || ra.nivel === "moderado")) a.push({ key: "risk:aval:" + ra.id, txt: `Última avaliação de risco (${fmt(ra.data)}): nível ${ra.nivel}.` });
  return a;
}
const CLOSED = ["resolvido", "naoproblema", "arquivado"];
const isClosed = (p, k) => !!(p.pend[k] && CLOSED.includes(p.pend[k].status));
const openRisk = p => riskAlerts(p).filter(a => !isClosed(p, a.key));

/* ---------- pendências respondíveis ---------- */
let PT = {};
const PEND_ST = [["atencao", "⚠ Atenção"], ["verificar", "🔍 Verificar"], ["resolvido", "✓ Resolvido"], ["naoproblema", "Não é problema"], ["sessao", "💬 Levar para a sessão"], ["outros", "✎ Outros (escrever)"], ["arquivado", "📁 Arquivar (tirar da lista)"]];
const pendLbl = s => (PEND_ST.find(x => x[0] === s) || [, "sem resposta"])[1];
/* lembrete numa linha: texto à esquerda, caixinha de opções à direita; campo de texto só em “Outros” */
function pendRow(p, it) {
  const r = p.pend[it.key] || (p.pend[it.key] = { status: "", nota: "", hist: [] });
  const cls = r.status === "atencao" ? "danger" : r.status === "verificar" ? "warn" : CLOSED.includes(r.status) ? "ok" : r.status ? "accent" : "";
  return `<li><div class="prow"><div class="ptxt">${it.html}</div>
    <select class="psel ${cls}" data-k="${esc(it.key)}" aria-label="Resposta ao lembrete"><option value="">Responder…</option>${PEND_ST.map(([id, t]) => `<option value="${id}" ${r.status === id ? "selected" : ""}>${t}</option>`).join("")}</select></div>
  ${r.status === "outros" ? `<div class="row" style="flex-wrap:nowrap;margin-top:6px"><input class="pnota" style="margin:0;flex:1" data-o="${reg(r)}" data-f="nota" value="${esc(r.nota)}" placeholder="Escreva sua resposta (ex.: a depressão é da sogra, não da paciente)"><button class="btn sm" data-act="pendArq" data-k="${esc(it.key)}" title="Tirar da lista e guardar nas Arquivadas">📁 Arquivar</button></div>` : r.nota ? `<div class="ref" style="margin-top:4px">📝 ${esc(r.nota)}</div>` : ""}
  ${r.hist.length ? `<details class="phist"><summary class="ref">histórico (${r.hist.length})</summary><ul class="ref">${r.hist.map(h => `<li>${fmtDT(h.quando)}: ${esc(pendLbl(h.para))}${h.nota ? " — " + esc(h.nota) : ""}</li>`).join("")}</ul></details>` : ""}</li>`;
}
document.addEventListener("change", e => {
  const sel = e.target; if (!sel.classList || !sel.classList.contains("psel") || !sel.dataset.k || !DB) return;
  const p = P(), k = sel.dataset.k, r = p.pend[k], para = sel.value;
  r.hist.push({ quando: nowISO(), de: r.status, para, nota: r.nota }); r.status = para;
  if (para === "sessao" && !p.abordar.some(a => a.origem === k && a.status !== "abordado")) p.abordar.push({ id: uid(), texto: PT[k] || "", status: "aberto", criado: nowISO(), nota: "", sessao: "", origem: k });
  logP(p, `Lembrete “${(PT[k] || k).slice(0, 90)}” → ${pendLbl(para)}`); touch(); V._keepScroll = true; render();
  if (para === "outros") setTimeout(() => { const i = document.querySelector(`.psel[data-k="${CSS.escape(k)}"]`); const n = i && i.closest("li").querySelector(".pnota"); if (n) n.focus(); }, 30);
});
/* ---------- para abordar ---------- */
const AB_ST = [["aberto", "Aberto"], ["abordado", "✓ Abordado"], ["adiado", "⏸ Adiar"]];
function abItem(p, a) {
  const cls = a.status === "abordado" ? "ok" : a.status === "adiado" ? "warn" : "";
  return `<li><div class="prow"><input class="ptxt" data-o="${reg(a)}" data-f="texto" value="${esc(a.texto)}">
    <select class="psel absel ${cls}" data-v="${a.id}" aria-label="Situação do item">${AB_ST.map(([id, t]) => `<option value="${id}" ${a.status === id ? "selected" : ""}>${t}</option>`).join("")}</select></div>
  ${a.status === "abordado" || a.nota ? `<input class="pnota" data-o="${reg(a)}" data-f="nota" value="${esc(a.nota)}" placeholder="Como foi / o que a paciente respondeu">` : ""}
  <div class="row" style="justify-content:space-between;margin-top:2px"><span class="ref">${fmtDT(a.criado)}${a.sessao ? ` · abordado na sessão ${a.sessao}` : ""}</span><button class="btn sm del" data-act="del" data-from="abordar" data-o="${reg(p.abordar)}" data-v="${a.id}" title="Excluir (vai para a lixeira)">✕</button></div></li>`;
}
document.addEventListener("change", e => {
  const sel = e.target; if (!sel.classList || !sel.classList.contains("absel") || !DB) return;
  const p = P(), it = p.abordar.find(x => x.id === sel.dataset.v), s = sel.value; it.status = s;
  it.sessao = s === "abordado" && p.sessoes.length ? p.sessoes.at(-1).num : "";
  logP(p, `Item “${it.texto.slice(0, 90)}” → ${AB_ST.find(x => x[0] === s)[1]}`); touch(); V._keepScroll = true; render();
});
function abordarCard(p) {
  const open = p.abordar.filter(a => a.status !== "abordado"), done = p.abordar.filter(a => a.status === "abordado");
  return `<div class="card"><h3>💬 Para abordar com a paciente</h3>
  <div class="row" style="flex-wrap:nowrap"><input id="novoAb" placeholder="Ex.: perguntar como está a relação com a sogra" style="flex:1"><button class="btn pri" data-act="addAb">Adicionar</button></div>
  ${open.length ? `<ul class="plist">${open.map(a => abItem(p, a)).join("")}</ul>` : `<p class="muted" style="margin-bottom:0">Nada pendente para abordar.</p>`}
  ${done.length ? `<details><summary class="muted" style="cursor:pointer;margin-top:8px">Já abordados (${done.length})</summary><ul class="plist">${done.map(a => abItem(p, a)).join("")}</ul></details>` : ""}</div>`;
}
function protoCard(pr, used, withPatient) {
  let nextId = null, nextPhase = -1;
  if (withPatient) pr.fases.some((f, i) => { const t = f.t.find(x => !used.has(x)); if (t) { nextId = t; nextPhase = i; return true; } });
  return `<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(pr.nome)}</h3><span class="badge ${pr.cor}">protocolo</span></div>
  ${withPatient && nextId ? `<div class="alert warn" style="margin:10px 0"><b>Próximo passo sugerido:</b> ${esc(TEC[nextId].nome)} — fase “${esc(pr.fases[nextPhase].n)}”. <button class="btn sm" data-act="showTec" data-v="${nextId}">ver técnica</button></div>` : ""}
  ${withPatient && !nextId ? `<div class="alert info" style="margin:10px 0">Todas as técnicas do protocolo já foram registradas em sessões. Avalie prevenção de recaída e alta.</div>` : ""}
  <details ${withPatient ? "" : "open"}><summary class="muted" style="cursor:pointer;margin:6px 0">Avaliação e instrumentos</summary>
  <ul>${pr.aval.map(x => `<li>${esc(x)}</li>`).join("")}</ul><p><b>Instrumentos:</b> ${pr.instr.map(esc).join(" · ")}</p></details>
  <div style="margin-top:10px">${pr.fases.map((f, i) => `<div class="phase ${i === nextPhase ? "cur" : ""}"><b>${esc(f.n)}</b> <span class="muted">— ${esc(f.foco)}</span><div style="margin-top:6px">${f.t.map(id => `<button class="chip ${used.has(id) ? "used" : ""} ${id === nextId ? "next" : ""}" data-act="showTec" data-v="${id}">${used.has(id) ? "✓ " : ""}${esc(TEC[id].nome)}</button>`).join("")}</div></div>`).join("")}</div>
  ${pr.cuid.length ? `<div class="alert ${pr.id === "suicidio" ? "danger" : "warn"}"><b>Cuidados</b><ul>${pr.cuid.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
  <details><summary class="ref" style="cursor:pointer">Referências (${pr.refs.length})</summary>${refList(pr.refs)}</details></div>`;
}
function tabDirecao(p) {
  const ses = p.sessoes, n = ses.length, used = new Set(ses.flatMap(s => s.tecnicas || []));
  PT = {};
  const allRisk = riskAlerts(p); allRisk.forEach(a => PT[a.key] = a.txt);
  const al = allRisk.filter(a => !isClosed(p, a.key)), riskDone = allRisk.filter(a => isClosed(p, a.key)); let h = "";
  if (al.length) h += `<div class="alert danger"><b>⚠ Atenção — possível risco</b><ul class="plist">${al.map(a => pendRow(p, { key: a.key, html: esc(a.txt) })).join("")}</ul>
    <p style="margin:4px 0 8px">Faça ou atualize a avaliação de risco e o plano de segurança <b>nesta sessão</b> e comunique o supervisor. CVV 188 · SAMU 192.</p>
    <button class="btn sm" data-act="tab" data-v="risco">Ir para Risco e segurança</button></div>`;
  if (riskDone.length) h += `<details class="item"><summary>Alertas de risco já avaliados (${riskDone.length})</summary><div class="body"><ul class="plist">${riskDone.map(a => pendRow(p, { key: a.key, html: esc(a.txt) })).join("")}</ul></div></details>`;
  h += abordarCard(p);
  const pend = [], last = ses.at(-1);
  if (last && last.tarefa) pend.push({ key: "tarefa:" + last.id, html: `No início da próxima sessão, revisar a tarefa combinada na sessão ${last.num}: “${esc(last.tarefa)}”.` });
  if (!p.demandas.length) pend.push({ key: "demandas", html: `Nenhuma demanda marcada — marque no <b>Cadastro</b> para receber protocolos sugeridos.` });
  if (!p.metas) pend.push({ key: "metas", html: "Metas terapêuticas ainda não registradas no Cadastro." });
  if (n >= 3 && !p.conc.crencaCentral) pend.push({ key: "conc", html: "Diagrama de conceituação ainda sem crença central — comece a levantar hipóteses (seta descendente)." });
  const hasScale = s => [s.phq9, s.gad7, s.bdi, s.bai].some(v => v !== "" && v != null);
  const li = ses.map(hasScale).lastIndexOf(true);
  if (n > 0 && (li < 0 || li < n - 4)) pend.push({ key: "escalas:" + last.id, html: "Nenhuma escala (PHQ-9 / GAD-7) registrada nas últimas 4 sessões." });
  if (allRisk.length && !p.risco.plano.sinais) pend.push({ key: "plano", html: "Há sinais de risco e o plano de segurança ainda está vazio." });
  [...used].map(tecById).filter(semRef).forEach(t => pend.push({ key: "tecref:" + t.id, html: `A técnica “<b>${esc(t.nome)}</b>” foi registrada sem referência científica. <a href="#" data-act="tecEdit" data-v="${esc(t.id)}">Completar a referência</a> (a IA pode sugerir).` }));
  const txt = ses.slice(-5).map(sessText).join(" ") + " " + p.queixa + " " + p.historia;
  PROTOCOLOS.forEach(pr => { if (!p.demandas.includes(pr.id) && new RegExp(pr.kw, "i").test(txt)) pend.push({ key: "kw:" + pr.id, html: `As anotações mencionam temas de <b>${esc(pr.nome)}</b>. Avalie se é uma demanda e marque no Cadastro.` }); });
  pend.forEach(it => PT[it.key] = it.html.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
  const pOpen = pend.filter(it => !isClosed(p, it.key)), pDone = pend.filter(it => isClosed(p, it.key));
  h += `<div class="card"><h3>📌 Pendências e lembretes</h3>${pOpen.length ? `<ul class="plist">${pOpen.map(it => pendRow(p, it)).join("")}</ul>` : `<p class="muted" style="margin-bottom:0">Nenhuma pendência em aberto.</p>`}
  ${pDone.length ? `<details><summary class="muted" style="cursor:pointer;margin-top:8px">📁 Arquivadas e resolvidas (${pDone.length}) — toque para ver ou reabrir</summary><ul class="plist">${pDone.map(it => pendRow(p, it)).join("")}</ul></details>` : ""}</div>`;
  const fase = faseGeral(n);
  h += `<div class="card"><h3>Momento do tratamento · ${n} sessão(ões)</h3><p style="margin:0 0 4px"><b>${fase.t}</b></p><ul>${fase.i.map(x => `<li>${esc(x)}</li>`).join("")}</ul><p class="ref">Base: ${esc(REF.JB)}</p></div>`;
  const lastOf = f => { for (let i = n - 1; i >= 0; i--) if (ses[i][f] !== "" && ses[i][f] != null) return ses[i]; return null; };
  const firstOf = f => ses.find(s => s[f] !== "" && s[f] != null);
  const sc = [], lp = lastOf("phq9"), fp = firstOf("phq9"), lg = lastOf("gad7"), fg = firstOf("gad7");
  if (lp) sc.push(`<li><b>PHQ-9 = ${lp.phq9}</b> (${sevPHQ(lp.phq9)}) na sessão ${lp.num}${fp && fp !== lp ? ` · início: ${fp.phq9} (${lp.phq9 - fp.phq9 >= 0 ? "+" : ""}${lp.phq9 - fp.phq9})` : ""}</li>`);
  if (lg) sc.push(`<li><b>GAD-7 = ${lg.gad7}</b> (${sevGAD(lg.gad7)}) na sessão ${lg.num}${fg && fg !== lg ? ` · início: ${fg.gad7} (${lg.gad7 - fg.gad7 >= 0 ? "+" : ""}${lg.gad7 - fg.gad7})` : ""}</li>`);
  if (sc.length) h += `<div class="card"><h3>Escalas</h3><ul>${sc.join("")}</ul></div>`;
  const prs = p.demandas.map(id => PRO[id]).filter(Boolean).sort((a, b) => (a.id === "suicidio" ? -1 : b.id === "suicidio" ? 1 : 0));
  if (prs.length) h += `<h2>Protocolos das demandas</h2><p class="muted" style="margin-top:-4px">Verde ✓ = já usada · contorno laranja = próximo passo sugerido. Marque as técnicas em cada sessão para o direcionamento acompanhar.</p>` + prs.map(pr => protoCard(pr, used, true)).join("");
  h += `<div class="card"><button class="btn" data-act="iaPerg" data-v="Com base no resumo deste paciente, sugira técnicas e um roteiro para a próxima sessão, com referências.">🤖 Pedir sugestões à IA para a próxima sessão</button></div>`;
  return h;
}

/* ---------- seletor de técnicas ---------- */
const TP_OPEN = new Set();
const semRef = t => t && t.custom && !String(t.refs || "").trim();
function tpBtn(s, t) { const on = s.tecnicas.includes(t.id); return `<button type="button" class="sq ${on ? "on" : ""}" data-act="${on ? "tpRem" : "tpAdd"}" data-sid="${s.id}" data-v="${esc(t.id)}">${on ? "✓ " : ""}${esc(t.nome)}${semRef(t) ? " ⚠" : ""}</button>`; }
function tpInner(s) {
  const sel = s.tecnicas.map(id => { const t = tecById(id); return `<span class="sq on" ${semRef(t) ? 'title="Sem referência científica — complete em Técnicas"' : ""}>${esc(t.nome)}${semRef(t) ? ` <a href="#" class="warnref" data-act="tecEdit" data-v="${esc(id)}">⚠ sem referência</a>` : ""}<button type="button" class="x" data-act="tpRem" data-sid="${s.id}" data-v="${esc(id)}" aria-label="Remover">✕</button></span>`; }).join("") || `<span class="muted" style="font-size:13px">Nenhuma técnica marcada ainda.</span>`;
  const open = TP_OPEN.has(s.id);
  const groups = [...ABORDAGENS, "Minhas técnicas"].map(ab => { const items = allTec().filter(t => (t.custom ? "Minhas técnicas" : t.ab) === ab); return items.length ? `<div class="tp-g"><div class="tp-gt">${esc(ab)}</div>${items.map(t => tpBtn(s, t)).join("")}</div>` : ""; }).join("");
  return `<div class="tp-sel">${sel}</div>
  <div class="row tp-bar" style="flex-wrap:nowrap"><input class="tp-q" data-sid="${s.id}" placeholder="🔍 Buscar técnica ou digitar uma nova…" autocomplete="off" enterkeyhint="done"><button type="button" class="btn" data-act="tpAll" data-sid="${s.id}">${open ? "− Fechar" : "＋ Ver todas"}</button></div>
  <div class="tp-res"></div>${open ? `<div class="tp-all">${groups}</div>` : ""}`;
}
function tpRefresh(sid) { const p = P(), s = p && p.sessoes.find(x => x.id === sid), el = document.querySelector(`.tp[data-sid="${sid}"]`); if (!s || !el) return; const q = el.querySelector(".tp-q"), qv = q ? q.value : ""; el.innerHTML = tpInner(s); const nq = el.querySelector(".tp-q"); if (nq && qv) { nq.value = qv; tpSearch(nq); } }
function tpSearch(inp) {
  const p = P(), s = p.sessoes.find(x => x.id === inp.dataset.sid), raw = inp.value.trim(), q = norm(raw), box = inp.closest(".tp").querySelector(".tp-res");
  if (!q) { box.innerHTML = ""; return; }
  const hits = allTec().filter(t => norm(t.nome + " " + (t.ab || "") + " " + (t.ind || t.descricao || "")).includes(q)).slice(0, 12);
  const exact = allTec().some(t => norm(t.nome) === q);
  box.innerHTML = hits.map(t => tpBtn(s, t)).join("") + (exact ? "" : `<button type="button" class="sq add" data-act="tpNew" data-sid="${s.id}">＋ Adicionar “${esc(raw)}” (informe a referência científica depois)</button>`);
}
document.addEventListener("input", e => { if (e.target.classList && e.target.classList.contains("tp-q")) tpSearch(e.target); });
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.classList && e.target.classList.contains("tp-q")) { e.preventDefault(); const b = e.target.closest(".tp").querySelector(".tp-res .sq"); if (b) b.click(); } });

/* ---------- sessões ---------- */
function novaSessao(p) {
  const prev = p.sessoes.at(-1);
  return { id: uid(), num: p.sessoes.reduce((m, s) => Math.max(m, s.num), 0) + 1, data: today(), humor: "", phq9: "", phq9i9: "", gad7: "", bdi: "", bai: "", ponte: "", agenda: "", tarefaRev: "", conteudo: "", tecnicas: [], obs: "", resumo: "", tarefa: "", feedback: "", supervisao: "", transcricao: "", _prevTarefa: prev ? prev.tarefa : "" };
}
function scaleFld(o, id) {
  const e = ESCALAS[id], k = reg(o), v = o[id] ?? "";
  return `<label class="f"><span>${esc(e.rotulo)}<button type="button" class="infobtn" data-act="showEsc" data-v="${id}" title="Explicação, exemplo e referências">＋</button></span>
  <input type="number" inputmode="decimal" data-o="${k}" data-f="${id}" data-sc="${id}" min="${e.min}" max="${e.max}" value="${esc(v)}">
  <small>${esc(e.curta)}</small><small class="interp">${v === "" ? "" : esc(faixaEsc(id, v))}</small></label>`;
}
function escHTML(id) {
  const e = ESCALAS[id];
  return `<div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(e.nome)}</h2><span class="badge ${e.uso.startsWith("USO RESTRITO") ? "danger" : "accent"}">${esc(e.uso)}</span></div>
  <p>${esc(e.simples)}</p>
  <h3>Como ler o resultado</h3><table class="t">${e.faixas.map(([a, b, t]) => `<tr><td style="width:90px"><b>${a === b ? a : a + "–" + b}</b></td><td>${esc(t)}</td></tr>`).join("")}</table>
  ${e.faixasNota ? `<p class="ref">${esc(e.faixasNota)}</p>` : ""}
  <h3 style="margin-top:12px">Exemplo</h3><p>${esc(e.exemplo)}</p>
  <details><summary style="cursor:pointer;font-weight:600;color:var(--accent)">＋ Detalhes técnicos</summary><ul>${e.tecnico.map(x => `<li>${esc(x)}</li>`).join("")}</ul></details>
  <details style="margin-top:6px"><summary style="cursor:pointer;font-weight:600;color:var(--accent)">＋ Referências (${e.refs.length})</summary>${refList(e.refs)}</details>`;
}
function docRow(p, d, compact) {
  const ic = d.tipo.startsWith("image/") ? "🖼" : d.tipo.startsWith("audio/") ? "🎙" : d.tipo.startsWith("video/") ? "🎬" : d.tipo === "application/pdf" ? "📄" : "📎";
  const s = d.sessaoId ? p.sessoes.find(x => x.id === d.sessaoId) : null;
  const sy = d.gravando ? `<span class="badge danger">● gravando</span>` : DB.config.driveOn ? ((d.sync || {}).drive ? `<span class="badge ok">☁ no Drive</span>` : `<span class="badge warn">☁ pendente</span>`) : "";
  return `<li class="doc"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="dic">${ic}</span><div style="flex:1;min-width:0">
    <div class="dnm">${esc(d.nome)}</div><div class="ref">${fmtSize(d.tamanho || 0)} · ${fmtDT(d.criado)}${s ? ` · sessão ${s.num}` : ""}${d.duracao ? ` · ${d.duracao}` : ""} ${sy}</div>
    ${compact ? "" : `<input data-o="${reg(d)}" data-f="desc" value="${esc(d.desc || "")}" placeholder="Descrição (opcional)" style="margin-top:6px">`}</div></div>
    <div class="row" style="margin-top:6px"><button class="btn sm" data-act="docVer" data-v="${d.id}" ${d.gravando ? "disabled" : ""}>${d.tipo.startsWith("audio/") ? "▶ Ouvir" : "👁 Ver"}</button><button class="btn sm" data-act="docBaixar" data-v="${d.id}" ${d.gravando ? "disabled" : ""}>⬇ Baixar</button>
    ${d.gravando ? "" : `<button class="btn sm del" data-act="del" data-from="docs" data-o="${reg(p.docs)}" data-v="${d.id}">✕</button>`}</div></li>`;
}
function tabSessoes(p) {
  const ses = [...p.sessoes].reverse();
  return `<div class="row" style="margin-bottom:12px"><button class="btn pri" data-act="newS">+ Nova sessão</button>
  <details style="flex:1;min-width:200px"><summary class="muted" style="cursor:pointer">Estrutura da sessão (J. Beck) — lembrete</summary><ol>${TEC.estrutura.passos.map(x => `<li>${esc(x)}</li>`).join("")}</ol></details></div>
  ${abordarCard(p)}
  ${ses.length ? ses.map((s, i) => {
    const sdocs = p.docs.filter(d => d.sessaoId === s.id), recHere = REC.on && REC.sid === s.id;
    return `<details class="item" ${i === 0 ? "open" : ""}><summary>Sessão ${s.num} <span class="sum-meta">· ${fmt(s.data)}${s.humor !== "" ? ` · humor ${s.humor}/10` : ""}${s.tecnicas.length ? ` · ${s.tecnicas.length} técnica(s)` : ""}${sdocs.length ? ` · 📎${sdocs.length}` : ""}</span>${recHere ? `<span class="badge danger">● gravando</span>` : ""}</summary><div class="body">
    <div class="row recrow"><button class="btn ${recHere ? "del" : ""}" data-act="${recHere ? "recStop" : "recStart"}" data-v="${s.id}" ${REC.on && !recHere ? "disabled" : ""}>${recHere ? "■ Parar gravação" : "🎙 Gravar sessão"}</button>
      <button class="btn" data-act="upDoc" data-v="${s.id}">📎 Anexar</button><button class="btn" data-act="upCam" data-v="${s.id}">📷 Foto</button>
      ${s.transcricao ? `<button class="btn" data-act="iaResumo" data-v="${s.id}">🤖 Resumir transcrição</button>` : ""}</div>
    <div class="g6" style="margin-top:10px">${fld(s, "data", "Data", "date")}${Object.keys(ESCALAS).map(id => scaleFld(s, id)).join("")}</div>
    <div class="g2">${fld(s, "ponte", "Ponte com a sessão anterior", "area", { rows: 2 })}${fld(s, "agenda", "Agenda combinada", "area", { rows: 2 })}</div>
    ${fld(s, "tarefaRev", "Revisão da tarefa de casa", "area", { rows: 2, ph: s._prevTarefa ? "Tarefa combinada: " + s._prevTarefa : "" })}
    ${fld(s, "conteudo", "Discussão dos itens da agenda — situações, pensamentos automáticos, emoções, intervenções", "area", { rows: 5 })}
    <div class="f"><span>Técnicas usadas nesta sessão</span><div class="tp" data-sid="${s.id}">${tpInner(s)}</div></div>
    ${fld(s, "obs", "Observações clínicas (afeto, comportamento, aliança, hipóteses)", "area", { rows: 3 })}
    <div class="g2">${fld(s, "resumo", "Resumo da sessão", "area", { rows: 2 })}${fld(s, "tarefa", "Nova tarefa de casa", "area", { rows: 2 })}</div>
    <div class="g2">${fld(s, "feedback", "Feedback do paciente", "area", { rows: 2 })}${fld(s, "supervisao", "Notas da supervisão", "area", { rows: 2 })}</div>
    ${s.transcricao || recHere ? fld(s, "transcricao", "📝 Transcrição da sessão (editável)", "area", { rows: 6, id: "tr-" + s.id }) : ""}
    ${s.consentGrav ? `<p class="ref">Consentimento para gravação registrado em ${fmtDT(s.consentGrav)}.</p>` : ""}
    ${sdocs.length ? `<div class="f"><span>Anexos e gravações desta sessão</span><ul class="plist">${sdocs.map(d => docRow(p, d, true)).join("")}</ul></div>` : ""}
    <div class="row"><button class="btn sm del" data-act="del" data-from="sessoes" data-o="${reg(p.sessoes)}" data-v="${s.id}">Excluir sessão</button></div>
  </div></details>`;
  }).join("") : `<div class="card">Nenhuma sessão registrada.</div>`}`;
}

/* ---------- documentos ---------- */
function tabDocs(p) {
  return `<div class="card"><h3>📎 Documentos, fotos e gravações</h3>
  <p class="muted" style="margin-top:0">Tudo é criptografado antes de ser salvo${DB.config.driveOn ? " e enviado ao seu Google Drive" : ""}. Use para termos de consentimento, fichas preenchidas, desenhos, exames, etc.</p>
  <div class="row"><button class="btn pri" data-act="upDoc">📎 Enviar arquivos</button><button class="btn" data-act="upCam">📷 Tirar foto</button></div></div>
  ${p.docs.length ? `<ul class="plist card">${[...p.docs].reverse().map(d => docRow(p, d)).join("")}</ul>` : `<p class="muted">Nenhum documento ainda.</p>`}`;
}
let UP_CTX = null;
async function handleUpload(files) {
  const p = DB.pacientes.find(x => x.id === UP_CTX.pid); if (!p) return;
  for (const f of files) {
    if (f.size > 200 * 1048576 && !confirm(`“${f.name}” tem ${fmtSize(f.size)}. Arquivos muito grandes demoram para sincronizar. Enviar mesmo assim?`)) continue;
    setFlagMsg(`Criptografando ${f.name}…`);
    const id = uid(), buf = await f.arrayBuffer(); await Store.putFile(id, buf);
    p.docs.push({ id, nome: f.name || ("foto-" + today() + ".jpg"), tipo: f.type || "application/octet-stream", tamanho: f.size, criado: nowISO(), sessaoId: UP_CTX.sid || "", desc: "", origem: "upload", sync: {} });
    logP(p, `Documento anexado: ${f.name}`);
  }
  await save(); V._keepScroll = true; render();
}
function setFlagMsg(m) { const el = $("#flag"); if (el) { el.className = "flag saving"; el.textContent = m; } }
function findDoc(id) { for (const p of DB.pacientes) { const d = p.docs.find(x => x.id === id); if (d) return [p, d]; } return [null, null]; }
async function docVer(id) {
  const [, d] = findDoc(id); if (!d) return;
  const dlg = $("#dlg"); dlg.innerHTML = `<p>Abrindo ${esc(d.nome)}…</p>`; dlg.showModal();
  const buf = await getDocBytes(d);
  if (!buf) { dlg.innerHTML = `<p>Este arquivo não está neste aparelho${DB.config.driveOn ? " e não foi possível baixá-lo do Drive agora (conecte o Google)" : ""}.</p><div class="row" style="justify-content:flex-end"><button class="btn" data-act="closeDlg">Fechar</button></div>`; return; }
  const url = URL.createObjectURL(new Blob([buf], { type: d.tipo })); dlg.dataset.url = url;
  const t = d.tipo, v = t.startsWith("image/") ? `<img src="${url}" alt="" style="max-width:100%;border-radius:8px">` : t.startsWith("audio/") ? `<audio controls src="${url}" style="width:100%"></audio>` : t.startsWith("video/") ? `<video controls src="${url}" style="width:100%"></video>` : t === "application/pdf" ? `<iframe src="${url}" style="width:100%;height:70vh;border:0"></iframe>` : `<p>Pré-visualização indisponível para este tipo de arquivo.</p>`;
  dlg.innerHTML = `<h3 style="margin-top:0">${esc(d.nome)}</h3>${v}<div class="row" style="justify-content:flex-end;margin-top:10px"><a class="btn" href="${url}" download="${esc(d.nome)}">⬇ Baixar</a><button class="btn" data-act="closeDlg">Fechar</button></div>`;
}
async function docBaixar(id) { const [, d] = findDoc(id); if (!d) return; const buf = await getDocBytes(d); if (!buf) return alert("Arquivo indisponível neste aparelho."); download(d.nome, new Blob([buf], { type: d.tipo })); }

/* ---------- gravação de sessão ---------- */
const REC = { on: false, paused: false, mr: null, stream: null, chunks: [], acc: 0, t0: 0, timer: null, docId: null, pid: null, sid: null, sr: null, transcribe: false, wake: null, mime: "", persistT: null, interim: "" };
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const recElapsed = () => REC.acc + (REC.on && !REC.paused ? Date.now() - REC.t0 : 0);
const mmss = ms => { const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(ss).padStart(2, "0"); };
function recConsent(sid) {
  const p = P(), s = p.sessoes.find(x => x.id === sid);
  if (!navigator.mediaDevices || !window.MediaRecorder) return alert("Este navegador não permite gravar áudio. Use o Chrome (Android/PC) ou Safari atualizado (iPhone).");
  const d = $("#dlg");
  d.innerHTML = `<h2 style="margin-top:0">🎙 Gravar sessão ${s.num}</h2>
  <div class="alert warn">A gravação exige <b>consentimento livre e esclarecido da paciente</b>, de preferência por escrito (anexe o termo assinado em Documentos), e deve seguir as regras da clínica-escola e da supervisão.</div>
  <label class="chk"><input type="checkbox" id="rcOk"> A paciente autorizou a gravação desta sessão</label>
  <label class="chk"><input type="checkbox" id="rcTr" ${SR ? (DB.config.transcrPadrao ? "checked" : "") : "disabled"}> Transcrever ao vivo ${SR ? "" : "(não disponível neste navegador)"}</label>
  <p class="ref" style="margin-top:-4px">A transcrição usa o reconhecimento de voz do próprio navegador; no Chrome o áudio é processado pelos servidores do Google. Se preferir, grave sem transcrever. Mantenha a tela ligada durante a gravação.</p>
  <div class="row" style="justify-content:flex-end"><button class="btn" data-act="closeDlg">Cancelar</button><button class="btn pri" id="rcGo" disabled data-act="recGo" data-v="${sid}">● Iniciar gravação</button></div>`;
  d.showModal(); $("#rcOk").onchange = e => { $("#rcGo").disabled = !e.target.checked; };
}
async function recStart(sid, transcribe) {
  const p = P(), s = p.sessoes.find(x => x.id === sid);
  let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); } catch (e) { return alert("Sem acesso ao microfone: " + e.message); }
  const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"].find(m => MediaRecorder.isTypeSupported(m)) || "";
  const mr = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : undefined);
  const tipo = (mr.mimeType || mime || "audio/webm").split(";")[0], ext = tipo.includes("mp4") || tipo.includes("aac") ? "m4a" : "webm";
  const id = uid();
  p.docs.push({ id, nome: `Sessão ${s.num} - ${fmt(s.data).replace(/\//g, "-")}.${ext}`, tipo, tamanho: 0, criado: nowISO(), sessaoId: s.id, desc: "Gravação da sessão", origem: "gravacao", gravando: true, sync: {} });
  s.consentGrav = s.consentGrav || nowISO(); logP(p, `Gravação da sessão ${s.num} iniciada (consentimento registrado)`);
  Object.assign(REC, { on: true, paused: false, mr, stream, chunks: [], acc: 0, t0: Date.now(), docId: id, pid: p.id, sid: s.id, transcribe, mime: tipo, interim: "" });
  mr.ondataavailable = e => { if (e.data && e.data.size) { REC.chunks.push(e.data); recPersistSoon(); } };
  mr.start(10000);
  REC.timer = setInterval(renderRecBar, 1000);
  try { if (navigator.wakeLock) REC.wake = await navigator.wakeLock.request("screen"); } catch (e) {}
  if (transcribe && SR) recSR(s);
  await save(); V._keepScroll = true; render();
}
function recSR(s) {
  const sr = new SR(); sr.lang = "pt-BR"; sr.continuous = true; sr.interimResults = true; REC.sr = sr;
  sr.onresult = e => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) { const line = `[${mmss(recElapsed())}] ${r[0].transcript.trim()}\n`; s.transcricao = (s.transcricao || "") + line; const ta = document.getElementById("tr-" + s.id); if (ta) { ta.value = s.transcricao; ta.scrollTop = ta.scrollHeight; } touch(); }
      else interim += r[0].transcript;
    }
    REC.interim = interim; renderRecBar();
  };
  sr.onerror = e => { if (e.error === "not-allowed" || e.error === "service-not-allowed") { REC.transcribe = false; REC.interim = "Transcrição bloqueada pelo navegador — a gravação continua."; } };
  sr.onend = () => { if (REC.on && !REC.paused && REC.transcribe) { try { sr.start(); } catch (x) {} } };
  try { sr.start(); } catch (x) {}
}
function recPersistSoon() { if (REC.persistT) return; REC.persistT = setTimeout(recPersist, 20000); }
async function recPersist() {
  clearTimeout(REC.persistT); REC.persistT = null; if (!REC.docId) return;
  const buf = await new Blob(REC.chunks, { type: REC.mime }).arrayBuffer(); await Store.putFile(REC.docId, buf);
  const [, d] = findDoc(REC.docId); if (d) { d.tamanho = buf.byteLength; d.duracao = mmss(recElapsed()); } touch();
}
function recPause() {
  if (!REC.on) return;
  if (!REC.paused) { REC.mr.pause(); REC.acc += Date.now() - REC.t0; REC.paused = true; if (REC.sr) try { REC.sr.stop(); } catch (e) {} }
  else { REC.mr.resume(); REC.t0 = Date.now(); REC.paused = false; if (REC.transcribe && REC.sr) try { REC.sr.start(); } catch (e) {} }
  renderRecBar();
}
async function recStop() {
  if (!REC.on) return;
  const stopped = new Promise(res => { REC.mr.onstop = res; });
  if (!REC.paused) REC.acc += Date.now() - REC.t0;
  REC.on = false; try { REC.mr.stop(); } catch (e) {}
  await Promise.race([stopped, new Promise(r => setTimeout(r, 3000))]);
  if (REC.sr) try { REC.sr.stop(); } catch (e) {}
  REC.stream.getTracks().forEach(t => t.stop()); clearInterval(REC.timer);
  try { if (REC.wake) await REC.wake.release(); } catch (e) {}
  await recPersist();
  const [p, d] = findDoc(REC.docId); if (d) { d.gravando = false; d.duracao = mmss(REC.acc); d.sync = {}; } if (p) logP(p, `Gravação encerrada (${mmss(REC.acc)})`);
  Object.assign(REC, { docId: null, sr: null, wake: null, chunks: [], interim: "" });
  await save(); V._keepScroll = true; render();
}
function renderRecBar() {
  let bar = $("#recBar");
  if (!REC.on) { if (bar) bar.remove(); document.body.classList.remove("recording"); return; }
  document.body.classList.add("recording");
  if (!bar) { bar = document.createElement("div"); bar.id = "recBar"; document.body.appendChild(bar); }
  const p = DB && DB.pacientes.find(x => x.id === REC.pid), s = p && p.sessoes.find(x => x.id === REC.sid);
  bar.innerHTML = `<div class="row" style="flex-wrap:nowrap"><span class="dot ${REC.paused ? "" : "on"}"></span><b>${REC.paused ? "Pausado" : "Gravando"} ${mmss(recElapsed())}</b><span class="ref" style="color:inherit;opacity:.8">· ${esc(p ? p.codigo : "")} · sessão ${s ? s.num : ""}</span><span class="sp"></span>
  <button class="btn sm" data-act="recPause">${REC.paused ? "▶ Retomar" : "⏸ Pausar"}</button><button class="btn sm del" data-act="recStop">■ Parar</button></div>
  ${REC.transcribe || REC.interim ? `<div class="interim">${esc(REC.interim || "🎤 transcrevendo…")}</div>` : ""}`;
}

/* ---------- conceituação ---------- */
function tabConc(p) {
  const c = p.conc;
  return `<div class="row" style="justify-content:flex-end;margin-bottom:8px"><button class="btn sm" data-act="printDCC">🖨 Imprimir diagrama (supervisão)</button><button class="btn sm" data-act="iaPerg" data-v="Analise a conceituação cognitiva deste paciente: aponte lacunas, hipóteses de crenças centrais e intermediárias e como testá-las, com referências.">🤖 Analisar com IA</button></div>
  <div class="card"><h3>Tríade cognitiva</h3><div class="tri">${fld(c, "eu", "Visão de si (EU)", "area", { ph: "Ex.: sou incapaz, sou um fardo" })}${fld(c, "mundo", "Visão do mundo / dos outros", "area", { ph: "Ex.: as pessoas me rejeitam" })}${fld(c, "futuro", "Visão do futuro", "area", { ph: "Ex.: nada vai mudar" })}</div></div>
  <div class="card"><h3>Diagrama de conceituação cognitiva (J. Beck)</h3>
  ${fld(c, "infancia", "Dados relevantes da história / infância", "area")}
  <div class="g2">${fld(c, "crencaCentral", "Crença(s) central(is)", "area", { rows: 2 })}${fld(c, "categoria", "Categoria", "select", { options: ["", "Desamparo", "Desamor", "Desvalor", "Desamparo + desvalor", "Desamor + desvalor", "Outra"] })}</div>
  ${fld(c, "regras", "Crenças intermediárias — regras, atitudes, pressupostos (“Se…, então…”)", "area")}
  ${fld(c, "estrategias", "Estratégias compensatórias", "area", { rows: 2 })}
  <h3 style="margin-top:12px">Situações típicas</h3>
  <div class="g3">${c.situacoes.map((s, i) => `<div class="card" style="background:var(--bg)"><b>Situação ${i + 1}</b>${fld(s, "situacao", "Situação", "area", { rows: 2 })}${fld(s, "pa", "Pensamento automático", "area", { rows: 2 })}${fld(s, "significado", "Significado do PA", "area", { rows: 2 })}${fld(s, "emocao", "Emoção", "text")}${fld(s, "comportamento", "Comportamento", "text")}</div>`).join("")}</div>
  <p class="ref">${esc(REF.JB)} · ${esc(REF.KPD)}</p></div>`;
}
/* ---------- registros ---------- */
function tabRegistros(p) {
  const dist = ["", ...DISTORCOES.map(d => d[0])];
  return `<h2 style="margin-top:0">RPD — Registro de Pensamentos</h2>
  <div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newRPD">+ Novo registro</button><button class="btn sm" data-act="ficha" data-v="rpd">🖨 Folha em branco</button><button class="btn sm" data-act="ficha" data-v="distorcoes">🖨 Distorções</button></div>
  ${[...p.rpd].reverse().map(r => `<details class="item"><summary>${fmt(r.data)} <span class="sum-meta">· ${esc((r.pa || "").slice(0, 70)) || "(sem pensamento)"}</span></summary><div class="body"><div class="g2" style="margin-top:10px">
    ${fld(r, "data", "Data", "date")}${fld(r, "situacao", "Situação", "area", { rows: 2 })}
    ${fld(r, "pa", "Pensamento automático", "area", { rows: 2 })}${fld(r, "credPA", "Quanto acredita (%)", "number", { min: 0, max: 100 })}
    ${fld(r, "emocao", "Emoção", "text")}${fld(r, "intens", "Intensidade (%)", "number", { min: 0, max: 100 })}
    ${fld(r, "distorcao", "Distorção", "select", { options: dist })}${fld(r, "resposta", "Resposta adaptativa", "area", { rows: 3, hint: "Use as perguntas socráticas." })}
    ${fld(r, "credResp", "Quanto acredita na resposta (%)", "number", { min: 0, max: 100 })}${fld(r, "resultado", "Resultado: reavaliação do PA e da emoção", "area", { rows: 2 })}
  </div><button class="btn sm del" data-act="del" data-from="rpd" data-o="${reg(p.rpd)}" data-v="${r.id}">Excluir</button></div></details>`).join("") || `<p class="muted">Nenhum RPD.</p>`}
  <h2>Seta descendente</h2>
  <div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newSeta">+ Nova seta</button><button class="btn sm" data-act="ficha" data-v="seta">🖨 Folha em branco</button></div>
  ${[...p.setas].reverse().map(s => `<details class="item" open><summary>${fmt(s.data)} <span class="sum-meta">· ${esc((s.pa || "").slice(0, 60)) || "(nova)"}${s.crenca ? " → " + esc(s.crenca.slice(0, 40)) : ""}</span></summary><div class="body"><div class="steps" style="margin-top:10px">
    ${fld(s, "pa", "Pensamento automático inicial", "text")}
    ${s.passos.map((x, i) => `<div class="arrow">↓ “Se isso fosse verdade, o que significaria?”</div>${fld(s.passos, i, "Nível " + (i + 1), "text")}`).join("")}
    <div class="row"><button class="btn sm" data-act="addPasso" data-v="${s.id}">+ descer um nível</button></div>
    <div class="arrow">↓</div><div class="g2">${fld(s, "crenca", "Crença identificada no fim da seta", "text")}${fld(s, "cat", "Categoria", "select", { options: ["", "Desamparo", "Desamor", "Desvalor"] })}</div>
  </div><button class="btn sm del" data-act="del" data-from="setas" data-o="${reg(p.setas)}" data-v="${s.id}">Excluir</button></div></details>`).join("") || `<p class="muted">Nenhuma seta descendente.</p>`}
  <h2>Registros A.W.A.R.E.</h2>
  <div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newAware">+ Novo registro</button><button class="btn sm" data-act="ficha" data-v="aware">🖨 Cartão AWARE</button></div>
  ${[...p.aware].reverse().map(a => `<details class="item"><summary>${fmt(a.data)} <span class="sum-meta">· ansiedade ${a.antes === "" ? "?" : a.antes} → ${a.depois === "" ? "?" : a.depois}</span></summary><div class="body"><div class="g2" style="margin-top:10px">
    ${fld(a, "data", "Data", "date")}${fld(a, "situacao", "Situação", "area", { rows: 2 })}
    ${fld(a, "antes", "Ansiedade antes (0–10)", "number", { min: 0, max: 10 })}${fld(a, "depois", "Ansiedade depois (0–10)", "number", { min: 0, max: 10 })}
    ${fld(a, "aceitar", "A — Aceitou? como?", "area", { rows: 2 })}${fld(a, "observar", "W — O que observou?", "area", { rows: 2 })}
    ${fld(a, "agir", "A — Como agiu com a ansiedade?", "area", { rows: 2 })}${fld(a, "esperar", "R/E — Repetiu? O que aconteceu?", "area", { rows: 2 })}
  </div><button class="btn sm del" data-act="del" data-from="aware" data-o="${reg(p.aware)}" data-v="${a.id}">Excluir</button></div></details>`).join("") || `<p class="muted">Nenhum registro AWARE.</p>`}`;
}
/* ---------- risco ---------- */
function tabRisco(p) {
  const pl = p.risco.plano;
  return `<div class="alert danger"><b>Conduta diante de risco</b><ul>
    <li>Pergunte diretamente: “Você tem pensado em se matar?” — perguntar não aumenta o risco.</li>
    <li>Avalie ideação, plano, intenção, acesso a meios, tentativas prévias e fatores de proteção.</li>
    <li><b>Estagiário(a): comunique o supervisor no mesmo dia</b> e registre as condutas.</li>
    <li>Risco alto/iminente: não deixe a pessoa sozinha; acione familiar/pessoa de referência (art. 10 do Código de Ética); SAMU 192 ou pronto-socorro; encaminhe para CAPS/psiquiatria.</li>
    <li>CVV 188 (24 h, gratuito) · Violência autoprovocada: notificação conforme Lei 13.819/2019 e o fluxo do serviço.</li></ul>
    <button class="btn sm" data-act="showProto" data-v="suicidio">Ver protocolo completo e referências</button></div>
  <h2>Avaliações de risco</h2><button class="btn pri sm" data-act="newRisk" style="margin-bottom:10px">+ Nova avaliação</button>
  ${[...p.risco.avaliacoes].reverse().map(a => `<details class="item" open><summary>${fmt(a.data)} <span class="sum-meta">· nível: ${esc(a.nivel || "não definido")}</span>${a.nivel === "alto" ? `<span class="badge danger">alto</span>` : a.nivel === "moderado" ? `<span class="badge warn">moderado</span>` : ""}</summary><div class="body"><div class="g2" style="margin-top:10px">
    ${fld(a, "data", "Data", "date")}
    ${fld(a, "ideacao", "Ideação", "select", { options: ["", "Ausente", "Passiva (desejo de morrer)", "Ativa sem plano", "Ativa com plano", "Ativa com plano e intenção"] })}
    ${fld(a, "plano", "Plano / método / data", "area", { rows: 2 })}${fld(a, "meios", "Acesso a meios", "area", { rows: 2 })}
    ${fld(a, "tentativas", "Tentativas prévias / autolesão", "area", { rows: 2 })}${fld(a, "fr", "Fatores de risco", "area", { rows: 2 })}
    ${fld(a, "fp", "Fatores de proteção / razões para viver", "area", { rows: 2 })}${fld(a, "cssrs", "C-SSRS (resultado, se aplicada)", "text")}
    ${fld(a, "nivel", "Nível de risco (julgamento clínico)", "select", { options: ["", "baixo", "moderado", "alto"] })}${fld(a, "conduta", "Conduta tomada", "area", { rows: 2 })}
  </div><div class="g2">${fld(a, "supInfo", "Supervisor informado", "check")}${fld(a, "famInfo", "Rede de apoio / familiar acionado", "check")}</div>
  <button class="btn sm del" data-act="del" data-from="risco.avaliacoes" data-o="${reg(p.risco.avaliacoes)}" data-v="${a.id}">Excluir</button></div></details>`).join("") || `<p class="muted">Nenhuma avaliação registrada.</p>`}
  <h2>Plano de segurança (Stanley & Brown)</h2>
  <div class="card"><p class="muted" style="margin-top:0">Construa junto com o paciente, com as palavras dele. Entregue uma cópia impressa.</p>
  ${fld(pl, "sinais", "1. Sinais de alerta (pensamentos, emoções, situações)", "area", { rows: 2 })}
  ${fld(pl, "internas", "2. Estratégias internas de enfrentamento", "area", { rows: 2 })}
  ${fld(pl, "social", "3. Pessoas e lugares que ajudam a distrair", "area", { rows: 2 })}
  ${fld(pl, "ajuda", "4. Pessoas a quem pedir ajuda (nome e telefone)", "area", { rows: 2 })}
  ${fld(pl, "profissionais", "5. Profissionais e serviços", "area", { rows: 4 })}
  ${fld(pl, "ambiente", "6. Tornar o ambiente seguro (restrição de meios)", "area", { rows: 2 })}
  ${fld(pl, "razoes", "♥ Razões para viver", "area", { rows: 2 })}
  <div class="row"><button class="btn pri" data-act="printPlano">🖨 Imprimir plano para o paciente</button><button class="btn" data-act="ficha" data-v="plano">🖨 Plano em branco</button></div>
  <p class="ref">${esc(REF.SB12)}</p></div>`;
}
/* ---------- evolução ---------- */
function tabEvol(p) {
  const ses = p.sessoes, S = [["humor", 10, "var(--accent)", "Humor (0–10)"], ["phq9", 27, "var(--danger)", "PHQ-9 (0–27)"], ["gad7", 21, "var(--warn)", "GAD-7 (0–21)"]];
  let chart = `<p class="muted">Registre pelo menos 2 sessões para ver o gráfico.</p>`;
  if (ses.length >= 2) {
    const W = 640, H = 230, L = 34, Rr = 14, T = 12, B = 30, x = i => L + i * (W - L - Rr) / (ses.length - 1), y = r => T + (1 - r) * (H - T - B);
    let g = "";
    for (let k = 0; k <= 4; k++) g += `<line x1="${L}" x2="${W - Rr}" y1="${y(k / 4)}" y2="${y(k / 4)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(k / 4) + 4}" font-size="10" text-anchor="end" fill="var(--muted)">${k * 25}%</text>`;
    S.forEach(([f, max, c]) => { const pts = ses.map((s, i) => s[f] === "" || s[f] == null ? null : [x(i), y(Number(s[f]) / max)]).filter(Boolean); if (pts.length) g += `<polyline fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" points="${pts.map(a => a.join(",")).join(" ")}"/>` + pts.map(a => `<circle cx="${a[0]}" cy="${a[1]}" r="3.5" fill="${c}"/>`).join(""); });
    ses.forEach((s, i) => g += `<text x="${x(i)}" y="${H - 10}" font-size="11" text-anchor="middle" fill="var(--muted)">S${s.num}</text>`);
    chart = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Evolução das escalas">${g}</svg><div class="legend">${S.map(([, , c, l]) => `<span><i style="background:${c}"></i>${l}</span>`).join("")}</div><p class="ref">Valores em % do máximo de cada escala. Humor: mais alto = melhor. PHQ-9 e GAD-7: mais alto = pior.</p>`;
  }
  return `<div class="card"><h3>Evolução</h3>${chart}</div>
  <div class="card scroll"><table class="t"><tr><th>Sessão</th><th>Data</th><th>Humor</th><th>PHQ-9</th><th>Item 9</th><th>GAD-7</th><th>BDI-II</th><th>BAI</th></tr>
  ${ses.map(s => `<tr><td>${s.num}</td><td>${fmt(s.data)}</td><td>${s.humor}</td><td>${s.phq9}${s.phq9 !== "" ? ` <small>${sevPHQ(s.phq9)}</small>` : ""}</td><td>${s.phq9i9}</td><td>${s.gad7}${s.gad7 !== "" ? ` <small>${sevGAD(s.gad7)}</small>` : ""}</td><td>${s.bdi}</td><td>${s.bai}</td></tr>`).join("")}</table></div>`;
}
/* ---------- cadastro ---------- */
function tabCadastro(p) {
  return `<div class="card"><div class="g3">
    ${fld(p, "codigo", "Código / iniciais", "text", { ph: "P07 – M.S." })}${fld(p, "idade", "Idade", "number")}${fld(p, "genero", "Gênero", "text")}
    ${fld(p, "inicio", "Início do acompanhamento", "date")}${fld(p, "contexto", "Contexto", "select", { options: ["Clínica-escola", "Consultório", "Online", "Instituição", "Outro"] })}${fld(p, "supervisor", "Supervisor(a)", "text")}</div>
    ${fld(p, "queixa", "Queixa principal", "area")}
    ${fld(p, "historia", "História / anamnese resumida", "area", { rows: 4 })}
    <div class="g2">${fld(p, "medicacao", "Medicação / acompanhamento psiquiátrico", "area", { rows: 2 })}${fld(p, "metas", "Metas terapêuticas (com o paciente)", "area", { rows: 2 })}</div>
    <div class="f"><span>Demandas (ativam protocolos no Direcionamento)</span>${chips(p.demandas, PROTOCOLOS.map(x => [x.id, x.nome]))}</div>
    ${fld(p, "obs", "Outras observações", "area", { rows: 2 })}
  </div>
  <details class="item"><summary>🗑 Lixeira (${p.lixeira.length}) <span class="sum-meta">· itens excluídos podem ser restaurados</span></summary><div class="body">
  ${p.lixeira.length ? `<ul class="plist">${[...p.lixeira].reverse().map(L => { const it = L.item; const prev = it.num ? `Sessão ${it.num} · ${fmt(it.data)}` : (it.nome || it.texto || it.pa || it.situacao || fmt(it.data) || ""); return `<li class="row" style="justify-content:space-between"><span><b>${esc(LIX_T[L.from] || L.from)}</b> — ${esc(String(prev).slice(0, 80))} <span class="ref">· excluído em ${fmtDT(L.quando)}</span></span><button class="btn sm" data-act="restore" data-v="${L.id}">↩ Restaurar</button></li>`; }).join("")}</ul>` : `<p class="muted">Lixeira vazia.</p>`}</div></details>
  <details class="item"><summary>📜 Histórico de alterações (${p.log.length})</summary><div class="body">
  ${p.log.length ? `<ul class="ref">${[...p.log].reverse().slice(0, 300).map(l => `<li>${fmtDT(l.quando)} — ${esc(l.txt)}</li>`).join("")}</ul>` : `<p class="muted">Nada registrado ainda.</p>`}
  <p class="ref">Qualquer texto pode ser corrigido a qualquer momento: toque no campo e edite — salva sozinho.</p></div></details>
  <button class="btn del" data-act="delP">Excluir paciente</button>`;
}

/* ---------- protocolos e técnicas ---------- */
function pgProtocolos() {
  return `<h1>Protocolos por demanda</h1><p class="muted">Síntese de avaliação, fases de tratamento, técnicas e cuidados, com base em manuais e diretrizes. Toque numa técnica para ver o passo a passo.</p>
  ${PROTOCOLOS.map(pr => `<details class="item"><summary>${esc(pr.nome)} <span class="badge ${pr.cor}">${pr.fases.length} fases</span></summary><div class="body" style="padding-top:12px">${protoCard(pr, new Set(), false)}</div></details>`).join("")}`;
}
function tecHTML(t) {
  if (t.custom) return `<div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(t.nome)}</h2><span class="badge accent">Minha técnica · ${esc(t.ab || "Própria")}</span></div>
    ${t.descricao ? `<p>${nl(t.descricao)}</p>` : `<p class="muted">Sem descrição. Edite em Técnicas → Minhas técnicas.</p>`}
    ${t.passos ? `<ol>${String(t.passos).split("\n").filter(Boolean).map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}
    ${semRef(t) ? `<div class="alert danger">⚠ Sem referência científica. <a href="#" data-act="tecEdit" data-v="${esc(t.id)}">Completar agora</a></div>` : `<b class="ref">Referências</b><p class="ref">${nl(t.refs)}</p>`}`;
  return `<div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(t.nome)}</h2><span class="badge accent">${esc(t.ab)}</span></div>
  <p><b>Quando usar:</b> ${esc(t.ind)}</p><ol>${t.passos.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
  ${t.cuid ? `<div class="alert warn"><b>Cuidado:</b> ${esc(t.cuid)}</div>` : ""}
  <b class="ref">Referências</b>${refList(t.refs)}
  ${t.ficha ? `<button class="btn" data-act="ficha" data-v="${t.ficha}">🖨 Imprimir ficha para o paciente</button>` : ""}`;
}
function pgTecnicas() {
  const mine = DB.tecCustom;
  return `<h1>Técnicas</h1><p class="muted">${TECNICAS.length} técnicas da base + ${mine.length} suas. TCC, terapias comportamentais, mindfulness, ACT, DBT e psicoeducação baseada em neurociência.</p>
  <input id="q" placeholder="🔍 Buscar técnica, indicação ou autor…" style="margin-bottom:10px">
  <div style="margin-bottom:12px"><button class="chip on" data-act="filt" data-v="">Todas</button>${[...ABORDAGENS, "Minhas técnicas"].map(a => `<button class="chip" data-act="filt" data-v="${esc(a)}">${esc(a)}</button>`).join("")}</div>
  <div id="tecList">${TECNICAS.map(t => `<details class="item" data-ab="${esc(t.ab)}" data-txt="${esc(norm(t.nome + " " + t.ind + " " + t.passos.join(" ") + " " + t.refs.map(r => REF[r]).join(" ")))}"><summary>${esc(t.nome)} <span class="badge accent">${esc(t.ab)}</span>${t.ficha ? `<span class="badge">ficha p/ paciente</span>` : ""}</summary><div class="body" style="padding-top:12px">${tecHTML(t)}</div></details>`).join("")}
  ${mine.map(t => { const uses = DB.pacientes.reduce((n, p) => n + p.sessoes.filter(s => s.tecnicas.includes(t.id)).length, 0); return `<details class="item" id="tec-${t.id}" data-ab="Minhas técnicas" data-txt="${esc(norm(t.nome + " " + (t.descricao || "")))}"><summary>${esc(t.nome)} <span class="badge accent">Adicionada por você</span>${semRef(t) ? `<span class="badge danger">⚠ sem referência</span>` : `<span class="badge ok">✓ com referência</span>`}${uses ? `<span class="badge">usada em ${uses} sessão(ões)</span>` : ""}</summary><div class="body" style="padding-top:12px">
    <div class="g2">${fld(t, "nome", "Nome", "text")}${fld(t, "ab", "Abordagem", "select", { options: ["Própria", ...ABORDAGENS] })}</div>${fld(t, "descricao", "Quando usar / descrição", "area")}${fld(t, "passos", "Passo a passo (um por linha)", "area", { rows: 4 })}
    ${fld(t, "refs", "Referências científicas (obrigatório) — autor, ano, obra/artigo", "area", { rows: 3, ph: "Ex.: Beck, J. S. (2022). Terapia cognitivo-comportamental: teoria e prática (3ª ed.). Artmed." })}
    <div class="row"><button class="btn" data-act="tecIA" data-v="${t.id}">🤖 Pedir à IA o embasamento e as referências</button></div>
    <div class="row" style="margin-top:14px">${uses ? `<p class="ref">Usada em sessões — não pode ser excluída (renomeie, se precisar).</p>` : `<button class="btn sm del" data-act="tecDel" data-v="${t.id}">Excluir técnica</button>`}</div></div></details>`; }).join("")}</div>
  <div class="card"><h3>＋ Adicionar técnica</h3><p class="muted" style="margin-top:0">Toda técnica precisa de embasamento científico. Você pode informar a referência agora ou depois — até lá ela aparece com ⚠ e como pendência no paciente.</p>
    <label class="f"><span>Nome da técnica</span><input id="novaTec" placeholder="Ex.: Reestruturação por imagens"></label>
    <label class="f"><span>Referência científica</span><input id="novaTecRef" placeholder="Autor (ano). Obra/artigo."></label>
    <button class="btn pri" data-act="tecAdd">Adicionar</button></div>`;
}
let filtAb = "";
function filterTec() { const q = norm($("#q") ? $("#q").value.trim() : ""); document.querySelectorAll("#tecList>details").forEach(d => { d.style.display = (!filtAb || d.dataset.ab === filtAb) && (!q || d.dataset.txt.includes(q)) ? "" : "none"; }); }
document.addEventListener("input", e => { if (e.target.id === "q") filterTec(); });

/* ---------- literatura científica ---------- */
function refTipo(t) {
  if (/^NICE/.test(t)) return "Diretriz";
  if (/Conselho Federal|Resolução|Brasil\. Lei/.test(t)) return "Norma / lei";
  if (/\d+\(\d+\)|Cochrane|, \d+, \d+|Frontiers/.test(t)) return "Artigo";
  return "Livro / manual";
}
let LIT_IDX = null;
function litIndex() {
  if (LIT_IDX) return LIT_IDX;
  const idx = {}; const add = (k, label, act, v) => { (idx[k] = idx[k] || []).push({ label, act, v }); };
  TECNICAS.forEach(t => t.refs.forEach(k => add(k, t.nome, "showTec", t.id)));
  PROTOCOLOS.forEach(p => p.refs.forEach(k => add(k, p.nome, "showProto", p.id)));
  Object.entries(ESCALAS).forEach(([id, e]) => e.refs.forEach(k => add(k, e.nome.split(" — ")[0], "showEsc", id)));
  return LIT_IDX = idx;
}
const scholar = q => "https://scholar.google.com/scholar?q=" + encodeURIComponent(q);
function litCard(txt, tipo, cites, extra) {
  return `<li class="lit" data-tipo="${esc(tipo)}" data-txt="${esc(norm(txt + " " + (cites || []).map(c => c.label).join(" ") + " " + (extra && extra.notas || "")))}">
    <div>${esc(txt)}</div>
    <div class="row" style="margin-top:6px"><span class="badge accent">${esc(tipo)}</span>${(cites || []).map(c => `<button class="chip" data-act="${c.act}" data-v="${esc(c.v)}">${esc(c.label)}</button>`).join("")}</div>
    ${extra ? extra.html : ""}
    <div class="row" style="margin-top:4px"><a class="btn sm" href="${scholar(txt.slice(0, 220))}" target="_blank" rel="noopener">🔎 Google Acadêmico</a><button class="btn sm" data-act="litIA" data-v="${esc(txt)}">🤖 Resumir com IA</button><button class="btn sm" data-act="litCopy" data-v="${esc(txt)}">Copiar</button></div></li>`;
}
function pgLiteratura() {
  const idx = litIndex(), keys = Object.keys(REF), tipos = ["Livro / manual", "Artigo", "Diretriz", "Norma / lei"];
  DB.literatura = DB.literatura || [];
  const mine = DB.literatura;
  return `<h1>📚 Literatura Científica</h1>
  <p class="muted">As ${keys.length} obras que embasam as técnicas, protocolos e escalas do kit, mais as que você adicionar. Toque no nome de uma técnica para abri-la.</p>
  <div class="alert info" style="font-size:14px">Esta é a bibliografia do kit, não um banco completo de artigos. Para buscar mais: <a href="https://scholar.google.com" target="_blank" rel="noopener">Google Acadêmico</a> · <a href="https://www.scielo.br" target="_blank" rel="noopener">SciELO</a> · <a href="https://pepsic.bvsalud.org" target="_blank" rel="noopener">PePSIC</a> · <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener">PubMed</a> · <a href="https://www.cochranelibrary.com" target="_blank" rel="noopener">Cochrane</a>. Encontrou algo útil? Adicione abaixo, com seu fichamento.</div>
  <input id="litQ" placeholder="🔍 Buscar autor, título, tema ou técnica…" style="margin-bottom:10px">
  <div id="litF" style="margin-bottom:12px"><button class="chip on" data-act="litFilt" data-v="">Todas</button>${[...tipos, "Minhas referências"].map(t => `<button class="chip" data-act="litFilt" data-v="${esc(t)}">${esc(t)}</button>`).join("")}</div>
  <ul class="plist card" id="litList">
  ${mine.map(r => litCard(r.citacao || "(sem citação)", "Minhas referências", [], { notas: r.notas + " " + r.tema, html: `<details style="margin-top:6px"><summary class="ref" style="cursor:pointer">Editar / fichamento</summary>${fld(r, "citacao", "Citação (autor, ano, título, editora/periódico)", "area", { rows: 2 })}<div class="g2">${fld(r, "tema", "Tema", "text")}${fld(r, "link", "Link / DOI", "text")}</div>${fld(r, "notas", "Fichamento / anotações", "area", { rows: 4 })}${r.link ? `<a href="${esc(/^https?:/.test(r.link) ? r.link : "https://doi.org/" + r.link)}" target="_blank" rel="noopener">Abrir link</a>` : ""}<div class="row" style="margin-top:10px"><button class="btn sm del" data-act="litDel" data-v="${r.id}">Excluir referência</button></div></details>` })).join("")}
  ${keys.map(k => litCard(REF[k], refTipo(REF[k]), idx[k] || [])).join("")}</ul>
  <div class="card"><h3>＋ Adicionar referência</h3>
    <label class="f"><span>Citação (autor, ano, título, editora/periódico)</span><textarea id="litNova" rows="2" placeholder="Ex.: Leahy, R. L. (2018). Técnicas de terapia cognitiva (2ª ed.). Artmed."></textarea></label>
    <label class="f"><span>Tema</span><input id="litTema" placeholder="Ex.: ansiedade, luto, TDAH…"></label>
    <button class="btn pri" data-act="litAdd">Adicionar</button></div>`;
}
let litF = "";
function filterLit() { const q = norm($("#litQ") ? $("#litQ").value.trim() : ""); document.querySelectorAll("#litList>li").forEach(li => { li.style.display = (!litF || li.dataset.tipo === litF) && (!q || li.dataset.txt.includes(q)) ? "" : "none"; }); }
document.addEventListener("input", e => { if (e.target.id === "litQ") filterLit(); });

/* ---------- ética ---------- */
function pgEtica() {
  const sec = (t, items, refs) => `<div class="card"><h3>${t}</h3><ul>${items.map(x => `<li>${x}</li>`).join("")}</ul>${refs ? refList(refs) : ""}</div>`;
  return `<h1>Ética e normas do CFP</h1>
  <div class="alert info">O CFP regula a <b>ética e a documentação</b> do trabalho do psicólogo; ele não publica protocolos de técnicas por transtorno. Os protocolos clínicos deste kit vêm da literatura científica e de diretrizes (manuais de referência, metanálises, NICE). Use-os sempre com supervisão e julgamento clínico.</div>
  ${sec("Sigilo e quebra de sigilo", ["Sigilo protege a intimidade das pessoas atendidas (art. 9º).", "Em conflito entre sigilo e proteção (ex.: risco de vida), a decisão busca o menor prejuízo e a quebra se restringe ao estritamente necessário (art. 10).", "Atendimento de criança/adolescente: comunicar aos responsáveis apenas o necessário (art. 13).", "Supervisores devem orientar e exigir dos estudantes a observância do Código (art. 17)."], ["CE"])}
  ${sec("Registro documental (prontuário)", ["O registro documental dos serviços prestados é obrigatório.", "Guarda mínima de 5 anos; a pessoa atendida tem direito de acesso ao registro.", "Na clínica-escola, siga as regras do serviço — <b>este kit é apoio pessoal e não substitui o prontuário oficial</b>.", "Documentos escritos (declaração, atestado, relatório, laudo, parecer) seguem a Res. 06/2019."], ["R0109", "R0619"])}
  ${sec("Gravação de sessões", ["Só grave com consentimento livre e esclarecido, preferencialmente por escrito, informando finalidade, quem terá acesso e por quanto tempo será guardado.", "A paciente pode recusar ou retirar o consentimento a qualquer momento, sem prejuízo do atendimento.", "Siga as regras da clínica-escola e da supervisão sobre gravações."], ["CE", "LGPD"])}
  ${sec("Estágio e supervisão", ["Todo atendimento de estagiário ocorre sob supervisão de psicólogo(a) responsável.", "Situações de risco devem ser comunicadas ao supervisor imediatamente."], ["L11788", "CE"])}
  ${sec("Atendimento online", ["Atendimento por meios digitais exige cadastro do profissional no e-Psi e atenção à segurança e ao sigilo da plataforma."], ["R1118"])}
  ${sec("Testes e escalas", ["Para avaliação psicológica, usar apenas testes com parecer favorável no SATEPSI (alguns são de uso restrito, ex.: BDI-II, BAI).", "Escalas de rastreio de domínio público (PHQ-9, GAD-7) podem ser usadas para monitoramento, sem caráter de diagnóstico isolado."], ["R3122", "KROENKE", "SPITZER"])}
  ${sec("Proteção de dados (LGPD) e IA", ["Dados de saúde são dados pessoais sensíveis.", "Minimização: registre só o necessário; use código/iniciais em vez do nome.", "Este kit criptografa tudo (AES-256) antes de salvar — no Drive fica apenas um arquivo ilegível sem a senha.", "Ao usar a IA, o resumo enviado leva só o código do paciente; mesmo assim, evite escrever nomes e dados identificáveis nas anotações."], ["LGPD"])}
  ${sec("Suicídio e autolesão", ["Política Nacional de Prevenção da Automutilação e do Suicídio: casos suspeitos ou confirmados de violência autoprovocada são de notificação compulsória pelos serviços de saúde.", "CVV 188 · SAMU 192 · CAPS."], ["L13819", "CFP13"])}
  <p class="ref">Este resumo é material de estudo. Confira o texto integral das resoluções em site.cfp.org.br e as edições das obras citadas.</p>`;
}

/* ---------- dados, sincronização e configurações ---------- */
function syncRows() {
  const lbl = { ok: "✓ em dia", pend: "⏳ pendente", err: "⚠ erro", disc: "⚠ desconectado", off: "— desligado" };
  const n = docsPendDrive();
  return `<table class="t">
  <tr><td>💾 Neste aparelho (criptografado)</td><td><span class="badge ${SYNC.local.st === "ok" ? "ok" : SYNC.local.st === "err" ? "danger" : "warn"}">${lbl[SYNC.local.st]}</span> ${hhmm(SYNC.local.t)}</td></tr>
  <tr><td>☁ Google Drive${GDrive.email ? ` <span class="ref">(${esc(GDrive.email)})</span>` : ""}</td><td><span class="badge ${!DB.config.driveOn ? "" : SYNC.drive.st === "ok" && !n ? "ok" : SYNC.drive.st === "pend" ? "warn" : "danger"}">${DB.config.driveOn ? lbl[SYNC.drive.st] || SYNC.drive.st : lbl.off}</span> ${hhmm(SYNC.drive.t)}${DB.config.driveOn && n ? ` · ${n} anexo(s) a enviar` : ""}${SYNC.drive.msg && SYNC.drive.st !== "ok" ? `<div class="ref">${esc(SYNC.drive.msg)}</div>` : ""}</td></tr>
  <tr><td>📁 Pasta vinculada${Folder.dir ? ` <span class="ref">(${esc(Folder.dir.name)})</span>` : ""}</td><td><span class="badge ${SYNC.pasta.st === "ok" ? "ok" : SYNC.pasta.st === "off" ? "" : "danger"}">${lbl[SYNC.pasta.st]}</span> ${hhmm(SYNC.pasta.t)}${SYNC.pasta.msg && SYNC.pasta.st !== "ok" ? `<div class="ref">${esc(SYNC.pasta.msg)}</div>` : ""}</td></tr>
  <tr><td>🗂 Versões automáticas neste aparelho</td><td><span class="badge ok">✓ ativo</span> <span class="ref">a cada 15 min de uso</span></td></tr>
  <tr><td>📦 Último backup completo baixado</td><td>${DB.config.ultimoBackup ? fmtDT(DB.config.ultimoBackup) : `<span class="badge warn">nunca</span>`}</td></tr></table>`;
}
function showFlagDlg() {
  const d = $("#dlg");
  d.innerHTML = `<h2 style="margin-top:0">Situação do salvamento</h2>${syncRows()}
  <div class="row" style="margin-top:12px">${DB.config.driveOn && !GDrive.live() ? `<button class="btn pri" data-act="gConnect">Reconectar Google</button>` : ""}${DB.config.driveOn && GDrive.live() ? `<button class="btn pri" data-act="syncNow">Sincronizar agora</button>` : ""}${!DB.config.driveOn ? `<button class="btn pri" data-act="nav" data-v="config">⚙ Configurar Google Drive</button>` : ""}${Folder.dir && SYNC.pasta.st === "disc" ? `<button class="btn" data-act="folderPerm">Renovar permissão da pasta</button>` : ""}<span class="sp"></span><button class="btn" data-act="closeDlg">Fechar</button></div>`;
  d.showModal();
}
function pgDados() {
  const nP = DB.pacientes.length, nS = DB.pacientes.reduce((a, p) => a + p.sessoes.length, 0), nD = allDocs().length, cfg = DB.config;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  return `<h1>Dados e backup</h1>
  <div class="card"><h3>Situação do salvamento</h3><p class="muted" style="margin-top:0">${nP} paciente(s) · ${nS} sessão(ões) · ${nD} anexo(s)</p>${syncRows()}
    <div class="row" style="margin-top:10px">${cfg.driveOn && GDrive.live() ? `<button class="btn" data-act="syncNow">Sincronizar agora</button>` : ""}${!cfg.driveOn ? `<button class="btn pri" data-act="nav" data-v="config">⚙ Configurar Google Drive</button>` : ""}</div></div>

  <div class="card"><h3>🗂 Versões automáticas</h3><p style="margin-top:0" class="muted">O kit guarda versões anteriores neste aparelho (a cada 15 min de uso, mais uma por dia). Restaurar não apaga nada: a versão atual também vira uma versão.</p>
    <div id="snapList"><button class="btn" data-act="snapLoad">Ver versões</button></div></div>

  <div class="card"><h3>📦 Backup completo e importação</h3><p class="muted" style="margin-top:0">O backup completo inclui todos os anexos e gravações (criptografados). Guarde uma cópia de vez em quando num pendrive ou e-mail para você.</p>
    <div class="row"><button class="btn" data-act="exportFull">📦 Baixar backup completo</button><button class="btn" data-act="importFile">⬆ Importar backup / arquivo .tcc</button></div></div>

  ${DB.lixeira.length ? `<div class="card"><h3>🗑 Pacientes excluídos (${DB.lixeira.length})</h3><ul class="plist">${DB.lixeira.map(L => `<li class="row" style="justify-content:space-between"><span><b>${esc(L.item.codigo || "(sem código)")}</b> <span class="ref">· ${L.item.sessoes.length} sessão(ões) · excluído em ${fmtDT(L.quando)}</span></span><button class="btn sm" data-act="restoreP" data-v="${L.id}">↩ Restaurar</button></li>`).join("")}</ul></div>` : ""}
  <p class="ref">Kit Clínico TCC v${APP_VER}</p>`;
}
function pgConfig() {
  const cfg = DB.config, ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  return `<h1>⚙ Configurações</h1>
  <div class="card"><h3>☁ Google Drive — salvar tudo online (recomendado)</h3>
    <p style="margin-top:0">Cada alteração e cada anexo vão direto para a pasta <b>“Kit TCC - Backups”</b> no seu Drive, criptografados. O Drive guarda também uma cópia por dia (histórico). Em outro aparelho, use “Entrar com Google” na tela de bloqueio.</p>
    ${!GDrive.originOk() ? `<div class="alert warn">O login com Google só funciona com o kit aberto por um endereço <b>https</b> (por exemplo, publicado no GitHub Pages). Aberto como arquivo, use a <b>pasta vinculada</b> abaixo.</div>` : ""}
    <label class="f"><span>Client ID do Google (já vem preenchido — não precisa mexer)</span><input id="gcid" value="${esc(GDrive.clientId())}" placeholder="xxxxxxxx.apps.googleusercontent.com"><small>Criado no Google Cloud Console → APIs e serviços → Credenciais → ID do cliente OAuth (aplicativo da Web), com a origem <code>${esc(location.origin)}</code> autorizada e a Google Drive API ativada.</small></label>
    <div class="row"><button class="btn" data-act="gSaveCid">Salvar Client ID</button>
    ${cfg.driveOn ? (GDrive.live() ? `<span class="badge ok">conectado${GDrive.email ? " · " + esc(GDrive.email) : ""}</span><button class="btn" data-act="gPullAll">⬇ Baixar todos os anexos para este aparelho</button><button class="btn del" data-act="gOff">Desligar sincronização</button>` : `<button class="btn pri" data-act="gConnect">Reconectar Google</button><button class="btn del" data-act="gOff">Desligar</button>`) : `<button class="btn pri" data-act="gConnect" ${GDrive.clientId() && GDrive.originOk() ? "" : "disabled"}>☁ Entrar com Google</button>`}</div></div>

  <div class="card"><h3>📁 Pasta vinculada (computador)</h3>
    ${Folder.supported() ? `<p style="margin-top:0">Escolha uma pasta — por exemplo dentro do <b>Google Drive para computador</b> ou do OneDrive. O kit grava ali o cofre, os anexos e uma cópia por dia.</p>
    <div class="row"><button class="btn" data-act="folderPick">${Folder.dir ? "Trocar pasta" : "Escolher pasta"}</button>${Folder.dir ? `<span class="badge">${esc(Folder.dir.name)}</span><button class="btn" data-act="folderPerm">Renovar permissão</button><button class="btn del" data-act="folderOff">Desvincular</button>` : ""}</div>` : `<p class="muted" style="margin:0">Não disponível neste navegador (no celular, use o Google Drive acima).</p>`}</div>

  <div class="card"><h3>🔑 Senha e recuperação</h3>
    <div class="g3"><label class="f"><span>Senha atual</span><input type="password" id="pw0" autocomplete="current-password"></label><label class="f"><span>Nova senha</span><input type="password" id="np1" autocomplete="new-password"></label><label class="f"><span>Repita</span><input type="password" id="np2" autocomplete="new-password"></label></div>
    <div class="row"><button class="btn" data-act="chpw">Trocar senha</button><span id="chmsg" class="muted"></span></div>
    <hr><p style="margin-top:0">Código de recuperação criado em <b>${fmtDT(Vault.HDR && Vault.HDR.recCriado)}</b>. Se perdeu o código, gere um novo (o antigo deixa de valer).</p>
    <button class="btn" data-act="newRec">Gerar novo código de recuperação</button></div>

  <div class="card"><h3>🤖 Assistente de IA (Claude)</h3>
    <p style="margin-top:0" class="muted">A chave fica guardada dentro do cofre criptografado e é enviada apenas à API da Anthropic. Crie uma em console.anthropic.com → API Keys.</p>
    <div class="g2">${fld(cfg, "aiKey", "Chave da API (sk-ant-…)", "password", { ph: "sk-ant-..." })}${fld(cfg, "aiModel", "Modelo", "select", { options: IA_MODELOS })}</div>
    <div class="row"><button class="btn" data-act="iaToggle">Abrir o assistente</button></div></div>

  <div class="card"><h3>📲 Instalar no celular</h3>
    ${DEFER_INSTALL ? `<button class="btn pri" data-act="install">Instalar o Kit como app</button>` : ios ? `<p style="margin:0">No iPhone: toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>.</p>` : `<p style="margin:0">No Android (Chrome): menu ⋮ → <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>. Requer o kit aberto por endereço https.</p>`}
    <p class="ref">Instalado, o kit abre como app e funciona sem internet (a sincronização acontece quando a conexão voltar).</p></div>

  <div class="card"><h3>🎨 Aparência e uso</h3><div class="g3">
    ${fld(cfg, "tema", "Tema", "select", { id: "cfgTema", options: [["", "Automático (do aparelho)"], ["light", "Claro"], ["dark", "Escuro"]] })}
    ${fld(cfg, "fonte", "Tamanho do texto", "select", { id: "cfgFonte", options: [["", "Normal"], ["g", "Grande"], ["gg", "Maior"]] })}
    ${fld(cfg, "bloqueioMin", "Bloquear sozinho após", "select", { options: [["", "20 minutos (padrão)"], ["5", "5 minutos"], ["10", "10 minutos"], ["30", "30 minutos"], ["60", "1 hora"]] })}</div>
    ${fld(cfg, "supPadrao", "Supervisor(a) padrão para novos pacientes", "text")}
    ${fld(cfg, "transcrPadrao", "Deixar “Transcrever ao vivo” marcado por padrão ao gravar", "check")}
    <p class="ref">O kit sempre salva sozinho; a exclusão sempre pede confirmação dupla.</p></div>
  <p class="ref">Kit Clínico TCC v${APP_VER}</p>`;
}
function applyPrefs() {
  const c = (DB && DB.config) || {};
  if (c.tema) document.documentElement.dataset.theme = c.tema; else delete document.documentElement.dataset.theme;
  document.body.classList.toggle("fs-g", c.fonte === "g"); document.body.classList.toggle("fs-gg", c.fonte === "gg");
}
document.addEventListener("change", e => { if (["cfgTema", "cfgFonte"].includes(e.target.id)) applyPrefs(); });
async function snapLoad() {
  const box = $("#snapList"); box.innerHTML = "Carregando…";
  const list = (await Store.snaps()).slice(0, 60);
  box.innerHTML = list.length ? `<ul class="plist">${list.map(x => `<li class="row" style="justify-content:space-between"><span>${fmtDT(new Date(x.value.t).toISOString())} <span class="ref">· ${esc(x.value.motivo)}${x.value.diaria ? " · diária" : ""} · ${fmtSize(x.value.blob.length)}</span></span><span class="row"><button class="btn sm" data-act="snapRestore" data-v="${x.key}">↩ Restaurar</button><button class="btn sm" data-act="snapDown" data-v="${x.key}">⬇</button></span></li>`).join("")}</ul>` : `<p class="muted">Nenhuma versão ainda.</p>`;
}
async function exportFull() {
  setFlagMsg("Preparando backup…");
  if (saveT || saving) await save();
  const files = {}; for (const id of await IDB.keys("files")) { const r = await IDB.get("files", id); files[id] = { iv: b64(r.iv), data: b64(r.data) }; }
  const out = JSON.stringify({ app: "kit-tcc-backup", v: 2, criado: nowISO(), vault: LAST_BLOB || await Vault.encrypt(DB), files });
  download(`kit-tcc-backup-completo-${today()}.tcc`, out);
  DB.config.ultimoBackup = nowISO(); touch();
}

/* ============================== impressão ============================== */
function printDoc(title, html, who) {
  $("#print").innerHTML = `<h1>${esc(title)}</h1>${who ? `<p>${esc(who)} · ${fmt(today())}</p>` : ""}${html}<div class="foot">Kit Clínico TCC — material de apoio terapêutico.</div>`;
  window.print();
}
const FICHA_T = { rpd: "Registro de Pensamentos (RPD)", distorcoes: "Distorções cognitivas", modelo: "O modelo cognitivo", aware: "Quando a ansiedade vier: A.W.A.R.E.", respiracao: "Respiração diafragmática", neuro: "Entendendo a ansiedade", sono: "Reeducação do sono", cartao: "Cartões de enfrentamento", seta: "Seta descendente", atividades: "Monitoramento e agenda de atividades", mindfulness: "Atenção plena", tipp: "Habilidades para crises", plano: "Meu plano de segurança" };

/* ============================== ações ============================== */
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); if (DB) save(); }
  if (e.key === "Enter" && e.target.id === "novoAb") { e.preventDefault(); $('[data-act="addAb"]').click(); }
  if (e.key === "Enter" && e.target.id === "novaTec") { e.preventDefault(); $('[data-act="tecAdd"]').click(); }
  if (e.key === "Enter" && ["pw", "pw2", "rc"].includes(e.target.id)) { const b = $('[data-act="unlock"],[data-act="create"],[data-act="recover"]'); if (b) b.click(); }
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && e.target.id === "iaIn") { e.preventDefault(); iaEnviar(); }
});
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const a = el.dataset.act, v = el.dataset.v, p = DB ? P() : null;
  if (el.tagName === "A" && el.getAttribute("href") === "#") e.preventDefault();
  const go = () => { V._keepScroll = true; render(); };
  const dlg = $("#dlg");
  try {
  switch (a) {
    case "unlock": await doUnlock(); break;
    case "create": await doCreate(); break;
    case "recover": await doRecover(); break;
    case "lockMode": LOCK_MODE = v; LOCK_MSG = ""; render(); break;
    case "openFile": await doOpenFile(); break;
    case "gLoginLock": await gLoginLock(); break;
    case "gCfgLock": { const id = prompt("Cole o Client ID do Google (termina em .apps.googleusercontent.com):", GDrive.clientId()); if (id != null) { lsSet("kitTCC.gClientId", id.trim()); render(); } break; }
    case "lock": await lock(); break;
    case "nav": if (dlg.open) dlg.close(); V.page = v; render(); break;
    case "openP": V.page = "paciente"; V.pid = v; V.tab = "direcao"; render(); break;
    case "tab": V.tab = v; render(); break;
    case "saveNow": el.disabled = true; await save(); await syncExternal(); el.disabled = false; break;
    case "flag": showFlagDlg(); break;
    case "syncNow": await save(); await syncExternal(); if (dlg.open) showFlagDlg(); else go(); break;
    case "newP": { const np = novoPaciente(); np.supervisor = DB.config.supPadrao || ""; logP(np, "Paciente criado"); DB.pacientes.push(np); touch(); V.page = "paciente"; V.pid = np.id; V.tab = "dados"; render(); break; }
    case "delP": if (await confirmDel(`o paciente <b>${esc(p.codigo || "(sem código)")}</b> (vai para “Pacientes excluídos” em Dados e backup)`)) { DB.pacientes.splice(DB.pacientes.indexOf(p), 1); logP(p, "Paciente excluído"); DB.lixeira.push({ id: uid(), quando: nowISO(), item: p }); touch(); V.page = "pacientes"; render(); } break;
    case "restoreP": { const L = DB.lixeira.find(x => x.id === v); DB.lixeira.splice(DB.lixeira.indexOf(L), 1); if (L.tipo === "literatura") { DB.literatura.unshift(L.item._lit); touch(); go(); break; } fill(L.item, novoPaciente()); logP(L.item, "Paciente restaurado da lixeira"); DB.pacientes.push(L.item); touch(); go(); break; }
    case "newS": { const ns = novaSessao(p); p.sessoes.push(ns); logP(p, `Sessão ${ns.num} criada`); touch(); V.tab = "sessoes"; render(); break; }
    case "newRPD": p.rpd.push({ id: uid(), data: today(), situacao: "", pa: "", credPA: "", emocao: "", intens: "", distorcao: "", resposta: "", credResp: "", resultado: "" }); touch(); go(); break;
    case "newSeta": p.setas.push({ id: uid(), data: today(), pa: "", passos: ["", ""], crenca: "", cat: "" }); touch(); go(); break;
    case "addPasso": p.setas.find(x => x.id === v).passos.push(""); touch(); go(); break;
    case "newAware": p.aware.push({ id: uid(), data: today(), situacao: "", antes: "", depois: "", aceitar: "", observar: "", agir: "", esperar: "" }); touch(); go(); break;
    case "newRisk": p.risco.avaliacoes.push({ id: uid(), data: today(), ideacao: "", plano: "", meios: "", tentativas: "", fr: "", fp: "", cssrs: "", nivel: "", conduta: "", supInfo: false, famInfo: false }); touch(); go(); break;
    case "del": {
      const arr = R[el.dataset.o], i = arr.findIndex(x => x.id === v), from = el.dataset.from;
      if (i >= 0 && await confirmDel(`este item (${esc((LIX_T[from] || from).toLowerCase())})`)) {
        const [it] = arr.splice(i, 1); p.lixeira.push({ id: uid(), from, quando: nowISO(), item: it });
        logP(p, `${LIX_T[from] || from} excluído(a) → lixeira`); touch(); go();
      } break;
    }
    case "restore": {
      const L = p.lixeira.find(x => x.id === v), arr = L.from.split(".").reduce((o, k) => o[k], p);
      arr.push(L.item); if (L.from === "sessoes") arr.sort((x, y) => x.num - y.num);
      p.lixeira.splice(p.lixeira.indexOf(L), 1); logP(p, `${LIX_T[L.from] || L.from} restaurado(a) da lixeira`); touch(); go(); break;
    }
    case "toggle": { const arr = R[el.dataset.o], i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); el.classList.toggle("on"); touch(); break; }
    case "pendSt": { const k = el.dataset.k, r = p.pend[k], para = r.status === v ? "" : v; r.hist.push({ quando: nowISO(), de: r.status, para, nota: r.nota }); r.status = para; logP(p, `Lembrete “${(PT[k] || k).slice(0, 90)}” → ${pendLbl(para)}${r.nota ? " (" + r.nota + ")" : ""}`); touch(); go(); break; }
    case "pendArq": { const k = el.dataset.k, r = p.pend[k]; r.hist.push({ quando: nowISO(), de: r.status, para: "arquivado", nota: r.nota }); r.status = "arquivado"; logP(p, `Lembrete arquivado: “${(PT[k] || k).slice(0, 90)}”${r.nota ? " — " + r.nota : ""}`); touch(); go(); break; }
    case "pendAb": { const t = PT[el.dataset.k] || ""; p.abordar.push({ id: uid(), texto: t, status: "aberto", criado: nowISO(), nota: "", sessao: "" }); logP(p, `Para abordar: “${t.slice(0, 90)}” (das pendências)`); touch(); go(); break; }
    case "addAb": { const i = $("#novoAb"), t = i.value.trim(); if (!t) { i.focus(); break; } p.abordar.push({ id: uid(), texto: t, status: "aberto", criado: nowISO(), nota: "", sessao: "" }); logP(p, `Para abordar: “${t.slice(0, 90)}”`); touch(); go(); break; }
    case "abSt": { const it = p.abordar.find(x => x.id === v), s = el.dataset.s; it.status = s; it.sessao = s === "abordado" && p.sessoes.length ? p.sessoes.at(-1).num : ""; logP(p, `Item “${it.texto.slice(0, 90)}” → ${AB_ST.find(x => x[0] === s)[1]}`); touch(); go(); break; }
    /* técnicas */
    case "tpAll": { const sid = el.dataset.sid; TP_OPEN.has(sid) ? TP_OPEN.delete(sid) : TP_OPEN.add(sid); tpRefresh(sid); break; }
    case "tpAdd": { const s = p.sessoes.find(x => x.id === el.dataset.sid); if (!s.tecnicas.includes(v)) s.tecnicas.push(v); touch(); tpRefresh(s.id); break; }
    case "tpRem": { const s = p.sessoes.find(x => x.id === el.dataset.sid); const i = s.tecnicas.indexOf(v); if (i >= 0) s.tecnicas.splice(i, 1); touch(); tpRefresh(s.id); break; }
    case "tpNew": { const box = el.closest(".tp"), q = box.querySelector(".tp-q"), nome = q.value.trim(); if (!nome) break; const t = { id: "c_" + uid(), nome, ab: "Própria", custom: true, descricao: "", passos: "", refs: "" }; DB.tecCustom.push(t); const s = p.sessoes.find(x => x.id === el.dataset.sid); s.tecnicas.push(t.id); q.value = ""; logP(p, `Técnica própria criada: ${nome}`); touch(); tpRefresh(s.id); break; }
    case "tecAdd": { const i = $("#novaTec"), nome = i.value.trim(); if (!nome) { i.focus(); break; } const id = "c_" + uid(); DB.tecCustom.push({ id, nome, ab: "Própria", custom: true, descricao: "", passos: "", refs: ($("#novaTecRef").value || "").trim() }); touch(); go(); setTimeout(() => { const d = document.getElementById("tec-" + id); if (d) { d.open = true; d.scrollIntoView({ block: "center" }); } }, 50); break; }
    case "tecDel": if (await confirmDel("esta técnica")) { DB.tecCustom.splice(DB.tecCustom.findIndex(t => t.id === v), 1); touch(); go(); } break;
    case "tecEdit": if (dlg.open) dlg.close(); V.page = "tecnicas"; render(); setTimeout(() => { const d = document.getElementById("tec-" + v); if (d) { d.open = true; d.scrollIntoView({ block: "center" }); } }, 50); break;
    case "tecIA": { const t = tecById(v); iaToggle(true); await iaEnviar(`Registrei uma técnica chamada “${t.nome}”${t.descricao ? ` (descrição: ${t.descricao})` : ""}${t.passos ? `\nPassos: ${t.passos}` : ""}.\n\nEla corresponde a alguma técnica descrita na literatura científica? Indique: nome técnico usado na literatura, abordagem, mecanismo proposto, nível de evidência e as principais referências (autor, ano, obra ou artigo, com DOI quando houver). Se não houver embasamento científico, diga isso claramente e sugira a técnica com evidência mais próxima.`); break; }
    case "showTec": dlg.innerHTML = tecHTML(tecById(v)) + `<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-act="closeDlg">Fechar</button></div>`; dlg.showModal(); break;
    case "showProto": dlg.innerHTML = protoCard(PRO[v], new Set(), false) + `<div class="row" style="justify-content:flex-end"><button class="btn" data-act="closeDlg">Fechar</button></div>`; dlg.showModal(); break;
    case "showEsc": dlg.innerHTML = escHTML(v) + `<div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-act="closeDlg">Fechar</button></div>`; dlg.showModal(); break;
    case "closeDlg": dlg.close(); break;
    case "filt": filtAb = v; el.parentElement.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === el)); filterTec(); break;
    /* impressão */
    case "ficha": printDoc(FICHA_T[v] || "Ficha", FICHAS[v](), ""); break;
    case "printPlano": printDoc("Meu plano de segurança", FICHAS.plano(p.risco.plano), p.codigo); break;
    case "printDCC": {
      const c = p.conc, row = (t, x) => `<tr><th style="width:30%">${t}</th><td>${nl(x)}</td></tr>`;
      printDoc("Diagrama de conceituação cognitiva", `<table>${row("Dados relevantes da história", c.infancia)}${row("Crença(s) central(is)", c.crencaCentral + (c.categoria ? ` (${c.categoria})` : ""))}${row("Crenças intermediárias", c.regras)}${row("Estratégias compensatórias", c.estrategias)}</table>
      <table><tr><th></th>${c.situacoes.map((_, i) => `<th>Situação ${i + 1}</th>`).join("")}</tr>${[["situacao", "Situação"], ["pa", "Pensamento automático"], ["significado", "Significado do PA"], ["emocao", "Emoção"], ["comportamento", "Comportamento"]].map(([k, t]) => `<tr><th>${t}</th>${c.situacoes.map(s => `<td>${nl(s[k])}</td>`).join("")}</tr>`).join("")}</table>
      <h3>Tríade cognitiva</h3><table>${row("Eu", c.eu)}${row("Mundo / outros", c.mundo)}${row("Futuro", c.futuro)}</table>`, p.codigo); break;
    }
    /* documentos */
    case "upDoc": case "upCam": UP_CTX = { pid: p.id, sid: v || "" }; { const inp = $(a === "upCam" ? "#camIn" : "#upIn"); inp.onchange = async () => { const fs = [...inp.files]; inp.value = ""; if (fs.length) await handleUpload(fs); }; inp.click(); } break;
    case "docVer": await docVer(v); break;
    case "docBaixar": await docBaixar(v); break;
    /* gravação */
    case "recStart": recConsent(v); break;
    case "recGo": { const tr = $("#rcTr").checked; dlg.close(); await recStart(v, tr); break; }
    case "recPause": recPause(); break;
    case "recStop": await recStop(); break;
    /* IA */
    case "iaToggle": iaToggle(); break;
    case "iaFechar": iaToggle(false); break;
    case "iaNova": iaNova(); touch(); iaRender(); break;
    case "iaEnviar": await iaEnviar(); break;
    case "iaSug": await iaEnviar(v); break;
    case "iaParar": if (IA.stream) IA.stream.abort(); break;
    case "iaPerg": iaToggle(true); await iaEnviar(v); break;
    case "iaResumo": { const s = p.sessoes.find(x => x.id === v); iaToggle(true); await iaEnviar(`Abaixo está a transcrição automática da sessão ${s.num} (pode ter erros de reconhecimento de voz). Organize em tópicos: checagem de humor, ponte, agenda, temas discutidos, pensamentos automáticos identificados (com emoções), técnicas usadas, tarefa combinada, pontos de atenção/risco e sugestões para a próxima sessão.\n\nTRANSCRIÇÃO:\n${s.transcricao}`); break; }
    case "iaCopiar": { const c = iaCurrent(), m = c && c.msgs[Number(v)]; if (m) { try { await navigator.clipboard.writeText(m.text); el.textContent = "Copiado ✓"; } catch (x) { alert("Não foi possível copiar."); } } break; }
    case "iaAbordar": { const c = iaCurrent(), m = c && c.msgs[Number(v)]; if (m && p) { const t = prompt("Texto do item para abordar (edite se quiser):", m.text.replace(/[#*`]/g, "").slice(0, 300)); if (t) { p.abordar.push({ id: uid(), texto: t, status: "aberto", criado: nowISO(), nota: "", sessao: "" }); logP(p, "Para abordar (sugestão da IA)"); touch(); go(); } } else if (!p) alert("Abra um paciente para usar a lista Para abordar."); break; }
    /* Drive, pasta, backup */
    case "gSaveCid": lsSet("kitTCC.gClientId", $("#gcid").value.trim()); go(); break;
    case "gConnect": if (dlg.open) dlg.close(); await gConnect(); break;
    case "gOff": if (await ask("Desligar a sincronização com o Google Drive? Os dados continuam neste aparelho e no Drive, mas novas alterações não serão enviadas.", "Desligar", "pos-top", false)) { DB.config.driveOn = false; GDrive.logout(); SYNC.drive = { st: "off", t: 0 }; touch(); go(); } break;
    case "gPullAll": { let n = 0; for (const d of allDocs()) { if (!(await Store.getFileEnc(d.id))) { const raw = await GDrive.pullFile(d.id); if (raw) { await Store.putFileEnc(d.id, unpackEnc(raw)); n++; } } } alert(`${n} anexo(s) baixado(s) para este aparelho.`); break; }
    case "folderPick": try { await Folder.pick(); await syncExternal(); go(); } catch (x) {} break;
    case "folderPerm": if (await Folder.ok(true)) { await syncExternal(); } if (dlg.open) showFlagDlg(); else go(); break;
    case "folderOff": await Folder.unlink(); SYNC.pasta = { st: "off", t: 0 }; go(); break;
    case "exportFull": await exportFull(); break;
    case "importFile": { const inp = $("#fileIn"); inp.onchange = async () => { const f = inp.files[0]; inp.value = ""; if (f) try { await importBlobText(await f.text(), false); } catch (x) { alert("Arquivo inválido: " + x.message); } }; inp.click(); break; }
    case "snapLoad": await snapLoad(); break;
    case "snapDown": { const s = (await Store.snaps()).find(x => String(x.key) === v); if (s) download(`kit-tcc-versao-${new Date(s.value.t).toISOString().slice(0, 16).replace(/[:T]/g, "-")}.tcc`, s.value.blob); break; }
    case "snapRestore": {
      const s = (await Store.snaps()).find(x => String(x.key) === v); if (!s) break;
      let db; try { db = await Vault.decryptWithDEK(s.value.blob); } catch (x) { alert("Esta versão foi criada com outra chave (outro cofre ou versão antiga). Baixe-a (⬇) e use “Importar backup”."); break; }
      if (!confirm(`Restaurar a versão de ${fmtDT(new Date(s.value.t).toISOString())}? A versão atual fica guardada.`)) break;
      await Store.snap(LAST_BLOB || await Vault.encrypt(DB), true, "antes de restaurar versão"); DB = db; normDB(); await save(); render(); alert("Versão restaurada."); break;
    }
    /* senha */
    case "chpw": {
      const m = $("#chmsg"), a0 = $("#pw0").value, a1 = $("#np1").value, a2 = $("#np2").value;
      if (!(await Vault.checkPassword(a0))) { m.textContent = "Senha atual incorreta."; break; }
      if (a1.length < 8) { m.textContent = "Mínimo 8 caracteres."; break; } if (a1 !== a2) { m.textContent = "As senhas não conferem."; break; }
      await Vault.setPassword(a1); await save(); m.textContent = "Senha trocada ✓ (o código de recuperação continua o mesmo)"; $("#pw0").value = $("#np1").value = $("#np2").value = ""; break;
    }
    case "newRec": if (confirm("Gerar um novo código de recuperação? O código antigo deixará de funcionar.")) { const code = await Vault.newRecovery(); await save(); showRecovery(code); } break;
    case "recCopy": try { await navigator.clipboard.writeText(v); el.textContent = "Copiado ✓"; } catch (x) {} break;
    case "recTxt": download("kit-tcc-codigo-de-recuperacao.txt", `Kit Clínico TCC — código de recuperação\n\n${v}\n\nGerado em ${fmtDT(nowISO())}. Guarde em local seguro.`, "text/plain"); break;
    case "recPrint": printDoc("Código de recuperação — Kit Clínico TCC", `<p style="font:20pt monospace;letter-spacing:2px">${esc(v)}</p><p>Gerado em ${fmtDT(nowISO())}. Use este código se esquecer a senha do cofre. Guarde em local seguro.</p>`, ""); break;
    case "recClose": dlg.dataset.locked = ""; dlg.close(); DB.config.recConfirmado = true; touch(); break;
    case "litFilt": litF = v; el.parentElement.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === el)); filterLit(); break;
    case "litAdd": { const c = $("#litNova").value.trim(); if (!c) { $("#litNova").focus(); break; } DB.literatura.unshift({ id: uid(), citacao: c, tema: $("#litTema").value.trim(), link: "", notas: "", criado: nowISO() }); touch(); go(); break; }
    case "litDel": if (await confirmDel("esta referência")) { const i = DB.literatura.findIndex(r => r.id === v); DB.lixeira.push({ id: uid(), quando: nowISO(), tipo: "literatura", item: Object.assign({ codigo: "Referência: " + DB.literatura[i].citacao.slice(0, 40), sessoes: [], docs: [] }, { _lit: DB.literatura[i] }) }); DB.literatura.splice(i, 1); touch(); go(); } break;
    case "litCopy": try { await navigator.clipboard.writeText(v); el.textContent = "Copiado ✓"; } catch (x) {} break;
    case "litIA": iaToggle(true); await iaEnviar(`Explique de forma objetiva esta obra/artigo: principais ideias ou achados, método (se for estudo), nível de evidência, limitações e como aplicar na prática clínica de um(a) estagiário(a) em TCC. Se você não conhecer bem a obra, diga isso.\n\nReferência: ${v}`); break;
    case "install": if (DEFER_INSTALL) { DEFER_INSTALL.prompt(); DEFER_INSTALL = null; go(); } break;
  }
  } catch (x) { console.error(x); alert("Ocorreu um erro: " + (x && x.message ? x.message : x)); }
});
document.addEventListener("change", e => { if (e.target.id === "iaSel") { IA.chatId = e.target.value; iaRender(); } });
const dlgEl = document.getElementById("dlg");
dlgEl.addEventListener("cancel", e => { if (dlgEl.dataset.locked === "1") e.preventDefault(); });
dlgEl.addEventListener("close", () => { if (dlgEl.dataset.url) { URL.revokeObjectURL(dlgEl.dataset.url); dlgEl.dataset.url = ""; } });
dlgEl.addEventListener("click", e => { if (e.target === dlgEl && dlgEl.dataset.locked !== "1") dlgEl.close(); });
window.addEventListener("online", () => { if (DB && DB.config.driveOn) scheduleSync(500); });

/* ============================== início ============================== */
(async function init() {
  if ("serviceWorker" in navigator && GDrive.originOk()) navigator.serviceWorker.register("sw.js").catch(() => {});
  try { VAULT_BLOB = await Store.loadVault(); } catch (e) { VAULT_BLOB = lsGet(LS2) || lsGet(LS1); }
  if (VAULT_BLOB) { try { const o = JSON.parse(VAULT_BLOB); if (!o.v || o.v === 1) LOCK_MSG = "Encontrei seus dados da versão anterior. Digite sua senha: eles serão convertidos para a v2 e você receberá um <b>código de recuperação</b>."; } catch (e) {} }
  render();
})();
