/* =====================================================================
   Kit Clínico TCC — AGENDA e AVISOS ESCALONADOS
   DB.agenda = [{id, tipo, titulo, pid, data, hora, dur, rep, ate, lembretes:[min], notas, ack:{data:iso}, st:{data:status}, excl:[data]}]
   ===================================================================== */
"use strict";
const AG_TIPOS = [["atendimento", "🧑‍⚕️ Atendimento"], ["supervisao", "🎓 Supervisão"], ["alerta", "⏰ Alerta / prazo"], ["outro", "📌 Outro"]];
const AG_REP = [["", "Não repete"], ["semanal", "Toda semana"], ["quinzenal", "A cada 2 semanas"], ["mensal", "Todo mês"]];
const AG_LEMB = [["10080", "1 semana antes"], ["1440", "1 dia antes"], ["120", "2 h antes"], ["60", "1 h antes"], ["30", "30 min antes"], ["15", "15 min antes"], ["10", "10 min antes"], ["5", "5 min antes"], ["0", "Na hora"]];
const AG_ST = [["", "—"], ["realizado", "✓ Realizado"], ["faltou", "✗ Faltou"], ["desmarcado", "Desmarcado"], ["remarcado", "Remarcado"]];
const AG = { view: "mes", mes: null, dia: null };
const pad2 = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const DSEM = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
function agList() { DB.agenda = DB.agenda || []; return DB.agenda; }
function agStart(ev, date) { const [h, m] = (ev.hora || "09:00").split(":").map(Number); const [Y, M, D] = date.split("-").map(Number); return new Date(Y, M - 1, D, h || 0, m || 0); }
function agTitulo(ev) {
  if (ev.titulo) return ev.titulo;
  const p = ev.pid && DB.pacientes.find(x => x.id === ev.pid);
  const t = (AG_TIPOS.find(x => x[0] === ev.tipo) || [, "Evento"])[1].replace(/^\S+ /, "");
  return p ? `${t} ${p.codigo || "(sem código)"}` : t;
}
/* ocorrências (expande repetições) entre duas datas */
function agOcc(from, to) {
  const out = [];
  for (const ev of agList()) {
    if (!ev.data) continue;
    const d = new Date(ev.data + "T00:00:00"), until = ev.ate ? new Date(ev.ate + "T23:59:59") : null;
    for (let g = 0; g < 1200; g++) {
      const date = ymd(d), st = agStart(ev, date);
      if (st > to || (until && d > until)) break;
      if (st >= from && !(ev.excl || []).includes(date)) out.push({ ev, date, start: st, key: ev.id + "@" + date });
      if (!ev.rep) break;
      if (ev.rep === "semanal") d.setDate(d.getDate() + 7); else if (ev.rep === "quinzenal") d.setDate(d.getDate() + 14); else if (ev.rep === "mensal") d.setMonth(d.getMonth() + 1); else break;
    }
  }
  return out.sort((a, b) => a.start - b.start);
}
const fmtMin = m => { m = Math.round(m); if (m >= 1440) return Math.round(m / 1440) + " dia(s)"; if (m >= 60) return Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " min" : ""); return m + " min"; };

/* ---------- telas ---------- */
function agEvRow(o, withDate) {
  const ev = o.ev, st = (ev.st || {})[o.date] || "", tipoLbl = (AG_TIPOS.find(x => x[0] === ev.tipo) || [, ""])[1];
  return `<li><div class="prow"><div class="ptxt"><b>${esc(ev.hora || "")}</b> ${withDate ? `<span class="ref">${DSEM[o.start.getDay()]} ${fmt(o.date)}</span> ` : ""}<a href="#" data-act="agEdit" data-v="${ev.id}" data-d="${o.date}">${esc(agTitulo(ev))}</a>
    <div class="ref">${esc(tipoLbl)}${ev.dur ? ` · ${ev.dur} min` : ""}${ev.rep ? " · 🔁 " + esc((AG_REP.find(x => x[0] === ev.rep) || [, ""])[1].toLowerCase()) : ""}${(ev.lembretes || []).length ? ` · 🔔 ${ev.lembretes.length}` : ""}${(ev.ack || {})[o.date] ? " · ✓ lembrado" : ""}</div></div>
    <select class="psel agst ${st === "realizado" ? "ok" : st === "faltou" ? "danger" : st ? "warn" : ""}" data-v="${ev.id}" data-d="${o.date}" aria-label="Situação">${AG_ST.map(([id, t]) => `<option value="${id}" ${st === id ? "selected" : ""}>${t}</option>`).join("")}</select></div>
    ${ev.tipo === "atendimento" && ev.pid ? `<div class="row" style="margin-top:6px"><button class="btn sm" data-act="agSessao" data-v="${ev.id}" data-d="${o.date}">📝 Registrar sessão</button><button class="btn sm" data-act="openP" data-v="${ev.pid}">Abrir paciente</button></div>` : ""}</li>`;
}
function agProximos() {
  const now = new Date(), occ = agOcc(now, new Date(now.getTime() + 7 * 86400000)).slice(0, 4);
  if (!occ.length) return "";
  return `<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">📅 Próximos compromissos</h3><button class="btn sm" data-act="nav" data-v="agenda">Ver agenda</button></div><ul class="plist">${occ.map(o => agEvRow(o, true)).join("")}</ul></div>`;
}
function pgAgenda() {
  const hoje = today(); AG.mes = AG.mes || hoje.slice(0, 7); AG.dia = AG.dia || hoje;
  const perm = window.Notification ? Notification.permission : "indisponivel";
  let h = `<div class="ph"><h1>📅 Agenda</h1><span class="sp"></span><button class="btn pri" data-act="agNovo" data-v="${AG.dia}">+ Evento</button></div>
  ${perm === "default" ? `<div class="alert info">🔔 <b>Ative os avisos</b> para receber lembretes neste aparelho. <button class="btn sm pri" data-act="agPerm">Ativar avisos</button></div>` : perm === "denied" ? `<div class="alert warn">Os avisos do navegador estão bloqueados para o kit. Libere nas configurações do navegador (cadeado ao lado do endereço → Notificações). Os lembretes continuam aparecendo dentro do kit.</div>` : ""}
  <div class="row" style="margin-bottom:12px"><button class="chip ${AG.view === "mes" ? "on" : ""}" data-act="agView" data-v="mes">Mês</button><button class="chip ${AG.view === "lista" ? "on" : ""}" data-act="agView" data-v="lista">Próximos 60 dias</button>
  <span class="sp"></span><button class="btn sm" data-act="agIcsAll">⬇ Exportar tudo (.ics)</button></div>`;
  if (AG.view === "lista") {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const occ = agOcc(now, new Date(now.getTime() + 60 * 86400000));
    h += occ.length ? `<ul class="plist card">${occ.map(o => agEvRow(o, true)).join("")}</ul>` : `<div class="card muted">Nada agendado nos próximos 60 dias.</div>`;
  } else {
    const [Y, M] = AG.mes.split("-").map(Number), first = new Date(Y, M - 1, 1), start = new Date(Y, M - 1, 1 - first.getDay());
    const end = new Date(start); end.setDate(end.getDate() + 42); end.setHours(23, 59);
    const occ = agOcc(start, end), byDay = {}; occ.forEach(o => (byDay[o.date] = byDay[o.date] || []).push(o));
    h += `<div class="row" style="margin-bottom:8px"><button class="btn sm" data-act="agMes" data-v="-1" aria-label="Mês anterior">‹</button><b style="min-width:150px;text-align:center;text-transform:capitalize">${MESES[M - 1]} ${Y}</b><button class="btn sm" data-act="agMes" data-v="1" aria-label="Próximo mês">›</button><button class="btn sm" data-act="agHoje">Hoje</button></div>
    <div class="cal">${DSEM.map(d => `<div class="dh">${d}</div>`).join("")}${Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); const k = ymd(d), evs = byDay[k] || []; return `<button class="dc ${d.getMonth() !== M - 1 ? "out" : ""} ${k === hoje ? "hoje" : ""} ${k === AG.dia ? "sel" : ""}" data-act="agDia" data-v="${k}"><span class="dn">${d.getDate()}</span>${evs.slice(0, 3).map(o => `<span class="ev ${o.ev.tipo}">${esc(o.ev.hora || "")} ${esc(agTitulo(o.ev))}</span>`).join("")}${evs.length > 3 ? `<span class="ref">+${evs.length - 3}</span>` : ""}${evs.length ? `<span class="dots">${evs.slice(0, 4).map(o => `<i class="${o.ev.tipo}"></i>`).join("")}</span>` : ""}</button>`; }).join("")}</div>`;
    const dayOcc = byDay[AG.dia] || agOcc(new Date(AG.dia + "T00:00:00"), new Date(AG.dia + "T23:59:59"));
    const dd = new Date(AG.dia + "T12:00:00");
    h += `<div class="card" style="margin-top:12px"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${DSEM[dd.getDay()]}, ${fmt(AG.dia)}</h3><button class="btn sm" data-act="agNovo" data-v="${AG.dia}">+ Evento neste dia</button></div>
    ${dayOcc.length ? `<ul class="plist">${dayOcc.map(o => agEvRow(o)).join("")}</ul>` : `<p class="muted" style="margin-bottom:0">Nada neste dia.</p>`}</div>`;
  }
  h += `<details class="card"><summary style="cursor:pointer;font-weight:600">Como funcionam os avisos</summary><ul>
    <li><b>Com o kit aberto</b> (no celular ou no computador): os lembretes aparecem e <b>vão ficando mais insistentes</b> perto do horário — primeiro um aviso discreto, depois notificação, depois alerta piscando com som e vibração, repetindo a cada poucos minutos até você tocar em <b>✓ Lembrei</b>.</li>
    <li><b>Com o kit fechado</b>: o navegador não consegue avisar sozinho. Para garantir, toque em <b>📅 Agenda do celular</b> no evento — ele vai para a agenda do Google/celular com vários alarmes, que tocam mesmo com o kit fechado.</li>
    <li>Os avisos mostram só o código do paciente, nunca o nome.</li></ul></details>`;
  return h;
}
function agEditor(ev, date) {
  const d = $("#dlg"), pacs = [["", "— nenhum —"], ...DB.pacientes.map(p => [p.id, p.codigo || "(sem código)"])];
  d.innerHTML = `<div class="row" style="justify-content:space-between"><h2 style="margin:0">📅 Evento</h2><button class="btn sm" data-act="agFechar" aria-label="Fechar">✕</button></div>
  <div class="g2" style="margin-top:10px">${fld(ev, "tipo", "Tipo", "select", { options: AG_TIPOS })}${fld(ev, "pid", "Paciente", "select", { options: pacs })}</div>
  ${fld(ev, "titulo", "Título (opcional)", "text", { ph: agTitulo(Object.assign({}, ev, { titulo: "" })) })}
  <div class="g3">${fld(ev, "data", "Data", "date")}${fld(ev, "hora", "Horário", "time")}${fld(ev, "dur", "Duração (min)", "number", { min: 5 })}</div>
  <div class="g2">${fld(ev, "rep", "Repetir", "select", { options: AG_REP })}${fld(ev, "ate", "Repetir até (opcional)", "date")}</div>
  <div class="f"><span>🔔 Lembretes (os avisos ficam mais insistentes perto do horário)</span>${chips(ev.lembretes, AG_LEMB)}</div>
  ${fld(ev, "notas", "Anotações", "area", { rows: 2 })}
  <div class="f"><span>Levar para a agenda do celular (alarmes tocam mesmo com o kit fechado)</span><div class="row">
    <a class="btn" href="${gcalLink(ev, ev.data)}" target="_blank" rel="noopener" data-act="agGcal">📅 Google Agenda</a><button class="btn" data-act="agIcs" data-v="${ev.id}">⬇ Arquivo .ics (com os alarmes)</button></div>
    <small>Vai só o título (com o código do paciente) e o horário — sem anotações.</small></div>
  <div class="row" style="justify-content:space-between;margin-top:16px">
    <span class="row">${ev.rep && date ? `<button class="btn sm del" data-act="agExcl" data-v="${ev.id}" data-d="${date}">Excluir só ${fmt(date)}</button>` : ""}<button class="btn sm del" data-act="agDel" data-v="${ev.id}">Excluir evento</button></span>
    <button class="btn pri" data-act="agFechar">Concluído</button></div>`;
  if (!d.open) d.showModal();
}
/* ---------- agenda do celular ---------- */
const icsDT = d => `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
function agRRule(ev) { if (!ev.rep) return ""; let r = ev.rep === "mensal" ? "FREQ=MONTHLY" : "FREQ=WEEKLY" + (ev.rep === "quinzenal" ? ";INTERVAL=2" : ""); if (ev.ate) r += ";UNTIL=" + ev.ate.replace(/-/g, "") + "T235959"; return r; }
function gcalLink(ev, date) {
  if (!date) return "#";
  const s = agStart(ev, date), e = new Date(s.getTime() + (Number(ev.dur) || 50) * 60000);
  const p = new URLSearchParams({ action: "TEMPLATE", text: agTitulo(ev), dates: icsDT(s) + "/" + icsDT(e), details: "Kit Clínico TCC", ctz: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const rr = agRRule(ev); if (rr) p.set("recur", "RRULE:" + rr);
  return "https://calendar.google.com/calendar/render?" + p;
}
const icsEsc = s => String(s).replace(/[\\;,]/g, m => "\\" + m).replace(/\n/g, "\\n");
function agICS(evs) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z", L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Kit Clinico TCC//PT-BR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  for (const ev of evs) {
    if (!ev.data) continue;
    const s = agStart(ev, ev.data), e = new Date(s.getTime() + (Number(ev.dur) || 50) * 60000);
    L.push("BEGIN:VEVENT", "UID:" + ev.id + "@kit-tcc", "DTSTAMP:" + stamp, "DTSTART:" + icsDT(s), "DTEND:" + icsDT(e), "SUMMARY:" + icsEsc(agTitulo(ev)));
    const rr = agRRule(ev); if (rr) L.push("RRULE:" + rr);
    (ev.excl || []).forEach(x => L.push("EXDATE:" + icsDT(agStart(ev, x))));
    (ev.lembretes || []).forEach(m => L.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(agTitulo(ev)), "TRIGGER:-PT" + Number(m) + "M", "END:VALARM"));
    L.push("END:VEVENT");
  }
  L.push("END:VCALENDAR"); return L.join("\r\n");
}

/* ---------- avisos escalonados ---------- */
const AGN = { last: {}, ac: null };
function agTick() {
  const old = $("#agBanner");
  if (!DB) { if (old) old.remove(); return; }
  const now = new Date(), due = [];
  for (const o of agOcc(new Date(now.getTime() - 15 * 60000), new Date(now.getTime() + 8 * 86400000))) {
    const ev = o.ev, lemb = (ev.lembretes || []).map(Number);
    if (!lemb.length || (ev.ack || {})[o.date] || (ev.st || {})[o.date]) continue;
    const mins = (o.start - now) / 60000;
    if (mins > Math.max(...lemb) || mins < -15) continue;
    const lvl = mins <= 15 ? 3 : mins <= 60 ? 2 : 1, every = lvl === 3 ? 3 : lvl === 2 ? 10 : 60;
    due.push({ o, mins, lvl });
    if (Date.now() - (AGN.last[o.key] || 0) >= every * 60000) { AGN.last[o.key] = Date.now(); agNotify(o, mins, lvl); }
  }
  agBanner(due);
}
function agMsg(o, mins) { return `${agTitulo(o.ev)} — ${mins > 0.5 ? "em " + fmtMin(mins) : "começou"} (${o.ev.hora || ""}, ${fmt(o.date)})`; }
async function agNotify(o, mins, lvl) {
  if (lvl >= 2) { agBeep(lvl); try { navigator.vibrate && navigator.vibrate(lvl === 3 ? [400, 150, 400, 150, 700] : [250]); } catch (e) {} }
  if (!window.Notification || Notification.permission !== "granted") return;
  const opt = { body: agMsg(o, mins), tag: o.key, renotify: true, requireInteraction: lvl >= 2, icon: "icon.svg", badge: "icon.svg", vibrate: lvl === 3 ? [400, 150, 400, 150, 700] : [200], data: { key: o.key } };
  const title = lvl === 3 ? "⏰ AGORA — Kit TCC" : lvl === 2 ? "🔔 Em breve — Kit TCC" : "📅 Lembrete — Kit TCC";
  try { const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration(); if (reg) await reg.showNotification(title, opt); else new Notification(title, opt); } catch (e) { try { new Notification(title, opt); } catch (x) {} }
}
function agBeep(lvl) {
  try {
    AGN.ac = AGN.ac || new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < (lvl === 3 ? 3 : 1); i++) { const o = AGN.ac.createOscillator(), g = AGN.ac.createGain(), t = AGN.ac.currentTime + i * 0.35; o.frequency.value = lvl === 3 ? 880 : 660; g.gain.value = lvl === 3 ? 0.25 : 0.08; o.connect(g); g.connect(AGN.ac.destination); o.start(t); o.stop(t + 0.2); }
  } catch (e) {}
}
function agBanner(due) {
  let b = $("#agBanner");
  if (!due.length) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement("div"); b.id = "agBanner"; document.body.appendChild(b); }
  const top = due.sort((a, c) => c.lvl - a.lvl || a.mins - c.mins)[0];
  b.className = "lvl" + top.lvl;
  b.innerHTML = `<div class="row" style="flex-wrap:nowrap"><span style="font-size:20px">${top.lvl === 3 ? "⏰" : top.lvl === 2 ? "🔔" : "📅"}</span><div style="flex:1;min-width:0"><b>${esc(agMsg(top.o, top.mins))}</b>${due.length > 1 ? `<div class="ref" style="color:inherit">+ ${due.length - 1} outro(s) lembrete(s)</div>` : ""}</div>
  <button class="btn sm pri" data-act="agAck" data-k="${esc(top.o.key)}">✓ Lembrei</button><button class="btn sm" data-act="nav" data-v="agenda">Agenda</button></div>`;
}
setInterval(agTick, 30000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") agTick(); });

/* ---------- ações ---------- */
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-act]"); if (!el || !DB) return;
  const a = el.dataset.act, v = el.dataset.v; if (!a.startsWith("ag")) return;
  if (el.tagName === "A" && el.getAttribute("href") === "#") e.preventDefault();
  const re = () => { V._keepScroll = true; if (V.page === "agenda" || V.page === "pacientes") render(); agTick(); };
  const find = id => agList().find(x => x.id === id);
  switch (a) {
    case "agView": AG.view = v; re(); break;
    case "agMes": { const [Y, M] = AG.mes.split("-").map(Number), d = new Date(Y, M - 1 + Number(v), 1); AG.mes = ymd(d).slice(0, 7); re(); break; }
    case "agHoje": AG.mes = today().slice(0, 7); AG.dia = today(); re(); break;
    case "agDia": AG.dia = v; re(); break;
    case "agNovo": {
      const pid = el.dataset.pid || "", ev = { id: uid(), tipo: pid ? "atendimento" : "atendimento", titulo: "", pid, data: v || today(), hora: "14:00", dur: 50, rep: pid ? "semanal" : "", ate: "", lembretes: ["1440", "60", "15"], notas: "", ack: {}, st: {}, excl: [], criado: nowISO() };
      agList().push(ev); touch(); agEditor(ev, ev.data); break;
    }
    case "agEdit": { const ev = find(v); if (ev) agEditor(ev, el.dataset.d); break; }
    case "agFechar": $("#dlg").close(); if (V.page === "paciente") { V._keepScroll = true; render(); } else re(); break;
    case "agDel": if (await confirmDel("este evento" + (find(v).rep ? " (todas as repetições)" : ""))) { const i = agList().findIndex(x => x.id === v); DB.lixeiraAgenda = DB.lixeiraAgenda || []; DB.lixeiraAgenda.push({ quando: nowISO(), item: agList()[i] }); agList().splice(i, 1); touch(); $("#dlg").close(); re(); } break;
    case "agExcl": { const ev = find(v); ev.excl = ev.excl || []; ev.excl.push(el.dataset.d); touch(); $("#dlg").close(); re(); break; }
    case "agAck": { const [id, date] = el.dataset.k.split("@"), ev = find(id); if (ev) { ev.ack = ev.ack || {}; ev.ack[date] = nowISO(); touch(); } agTick(); break; }
    case "agPerm": try { await Notification.requestPermission(); } catch (x) {} re(); break;
    case "agIcs": { const ev = find(v); download(`kit-tcc-${(ev.data || "evento")}.ics`, agICS([ev]), "text/calendar"); break; }
    case "agIcsAll": download(`kit-tcc-agenda-${today()}.ics`, agICS(agList()), "text/calendar"); break;
    case "agSessao": {
      const ev = find(v), p = DB.pacientes.find(x => x.id === ev.pid); if (!p) break;
      let s = p.sessoes.find(x => x.data === el.dataset.d);
      if (!s) { s = novaSessao(p); s.data = el.dataset.d; p.sessoes.push(s); p.sessoes.sort((x, y) => (x.data || "").localeCompare(y.data || "") || x.num - y.num); logP(p, `Sessão ${s.num} criada pela agenda (${fmt(s.data)})`); }
      ev.st = ev.st || {}; if (!ev.st[el.dataset.d]) ev.st[el.dataset.d] = "realizado";
      touch(); V.page = "paciente"; V.pid = p.id; V.tab = "sessoes"; render(); break;
    }
  }
});
document.addEventListener("change", e => {
  const s = e.target; if (!s.classList || !s.classList.contains("agst") || !DB) return;
  const ev = agList().find(x => x.id === s.dataset.v); ev.st = ev.st || {}; ev.st[s.dataset.d] = s.value; touch(); V._keepScroll = true; render(); agTick();
});
