/* ============ 👋 Boas-vindas, ❓ Ajuda e Termos de uso ============ */
const AJUDA = [
  ["👥", "Como cadastro um paciente?", "Pacientes → + Novo paciente. Use só <b>código ou iniciais</b> (ex.: P07 – M.S.). Nunca nome completo, CPF ou endereço."],
  ["🗓", "Como registro uma sessão ou falta?", "No paciente, toque em <b>Sessões</b>. Use <b>+ Nova sessão</b> para atendimentos e <b>❌ Registrar falta</b> para faltas."],
  ["📝", "Onde fica o RPD?", "No paciente → <b>RPD · Seta · AWARE</b>. As colunas ficam lado a lado: deslize para o lado."],
  ["🖨", "Como imprimo o caso?", "No topo do paciente → <b>🖨 Imprimir caso</b>. No celular, escolha <b>Salvar como PDF</b>."],
  ["🎤", "Posso falar em vez de digitar?", "Sim. Toque no <b>🎤</b> do campo, fale, e toque de novo para parar. O <b>＋</b> abre o texto inteiro."],
  ["💾", "Meus dados estão seguros?", "Ficam <b>no aparelho, criptografados</b> com sua senha. Ligue o Google Drive em ⚙ Configurações para ter cópia extra."],
  ["🔑", "Esqueci a senha. E agora?", "Use o <b>código de recuperação</b> que você anotou ao criar o cofre. Sem senha e sem código, ninguém abre os dados — nem nós."],
  ["🎨", "Como mudo cores e tamanho?", "Botão <b>Aa</b> no topo: temas, estilo (quadradinhos ou clássico), ampliar, alto contraste e leitura em voz alta."],
  ["🧭", "Por onde começo um caso?", "Cadastro → <b>Direcionamento</b> (o kit sugere protocolo e próximos passos) → Sessões. Leve dúvidas à supervisão."],
  ["🤖", "Tenho uma dúvida clínica ou do kit", "Toque em <b>🤖 IA</b> e pergunte. Ela ajuda com TCC, técnicas e uso do kit. Não envie dados que identifiquem o paciente."]];
const TERMOS_VER = "1.0 (19/11/2026)";
const TERMOS = `<ol style="padding-left:18px">
  <li>O Kit Clínico TCC é uma <b>ferramenta de apoio</b>. Não substitui a formação, a supervisão nem o julgamento clínico do profissional.</li>
  <li>Os dados ficam <b>no seu aparelho</b>, criptografados com a sua senha, e, se você quiser, no <b>seu</b> Google Drive. O desenvolvedor não tem acesso a eles.</li>
  <li>Você é responsável por guardar sua <b>senha e o código de recuperação</b>. Sem eles, os dados não podem ser recuperados.</li>
  <li>Você se compromete a seguir o <b>Código de Ética do Psicólogo</b>, as resoluções do CFP sobre registro documental (Res. 01/2009) e a <b>LGPD</b> (Lei 13.709/2018), identificando pacientes só por código.</li>
  <li>Gravações só com <b>consentimento</b> do paciente. A transcrição e a IA, quando usadas, enviam conteúdo a serviços externos (Google e Anthropic).</li>
  <li>O conteúdo técnico tem referências científicas, mas pode conter falhas. Confira sempre nas fontes e com o supervisor.</li>
  <li>O kit é oferecido <b>como está</b>, sem garantia. Faça backups.</li></ol>
  <p class="ref">Política de privacidade completa: <a href="privacidade.html" target="_blank">privacidade.html</a> · Versão dos termos ${TERMOS_VER}</p>`;

function ajudaAbrir() {
  const d = document.getElementById("dlg");
  d.innerHTML = `<h2 style="margin-top:0">❓ Ajuda e dicas</h2>
  <div class="aj-grid">${AJUDA.map(([i, q, r]) => `<details class="aj"><summary><span class="aj-i">${i}</span> ${q}</summary><p>${r}</p></details>`).join("")}</div>
  <div class="row" style="justify-content:space-between;margin-top:12px"><span class="row" style="gap:6px"><button class="btn" data-aj="bv">👋 Boas-vindas</button><button class="btn" data-aj="termos">📄 Termos</button></span><span class="row" style="gap:6px"><button class="btn" data-aj="ia">🤖 Perguntar à IA</button><button class="btn pri" data-aj="fechar">Fechar</button></span></div>`;
  if (!d.open) d.showModal();
}
function bemVindo(passo = 0) {
  const d = document.getElementById("dlg");
  const P = [
    ["👋", "Bem-vindo(a) ao Kit Clínico TCC", "Seu apoio para registrar atendimentos e conduzir casos em TCC, com base científica."],
    ["🔒", "Sigilo em primeiro lugar", "Tudo fica <b>criptografado</b> no aparelho. Identifique pacientes <b>só por código</b>."],
    ["🧭", "Como funciona", "<b>Paciente</b> → Direcionamento, Sessões, RPD e mais.<br><b>Protocolos</b> e <b>Técnicas</b> guiam o caminho.<br><b>Agenda</b> lembra seus atendimentos."],
    ["💾", "Não perca nada", "Ligue o <b>Google Drive</b> em ⚙ Configurações. O kit faz cópias sozinho."],
    ["📄", "Termos de uso", TERMOS + `<label class="chk" style="margin-top:8px"><input type="checkbox" id="bvOk"> <b>Li e aceito os Termos de uso</b></label>`]];
  const [ic, t, x] = P[passo], ult = passo === P.length - 1;
  d.innerHTML = `<div style="text-align:center;font-size:44px;line-height:1">${ic}</div><h2 style="text-align:center;margin:8px 0">${t}</h2>
  <div style="${ult ? "max-height:50vh;overflow:auto" : "text-align:center"}">${x}</div>
  <div class="row" style="justify-content:center;gap:6px;margin:12px 0 4px">${P.map((_, i) => `<span style="width:8px;height:8px;border-radius:50%;background:${i === passo ? "var(--accent)" : "var(--line)"}"></span>`).join("")}</div>
  <div class="row" style="justify-content:space-between">${passo ? `<button class="btn" data-aj="bv" data-v="${passo - 1}">← Voltar</button>` : "<span></span>"}
  ${ult ? `<button class="btn pri" data-aj="aceito">Começar</button>` : `<button class="btn pri" data-aj="bv" data-v="${passo + 1}">Próximo →</button>`}</div>`;
  if (!d.open) d.showModal();
}
/* mostra as boas-vindas assim que não houver outra janela aberta (ex.: código de recuperação) */
let BV_T = null;
function bvAgendar() {
  clearTimeout(BV_T);
  BV_T = setTimeout(() => { if (!DB || DB.config.bemVindo) return; if (document.querySelector("dialog[open]")) return bvAgendar(); bemVindo(0); }, 700);
}
(() => {
  const st = document.createElement("style");
  st.textContent = `.aj-grid{display:grid;gap:8px}.aj{border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--panel)}
.aj summary{cursor:pointer;font-weight:600;display:flex;gap:8px;align-items:center}.aj-i{font-size:20px}.aj p{margin:8px 0 0}`;
  document.head.appendChild(st);
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-aj]"); if (!b) return;
    const a = b.dataset.aj, d = document.getElementById("dlg");
    if (a === "abrir") return ajudaAbrir();
    if (a === "fechar") return d.close();
    if (a === "bv") return bemVindo(+(b.dataset.v || 0));
    if (a === "termos") { d.innerHTML = `<h2 style="margin-top:0">📄 Termos de uso</h2>${TERMOS}${DB && DB.config.termosAceitos ? `<p class="ref">Aceitos em ${fmtDT(DB.config.termosAceitos)}.</p>` : ""}<div class="row" style="justify-content:flex-end"><button class="btn pri" data-aj="abrir">← Voltar</button></div>`; return; }
    if (a === "ia") { d.close(); const t = document.querySelector('[data-act="iaToggle"]'); if (t) t.click(); return; }
    if (a === "aceito") {
      if (!d.querySelector("#bvOk").checked) return alert("Para começar, marque que leu e aceita os Termos de uso.");
      DB.config.bemVindo = nowISO(); DB.config.termosAceitos = nowISO(); DB.config.termosVer = TERMOS_VER; touch(); save(); d.close();
    }
  });
})();
