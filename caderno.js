/* ============ 📓 Caderno: anotações livres + notas de áudio ============
   Tudo fica dentro do cofre (criptografado). Os áudios vão para o Drive junto com os outros arquivos.
   Excluir pede confirmação dupla e manda para a lixeira do caderno (dá para restaurar). */
const CAD = { rec: null };
function cadNorm() {
  DB.caderno = DB.caderno || {}; const c = DB.caderno;
  c.notas = c.notas || []; c.docs = c.docs || []; c.lixeira = c.lixeira || [];
  return c;
}
function pgCaderno() {
  const c = cadNorm();
  const notas = [...c.notas].sort((a, b) => (b.mod || "").localeCompare(a.mod || ""));
  const rec = CAD.rec;
  return `<h1>📓 Caderno</h1>
  <p class="muted">Anotações livres e notas de áudio. Fica tudo criptografado, como o resto do kit. Evite nomes de pacientes: use códigos.</p>
  <div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">🎙 Notas de áudio</h3>
    ${rec ? `<button class="btn del" data-cad="audioStop">■ Parar (${mmss(Date.now() - rec.t0)})</button>` : `<button class="btn pri" data-cad="audioGo">● Gravar nota de áudio</button>`}</div>
    ${c.docs.length ? `<ul class="plist" style="margin-top:10px">${[...c.docs].reverse().map(d => `<li class="row" style="justify-content:space-between;gap:6px">
      <span>🎧 ${esc(d.nome)} <span class="ref">· ${d.duracao || ""} ${d.gravando ? "· gravando…" : ""}</span></span>
      <span class="row" style="gap:6px">${d.gravando ? "" : `<button class="btn sm" data-act="docVer" data-v="${d.id}">▶ Ouvir</button>`}<button class="btn sm del" data-cad="audioDel" data-v="${d.id}" aria-label="Excluir áudio">🗑</button></span></li>`).join("")}</ul>`
      : `<p class="ref" style="margin:8px 0 0">Nenhuma nota de áudio ainda.</p>`}
  </div>
  <div class="row" style="justify-content:space-between;margin:18px 0 8px"><h2 style="margin:0">📝 Anotações</h2><button class="btn pri" data-cad="notaNova">+ Nova anotação</button></div>
  ${notas.length ? notas.map(n => `<details class="item" ${n.id === CAD.aberta ? "open" : ""}><summary><b>${esc(n.titulo || "Sem título")}</b> <span class="ref">· ${fmtDT(n.mod)}</span></summary><div class="body">
    ${fld(n, "titulo", "Título", "text")}${fld(n, "texto", "Anotação", "area", { rows: 8, ph: "Escreva ou toque no 🎤 para falar" })}
    <div class="row" style="justify-content:flex-end"><button class="btn sm del" data-cad="notaDel" data-v="${n.id}">🗑 Excluir</button></div></div></details>`).join("")
    : `<div class="card"><p class="muted" style="margin:0">Nenhuma anotação ainda. Toque em <b>+ Nova anotação</b>.</p></div>`}
  ${c.lixeira.length ? `<details class="item" style="margin-top:18px"><summary>🗑 Lixeira do caderno (${c.lixeira.length})</summary><div class="body"><ul class="plist">${c.lixeira.map((L, i) => `<li class="row" style="justify-content:space-between">
    <span>${L.tipo === "audio" ? "🎧" : "📝"} ${esc(L.item.titulo || L.item.nome || "Sem título")} <span class="ref">· excluído em ${fmtDT(L.quando)}</span></span><button class="btn sm" data-cad="restaurar" data-v="${i}">↩ Restaurar</button></li>`).join("")}</ul></div></details>` : ""}`;
}
/* data de alteração da anotação */
document.addEventListener("input", e => {
  if (!DB || !DB.caderno || V.page !== "caderno" || !e.target.dataset || !e.target.dataset.o) return;
  const det = e.target.closest("details.item"); if (!det) return;
  const n = DB.caderno.notas.find(x => det.querySelector(`[data-cad="notaDel"][data-v="${x.id}"]`)); if (n) n.mod = nowISO();
});
function cadExcluir(txt) { return confirm(`Excluir ${txt}?`) && confirm("Tem certeza? Vai para a lixeira do caderno (dá para restaurar).") }
async function cadAudioGo() {
  if (!navigator.mediaDevices || !window.MediaRecorder) return alert("Este navegador não permite gravar áudio. Use o Chrome (Android/PC) ou Safari atualizado (iPhone).");
  if (REC.on) return alert("Já existe uma gravação de sessão em andamento.");
  let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); } catch (e) { return alert("Sem acesso ao microfone: " + e.message); }
  const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"].find(m => MediaRecorder.isTypeSupported(m)) || "";
  const mr = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : undefined);
  const tipo = (mr.mimeType || mime || "audio/webm").split(";")[0], ext = tipo.includes("mp4") || tipo.includes("aac") ? "m4a" : "webm";
  const d = { id: uid(), nome: `Nota de áudio ${new Date().toLocaleString("pt-BR").replace(/[/:]/g, "-").replace(",", "")}.${ext}`, tipo, tamanho: 0, criado: nowISO(), desc: "Nota de áudio (caderno)", origem: "nota", gravando: true, sync: {} };
  cadNorm().docs.push(d);
  const chunks = [], guarda = async () => { const buf = await new Blob(chunks, { type: tipo }).arrayBuffer(); await Store.putFile(d.id, buf); d.tamanho = buf.byteLength; d.duracao = mmss(Date.now() - CAD.rec.t0); touch(); };
  CAD.rec = { mr, stream, chunks, d, t0: Date.now(), guarda, timer: setInterval(() => { const b = document.querySelector('[data-cad="audioStop"]'); if (b && CAD.rec) b.textContent = `■ Parar (${mmss(Date.now() - CAD.rec.t0)})`; }, 1000) };
  mr.ondataavailable = e => { if (e.data && e.data.size) { chunks.push(e.data); guarda(); } };  /* guarda a cada 10 s: não perde nada se fechar */
  mr.start(10000);
  await save(); V._keepScroll = true; render();
}
async function cadAudioStop() {
  const r = CAD.rec; if (!r) return;
  const parou = new Promise(res => { r.mr.onstop = res; });
  try { r.mr.stop(); } catch (e) {}
  await Promise.race([parou, new Promise(res => setTimeout(res, 3000))]);
  r.stream.getTracks().forEach(t => t.stop()); clearInterval(r.timer);
  await r.guarda(); r.d.gravando = false; r.d.sync = {}; CAD.rec = null;
  await save(); V._keepScroll = true; render();
}
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-cad]"); if (!b || !DB) return;
  const a = b.dataset.cad, v = b.dataset.v, c = cadNorm();
  if (a === "audioGo") return cadAudioGo();
  if (a === "audioStop") return cadAudioStop();
  if (a === "notaNova") { const n = { id: uid(), titulo: "", texto: "", criado: nowISO(), mod: nowISO() }; c.notas.push(n); CAD.aberta = n.id; }
  if (a === "notaDel") { const i = c.notas.findIndex(x => x.id === v); if (i < 0 || !cadExcluir("esta anotação")) return; c.lixeira.unshift({ tipo: "nota", item: c.notas.splice(i, 1)[0], quando: nowISO() }); }
  if (a === "audioDel") { const i = c.docs.findIndex(x => x.id === v); if (i < 0 || c.docs[i].gravando || !cadExcluir("esta nota de áudio")) return; c.lixeira.unshift({ tipo: "audio", item: c.docs.splice(i, 1)[0], quando: nowISO() }); }
  if (a === "restaurar") { const L = c.lixeira.splice(+v, 1)[0]; if (L) (L.tipo === "audio" ? c.docs : c.notas).push(L.item); }
  touch(); await save(); V._keepScroll = true; render();
});
