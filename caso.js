/* ============ Presença nas sessões + 🖨 Imprimir o caso (processofólio / supervisão) ============ */
const PRESENCA = ["Compareceu", "Falta", "Falta justificada", "Cancelada pelo serviço", "Remarcada"];
const ehFalta = s => s.presenca && s.presenca !== "Compareceu";
const sesTitulo = s => ehFalta(s) ? `${s.presenca === "Falta" ? "❌" : "⚪"} ${s.presenca}` : `Sessão ${s.num}`;

function casoContagem(p) {
  const c = {}; PRESENCA.forEach(k => c[k] = 0);
  p.sessoes.forEach(s => c[s.presenca || "Compareceu"]++);
  const marc = c["Compareceu"] + c["Falta"] + c["Falta justificada"];
  return { c, freq: marc ? Math.round(c["Compareceu"] / marc * 100) : null };
}
function casoHTML(p, o) {
  const L = (r, v) => v ? `<tr><th style="width:32%">${r}</th><td>${esc(String(v)).replace(/\n/g, "<br>")}</td></tr>` : "";
  const ses = [...p.sessoes].sort((a, b) => (a.data || "").localeCompare(b.data || "")); /* mesma data: mantém a ordem de registro */
  const { c, freq } = casoContagem(p);
  let h = `<p style="font-size:9.5pt;border:1px solid #999;padding:4px 8px">Documento sigiloso (Código de Ética do Psicólogo, art. 9º; Resolução CFP nº 01/2009). Identificação somente por código. Uso restrito a supervisão e processofólio.</p>`;
  if (o.cad) h += `<h3>1. Identificação e anamnese</h3><table>
    ${L("Código / iniciais", p.codigo)}${L("Idade", p.idade)}${L("Gênero", p.genero)}${L("Início do acompanhamento", p.inicio ? fmt(p.inicio) : "")}
    ${L("Contexto", p.contexto)}${L("Supervisor(a)", p.supervisor)}${L("Demandas", (p.demandas || []).map(d => PRO[d] ? PRO[d].nome : d).join(", "))}
    ${L("Queixa principal", p.queixa)}${L("História / anamnese", p.historia)}${L("Medicação / acompanhamento psiquiátrico", p.medicacao)}
    ${L("Metas terapêuticas", p.metas)}${L("Outras observações", p.obs)}</table>`;
  if (o.cron) h += `<h3>${o.cad ? 2 : 1}. Cronograma de encontros e faltas</h3>
    <p>Total de registros: <b>${ses.length}</b> · Compareceu: <b>${c["Compareceu"]}</b> · Faltas: <b>${c["Falta"]}</b> · Faltas justificadas: <b>${c["Falta justificada"]}</b>${c["Cancelada pelo serviço"] ? ` · Canceladas pelo serviço: <b>${c["Cancelada pelo serviço"]}</b>` : ""}${c["Remarcada"] ? ` · Remarcadas: <b>${c["Remarcada"]}</b>` : ""}${freq != null ? ` · Frequência: <b>${freq}%</b>` : ""}</p>
    <table><tr><th>#</th><th>Data</th><th>Horário</th><th>Situação</th><th>${o.res ? "Observação" : "Resumo / motivo"}</th></tr>
    ${ses.map((s, i) => `<tr><td>${i + 1}</td><td>${fmt(s.data)}</td><td>${esc(s.hora || "")}</td><td>${esc(s.presenca || "Compareceu")}${!ehFalta(s) ? ` (sessão ${s.num})` : ""}</td><td>${esc(ehFalta(s) ? s.motivo || "" : o.res ? "" : (s.resumo || "").slice(0, 160))}</td></tr>`).join("")}</table>`;
  if (o.res) h += `<h3>${(o.cad ? 1 : 0) + (o.cron ? 1 : 0) + 1}. Resumo dos atendimentos</h3>` + ses.filter(s => !ehFalta(s)).map(s => `<h4 style="margin:12px 0 4px">Sessão ${s.num} · ${fmt(s.data)}${s.hora ? " · " + esc(s.hora) : ""}</h4><table>
    ${L("Agenda", s.agenda)}${L("Resumo", s.resumo || s.conteudo)}${L("Técnicas", (s.tecnicas || []).map(tecNome).join(", "))}${L("Tarefa de casa", s.tarefa)}${L("Observações clínicas", s.obs)}${L("Feedback do paciente", s.feedback)}${o.sup ? L("Notas da supervisão", s.supervisao) : ""}
    ${L("Humor (0–10)", s.humor)}</table>`).join("");
  return h;
}
function casoDialogo(p) {
  const d = document.getElementById("dlg");
  d.innerHTML = `<h2 style="margin-top:0">🖨 Imprimir o caso</h2>
  <p class="ref">Para o processofólio ou a supervisão. No celular, escolha <b>Salvar como PDF</b> na tela de impressão.</p>
  <label class="chk"><input type="checkbox" id="cs-cad" checked> Identificação e anamnese (cadastro)</label>
  <label class="chk"><input type="checkbox" id="cs-cron" checked> Cronograma de encontros e faltas</label>
  <label class="chk"><input type="checkbox" id="cs-res" checked> Resumo de cada atendimento</label>
  <label class="chk"><input type="checkbox" id="cs-sup"> Incluir notas da supervisão</label>
  <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-caso="fechar">Cancelar</button><button class="btn pri" data-caso="imprimir">🖨 Imprimir</button></div>`;
  d.showModal();
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-caso]"); if (!b || !DB) return;
  const p = DB.pacientes.find(x => x.id === V.pid), d = document.getElementById("dlg"), a = b.dataset.caso;
  if (a === "fechar") return d.close();
  if (!p) return;
  if (a === "print") return casoDialogo(p);
  if (a === "imprimir") {
    const o = { cad: d.querySelector("#cs-cad").checked, cron: d.querySelector("#cs-cron").checked, res: d.querySelector("#cs-res").checked, sup: d.querySelector("#cs-sup").checked };
    d.close(); printDoc(`Relato de caso — ${p.codigo || "paciente"}`, casoHTML(p, o), `Supervisão: ${p.supervisor || "—"}`); return;
  }
  if (a === "falta") {
    p.sessoes.push({ ...novaSessao(p), num: null, presenca: "Falta", motivo: "" });
    logP(p, "Falta registrada"); touch(); V.tab = "sessoes"; render();
  }
});
/* ao mudar a presença, redesenha para mostrar/esconder os campos */
document.addEventListener("change", e => {
  if (!e.target.dataset || e.target.dataset.f !== "presenca") return;
  setTimeout(() => {
    const s = R[e.target.dataset.o], p = DB.pacientes.find(x => x.id === V.pid);
    if (s && p && !ehFalta(s) && !s.num) s.num = p.sessoes.reduce((m, x) => Math.max(m, x.num || 0), 0) + 1; /* falta virou sessão: ganha número */
    touch(); V._keepScroll = true; render();
  }, 0);
});
