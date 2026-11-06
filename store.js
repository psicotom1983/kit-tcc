/* =====================================================================
   Kit Clínico TCC — ARMAZENAMENTO SEGURO (v2)
   - Criptografia: chave de dados (AES-256-GCM) protegida pela senha
     E por um código de recuperação (PBKDF2-SHA256)
   - IndexedDB: cofre, anexos criptografados e versões automáticas
   - Pasta vinculada (ex.: pasta do Google Drive para computador)
   - Google Drive via API (login com Google)
   ===================================================================== */
"use strict";
const te = new TextEncoder(), td = new TextDecoder();
function b64(buf) { const a = buf instanceof Uint8Array ? buf : new Uint8Array(buf); let s = ""; for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); }
function ub64(s) { const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };

/* ----------------------------- criptografia ----------------------------- */
const ITER = 310000;
async function kek(secret, salt) {
  const base = await crypto.subtle.importKey("raw", te.encode(secret), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function aesEnc(key, bytes) { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes); return { iv, data: ct }; }
const aesDec = (key, iv, ct) => crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
const REC_ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function genRecCode() { const r = crypto.getRandomValues(new Uint8Array(24)); let s = ""; r.forEach((v, i) => { s += REC_ALPHA[v & 31]; if (i % 4 === 3 && i < 23) s += "-"; }); return s; }
const normCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
function packEnc(rec) { const ct = new Uint8Array(rec.data), out = new Uint8Array(12 + ct.length); out.set(rec.iv, 0); out.set(ct, 12); return out; }
function unpackEnc(buf) { const a = new Uint8Array(buf); return { iv: a.slice(0, 12), data: a.slice(12).buffer }; }

const Vault = {
  DEK: null, HDR: null,
  async wrap(secret) {
    const salt = crypto.getRandomValues(new Uint8Array(16)), k = await kek(secret, salt);
    const raw = await crypto.subtle.exportKey("raw", this.DEK), e = await aesEnc(k, raw);
    return { salt: b64(salt), iv: b64(e.iv), ct: b64(e.data) };
  },
  async unwrap(w, secret) {
    const k = await kek(secret, ub64(w.salt)), raw = await aesDec(k, ub64(w.iv), ub64(w.ct));
    return crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
  },
  async create(pw) {
    this.DEK = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const code = genRecCode();
    this.HDR = { pw: await this.wrap(pw), rec: await this.wrap(normCode(code)), recCriado: new Date().toISOString() };
    return code;
  },
  async encrypt(db) {
    const e = await aesEnc(this.DEK, te.encode(JSON.stringify(db)));
    return JSON.stringify({ app: "kit-tcc", v: 2, savedAt: db.updated || new Date().toISOString(), pw: this.HDR.pw, rec: this.HDR.rec, recCriado: this.HDR.recCriado, iv: b64(e.iv), data: b64(e.data) });
  },
  /* via = "pw" (senha) ou "rec" (código de recuperação) */
  async open(blob, secret, via) {
    const o = JSON.parse(blob); if (o.app !== "kit-tcc") throw new Error("arquivo inválido");
    if (!o.v || o.v === 1) {
      if (via !== "pw") throw new Error("Este cofre é da versão 1 e ainda não tem código de recuperação — use a senha.");
      const key = await kek(secret, ub64(o.salt)), pt = await aesDec(key, ub64(o.iv), ub64(o.data));
      return { db: JSON.parse(td.decode(pt)), legacy: true };
    }
    const dek = await this.unwrap(via === "rec" ? o.rec : o.pw, via === "rec" ? normCode(secret) : secret);
    const pt = await aesDec(dek, ub64(o.iv), ub64(o.data));
    this.DEK = dek; this.HDR = { pw: o.pw, rec: o.rec, recCriado: o.recCriado };
    return { db: JSON.parse(td.decode(pt)), legacy: false };
  },
  async decryptWithDEK(blob) { const o = JSON.parse(blob); if (o.v !== 2) throw new Error("formato antigo"); return JSON.parse(td.decode(await aesDec(this.DEK, ub64(o.iv), ub64(o.data)))); },
  async setPassword(pw) { this.HDR.pw = await this.wrap(pw); },
  async newRecovery() { const code = genRecCode(); this.HDR.rec = await this.wrap(normCode(code)); this.HDR.recCriado = new Date().toISOString(); return code; },
  async checkPassword(pw) { try { await this.unwrap(this.HDR.pw, pw); return true; } catch (e) { return false; } },
  encBytes(buf) { return aesEnc(this.DEK, buf); },
  decBytes(rec) { return aesDec(this.DEK, rec.iv, rec.data); },
  lock() { this.DEK = null; this.HDR = null; }
};

/* ----------------------------- IndexedDB ----------------------------- */
const IDB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open("kitTCC", 1);
      r.onupgradeneeded = () => { const d = r.result; d.createObjectStore("kv"); d.createObjectStore("files"); d.createObjectStore("snaps", { autoIncrement: true }); };
      r.onsuccess = () => res(this.db = r.result); r.onerror = () => rej(r.error);
    });
  },
  async tx(store, mode, fn) {
    const d = await this.open();
    return new Promise((res, rej) => {
      const t = d.transaction(store, mode), req = fn(t.objectStore(store)); let out;
      if (req) req.onsuccess = () => { out = req.result; };
      t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error || new Error("transação abortada (disco cheio?)"));
    });
  },
  get(s, k) { return this.tx(s, "readonly", o => o.get(k)); },
  put(s, k, v) { return this.tx(s, "readwrite", o => k === undefined ? o.put(v) : o.put(v, k)); },
  del(s, k) { return this.tx(s, "readwrite", o => o.delete(k)); },
  keys(s) { return this.tx(s, "readonly", o => o.getAllKeys()); },
  async all(s) {
    const d = await this.open();
    return new Promise((res, rej) => { const out = [], t = d.transaction(s), c = t.objectStore(s).openCursor(); c.onsuccess = () => { const cur = c.result; if (cur) { out.push({ key: cur.key, value: cur.value }); cur.continue(); } }; t.oncomplete = () => res(out); t.onerror = () => rej(t.error); });
  }
};

/* ----------------------------- cofre local + versões ----------------------------- */
const LS1 = "kitTCC.vault.v1", LS2 = "kitTCC.vault.v2";
const Store = {
  async loadVault() {
    let b = null; try { b = await IDB.get("kv", "vault"); } catch (e) {}
    return b || lsGet(LS2) || lsGet(LS1);
  },
  /* grava em dois lugares do aparelho; só dá erro se os dois falharem */
  async saveVault(blob) {
    const okLS = blob.length < 4.5e6 && lsSet(LS2, blob);
    let okIDB = true; try { await IDB.put("kv", "vault", blob); } catch (e) { okIDB = false; }
    if (!okLS && !okIDB) throw new Error("não foi possível gravar neste aparelho (armazenamento cheio ou bloqueado)");
    try { await this.snap(blob, false); } catch (e) {}
  },
  /* versões automáticas: no máximo 1 a cada 15 min; mantém as 150 mais recentes + 1 por dia para sempre */
  async snap(blob, force, motivo) {
    const list = await IDB.all("snaps"), last = list.at(-1);
    if (!force && last && Date.now() - last.value.t < 15 * 60000) return;
    await IDB.put("snaps", undefined, { t: Date.now(), motivo: motivo || "automática", blob });
    if (list.length + 1 > 150) {
      const old = list.slice(0, list.length + 1 - 150), seen = new Set(list.slice(list.length + 1 - 150).map(x => new Date(x.value.t).toDateString()));
      for (const x of old) { const day = new Date(x.value.t).toDateString(); if (seen.has(day) || x.value.diaria) { if (!x.value.diaria || seen.has(day)) { if (!x.value.diaria) await IDB.del("snaps", x.key); } } else { x.value.diaria = true; seen.add(day); await IDB.put("snaps", x.key, x.value); } }
    }
  },
  async snaps() { return (await IDB.all("snaps")).reverse(); },
  async putFile(id, buf) { await IDB.put("files", id, await Vault.encBytes(buf)); },
  async putFileEnc(id, rec) { await IDB.put("files", id, rec); },
  async getFileEnc(id) { return IDB.get("files", id); },
  async getFile(id) { const r = await IDB.get("files", id); return r ? Vault.decBytes(r) : null; }
};

/* ----------------------------- pasta vinculada (ex.: Google Drive para computador) ----------------------------- */
const Folder = {
  dir: null,
  supported: () => !!window.showDirectoryPicker,
  async restore() { try { const h = await IDB.get("kv", "folderHandle"); if (h) this.dir = h; } catch (e) {} },
  async pick() { const h = await showDirectoryPicker({ id: "kit-tcc", mode: "readwrite" }); this.dir = h; await IDB.put("kv", "folderHandle", h); },
  async unlink() { this.dir = null; await IDB.del("kv", "folderHandle"); },
  async ok(ask) {
    if (!this.dir) return false;
    let p = await this.dir.queryPermission({ mode: "readwrite" });
    if (p !== "granted" && ask) p = await this.dir.requestPermission({ mode: "readwrite" });
    return p === "granted";
  },
  async sub(name) { return name ? this.dir.getDirectoryHandle(name, { create: true }) : this.dir; },
  async write(name, data, sub) { const d = await this.sub(sub), fh = await d.getFileHandle(name, { create: true }), w = await fh.createWritable(); await w.write(data); await w.close(); },
  async read(name, sub, asText) { try { const d = await this.sub(sub), f = await (await d.getFileHandle(name)).getFile(); return asText ? f.text() : f.arrayBuffer(); } catch (e) { return null; } }
};

/* ----------------------------- Google Drive (login com Google) ----------------------------- */
const GDrive = {
  token: null, exp: 0, folderId: null, vaultId: null, email: "", triedSilent: false,
  // Client ID é público (não é segredo); o campo nas Configurações pode sobrescrever
  clientId() { return lsGet("kitTCC.gClientId") || "673208952779-r4t755nhh161ij1kvjjkermpj2i93t6e.apps.googleusercontent.com"; },
  originOk() { return location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1"; },
  live() { return !!this.token && Date.now() < this.exp; },
  async loadGis() {
    if (window.google && google.accounts && google.accounts.oauth2) return;
    await new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.onload = res; s.onerror = () => rej(new Error("não foi possível carregar o login do Google (sem internet?)")); document.head.appendChild(s); });
  },
  async login() {
    if (!this.clientId()) throw new Error("configure o Client ID do Google primeiro");
    if (!this.originOk()) throw new Error("o login com Google exige que o kit esteja aberto por um endereço web (https ou localhost), não por arquivo");
    await this.loadGis();
    await new Promise((res, rej) => {
      const tc = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId(), scope: "https://www.googleapis.com/auth/drive.file",
        callback: r => { if (r.error) return rej(new Error(r.error)); this.token = r.access_token; this.exp = Date.now() + (Number(r.expires_in) - 60) * 1000; this.triedSilent = false; res(); },
        error_callback: e => rej(new Error(e && e.type === "popup_closed" ? "janela do Google fechada" : (e && e.type) || "login cancelado"))
      });
      tc.requestAccessToken({ prompt: "" });
    });
  },
  /* token expirado: tenta renovar sem perguntar nada, uma vez por desconexão (evita abrir janelas a cada salvamento) */
  async renew() {
    if (this.live()) return true; if (this.triedSilent) return false; this.triedSilent = true;
    try { await this.login(); return true; } catch (e) { return false; }
  },
  logout() { if (this.token && window.google) try { google.accounts.oauth2.revoke(this.token); } catch (e) {} this.token = null; this.exp = 0; this.folderId = null; this.vaultId = null; this.email = ""; },
  async api(url, opt = {}) {
    if (!this.live()) throw new Error("Google desconectado — clique em Reconectar");
    opt.headers = Object.assign({ Authorization: "Bearer " + this.token }, opt.headers || {});
    const r = await fetch(url, opt);
    if (r.status === 401) { this.token = null; throw new Error("a sessão do Google expirou — clique em Reconectar"); }
    if (!r.ok) throw new Error("Drive " + r.status + ": " + (await r.text()).slice(0, 160));
    return r;
  },
  async find(q) { const r = await this.api("https://www.googleapis.com/drive/v3/files?" + new URLSearchParams({ q: q + " and trashed=false", fields: "files(id,name,modifiedTime,appProperties)", spaces: "drive", pageSize: "1000", orderBy: "modifiedTime desc" })); return (await r.json()).files || []; },
  async ensureFolder() {
    if (this.folderId) return this.folderId;
    const f = await this.find("appProperties has { key='kitTCC' and value='folder' }");
    if (f.length) return this.folderId = f[0].id;
    const r = await this.api("https://www.googleapis.com/drive/v3/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Kit TCC - Backups", mimeType: "application/vnd.google-apps.folder", appProperties: { kitTCC: "folder" } }) });
    return this.folderId = (await r.json()).id;
  },
  multipart(meta, data, type) {
    const b = "kittcc" + Math.random().toString(36).slice(2);
    return { headers: { "Content-Type": "multipart/related; boundary=" + b }, body: new Blob([`--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\nContent-Type: ${type}\r\n\r\n`, data, `\r\n--${b}--`]) };
  },
  async upload(meta, data, type, id) {
    if (id) { const m = this.multipart(meta, data, type); const r = await this.api(`https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=multipart&fields=id`, { method: "PATCH", headers: m.headers, body: m.body }); return (await r.json()).id; }
    meta.parents = [await this.ensureFolder()];
    const m = this.multipart(meta, data, type); const r = await this.api("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", { method: "POST", headers: m.headers, body: m.body });
    return (await r.json()).id;
  },
  async remoteVault() { const f = await this.find("appProperties has { key='kitTCC' and value='vault' }"); if (f[0]) this.vaultId = f[0].id; return f[0] || null; },
  async download(id, asText) { const r = await this.api(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`); return asText ? r.text() : r.arrayBuffer(); },
  async pushVault(blob, savedAt) {
    if (!this.vaultId) await this.remoteVault();
    this.vaultId = await this.upload({ name: "kit-tcc.tcc", appProperties: { kitTCC: "vault", savedAt } }, blob, "application/json", this.vaultId);
    const day = new Date().toISOString().slice(0, 10), h = await this.find(`appProperties has { key='kitTCCday' and value='${day}' }`);
    await this.upload({ name: `historico-kit-tcc-${day}.tcc`, appProperties: { kitTCC: "hist", kitTCCday: day } }, blob, "application/json", h[0] && h[0].id);
  },
  async pushFile(fid, packed) { const f = await this.find(`appProperties has { key='kitTCCfid' and value='${fid}' }`); return this.upload({ name: `anexo-${fid}.bin`, appProperties: { kitTCC: "file", kitTCCfid: fid } }, packed, "application/octet-stream", f[0] && f[0].id); },
  async pullFile(fid) { const f = await this.find(`appProperties has { key='kitTCCfid' and value='${fid}' }`); return f[0] ? this.download(f[0].id) : null; }
};
