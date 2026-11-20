/* ============ 🎓 Estudo: exemplos, onde estudar, casos didáticos e glossário ============
   Texto próprio, resumido a partir da bibliografia do estágio. Páginas = páginas impressas do sumário de cada livro.
   Quando o arquivo não mostra páginas (e-book), indicamos só o capítulo. */
Object.assign(REF, {
  JB21: "Beck, J. S. (2022). Terapia cognitivo-comportamental: teoria e prática (3ª ed.). Artmed. [e-book sem paginação: citamos capítulos]",
  BDES: "Beck, J. S. (2007). Terapia cognitiva para desafios clínicos: o que fazer quando o básico não funciona. Artmed.",
  T101: "Conceição, J., & Bueno, G. (Orgs.). (2020). 101 técnicas da terapia cognitivo-comportamental. [e-book]",
  LTN: "Leahy, R. L., Tirch, D., & Napolitano, L. A. (2013). Regulação emocional em psicoterapia: um guia para o terapeuta cognitivo-comportamental. Artmed.",
  FMG: "Friedberg, R. D., McClure, J. M., & Garcia, J. H. (2011). Técnicas de terapia cognitiva para crianças e adolescentes. Artmed.",
  WRIGHT: "Wright, J. H., Brown, G. K., Thase, M. E., & Basco, M. R. (2019). Aprendendo a terapia cognitivo-comportamental: um guia ilustrado (2ª ed.). Artmed.",
  PK: "Padesky, C. A., & Kennerley, H. (Orgs.). Diálogo socrático para a descoberta em psicoterapia (1ª ed.). Artmed.",
  WALT: "Waltman, S. H., Codd III, R. T., McFarr, L. M., & Moore, B. A. (2023). Questionamento socrático para terapeutas: aprenda a pensar e a intervir como um terapeuta cognitivo-comportamental. Artmed.",
  CMR: "Carvalho, M. R., Malagris, L. E. N., & Rangé, B. (Orgs.). (2019). Psicoeducação em terapia cognitivo-comportamental. Sinopsys.",
  NDP: "Nicoletti, E. A., Donadon, M. F., & Portela, C. E. (Orgs.). (2022). Guia prático de formulação de casos em terapia cognitivo-comportamental. Sinopsys.",
  HSW: "Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2021). Terapia de aceitação e compromisso: o processo e a prática da mudança consciente (2ª ed.). Artmed.",
  CRAMER13: "Cramer, H., Lauche, R., Langhorst, J., & Dobos, G. (2013). Yoga for depression: a systematic review and meta-analysis. Depression and Anxiety, 30(11), 1068–1083.",
  BG05: "Brown, R. P., & Gerbarg, P. L. (2005). Sudarshan Kriya yogic breathing in the treatment of stress, anxiety, and depression. Journal of Alternative and Complementary Medicine, 11(1), 189–201.",
  STREETER10: "Streeter, C. C., et al. (2010). Effects of yoga versus walking on mood, anxiety, and brain GABA levels. Journal of Alternative and Complementary Medicine, 16(11), 1145–1152.",
  DEMING: "Deming, W. E. (1986). Out of the crisis. MIT Press.",
  GUREL: "Gürel, E., & Tat, M. (2017). SWOT analysis: a theoretical review. Journal of International Social Research, 10(51), 994–1006.",
  LL02: "Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation. American Psychologist, 57(9), 705–717.",
  DORAN: "Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. Management Review, 70(11), 35–36.",
  COVEY: "Covey, S. R. (1989). Os 7 hábitos das pessoas altamente eficazes. [ed. bras.: BestSeller]",
  GOLL99: "Gollwitzer, P. M. (1999). Implementation intentions: strong effects of simple plans. American Psychologist, 54(7), 493–503."
});

/* onde estudar: [ref, local] · exemplo curto de diálogo/aplicação */
const ESTUDO = {
  seta: { ex: "P: “Vou errar na apresentação.” T: “Se errasse, o que isso significaria?” P: “Que vão rir de mim.” T: “E se rissem, o que diria sobre você?” P: “Que sou um fracasso.” → crença central (desvalor).",
    ler: [["JB21", "cap. 17 — Introdução às crenças"], ["T101", "técnica 86, p. 142"], ["BDES", "cap. 13, p. 273"], ["GP", "cap. 12, p. 147"]] },
  socratico: { ex: "Em vez de “isso é distorção”, pergunte: “O que te faz pensar isso?” → “Há algo que não combina com essa ideia?” → “Se uma amiga pensasse isso, o que você diria?” → “O que você conclui agora?”",
    ler: [["PK", "cap. 2 — Modelo de diálogo socrático em 4 estágios"], ["WALT", "livro inteiro (prática guiada)"], ["JB21", "cap. 14 — Avaliação de pensamentos automáticos"], ["T101", "técnica 61, p. 108"]] },
  rpd: { ex: "Situação: amiga não respondeu. PA: “Ela não gosta mais de mim” (80%). Emoção: tristeza 70%. Resposta: “Ela pode estar ocupada; já demorou antes” (60%). Resultado: PA 30%, tristeza 30%.",
    ler: [["GP", "caps. 6–9, p. 41–112 (RPD de 7 colunas)"], ["JB21", "cap. 15 — Respostas aos PAs"], ["T101", "técnica 33, p. 63"], ["WRIGHT", "cap. 5"]] },
  dcc: { ex: "Junte 3 RPDs (situações típicas). Para cada um, pergunte o significado do PA (“o que isso diz sobre você?”). Os significados que se repetem apontam a crença central; as regras “se… então…” e o que a pessoa faz para se proteger são as intermediárias e as estratégias compensatórias.",
    ler: [["JB21", "cap. 3 — Conceitualização cognitiva"], ["NDP", "livro inteiro (modelos de formulação)"], ["BDES", "cap. 2, p. 30"], ["KPD", "formulação colaborativa"], ["WRIGHT", "cap. 3"]] },
  cartoes: { ex: "Frente: “Quando eu pensar ‘sou incapaz’…”. Verso: “Lembre: terminei o curso, resolvo problemas no trabalho. Errar não é ser incapaz. Faça: respire e dê o 1º passo.”",
    ler: [["JB21", "cap. 15"], ["T101", "técnica 17, p. 39 · técnica 07, p. 21"], ["WRIGHT", "cap. 5"]] },
  crencas: { ex: "Crença antiga: “Sou incapaz” (90%). Crença nova: “Sou capaz em muitas coisas, mesmo errando às vezes” (40%). Registre evidências semanais da crença nova e reavalie as porcentagens.",
    ler: [["JB21", "cap. 18 — Modificação das crenças"], ["GP", "cap. 12, p. 147"], ["BDES", "cap. 13, p. 273"]] },
  continuum: { ex: "0% = “nunca faz nada certo”; 100% = “nunca erra”. Onde fica seu colega que errou uma vez? E você, olhando os fatos da semana? Normalmente ninguém está nos extremos.",
    ler: [["JB21", "cap. 18"], ["LEAHY", "técnicas para crenças"]] },
  distorcoes: { ex: "“Ninguém gosta de mim” → hipergeneralização. Pergunte: “Ninguém mesmo? Quem já demonstrou carinho esta semana?”",
    ler: [["JB21", "cap. 14"], ["T101", "técnica 58, p. 105"], ["BURNS", "lista clássica de distorções"]] },
  psicoed: { ex: "Desenhe com o paciente: situação → pensamento → emoção → corpo → ação, usando um episódio que ele trouxe hoje.",
    ler: [["JB21", "cap. 6 — A primeira sessão"], ["CMR", "introdução, p. 15"], ["T101", "técnica 62, p. 110"]] },
  emopens: { ex: "“Senti que fui deixada de lado.” → pensamento: “fui deixada de lado”; emoção: tristeza 60%.",
    ler: [["GP", "caps. 4 e 6, p. 27 e 41"], ["JB21", "cap. 13 — Emoções"], ["T101", "técnicas 12, 13 e 70 (p. 27, 29, 122)"]] },
  triade: { ler: [["JB21", "cap. 3"], ["GP", "cap. 13, p. 183"]] },
  ab: { ex: "Monitore 1 semana de atividades com notas de prazer (P) e domínio (D) de 0 a 10. Planeje 1 atividade pequena por dia com P ou D alto.",
    ler: [["JB21", "cap. 7 — Programação das atividades"], ["WRIGHT", "cap. 6"], ["GP", "cap. 13, p. 183"]] },
  resolucao: { ler: [["T101", "técnicas 01 e 02, p. 12 e 14"], ["BDES", "cap. 9, p. 183"], ["WRIGHT", "cap. 6"]] },
  decat: { ex: "“E se eu desmaiar no ônibus?” → Qual a chance real? Se acontecesse, o que faria? Quem ajudaria? Como estaria em 1 semana?",
    ler: [["T101", "técnica 05, p. 18"], ["JB21", "cap. 14"]] },
  experimentos: { ex: "Previsão: “Se eu falar na reunião, vão rir” (80%). Experimento: fazer 1 comentário. Resultado: ninguém riu; um colega concordou. Nova crença: 30%.",
    ler: [["GP", "cap. 11, p. 129"], ["T101", "técnicas 59 e 68, p. 106 e 119"], ["JB21", "cap. 19"]] },
  exposicao: { ler: [["WRIGHT", "cap. 7"], ["T101", "técnicas 18 e 34, p. 41 e 65"], ["CMR", "caps. 1, 5 e 7, p. 30, 77 e 88"]] },
  epr: { ler: [["T101", "técnicas 65 e 92, p. 116 e 153"], ["CMR", "cap. 4, p. 65"], ["CORD", "manual de TOC"]] },
  respiracao: { ex: "Inspire pelo nariz em 4 tempos, segure 1–2, solte devagar em 6. Mão na barriga: ela sobe, o peito quase não mexe. 5 minutos.",
    ler: [["T101", "técnicas 29, 90 e 91, p. 58, 150 e 152"]] },
  rmp: { ler: [["T101", "técnica 37, p. 69"]] },
  worry: { ler: [["T101", "técnicas 54 e 55, p. 98 e 100"], ["CMR", "cap. 2, p. 42"]] },
  preocprod: { ler: [["T101", "técnica 89, p. 149"], ["LEAHY", "manejo da preocupação"]] },
  responsab: { ex: "Evento: filho foi mal na prova. Fatias: falta de estudo dele (40%), prova difícil (20%), sono ruim (15%), escola (10%)… a da mãe fica 15%, não 100%.",
    ler: [["T101", "técnica 38, p. 71 (torta)"], ["GP", "cap. 15, p. 245"]] },
  assertiv: { ler: [["T101", "técnica 04, p. 16"], ["DP01", "vivências de habilidades sociais"]] },
  mindfulness: { ler: [["LTN", "cap. 5, p. 111"], ["JB21", "cap. 16"]] },
  desfusao: { ex: "Repita: “Estou tendo o pensamento de que sou um fracasso.” Note a distância que surge entre você e o pensamento.",
    ler: [["HSW", "cap. 9 — Desfusão"]] },
  valores: { ler: [["HSW", "caps. 11 e 12"]] },
  custos: { ler: [["HSW", "cap. 10 — Aceitação"], ["T101", "técnica 87, p. 145 (custo-benefício)"]] },
  dbtreg: { ler: [["LTN", "caps. 3, 7 e 8, p. 68, 152 e 165"]] },
  tipp: { ler: [["LTN", "cap. 10, p. 200"]] },
  estrutura: { ex: "Humor (0–10) → ponte → agenda → revisar plano de ação → itens da agenda → resumo → novo plano de ação → feedback.",
    ler: [["JB21", "caps. 10 e 11"], ["BDES", "cap. 8, p. 161"]] },
  recaida: { ler: [["JB21", "cap. 21"], ["T101", "técnica 23, p. 50"], ["GP", "cap. 16, p. 271"]] },
  panicoed: { ler: [["CMR", "cap. 1, p. 30"], ["T101", "técnica 85, p. 141 (luta e fuga)"]] },
  aware: { ler: [["JB21", "apêndice C — Passos na técnica AWARE"]] },
  checklist: { ler: [["BDES", "cap. 7, p. 137 (metas)"]] }
};
function tecEstudo(t) {
  const e = ESTUDO[t.id]; if (!e) return "";
  return `${e.ex ? `<div class="est-box"><b>💬 Exemplo</b><p>${esc(e.ex)}</p></div>` : ""}
  ${e.ler ? `<div class="est-box"><b>📖 Onde estudar</b><ul>${e.ler.map(([r, l]) => `<li><b>${esc(l)}</b><br><span class="ref">${esc(REF[r] || r)}</span></li>`).join("")}</ul></div>` : ""}`;
}

/* ---- técnicas de outras áreas (com base científica) ---- */
if (!ABORDAGENS.includes("Outras áreas")) ABORDAGENS.push("Outras áreas");
TECNICAS.push(
  { id: "yogaresp", nome: "Respiração do yoga (pranayama lento)", ab: "Outras áreas",
    ind: "Ansiedade, estresse, insônia; complemento à TCC.",
    passos: ["Respiração alternada pelas narinas: tampe uma, inspire; troque, expire (5 min)", "Ujjayi: expire longo com leve som na garganta", "Ritmo lento, ~5–6 respirações por minuto", "Pare se houver tontura"],
    refs: ["BG05", "STREETER10"] },
  { id: "yoga", nome: "Yoga como atividade terapêutica", ab: "Outras áreas",
    ind: "Depressão leve a moderada e ansiedade, junto ao tratamento (não substitui).",
    passos: ["Posturas suaves + respiração + relaxamento final", "2–3 vezes por semana, 30–60 min", "Pode entrar na ativação comportamental", "Respeite limites físicos e indicação médica"],
    refs: ["CRAMER13", "STREETER10"] },
  { id: "smart", nome: "Metas SMART", ab: "Outras áreas",
    ind: "Definir metas terapêuticas claras e mensuráveis.",
    passos: ["Específica: o quê, exatamente?", "Mensurável: como saberei que avancei? (0–100%, nº de vezes)", "Alcançável: é possível agora?", "Relevante: importa para o paciente?", "Temporal: até quando?"],
    refs: ["DORAN", "LL02"] },
  { id: "pdca", nome: "PDCA (planejar, fazer, checar, ajustar)", ab: "Outras áreas",
    ind: "Planos de ação e hábitos: tratar cada tarefa como um teste que se ajusta.",
    passos: ["Planejar: 1 objetivo e 1 ação pequena", "Fazer: executar na semana", "Checar: o que aconteceu? (registro)", "Agir: manter, ajustar ou trocar e recomeçar o ciclo"],
    refs: ["DEMING"] },
  { id: "swot", nome: "SWOT pessoal (forças, fraquezas, oportunidades, ameaças)", ab: "Outras áreas",
    ind: "Decisões de vida, carreira, autoconhecimento; equilibra a visão negativa de si.",
    passos: ["Forças: o que faço bem?", "Fraquezas: o que posso desenvolver?", "Oportunidades: o que está a meu favor fora de mim?", "Ameaças: o que pode atrapalhar?", "Cruze: como usar forças para aproveitar oportunidades?"],
    refs: ["GUREL"] },
  { id: "w5h2", nome: "Plano 5W2H / intenção de implementação", ab: "Outras áreas",
    ind: "Tirar a tarefa de casa do papel; procrastinação.",
    passos: ["O quê? Por quê? Onde? Quando? Quem?", "Como? Quanto (tempo/esforço)?", "Formato “se for 19h, então caminho 10 min”", "Revisar na sessão seguinte"],
    refs: ["GOLL99"] },
  { id: "eisenhower", nome: "Matriz de prioridades (urgente x importante)", ab: "Outras áreas",
    ind: "Sobrecarga, ansiedade com tarefas, dificuldade de dizer não.",
    passos: ["Importante e urgente: fazer agora", "Importante, não urgente: agendar", "Urgente, não importante: delegar ou simplificar", "Nem um nem outro: eliminar"],
    refs: ["COVEY"] }
);

/* ---- DCC guiado por perguntas (J. Beck, 2022, cap. 3) ---- */
const DCC_PERG = {
  infancia: "Que experiências da história (infância, família, escola) ajudam a entender como essa crença surgiu?",
  crencaCentral: "Se o pior pensamento fosse verdade, o que diria sobre você? (use a seta descendente) — é sobre desamparo, desamor ou desvalor?",
  regras: "Que regras você segue? Complete: “Se eu ___, então ___.” · “Eu deveria ___.” · “É terrível se ___.”",
  estrategias: "O que você faz para que a crença não se confirme? (evitar, agradar, perfeccionismo, controlar, se esconder)",
  situacao: "Em que situação recente o humor piorou?",
  pa: "O que passou pela sua cabeça naquele momento?",
  significado: "O que esse pensamento significa sobre você?",
  emocao: "O que você sentiu? (uma palavra, 0–100%)",
  comportamento: "O que você fez?"
};

/* ---- 🗂 Estudos de caso (fictícios, didáticos) ---- */
const CASOS = [
  { id: "c-dep", dem: ["depressao"], titulo: "Marcos, 41 — “Não sirvo para nada”", perfil: "Desempregado há 8 meses; parou de sair e de procurar emprego.",
    queixa: "Tristeza quase todo dia, sem prazer, dorme demais.", cc: "Sou incapaz (desamparo).", ci: "Se eu tentar, vou fracassar de novo. É melhor não tentar.",
    pa: "“Ninguém vai me contratar.” “Não adianta.”", comp: "Evita currículos, fica na cama, se isola.",
    metas: ["Retomar 1 atividade prazerosa por dia em 4 semanas", "Enviar 3 currículos por semana em 6 semanas", "PHQ-9 de 18 para menos de 10 em 12 semanas"],
    tec: ["psicoed", "ab", "rpd", "socratico", "seta", "continuum", "cartoes", "recaida"],
    aprendizado: "Na depressão, começar pelo comportamento (ativação) gera evidências para depois trabalhar as crenças." },
  { id: "c-tag", dem: ["tag"], titulo: "Lúcia, 35 — “E se acontecer algo ruim?”", perfil: "Mãe de dois, servidora, preocupa-se com tudo há anos.",
    queixa: "Preocupação constante, tensão muscular, insônia inicial.", cc: "O mundo é perigoso e não vou dar conta (desamparo).", ci: "Se eu me preocupar, fico preparada. Se relaxar, algo ruim acontece.",
    pa: "“E se meu filho se machucar?” “E se eu perder o emprego?”", comp: "Checa o celular dos filhos, pede garantias ao marido.",
    metas: ["Reduzir tempo de preocupação de 4 h para 1 h/dia em 8 semanas", "GAD-7 de 16 para menos de 8 em 12 semanas"],
    tec: ["psicoed", "worry", "preocprod", "decat", "experimentos", "mindfulness", "desfusao"],
    aprendizado: "Trabalhe as crenças positivas sobre preocupar-se (“me protege”) e a tolerância à incerteza." },
  { id: "c-pan", dem: ["panico"], titulo: "Rafael, 27 — “Vou ter um infarto”", perfil: "Teve ataque no ônibus; passou a evitar transporte e academia.",
    queixa: "Crises com taquicardia e falta de ar; medo de novas crises.", cc: "Sou frágil (desamparo).", ci: "Se o coração acelerar, é perigo. Preciso evitar qualquer sensação.",
    pa: "“Vou morrer.” “Vou perder o controle.”", comp: "Evita esforço, leva remédio no bolso, só sai acompanhado.",
    metas: ["Andar de ônibus sozinho 3 vezes por semana em 10 semanas", "Retomar a academia em 12 semanas"],
    tec: ["panicoed", "psicoed", "respiracao", "decat", "exposicao", "experimentos"],
    aprendizado: "A exposição interoceptiva (provocar as sensações em sessão) ensina que elas não são perigosas." },
  { id: "c-soc", dem: ["social"], titulo: "Ana Clara, 32 — “Vou falar algo errado”", perfil: "Analista; evita reuniões e apresentações.",
    queixa: "Medo de ser julgada, taquicardia e sudorese em público.", cc: "Sou incapaz / não sou boa o suficiente.", ci: "Se eu errar, serei rejeitada. Preciso ser perfeita para ser aceita.",
    pa: "“Vão perceber que não sei nada.” “Vou passar vergonha.”", comp: "Silêncio nas reuniões, evita contato com chefes.",
    metas: ["Ansiedade social de 90% para 40% em 12 semanas", "Participar de 2 reuniões por semana em 8 semanas"],
    tec: ["psicoed", "rpd", "exposicao", "experimentos", "assertiv", "seta", "cartoes"],
    aprendizado: "Baseado no caso fictício do minicurso “TCC na prática”: metas SMART + hierarquia de exposição." },
  { id: "c-toc", dem: ["toc"], titulo: "Beatriz, 24 — “Se eu não checar, a culpa é minha”", perfil: "Estudante; verifica fogão e portas por até 1 hora.",
    queixa: "Pensamentos intrusivos de incêndio; rituais de checagem.", cc: "Sou perigosa/irresponsável.", ci: "Se algo ruim acontecer e eu puder evitar, a culpa é toda minha.",
    pa: "“A casa vai pegar fogo por minha causa.”", comp: "Checa repetidamente, pede garantia à mãe, tira fotos do fogão.",
    metas: ["Reduzir checagens de 60 para 10 min/dia em 10 semanas"],
    tec: ["psicoed", "epr", "exposicao", "responsab", "desfusao"],
    aprendizado: "Sem prevenção de resposta, a exposição não funciona. A pizza da responsabilidade reduz a culpa inflada." },
  { id: "c-ins", dem: ["insonia"], titulo: "Sérgio, 55 — “Não vou conseguir dormir”", perfil: "Comerciante; insônia há 2 anos, passa 9 h na cama.",
    queixa: "Demora a dormir, acorda de madrugada, cansaço de dia.", cc: "Se eu não dormir, não dou conta (desamparo).", ci: "Preciso ficar mais tempo na cama para compensar.",
    pa: "“Amanhã vai ser um desastre.”", comp: "Cochila à tarde, fica na cama acordado, usa o celular.",
    metas: ["Eficiência do sono acima de 85% em 6 semanas"],
    tec: ["sono", "respiracao", "worry", "rmp"],
    aprendizado: "Restrição de sono e controle de estímulos são o coração da TCC-I." },
  { id: "c-reg", dem: ["desregulacao"], titulo: "Júlia, 22 — “Ninguém vai ficar comigo”", perfil: "Universitária; relações intensas e instáveis, explosões de raiva.",
    queixa: "Emoções muito fortes, impulsividade, medo de abandono.", cc: "Não sou amável (desamor).", ci: "Se a pessoa se afastar um pouco, vai me abandonar.",
    pa: "“Ele não respondeu, vai me deixar.”", comp: "Manda muitas mensagens, briga, depois se arrepende.",
    metas: ["Reduzir explosões de 3 para menos de 1 por semana em 12 semanas"],
    tec: ["dbtreg", "tipp", "mindfulness", "rpd", "plano"],
    aprendizado: "Sempre avalie risco de autolesão. Validação vem antes da mudança." }
];
const GLOSS = [
  ["Pensamento automático", "Conceitos", "Pensamento rápido e espontâneo que surge numa situação.", "Identificar o que dispara a emoção.", ["JB21", "GP"]],
  ["Crença central", "Conceitos", "Ideia global e rígida sobre si, os outros ou o mundo (desamparo, desamor, desvalor).", "Entender a raiz dos padrões; alvo da fase final.", ["JB21", "GP"]],
  ["Crença intermediária", "Conceitos", "Regras, atitudes e pressupostos (“Se…, então…”).", "Ligar a crença central aos comportamentos.", ["JB21"]],
  ["Estratégia compensatória", "Conceitos", "Comportamento usado para não confirmar a crença (evitar, agradar, perfeccionismo).", "Mostrar o que mantém o problema.", ["JB21", "NDP"]],
  ["Conceituação cognitiva", "Conceitos", "Mapa do caso que liga história, crenças e situações atuais.", "Guiar o plano de tratamento.", ["JB21", "NDP", "KPD"]],
  ["Tríade cognitiva", "Conceitos", "Visão negativa de si, do mundo e do futuro.", "Conceituar a depressão.", ["BECK79"]],
  ["Distorção cognitiva", "Conceitos", "Erro típico de pensamento (catastrofização, leitura mental…).", "Ajudar o paciente a reconhecer padrões.", ["JB21", "BURNS"]],
  ["Empirismo colaborativo", "Relação", "Terapeuta e paciente testam juntos as ideias, como cientistas.", "Base da aliança na TCC.", ["WRIGHT", "JB21"]],
  ["Descoberta guiada", "Relação", "Perguntas que levam o paciente a chegar às próprias conclusões.", "Mudança mais duradoura que conselhos.", ["PK", "WALT"]],
  ["Diálogo socrático (4 estágios)", "Relação", "Perguntas informativas → escuta empática → síntese → perguntas analíticas.", "Conduzir o questionamento com método.", ["PK"]],
  ["Plano de ação", "Sessão", "Tarefa entre sessões combinada com o paciente.", "Levar a mudança para a vida real.", ["JB21"]],
  ["Ponte", "Sessão", "Ligação com a sessão anterior.", "Dar continuidade ao tratamento.", ["JB21"]],
  ["Agenda", "Sessão", "Temas da sessão definidos em conjunto.", "Foco e eficiência.", ["JB21"]],
  ["Psicoeducação", "Sessão", "Ensinar sobre o problema e o modelo da TCC.", "Adesão e autonomia.", ["CMR", "JB21"]],
  ["Comportamento de segurança", "Ansiedade", "Ação sutil para evitar o perigo temido (levar remédio, não olhar nos olhos).", "Identificar e retirar na exposição.", ["CLARK86", "CW95"]],
  ["Evitação", "Ansiedade", "Fugir de situações, pensamentos ou sensações.", "Principal mantenedor da ansiedade.", ["WRIGHT"]],
  ["Aprendizado inibitório", "Ansiedade", "Na exposição, o cérebro aprende uma nova associação de segurança.", "Fundamento atual da exposição.", ["CRASKE14"]],
  ["SUDS", "Ansiedade", "Escala de desconforto de 0 a 100.", "Montar e acompanhar a hierarquia de exposição.", ["WRIGHT"]],
  ["Fusão cognitiva", "ACT", "Tomar o pensamento como verdade literal.", "Alvo da desfusão.", ["HSW"]],
  ["Flexibilidade psicológica", "ACT", "Estar presente e agir pelos valores mesmo com desconforto.", "Objetivo central da ACT.", ["HSW"]],
  ["Valores", "ACT", "Direções de vida escolhidas, que dão sentido.", "Motivar ação comprometida.", ["HSW"]],
  ["Validação", "Emoções", "Comunicar que a emoção faz sentido no contexto.", "Reduz a intensidade e fortalece a aliança.", ["LTN", "LINE"]],
  ["Esquema emocional", "Emoções", "Crenças da pessoa sobre as próprias emoções (“não posso sentir raiva”).", "Trabalhar a relação com as emoções.", ["LTN"]],
  ["Mente compassiva", "Emoções", "Treino de gentileza consigo diante do sofrimento.", "Reduzir autocrítica e vergonha.", ["LTN"]],
  ["Ruminação", "Processos", "Pensar repetidamente no passado e nos problemas.", "Comum na depressão; alvo de mindfulness e ativação.", ["WELLS09"]],
  ["Metacognição", "Processos", "Pensar sobre o próprio pensamento.", "Identificar crenças sobre preocupar-se e ruminar.", ["WELLS09"]],
  ["Ativação comportamental", "Comportamento", "Planejar atividades de prazer e domínio.", "Primeira linha na depressão.", ["MARTELL", "JB21"]],
  ["Prevenção de recaída", "Sessão", "Plano para sinais de alerta e manutenção dos ganhos.", "Fechamento seguro do tratamento.", ["JB21"]]
];
function pgEstudo() {
  return `<h1>🎓 Estudo</h1><p class="muted">Material para estudar e consultar. Casos fictícios e termos com referência.</p>
  <div class="est-tiles"><button class="est-tile" data-act="nav" data-v="casos"><span>🗂</span>Estudos de casos<small>${CASOS.length} casos didáticos</small></button>
  <button class="est-tile" data-act="nav" data-v="glossario"><span>📖</span>Glossário<small>${glossTodos().length} termos</small></button>
  <button class="est-tile" data-act="nav" data-v="tecnicas"><span>🧰</span>Técnicas<small>${TECNICAS.length} com passo a passo</small></button>
  <button class="est-tile" data-act="nav" data-v="literatura"><span>📚</span>Literatura<small>referências</small></button></div>`;
}
function casoCard(c) {
  return `<details class="item"><summary>${esc(c.titulo)} <span class="badge">${esc((PRO[c.dem[0]] || {}).nome || c.dem[0])}</span></summary><div class="body">
  <div class="est-grid">
  <div class="est-box"><b>👤 Perfil</b><p>${esc(c.perfil)}</p><p><b>Queixa:</b> ${esc(c.queixa)}</p></div>
  <div class="est-box"><b>🧩 Conceituação</b><p><b>Crença central:</b> ${esc(c.cc)}</p><p><b>Intermediárias:</b> ${esc(c.ci)}</p><p><b>PAs:</b> ${esc(c.pa)}</p><p><b>Comportamentos:</b> ${esc(c.comp)}</p></div>
  <div class="est-box"><b>🎯 Metas (SMART)</b><ul>${c.metas.map(m => `<li>${esc(m)}</li>`).join("")}</ul></div>
  <div class="est-box"><b>🧰 Técnicas</b><p>${c.tec.map(id => `<span class="chip">${esc(tecNome(id))}</span>`).join(" ")}</p></div>
  <div class="est-box"><b>💡 Aprendizado</b><p>${esc(c.aprendizado)}</p></div></div>
  <p class="ref">Caso fictício, criado para estudo. Não representa paciente real.</p></div></details>`;
}
function pgCasos() {
  return `<div class="ph"><button class="btn sm" data-act="nav" data-v="estudo">← Estudo</button><h1>🗂 Estudos de casos</h1></div>
  <p class="muted">Casos fictícios e didáticos, um por demanda. No paciente, a aba Direcionamento mostra os casos parecidos.</p>${CASOS.map(casoCard).join("")}`;
}
function casosParecidos(p) {
  const L = CASOS.filter(c => c.dem.some(d => (p.demandas || []).includes(d)));
  return L.length ? `<div class="card"><h3 style="margin-top:0">🗂 Casos parecidos para estudar</h3>${L.map(casoCard).join("")}</div>` : "";
}
function glossTodos() {
  const g = GLOSS.map(([t, cat, oq, pq, refs]) => ({ t, cat, oq, pq, refs }));
  TECNICAS.forEach(x => g.push({ t: x.nome, cat: "Técnica · " + x.ab, oq: x.ind, pq: (x.passos || [])[0] || "", refs: x.refs || [] }));
  DISTORCOES.forEach(([n, d]) => g.push({ t: n, cat: "Distorção cognitiva", oq: d, pq: "Reconhecer e questionar o pensamento.", refs: ["JB21", "BURNS"] }));
  return g.sort((a, b) => a.t.localeCompare(b.t, "pt"));
}
function pgGlossario() {
  const g = glossTodos(), cats = [...new Set(g.map(x => x.cat.split(" · ")[0]))];
  return `<div class="ph"><button class="btn sm" data-act="nav" data-v="estudo">← Estudo</button><h1>📖 Glossário</h1></div>
  <input id="glq" placeholder="🔍 Buscar termo…" style="margin-bottom:10px">
  <div style="margin-bottom:10px"><button class="chip on" data-glc="">Todos (${g.length})</button>${cats.map(c => `<button class="chip" data-glc="${esc(c)}">${esc(c)}</button>`).join("")}</div>
  <div id="glList">${g.map(x => `<details class="item gl" data-cat="${esc(x.cat.split(" · ")[0])}" data-txt="${esc(norm(x.t + " " + x.oq))}"><summary>${esc(x.t)} <span class="sum-meta">${esc(x.cat)}</span></summary><div class="body">
  <p><b>O que é:</b> ${esc(x.oq)}</p>${x.pq ? `<p><b>Pra que serve:</b> ${esc(x.pq)}</p>` : ""}<p class="ref">${x.refs.map(r => esc(REF[r] || r)).join("<br>")}</p></div></details>`).join("")}</div>`;
}
(() => {
  const st = document.createElement("style");
  st.textContent = `.est-box{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:8px 0;background:var(--panel)}.est-box p{margin:6px 0 0}.est-box ul{margin:6px 0 0;padding-left:18px}
.est-grid{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.est-tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}@media(min-width:761px){.est-tiles{grid-template-columns:repeat(4,1fr)}}
.est-tile{display:flex;flex-direction:column;align-items:center;gap:4px;padding:18px 8px;border:1px solid var(--line);border-radius:16px;background:var(--panel);color:var(--ink);font:inherit;font-weight:700;cursor:pointer;box-shadow:var(--shadow,0 1px 3px rgba(0,0,0,.06))}
.est-tile span{font-size:30px}.est-tile small{font-weight:400;color:var(--muted)}
.dcc-q{display:block;font-size:.85em;color:var(--muted);margin:2px 0 4px}`;
  document.head.appendChild(st);
  document.addEventListener("input", e => {
    if (e.target.id !== "glq") return;
    const q = norm(e.target.value);
    document.querySelectorAll("#glList .gl").forEach(d => d.style.display = d.dataset.txt.includes(q) ? "" : "none");
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-glc]"); if (!b) return;
    document.querySelectorAll("[data-glc]").forEach(x => x.classList.toggle("on", x === b));
    document.querySelectorAll("#glList .gl").forEach(d => d.style.display = !b.dataset.glc || d.dataset.cat === b.dataset.glc ? "" : "none");
  });
  /* DCC: puxar situações dos RPDs e criar cartão de enfrentamento */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-dcc]"); if (!b || !DB) return;
    const p = DB.pacientes.find(x => x.id === V.pid); if (!p) return; const c = p.conc;
    if (b.dataset.dcc === "puxar") {
      const rs = [...p.rpd].reverse().filter(r => r.situacao || r.pa); let n = 0;
      c.situacoes.forEach(s => { if (s.situacao || s.pa) return; const r = rs.shift(); if (!r) return;
        s.situacao = r.situacao || ""; s.pa = r.pa || ""; s.emocao = r.emocao || ""; s.comportamento = r.comport || ""; n++; });
      if (!n) return alert(p.rpd.length ? "As 3 situações já estão preenchidas ou os RPDs estão vazios." : "Ainda não há RPDs. Faça alguns em “RPD · Seta · AWARE”.");
      touch(); V._keepScroll = true; render(); return;
    }
    if (b.dataset.dcc === "cartao") {
      const resp = [...p.rpd].reverse().find(r => r.resposta);
      printDoc("Cartão de enfrentamento", `<table><tr><th style="width:50%">Quando eu pensar…</th><th>Lembre e faça…</th></tr>
      <tr><td style="height:160px">${esc(c.crencaCentral || "(crença ou pensamento difícil)")}</td><td>${esc(c.novaCrenca || (resp && resp.resposta) || "(crença nova / resposta alternativa)")}<br><br><b>O que fazer:</b> ${esc((resp && resp.fazer) || "")}</td></tr></table>
      <p class="ref">Recorte e leve com você. Baseado em J. Beck (2022), cap. 15.</p>`, p.codigo || "");
    }
  });
})();
