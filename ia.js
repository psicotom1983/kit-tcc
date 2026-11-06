/* =====================================================================
   Kit Clínico TCC — ASSISTENTE DE IA (Claude, via SDK oficial da Anthropic)
   A chave de API fica DENTRO do cofre criptografado (DB.config.aiKey).
   ===================================================================== */
"use strict";
const IA_SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.2.0/+esm";
const IA_MODELOS = [["claude-opus-5-5", "Claude Opus 5.5 (mais capaz — padrão)"], ["claude-sonnet-5-5", "Claude Sonnet 5.5 (mais rápido e barato)"], ["claude-haiku-5-5", "Claude Haiku 5.5 (o mais barato)"]];
const IA_FALLBACK_OK = ["claude-opus-5-5", "claude-sonnet-5-5"];
let IA_MOD = null;
async function iaSDK() { if (!IA_MOD) IA_MOD = await import(IA_SDK_URL); return IA_MOD.default || IA_MOD.Anthropic; }

const IA_SYSTEM = `Você é um assistente de apoio clínico para um(a) estagiário(a) de Psicologia no Brasil que atende sob supervisão, principalmente em Terapia Cognitivo-Comportamental (TCC), integrando outras abordagens baseadas em evidências (terapias comportamentais, ACT, DBT, mindfulness, neurociência).

Como responder:
- Sempre em português do Brasil, claro e direto, com termos técnicos explicados quando necessário.
- Ao sugerir técnicas, protocolos ou interpretações, cite a fonte (autor, ano e obra/artigo). Se não tiver certeza de uma referência, diga isso em vez de inventar.
- Diferencie hipótese de conclusão. Não feche diagnósticos: sugira o que investigar e quais instrumentos usar.
- Você apoia o raciocínio clínico; as decisões são do terapeuta e da supervisão. Lembre isso quando a decisão for delicada.
- Respeite o Código de Ética Profissional do Psicólogo (CFP), o sigilo e a LGPD.
- Se aparecer qualquer sinal de risco de suicídio, autolesão ou violência, comece a resposta por isso: avaliação de risco direta, plano de segurança (Stanley & Brown), comunicar o supervisor no mesmo dia, CVV 188, SAMU 192, CAPS.
- Os pacientes aparecem apenas por código; nunca peça dados identificáveis.`;

function iaContexto(p) {
  if (!p) return "";
  const c = p.conc, ses = p.sessoes.slice(-3);
  const dem = p.demandas.map(d => (PRO[d] || {}).nome || d).join(", ") || "nenhuma marcada";
  const pend = Object.entries(p.pend || {}).filter(([, r]) => r.nota || r.status).map(([k, r]) => `- ${(PT[k] || k).slice(0, 120)} → ${pendLbl(r.status)}${r.nota ? " (" + r.nota + ")" : ""}`).join("\n");
  const ab = p.abordar.filter(a => a.status !== "abordado").map(a => "- " + a.texto).join("\n");
  return `[CONTEXTO DO PACIENTE — código ${p.codigo || "sem código"}]
Idade: ${p.idade || "?"} · Gênero: ${p.genero || "?"} · Contexto: ${p.contexto} · Sessões registradas: ${p.sessoes.length}
Demandas: ${dem}
Queixa: ${p.queixa || "—"}
História: ${p.historia || "—"}
Medicação: ${p.medicacao || "—"}
Metas: ${p.metas || "—"}
Tríade — eu: ${c.eu || "—"} | mundo: ${c.mundo || "—"} | futuro: ${c.futuro || "—"}
Crença central: ${c.crencaCentral || "—"} ${c.categoria ? "(" + c.categoria + ")" : ""}
Crenças intermediárias: ${c.regras || "—"}
Estratégias compensatórias: ${c.estrategias || "—"}
${pend ? "Respostas do terapeuta às pendências:\n" + pend + "\n" : ""}${ab ? "Para abordar com o paciente:\n" + ab + "\n" : ""}
Últimas sessões:
${ses.map(s => `• Sessão ${s.num} (${fmt(s.data)}) — humor ${s.humor === "" ? "?" : s.humor}/10, PHQ-9 ${s.phq9 === "" ? "?" : s.phq9}, GAD-7 ${s.gad7 === "" ? "?" : s.gad7}
  Técnicas: ${(s.tecnicas || []).map(id => tecNome(id)).join(", ") || "—"}
  Discussão: ${s.conteudo || "—"}
  Observações: ${s.obs || "—"}
  Resumo: ${s.resumo || "—"} · Tarefa: ${s.tarefa || "—"}`).join("\n") || "nenhuma"}
[FIM DO CONTEXTO]`;
}

/* conversas: DB.chats = [{id, pid, criado, titulo, msgs:[{role, text, t, ctx}]}] */
const IA = { open: false, busy: false, chatId: null, stream: null, draft: "" };
function iaChats() { DB.chats = DB.chats || []; return DB.chats; }
function iaCurrent() {
  const pid = V.page === "paciente" ? V.pid : null;
  let c = iaChats().find(x => x.id === IA.chatId);
  if (!c || c.pid !== pid) { c = iaChats().filter(x => x.pid === pid).at(-1); IA.chatId = c ? c.id : null; }
  return c || null;
}
function iaNova() { const pid = V.page === "paciente" ? V.pid : null; const c = { id: uid(), pid, criado: nowISO(), titulo: "", msgs: [] }; iaChats().push(c); IA.chatId = c.id; return c; }

function iaPanelHTML() {
  const cfg = DB.config || {}, p = V.page === "paciente" ? P() : null, c = iaCurrent();
  const list = iaChats().filter(x => x.pid === (p ? p.id : null));
  const sugs = p ? ["Sugira técnicas e um plano para a próxima sessão", "Quais hipóteses de conceituação cognitiva você vê?", "Que perguntas eu poderia fazer para investigar melhor?", "Resuma a evolução até aqui"] : ["Como aplicar a seta descendente?", "Diferença entre RPD de 5 e 7 colunas", "Como conduzir a primeira sessão de TCC?", "Como avaliar risco de suicídio?"];
  return `<div class="ia-head"><b>🤖 Assistente de IA</b><span class="sp"></span>
    <button class="btn sm" data-act="iaNova" title="Começar nova conversa">＋ Nova</button><button class="btn sm" data-act="iaFechar" aria-label="Fechar">✕</button></div>
  ${!cfg.aiKey ? `<div class="alert warn" style="margin:10px">Para usar a IA, cadastre sua chave da API da Anthropic em <b>⚙ Configurações → Assistente de IA</b>. Ela fica guardada dentro do cofre criptografado.<br><button class="btn sm" data-act="nav" data-v="config" style="margin-top:6px">Ir para Configurações</button></div>` : ""}
  <div class="ia-sub">${p ? `Paciente: <b>${esc(p.codigo || "(sem código)")}</b>` : "Conversa geral (sem paciente)"}
    ${list.length > 1 ? `<select id="iaSel">${list.map(x => `<option value="${x.id}" ${c && x.id === c.id ? "selected" : ""}>${esc(x.titulo || fmtDT(x.criado))}</option>`).join("")}</select>` : ""}</div>
  <div class="ia-msgs" id="iaMsgs">${c && c.msgs.length ? c.msgs.map((m, i) => iaMsgHTML(m, i)).join("") : `<div class="muted" style="padding:6px 2px">Pergunte qualquer coisa sobre técnicas, protocolos, conceituação ou o caso.${p ? " Com a opção abaixo marcada, a IA recebe o resumo do paciente (só o código, sem nome)." : ""}</div><div class="ia-sugs">${sugs.map(s => `<button class="sq" data-act="iaSug" data-v="${esc(s)}">${esc(s)}</button>`).join("")}</div>`}</div>
  <div class="ia-foot">
    ${p ? `<label class="chk" style="margin:0 0 6px"><input type="checkbox" id="iaCtx" ${cfg.aiCtx !== false ? "checked" : ""}> Enviar resumo do paciente junto</label>` : ""}
    <textarea id="iaIn" rows="3" placeholder="Escreva sua pergunta… (Ctrl+Enter envia)">${esc(IA.draft)}</textarea>
    <div class="row" style="margin-top:6px"><span class="ref">${esc((IA_MODELOS.find(m => m[0] === (cfg.aiModel || "claude-opus-5-5")) || [, ""])[1])}</span><span class="sp"></span>
    ${IA.busy ? `<button class="btn" data-act="iaParar">■ Parar</button>` : `<button class="btn pri" data-act="iaEnviar" ${cfg.aiKey ? "" : "disabled"}>Enviar</button>`}</div>
    <p class="ref" style="margin:6px 0 0">A IA pode errar. Confira as referências e decida com a supervisão.</p></div>`;
}
function iaMsgHTML(m, i) {
  return `<div class="ia-msg ${m.role}">${m.role === "user" ? (m.ctx ? `<span class="badge accent">com resumo do paciente</span><br>` : "") + nl(m.text) : iaMd(m.text)}
  ${m.role === "assistant" && m.text ? `<div class="row" style="margin-top:6px"><button class="btn sm" data-act="iaCopiar" data-v="${i}">Copiar</button><button class="btn sm" data-act="iaAbordar" data-v="${i}" title="Adicionar à lista Para abordar">💬 Para abordar</button></div>` : ""}${m.erro ? `<div class="alert danger" style="margin-top:6px">${esc(m.erro)}</div>` : ""}</div>`;
}
/* markdown mínimo e seguro (escapa tudo antes) */
function iaMd(t) {
  let h = esc(t || "");
  h = h.replace(/^### (.*)$/gm, "<h4>$1</h4>").replace(/^## (.*)$/gm, "<h3>$1</h3>").replace(/^# (.*)$/gm, "<h3>$1</h3>");
  h = h.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/^(?:- |\* )(.*)$/gm, "<li>$1</li>").replace(/^\d+\. (.*)$/gm, "<li>$1</li>");
  h = h.replace(/(<li>.*<\/li>\n?)+/g, m => "<ul>" + m.replace(/\n/g, "") + "</ul>");
  return h.replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");
}
function iaRender(keepScroll) {
  const el = $("#ia"); if (!el) return;
  const box = $("#iaMsgs"), st = box ? box.scrollTop : 0, inp = $("#iaIn"); if (inp) IA.draft = inp.value;
  el.innerHTML = iaPanelHTML();
  const nb = $("#iaMsgs"); if (nb) nb.scrollTop = keepScroll ? st : nb.scrollHeight;
}
function iaToggle(force) { IA.open = force == null ? !IA.open : force; document.body.classList.toggle("ia-open", IA.open); if (IA.open) { iaRender(); setTimeout(() => $("#iaIn") && $("#iaIn").focus(), 50); } }

async function iaEnviar(texto) {
  const cfg = DB.config || {}; if (!cfg.aiKey || IA.busy) return;
  const inp = $("#iaIn"); texto = (texto != null ? texto : inp ? inp.value : "").trim(); if (!texto) return;
  const p = V.page === "paciente" ? P() : null, ctxOn = !!(p && $("#iaCtx") && $("#iaCtx").checked);
  if (p && $("#iaCtx")) DB.config.aiCtx = ctxOn;
  const c = iaCurrent() || iaNova(); if (!c.titulo) c.titulo = texto.slice(0, 60);
  c.msgs.push({ role: "user", text: texto, t: nowISO(), ctx: ctxOn, ctxText: ctxOn ? iaContexto(p) : "" });
  const resp = { role: "assistant", text: "", t: nowISO(), model: cfg.aiModel || "claude-opus-5-5" }; c.msgs.push(resp);
  IA.draft = ""; IA.busy = true; touch(); iaRender();
  try {
    const Anthropic = await iaSDK();
    const client = new Anthropic({ apiKey: cfg.aiKey, dangerouslyAllowBrowser: true });
    const model = resp.model;
    const messages = c.msgs.slice(0, -1).filter(m => m.text && !m.erro).map(m => ({ role: m.role, content: m.role === "user" && m.ctxText ? m.ctxText + "\n\n" + m.text : m.text }));
    const params = { model, max_tokens: 64000, thinking: { type: "adaptive" }, output_config: { effort: "medium" }, system: IA_SYSTEM, messages };
    if (IA_FALLBACK_OK.includes(model)) { params.betas = ["server-side-fallback-2026-07-01"]; params.fallbacks = "default"; }
    const stream = client.beta.messages.stream(params); IA.stream = stream;
    let pend = "", raf = 0;
    stream.on("text", d => { resp.text += d; pend += d; if (!raf) raf = requestAnimationFrame(() => { raf = 0; const box = $("#iaMsgs"); const last = box && box.lastElementChild; if (last) { last.innerHTML = iaMd(resp.text); box.scrollTop = box.scrollHeight; } }); });
    const msg = await stream.finalMessage();
    if (msg.stop_reason === "refusal") resp.erro = "A IA recusou responder a este pedido (filtro de segurança). Tente reformular a pergunta.";
    else if (msg.stop_reason === "max_tokens") resp.erro = "A resposta foi cortada por ser longa demais.";
    resp.model = msg.model || model;
  } catch (e) {
    const A = IA_MOD && (IA_MOD.default || IA_MOD.Anthropic);
    let m = e && e.message ? e.message : String(e);
    if (A && e instanceof A.AuthenticationError) m = "Chave de API inválida. Confira em ⚙ Configurações → Assistente de IA.";
    else if (A && e instanceof A.PermissionDeniedError) m = "A chave não tem permissão para este modelo.";
    else if (A && e instanceof A.RateLimitError) m = "Limite de uso atingido. Aguarde um pouco e tente de novo.";
    else if (A && e instanceof A.APIUserAbortError) m = "Resposta interrompida.";
    else if (A && e instanceof A.APIConnectionError) m = "Sem conexão com a API. Verifique a internet.";
    else if (!IA_MOD) m = "Não foi possível carregar o SDK da IA (sem internet?).";
    resp.erro = m;
  } finally { IA.busy = false; IA.stream = null; touch(); iaRender(); }
}
