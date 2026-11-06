/* =====================================================================
   Kit Clínico TCC — BASE DE CONHECIMENTO
   Técnicas, protocolos por demanda e referências.
   Para acrescentar conteúdo, edite este arquivo (não contém dados de pacientes).
   Confira sempre edição/páginas na fonte original antes de citar em trabalhos.
   ===================================================================== */

const REF = {
  JB: "Beck, J. S. (2022). Terapia cognitivo-comportamental: teoria e prática (3ª ed.). Artmed.",
  BECK79: "Beck, A. T., Rush, A. J., Shaw, B. F., & Emery, G. (1997). Terapia cognitiva da depressão. Artmed. (Obra original de 1979.)",
  BECK08: "Beck, A. T. (2008). The evolution of the cognitive model of depression and its neurobiological correlates. American Journal of Psychiatry, 165(8), 969–977.",
  BE85: "Beck, A. T., & Emery, G. (1985). Anxiety disorders and phobias: a cognitive perspective. Basic Books.",
  GP: "Greenberger, D., & Padesky, C. A. (2017). A mente vencendo o humor (2ª ed.). Artmed.",
  LEAHY: "Leahy, R. L. (2018). Técnicas de terapia cognitiva: manual do terapeuta (2ª ed.). Artmed.",
  RANGE: "Rangé, B. (Org.). (2011). Psicoterapias cognitivo-comportamentais: um diálogo com a psiquiatria (2ª ed.). Artmed.",
  KPD: "Kuyken, W., Padesky, C. A., & Dudley, R. (2010). Conceitualização de casos colaborativa. Artmed.",
  CB12: "Clark, D. A., & Beck, A. T. (2012). Terapia cognitiva para os transtornos de ansiedade. Artmed.",
  BURNS: "Burns, D. D. (1980). Feeling good: the new mood therapy. William Morrow.",
  PAD94: "Padesky, C. A. (1994). Schema change processes in cognitive therapy. Clinical Psychology & Psychotherapy, 1(5), 267–278.",
  BL04: "Bennett-Levy, J., Butler, G., Fennell, M., Hackmann, A., Mueller, M., & Westbrook, D. (2004). Oxford guide to behavioural experiments in cognitive therapy. Oxford University Press.",
  MARTELL: "Martell, C. R., Dimidjian, S., & Herman-Dunn, R. (2010). Behavioral activation for depression: a clinician's guide. Guilford.",
  DIM06: "Dimidjian, S., et al. (2006). Randomized trial of behavioral activation, cognitive therapy, and antidepressant medication in the acute treatment of adults with major depression. Journal of Consulting and Clinical Psychology, 74(4), 658–670.",
  CUIJ13: "Cuijpers, P., et al. (2013). A meta-analysis of cognitive-behavioural therapy for adult depression, alone and in comparison with other treatments. Canadian Journal of Psychiatry, 58(7), 376–385.",
  HOF12: "Hofmann, S. G., Asnaani, A., Vonk, I. J., Sawyer, A. T., & Fang, A. (2012). The efficacy of cognitive behavioral therapy: a review of meta-analyses. Cognitive Therapy and Research, 36(5), 427–440.",
  NEZU: "Nezu, A. M., Nezu, C. M., & D'Zurilla, T. J. (2013). Problem-solving therapy: a treatment manual. Springer.",
  ZAC18: "Zaccaro, A., et al. (2018). How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 12, 353.",
  JAC38: "Jacobson, E. (1938). Progressive relaxation. University of Chicago Press.",
  BB73: "Bernstein, D. A., & Borkovec, T. D. (1973). Progressive relaxation training: a manual for the helping professions. Research Press.",
  CRASKE14: "Craske, M. G., Treanor, M., Conway, C. C., Zbozinek, T., & Vervliet, B. (2014). Maximizing exposure therapy: an inhibitory learning approach. Behaviour Research and Therapy, 58, 10–23.",
  FOA12: "Foa, E. B., Yadin, E., & Lichner, T. K. (2012). Exposure and response (ritual) prevention for obsessive-compulsive disorder: therapist guide (2nd ed.). Oxford University Press.",
  CORD: "Cordioli, A. V. (2014). TOC: manual de terapia cognitivo-comportamental para o transtorno obsessivo-compulsivo (2ª ed.). Artmed.",
  OST15: "Öst, L.-G., Havnen, A., Hansen, B., & Kvale, G. (2015). Cognitive behavioral treatments of obsessive–compulsive disorder: a systematic review and meta-analysis of studies published 1993–2014. Clinical Psychology Review, 40, 156–169.",
  BORK83: "Borkovec, T. D., Wilkinson, L., Folensbee, R., & Lerman, C. (1983). Stimulus control applications to the treatment of worry. Behaviour Research and Therapy, 21(3), 247–251.",
  DUGAS: "Dugas, M. J., & Robichaud, M. (2007). Cognitive-behavioral treatment for generalized anxiety disorder: from science to practice. Routledge.",
  SB12: "Stanley, B., & Brown, G. K. (2012). Safety planning intervention: a brief intervention to mitigate suicide risk. Cognitive and Behavioral Practice, 19(2), 256–264.",
  STAN18: "Stanley, B., et al. (2018). Comparison of the safety planning intervention with follow-up vs usual care of suicidal patients treated in the emergency department. JAMA Psychiatry, 75(9), 894–900.",
  WBB: "Wenzel, A., Brown, G. K., & Beck, A. T. (2010). Terapia cognitivo-comportamental para pacientes suicidas. Artmed.",
  BROWN05: "Brown, G. K., et al. (2005). Cognitive therapy for the prevention of suicide attempts: a randomized controlled trial. JAMA, 294(5), 563–570.",
  POSNER: "Posner, K., et al. (2011). The Columbia–Suicide Severity Rating Scale: initial validity and internal consistency findings. American Journal of Psychiatry, 168(12), 1266–1277.",
  DAZZI: "Dazzi, T., Gribble, R., Wessely, S., & Fear, N. T. (2014). Does asking about suicide and related behaviours induce suicidal ideation? What is the evidence? Psychological Medicine, 44(16), 3361–3363.",
  SEGAL: "Segal, Z. V., Williams, J. M. G., & Teasdale, J. D. (2013). Mindfulness-based cognitive therapy for depression (2nd ed.). Guilford.",
  KZ: "Kabat-Zinn, J. (1990). Full catastrophe living. Delacorte.",
  KUY16: "Kuyken, W., et al. (2016). Efficacy of mindfulness-based cognitive therapy in prevention of depressive relapse: an individual patient data meta-analysis. JAMA Psychiatry, 73(6), 565–574.",
  GOLD18: "Goldberg, S. B., et al. (2018). Mindfulness-based interventions for psychiatric disorders: a systematic review and meta-analysis. Clinical Psychology Review, 59, 52–60.",
  HOLZ11: "Hölzel, B. K., et al. (2011). How does mindfulness meditation work? Proposing mechanisms of action from a conceptual and neural perspective. Perspectives on Psychological Science, 6(6), 537–559.",
  HAYES: "Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2021). Terapia de aceitação e compromisso: o processo e a prática da mudança consciente (2ª ed.). Artmed.",
  ATJAK: "A-Tjak, J. G. L., et al. (2015). A meta-analysis of the efficacy of acceptance and commitment therapy for clinically relevant mental and physical health problems. Psychotherapy and Psychosomatics, 84(1), 30–36.",
  LINE: "Linehan, M. M. (2018). Treinamento de habilidades em DBT: manual de terapia comportamental dialética para o terapeuta (2ª ed.). Artmed.",
  STORE: "Storebø, O. J., et al. (2020). Psychological therapies for people with borderline personality disorder. Cochrane Database of Systematic Reviews, CD012955.",
  RIEM: "Riemann, D., et al. (2017). European guideline for the diagnosis and treatment of insomnia. Journal of Sleep Research, 26(6), 675–700.",
  QAS: "Qaseem, A., et al. (2016). Management of chronic insomnia disorder in adults: a clinical practice guideline from the American College of Physicians. Annals of Internal Medicine, 165(2), 125–133.",
  TRAUER: "Trauer, J. M., et al. (2015). Cognitive behavioral therapy for chronic insomnia: a systematic review and meta-analysis. Annals of Internal Medicine, 163(3), 191–204.",
  ME03: "Morin, C. M., & Espie, C. A. (2003). Insomnia: a clinical guide to assessment and treatment. Springer.",
  BASTIEN: "Bastien, C. H., Vallières, A., & Morin, C. M. (2001). Validation of the Insomnia Severity Index as an outcome measure for insomnia research. Sleep Medicine, 2(4), 297–307.",
  LEDOUX: "LeDoux, J. (1996). The emotional brain. Simon & Schuster.",
  OG05: "Ochsner, K. N., & Gross, J. J. (2005). The cognitive control of emotion. Trends in Cognitive Sciences, 9(5), 242–249.",
  CLARK86: "Clark, D. M. (1986). A cognitive approach to panic. Behaviour Research and Therapy, 24(4), 461–470.",
  CB07: "Craske, M. G., & Barlow, D. H. (2007). Mastery of your anxiety and panic: therapist guide (4th ed.). Oxford University Press.",
  CW95: "Clark, D. M., & Wells, A. (1995). A cognitive model of social phobia. In R. G. Heimberg et al. (Eds.), Social phobia: diagnosis, assessment, and treatment (pp. 69–93). Guilford.",
  MW14: "Mayo-Wilson, E., et al. (2014). Psychological and pharmacological interventions for social anxiety disorder in adults: a systematic review and network meta-analysis. The Lancet Psychiatry, 1(5), 368–376.",
  RESICK: "Resick, P. A., Monson, C. M., & Chard, K. M. (2017). Cognitive processing therapy for PTSD: a comprehensive manual. Guilford.",
  FOA07: "Foa, E. B., Hembree, E. A., & Rothbaum, B. O. (2007). Prolonged exposure therapy for PTSD: therapist guide. Oxford University Press.",
  NAJ: "Najavits, L. M. (2002). Seeking safety: a treatment manual for PTSD and substance abuse. Guilford.",
  KROENKE: "Kroenke, K., Spitzer, R. L., & Williams, J. B. W. (2001). The PHQ-9: validity of a brief depression severity measure. Journal of General Internal Medicine, 16(9), 606–613.",
  SPITZER: "Spitzer, R. L., Kroenke, K., Williams, J. B. W., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. Archives of Internal Medicine, 166(10), 1092–1097.",
  NICE113: "NICE (2011). Generalised anxiety disorder and panic disorder in adults: management (Clinical guideline CG113).",
  NICE159: "NICE (2013). Social anxiety disorder: recognition, assessment and treatment (Clinical guideline CG159).",
  NICE222: "NICE (2022). Depression in adults: treatment and management (Guideline NG222).",
  NICE31: "NICE (2005). Obsessive-compulsive disorder and body dysmorphic disorder: treatment (Clinical guideline CG31).",
  NICE116: "NICE (2018). Post-traumatic stress disorder (Guideline NG116).",
  NICE225: "NICE (2022). Self-harm: assessment, management and preventing recurrence (Guideline NG225).",
  DSM: "American Psychiatric Association (2023). DSM-5-TR: manual diagnóstico e estatístico de transtornos mentais (5ª ed., texto revisado). Artmed.",
  CE: "Conselho Federal de Psicologia (2005). Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005).",
  R0109: "Conselho Federal de Psicologia. Resolução CFP nº 001/2009 — obrigatoriedade do registro documental decorrente da prestação de serviços psicológicos.",
  R0619: "Conselho Federal de Psicologia. Resolução CFP nº 006/2019 — elaboração de documentos escritos produzidos pela(o) psicóloga(o).",
  R1118: "Conselho Federal de Psicologia. Resolução CFP nº 011/2018 — prestação de serviços psicológicos por meio de tecnologias da informação e da comunicação.",
  R3122: "Conselho Federal de Psicologia. Resolução CFP nº 031/2022 — diretrizes para a realização de avaliação psicológica e regulamentação do SATEPSI.",
  LGPD: "Brasil. Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (dados de saúde = dados pessoais sensíveis: art. 5º, II, e art. 11).",
  L13819: "Brasil. Lei nº 13.819/2019 — Política Nacional de Prevenção da Automutilação e do Suicídio.",
  L11788: "Brasil. Lei nº 11.788/2008 — dispõe sobre o estágio de estudantes (supervisão obrigatória).",
  CFP13: "Conselho Federal de Psicologia (2013). O suicídio e os desafios para a psicologia. CFP."
};

Object.assign(REF, {
  LOWE04: "Löwe, B., Unützer, J., Callahan, C. M., Perkins, A. J., & Kroenke, K. (2004). Monitoring depression treatment outcomes with the Patient Health Questionnaire-9. Medical Care, 42(12), 1194–1201.",
  SANTOS13: "Santos, I. S., Tavares, B. F., Munhoz, T. N., et al. (2013). Sensibilidade e especificidade do Patient Health Questionnaire-9 (PHQ-9) entre adultos da população geral. Cadernos de Saúde Pública, 29(8), 1533–1543.",
  SIMON13: "Simon, G. E., Rutter, C. M., Peterson, D., et al. (2013). Does response on the PHQ-9 depression questionnaire predict subsequent suicide attempt or suicide death? Psychiatric Services, 64(12), 1195–1202.",
  KROENKE07: "Kroenke, K., Spitzer, R. L., Williams, J. B. W., Monahan, P. O., & Löwe, B. (2007). Anxiety disorders in primary care: prevalence, impairment, comorbidity, and detection. Annals of Internal Medicine, 146(5), 317–325.",
  BECK96: "Beck, A. T., Steer, R. A., & Brown, G. K. (1996). Manual for the Beck Depression Inventory-II. Psychological Corporation.",
  GOR11: "Gorenstein, C., Pang, W. Y., Argimon, I. L., & Werlang, B. S. G. (2011). Inventário de Depressão de Beck – II: manual. Casa do Psicólogo.",
  BECK88: "Beck, A. T., Epstein, N., Brown, G., & Steer, R. A. (1988). An inventory for measuring clinical anxiety: psychometric properties. Journal of Consulting and Clinical Psychology, 56(6), 893–897.",
  CUNHA01: "Cunha, J. A. (2001). Manual da versão em português das Escalas Beck. Casa do Psicólogo."
});

/* ----------------------------- ESCALAS (explicações) ----------------------------- */
const ESCALAS = {
  humor: { rotulo: "Humor 0–10", nome: "Checagem de humor (0–10)", min: 0, max: 10, uso: "Livre — não é teste psicológico",
    curta: "Como a paciente avalia o próprio humor",
    simples: "Pergunta rápida no início da sessão: “De 0 a 10, como esteve seu humor nesta semana?” (0 = o pior que já se sentiu, 10 = o melhor). Serve para acompanhar a evolução de uma sessão para outra e para abrir a conversa.",
    faixas: [[0, 3, "humor baixo"], [4, 6, "intermediário"], [7, 10, "bom"]], faixasNota: "Faixas apenas práticas, não validadas.",
    exemplo: "A paciente diz “uns 4, a semana foi pesada”. Na sessão anterior foi 6. Pergunte: “O que fez cair de 6 para 4?” — a resposta pode virar item da agenda.",
    tecnico: ["Não é instrumento padronizado: é uma escala subjetiva (tipo escala visual analógica) usada na checagem de humor da estrutura de sessão de J. Beck.", "Compare sempre com a semana anterior e peça exemplos concretos.", "Pode ser usada também para ansiedade, raiva etc. (0–10 ou 0–100%).", "Complemente periodicamente com escalas padronizadas (PHQ-9, GAD-7)."],
    refs: ["JB"] },
  phq9: { rotulo: "PHQ-9 (0–27)", nome: "PHQ-9 — Questionário sobre a Saúde do Paciente", min: 0, max: 27, uso: "Uso livre (domínio público)",
    curta: "Sintomas de depressão nas últimas 2 semanas",
    simples: "São 9 perguntas sobre sintomas de depressão nas últimas 2 semanas: tristeza, perda de interesse, sono, cansaço, apetite, culpa, concentração, lentidão ou agitação e pensamentos de morte. Cada uma vale de 0 a 3; somando, o total vai de 0 a 27. Quanto maior, mais sintomas.",
    faixas: [[0, 4, "mínimo"], [5, 9, "leve"], [10, 14, "moderado"], [15, 19, "moderadamente grave"], [20, 27, "grave"]],
    exemplo: "Respostas 2, 2, 3, 2, 1, 1, 1, 0, 0 → total 12 = sintomas moderados. Se na 6ª sessão o total cair para 6, a queda de 6 pontos sugere melhora clinicamente relevante.",
    tecnico: ["Cada item: 0 = nenhuma vez · 1 = vários dias · 2 = mais da metade dos dias · 3 = quase todos os dias.", "Ponto de corte ≥ 10: sensibilidade e especificidade de 88% para depressão maior no estudo original.", "Mudança clinicamente relevante: redução de cerca de 5 pontos.", "Pergunta final (não pontuada) sobre o quanto os problemas dificultam trabalho, casa e relações.", "É rastreio, não diagnóstico: confirme com entrevista clínica.", "Validado no Brasil (Santos et al., 2013).", "O item 9 deve sempre ser lido separadamente (ver “PHQ-9 item 9”)."],
    refs: ["KROENKE", "LOWE04", "SANTOS13"] },
  phq9i9: { rotulo: "PHQ-9 item 9", nome: "PHQ-9, item 9 — pensamentos de morte ou de se ferir", min: 0, max: 3, uso: "Parte do PHQ-9 (uso livre)",
    curta: "Pensou que seria melhor estar morta ou em se ferir?",
    simples: "É a 9ª pergunta do PHQ-9: “Pensar em se ferir de alguma maneira ou que seria melhor estar morto(a)”. Vale de 0 a 3. Qualquer resposta acima de 0 pede uma conversa direta sobre risco de suicídio na mesma sessão.",
    faixas: [[0, 0, "nenhuma vez"], [1, 3, "⚠ avaliar risco nesta sessão"]],
    exemplo: "A paciente marca 1. Pergunte com calma e diretamente: “Você marcou que às vezes pensa que seria melhor estar morta. Me conta como são esses pensamentos? Já pensou em se matar?” Registre na aba Risco e segurança e comunique a supervisão.",
    tecnico: ["Resposta positiva está associada a maior risco posterior de tentativa e de morte por suicídio, mas a maioria das pessoas com item 9 positivo não tenta: é rastreio, e a avaliação clínica decide.", "O item mistura ideação passiva (“melhor estar morto”) e autolesão; diferencie na entrevista.", "Use junto com a C-SSRS e o julgamento clínico."],
    refs: ["SIMON13", "KROENKE", "POSNER"] },
  gad7: { rotulo: "GAD-7 (0–21)", nome: "GAD-7 — Escala de Transtorno de Ansiedade Generalizada", min: 0, max: 21, uso: "Uso livre (domínio público)",
    curta: "Sintomas de ansiedade nas últimas 2 semanas",
    simples: "São 7 perguntas sobre ansiedade nas últimas 2 semanas: nervosismo, não conseguir parar de se preocupar, preocupar-se demais, dificuldade para relaxar, inquietação, irritabilidade e medo de que algo terrível aconteça. Cada uma de 0 a 3, total de 0 a 21.",
    faixas: [[0, 4, "mínimo"], [5, 9, "leve"], [10, 14, "moderado"], [15, 21, "grave"]],
    exemplo: "Total 14 = ansiedade moderada. Se a paciente também relata taquicardia, tontura e tremores em crises, investigue pânico e ansiedade de saúde.",
    tecnico: ["Cada item: 0 = nenhuma vez · 1 = vários dias · 2 = mais da metade dos dias · 3 = quase todos os dias.", "Ponto de corte ≥ 10: sensibilidade de 89% e especificidade de 82% para TAG no estudo original.", "Também rastreia razoavelmente pânico, ansiedade social e TEPT (Kroenke et al., 2007).", "É rastreio, não diagnóstico.", "Pergunta final sobre prejuízo funcional."],
    refs: ["SPITZER", "KROENKE07"] },
  bdi: { rotulo: "BDI-II (0–63)", nome: "BDI-II — Inventário de Depressão de Beck II", min: 0, max: 63, uso: "USO RESTRITO a psicólogos — verificar parecer favorável no SATEPSI",
    curta: "Depressão · 21 itens · uso restrito",
    simples: "São 21 grupos de frases sobre sintomas de depressão nas últimas 2 semanas. Em cada grupo a pessoa escolhe a frase que mais combina com ela (0 a 3). O total vai de 0 a 63.",
    faixas: [[0, 13, "mínimo"], [14, 19, "leve"], [20, 28, "moderado"], [29, 63, "grave"]], faixasNota: "Faixas originais (Beck et al., 1996). Confira as normas do manual brasileiro.",
    exemplo: "Total 22 = depressão moderada. Compare com o PHQ-9 da mesma semana; se divergirem muito, converse sobre os itens que mais pontuaram.",
    tecnico: ["Material protegido: use só a versão oficial adquirida (no Brasil, manual da Casa do Psicólogo).", "Interprete pelas normas do manual brasileiro (Gorenstein et al., 2011).", "Tem um item sobre pensamentos suicidas: leia separadamente.", "Registre aqui só o escore, nunca cópias do teste."],
    refs: ["BECK96", "GOR11", "R3122"] },
  bai: { rotulo: "BAI (0–63)", nome: "BAI — Inventário de Ansiedade de Beck", min: 0, max: 63, uso: "USO RESTRITO a psicólogos — verificar parecer favorável no SATEPSI",
    curta: "Ansiedade · 21 sintomas · uso restrito",
    simples: "Lista de 21 sintomas de ansiedade, muitos físicos (tremores, taquicardia, tontura, sensação de sufocação). A pessoa diz o quanto cada um a incomodou na última semana (0 a 3). O total vai de 0 a 63.",
    faixas: [[0, 10, "mínimo"], [11, 19, "leve"], [20, 30, "moderado"], [31, 63, "grave"]], faixasNota: "Faixas da versão brasileira (Cunha, 2001). Confira no manual.",
    exemplo: "Total 24 = moderado. Como o BAI pesa muito nos sintomas físicos, escore alto com GAD-7 baixo pode indicar pânico ou condição médica — vale avaliação clínica.",
    tecnico: ["Ênfase em sintomas somáticos e de pânico; diferencia ansiedade de depressão melhor que muitas escalas.", "Faixas originais (Beck et al., 1988/1993): 0–7 mínimo, 8–15 leve, 16–25 moderado, 26–63 grave; no Brasil, use as do manual (Cunha, 2001).", "Uso restrito; verifique o SATEPSI."],
    refs: ["BECK88", "CUNHA01", "R3122"] }
};
function faixaEsc(id, v) { v = Number(v); const f = ESCALAS[id].faixas.find(([a, b]) => v >= a && v <= b); return f ? f[2] : "fora da faixa"; }

const SOCRATICAS = [
  "Qual é a evidência de que esse pensamento é verdadeiro? E de que não é verdadeiro?",
  "Existe uma explicação alternativa?",
  "Qual é a pior coisa que poderia acontecer? Eu conseguiria lidar com isso?",
  "Qual é a melhor coisa que poderia acontecer? E o mais realista?",
  "Qual é o efeito de eu acreditar nesse pensamento? E qual seria o efeito de mudar meu pensamento?",
  "O que eu diria a um(a) amigo(a) querido(a) se estivesse na mesma situação?",
  "O que eu devo fazer agora?"
];

const DISTORCOES = [
  ["Pensamento tudo-ou-nada", "Ver a situação em só duas categorias, sem meio-termo. “Se não for perfeito, fracassei.”"],
  ["Catastrofização (adivinhação)", "Prever o futuro de forma negativa, sem considerar resultados mais prováveis."],
  ["Desqualificação do positivo", "Dizer a si mesmo que experiências positivas “não contam”."],
  ["Raciocínio emocional", "Achar que algo é verdade porque se “sente” fortemente. “Sinto que sou um fracasso, então sou.”"],
  ["Rotulação", "Colocar um rótulo fixo e global em si ou nos outros. “Sou um perdedor.”"],
  ["Magnificação / minimização", "Aumentar o negativo e diminuir o positivo."],
  ["Filtro mental (abstração seletiva)", "Prestar atenção a um detalhe negativo em vez de ver o quadro todo."],
  ["Leitura mental", "Acreditar que sabe o que os outros estão pensando, sem considerar outras possibilidades."],
  ["Supergeneralização", "Tirar uma conclusão negativa ampla a partir de um único fato."],
  ["Personalização", "Achar que os outros agem negativamente por sua causa."],
  ["Afirmações do tipo “deveria” / “tenho que”", "Ter regras rígidas sobre como você e os outros deveriam agir."],
  ["Visão em túnel", "Ver apenas os aspectos negativos de uma situação."]
];

const ABORDAGENS = ["TCC", "Comportamental", "Mindfulness", "ACT", "DBT", "Neurociência", "Prevenção do suicídio"];

/* ----------------------------- FICHAS (impressão para o paciente) ----------------------------- */
const blankRows = (cols, n = 5) => Array.from({ length: n }, () => `<tr class="blank">${"<td></td>".repeat(cols)}</tr>`).join("");

const FICHAS = {
  rpd: () => `<p>Quando perceber que seu humor mudou, pergunte-se: <b>“O que estava passando pela minha cabeça agora?”</b></p>
  <table><tr><th>Data / Situação</th><th>Pensamento automático<br><small>quanto acredito (0–100%)</small></th><th>Emoção<br><small>intensidade (0–100%)</small></th><th>Distorção</th><th>Resposta adaptativa<br><small>quanto acredito (0–100%)</small></th><th>Resultado<br><small>reavalie pensamento e emoção</small></th></tr>${blankRows(6)}</table>
  <h3>Perguntas para encontrar a resposta adaptativa</h3><ol>${SOCRATICAS.map(q => `<li>${q}</li>`).join("")}</ol>`,
  distorcoes: () => `<p>Pensamentos automáticos costumam seguir alguns padrões. Reconhecê-los ajuda a se distanciar deles.</p><table>${DISTORCOES.map(d => `<tr><th style="width:32%">${d[0]}</th><td>${d[1]}</td></tr>`).join("")}</table>`,
  modelo: () => `<p style="font-size:14pt;text-align:center"><b>Situação</b> → <b>Pensamento automático</b> → <b>Emoção · Reação do corpo · Comportamento</b></p>
  <p>Não é a situação em si que determina como nos sentimos, mas o significado que damos a ela. Duas pessoas na mesma situação podem sentir coisas diferentes porque pensam coisas diferentes.</p>
  <p>Pensamentos automáticos surgem rápido, parecem verdadeiros, mas nem sempre são. Podemos aprender a percebê-los, examiná-los e buscar formas mais realistas e úteis de ver a situação.</p>
  <h3>Meu exemplo</h3><table><tr><th>Situação</th><th>Pensamento</th><th>Emoção</th><th>Corpo</th><th>Comportamento</th></tr>${blankRows(5, 3)}</table>`,
  aware: () => `<h3>A.W.A.R.E. (Beck & Emery)</h3><ol>
  <li><b>A – Aceite a ansiedade.</b> Ela é desagradável, mas não é perigosa. Não lute contra ela.</li>
  <li><b>W – Observe (Watch).</b> Dê uma nota de 0 a 10 para sua ansiedade e observe como ela sobe e desce, como um observador curioso, sem julgar.</li>
  <li><b>A – Aja com a ansiedade.</b> Continue o que estava fazendo, devagar. Respire de forma lenta e tranquila.</li>
  <li><b>R – Repita os passos</b> anteriores até a ansiedade baixar a um nível confortável.</li>
  <li><b>E – Espere o melhor.</b> O que você teme raramente acontece. A ansiedade passa, e cada vez você lida melhor com ela.</li></ol>
  <h3>Versão em português: A.C.A.L.M.E.-S.E. (Rangé)</h3><p><b>A</b>ceite sua ansiedade · <b>C</b>ontemple as coisas ao seu redor · <b>A</b>ja com sua ansiedade · <b>L</b>ibere o ar dos pulmões · <b>M</b>antenha os passos anteriores · <b>E</b>xamine seus pensamentos · <b>S</b>orria, você conseguiu · <b>E</b>spere o futuro com aceitação.</p>
  <table><tr><th>Data / situação</th><th>Ansiedade antes (0–10)</th><th>O que fiz</th><th>Ansiedade depois (0–10)</th></tr>${blankRows(4, 4)}</table>`,
  respiracao: () => `<ol><li>Sente-se confortavelmente. Coloque uma mão no peito e outra no abdômen.</li><li>Inspire pelo nariz contando até 4, deixando o <b>abdômen</b> subir (o peito quase não se mexe).</li><li>Solte o ar devagar pela boca contando até 6.</li><li>Mantenha esse ritmo (cerca de 6 respirações por minuto) por 5 a 10 minutos.</li><li>Pratique todos os dias quando estiver calmo(a) — assim fica mais fácil usar em momentos difíceis.</li></ol><p><small>Se sentir tontura, volte a respirar normalmente e tente um ritmo mais leve.</small></p>
  <table><tr><th>Dia</th><th>Minutos</th><th>Tensão antes (0–10)</th><th>Tensão depois (0–10)</th></tr>${blankRows(4, 7)}</table>`,
  neuro: () => `<h3>Por que meu corpo reage assim?</h3><p>A ansiedade é o <b>sistema de alarme</b> do corpo. Uma região do cérebro chamada <b>amígdala</b> detecta possíveis ameaças e dispara a reação de <b>luta ou fuga</b>: coração acelera, respiração fica rápida, músculos tensos, suor, “frio na barriga”. Isso prepara o corpo para agir — é desconfortável, mas <b>não é perigoso</b>.</p>
  <p>O problema é quando o alarme dispara sem perigo real (um “alarme falso”). Quando evitamos as situações que tememos, sentimos alívio na hora, mas o cérebro não tem a chance de aprender que estava seguro — e o medo se mantém.</p>
  <p>A parte da frente do cérebro (<b>córtex pré-frontal</b>) ajuda a reavaliar a situação e a acalmar o alarme. Na terapia treinamos isso: examinar pensamentos, enfrentar aos poucos o que tememos e regular o corpo.</p>`,
  sono: () => `<h3>Regras para reeducar o sono</h3><ol><li>Vá para a cama só quando estiver com <b>sono</b> (não apenas cansado).</li><li>Use a cama apenas para dormir (e atividade sexual) — nada de celular, TV ou trabalho na cama.</li><li>Se não dormir em cerca de 20 minutos, levante, vá a outro cômodo e faça algo calmo com pouca luz. Volte quando tiver sono.</li><li>Acorde <b>sempre no mesmo horário</b>, inclusive fins de semana.</li><li>Evite cochilos durante o dia.</li></ol>
  <h3>Hábitos que ajudam</h3><ul><li>Evite cafeína depois do meio da tarde, álcool e nicotina à noite.</li><li>Quarto escuro, silencioso e com temperatura agradável.</li><li>Atividade física regular (não muito perto da hora de dormir).</li><li>Reserve um tempo antes de deitar para “desacelerar” e anotar preocupações para o dia seguinte.</li></ul>
  <h3>Diário do sono</h3><table><tr><th>Data</th><th>Deitei</th><th>Demorei p/ dormir</th><th>Acordei à noite (vezes/min)</th><th>Levantei</th><th>Qualidade (0–10)</th></tr>${blankRows(6, 7)}</table>`,
  cartao: () => `${[1, 2, 3].map(() => `<table style="margin-bottom:14px"><tr><th style="width:35%">Quando eu…</th><td style="height:50px"></td></tr><tr><th>Vou lembrar que…</th><td style="height:70px"></td></tr><tr><th>E posso fazer…</th><td style="height:70px"></td></tr></table>`).join("")}`,
  seta: () => `<p>Escolha um pensamento que te incomodou. Em vez de discutir se ele é verdadeiro, pergunte: <b>“Se isso fosse verdade, o que significaria para mim?”</b> e repita a pergunta para cada resposta.</p><table><tr><th>Pensamento inicial</th><td style="height:50px"></td></tr>${[1, 2, 3, 4].map(i => `<tr><th>↓ Se fosse verdade, o que significaria?</th><td style="height:50px"></td></tr>`).join("")}<tr><th>Crença no fim da seta</th><td style="height:50px"></td></tr></table>`,
  atividades: () => `<p>Anote o que fez em cada período e dê notas de <b>Prazer</b> (P, 0–10) e <b>Domínio/realização</b> (D, 0–10).</p><table><tr><th>Período</th><th>Seg</th><th>Ter</th><th>Qua</th><th>Qui</th><th>Sex</th><th>Sáb</th><th>Dom</th></tr>${["Manhã", "Tarde", "Noite"].map(p => `<tr class="blank"><th>${p}</th>${"<td></td>".repeat(7)}</tr>`).join("")}</table>
  <h3>Atividades que quero agendar esta semana</h3><table><tr><th>Atividade</th><th>Dia/horário</th><th>Fiz? P/D</th></tr>${blankRows(3, 4)}</table>`,
  mindfulness: () => `<h3>Espaço de respiração de 3 minutos (MBCT)</h3><ol><li><b>Consciência (1 min):</b> pare, feche os olhos se quiser. O que está passando agora — pensamentos, emoções, sensações no corpo? Apenas note, sem mudar nada.</li><li><b>Foco (1 min):</b> leve a atenção para a respiração, no abdômen. Quando a mente se distrair, gentilmente volte.</li><li><b>Expansão (1 min):</b> amplie a atenção para o corpo inteiro, a postura, o rosto. Leve essa consciência para o próximo momento do dia.</li></ol>
  <table><tr><th>Dia</th><th>Quando pratiquei</th><th>O que notei</th></tr>${blankRows(3, 7)}</table>`,
  tipp: () => `<h3>Habilidades TIP para crises (DBT)</h3><p>Use quando a emoção estiver muito intensa (acima de 8/10) e for difícil pensar.</p><ol><li><b>T – Temperatura:</b> água fria no rosto ou compressa gelada nos olhos/bochechas por ~30 segundos. <small>Não use se tiver problema cardíaco, sem orientação médica.</small></li><li><b>I – Intensa atividade física:</b> 10–20 minutos de movimento vigoroso (correr, pular, subir escada).</li><li><b>P – Respiração compassada:</b> solte o ar mais devagar do que inspira (ex.: 4 s inspirando, 6–8 s expirando).</li><li><b>P – Relaxamento muscular pareado:</b> ao soltar o ar, relaxe os músculos que estavam tensos.</li></ol>`,
  plano: (p) => {
    const v = (k) => (p && p[k] ? String(p[k]).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])).replace(/\n/g, "<br>") : "");
    const row = (n, t, k, h) => `<tr><th style="width:34%">${n}. ${t}</th><td style="height:${h || 70}px">${v(k)}</td></tr>`;
    return `<p>Este plano é para ser usado em momentos de crise. Siga os passos em ordem até se sentir seguro(a).</p><table>
    ${row(1, "Meus sinais de alerta (pensamentos, emoções, situações)", "sinais")}
    ${row(2, "O que posso fazer sozinho(a) para me acalmar", "internas")}
    ${row(3, "Pessoas e lugares que me ajudam a me distrair", "social")}
    ${row(4, "Pessoas a quem posso pedir ajuda (nome e telefone)", "ajuda")}
    ${row(5, "Profissionais e serviços", "profissionais", 90)}
    ${row(6, "Como deixar meu ambiente mais seguro", "ambiente")}
    ${row("♥", "Minhas razões para viver", "razoes")}</table>
    <p style="font-size:13pt"><b>CVV — 188</b> (24 h, gratuito, também por chat em cvv.org.br) · <b>SAMU — 192</b> · Em perigo imediato, vá ao pronto-socorro/UPA mais próximo.</p>`;
  }
};

/* ----------------------------- TÉCNICAS ----------------------------- */
const TECNICAS = [
  { id: "estrutura", nome: "Estrutura da sessão", ab: "TCC",
    ind: "Todas as sessões. Dá previsibilidade, foco e eficiência; modela no paciente uma forma organizada de lidar com problemas.",
    passos: ["Checagem de humor (escalas, medicação, uso de substâncias, sono)", "Ponte com a sessão anterior: o que foi importante? algo ficou pendente?", "Estabelecer a agenda colaborativamente e priorizar", "Revisar a tarefa de casa (o que aprendeu? o que dificultou?)", "Trabalhar os itens da agenda: identificar PAs, aplicar técnicas, psicoeducar", "Resumos periódicos e combinar nova tarefa (viável, com o paciente)", "Resumo final e pedido de feedback sobre a sessão"],
    refs: ["JB"] },
  { id: "psicoed", nome: "Psicoeducação: modelo cognitivo", ab: "TCC", ficha: "modelo",
    ind: "Primeiras sessões; base para RPD e reestruturação. Repetir sempre que o paciente perder o modelo de vista.",
    passos: ["Explique: o modo como interpretamos a situação influencia emoção, corpo e comportamento", "Use um exemplo do próprio paciente (situação → pensamento → reação)", "Mostre que pensamentos automáticos são rápidos, plausíveis e nem sempre verdadeiros", "Peça que o paciente explique com as próprias palavras (checar compreensão)", "Tarefa: notar mudanças de humor e perguntar “o que passou pela minha cabeça?”"],
    refs: ["JB", "GP", "BECK79"] },
  { id: "triade", nome: "Tríade cognitiva", ab: "TCC",
    ind: "Depressão principalmente: visão negativa de si, do mundo/experiências e do futuro. Útil para conceituar e monitorar.",
    passos: ["Mapear PAs do paciente nas três áreas: EU / MUNDO / FUTURO", "Registrar na aba Conceituação", "Escolher alvos para reestruturação a partir da área mais carregada", "Desesperança (futuro) elevada → avaliar risco de suicídio"],
    refs: ["BECK79", "JB", "BECK08"] },
  { id: "rpd", nome: "RPD — Registro de Pensamentos Disfuncionais", ab: "TCC", ficha: "rpd",
    ind: "Identificar e avaliar PAs. Começar com 3 colunas (situação, pensamento, emoção) e evoluir para o registro completo.",
    passos: ["Gatilho: perceber a mudança de humor", "Situação: onde, quando, com quem", "Pensamento automático e quanto acredita (0–100%)", "Emoção e intensidade (0–100%)", "Distorção cognitiva (opcional)", "Resposta adaptativa guiada pelas perguntas socráticas, e quanto acredita", "Resultado: reavaliar crença no PA e intensidade da emoção"],
    cuid: "Treine o RPD na sessão antes de passar como tarefa; se o paciente não sentir alívio, investigue (PA errado? crença central ativada?).",
    refs: ["JB", "GP", "LEAHY"] },
  { id: "socratico", nome: "Questionamento socrático / exame de evidências", ab: "TCC",
    ind: "Avaliar PAs e crenças por descoberta guiada, sem convencer o paciente.",
    passos: SOCRATICAS,
    refs: ["JB", "LEAHY", "GP"] },
  { id: "distorcoes", nome: "Identificação de distorções cognitivas", ab: "TCC", ficha: "distorcoes",
    ind: "Ajuda o paciente a se distanciar dos PAs reconhecendo padrões típicos de erro de pensamento.",
    passos: DISTORCOES.map(d => `${d[0]}: ${d[1]}`),
    refs: ["JB", "BURNS", "LEAHY"] },
  { id: "seta", nome: "Seta descendente", ab: "TCC", ficha: "seta",
    ind: "Chegar a crenças intermediárias e centrais a partir de um PA.",
    passos: ["Escolha um PA com forte carga emocional", "Em vez de questioná-lo, assuma-o como verdadeiro: “Se isso fosse verdade, o que significaria?”", "Repita: “E o que isso diz sobre você?” (crença central) ou “...sobre os outros / o mundo?”", "Pare quando surgir uma crença global, acompanhada de emoção forte", "Classifique (desamparo / desamor / desvalor) e leve ao diagrama de conceituação"],
    refs: ["JB", "BURNS", "LEAHY"] },
  { id: "dcc", nome: "Diagrama de conceituação cognitiva", ab: "TCC",
    ind: "Organizar o caso: história → crenças centrais → crenças intermediárias → estratégias compensatórias → situações típicas.",
    passos: ["Dados relevantes da história (infância, eventos marcantes)", "Crença(s) central(is) sobre si, outros e mundo", "Crenças intermediárias: regras, atitudes e pressupostos (“Se…, então…”)", "Estratégias compensatórias (como lida com a crença)", "Três situações típicas: PA → significado do PA → emoção → comportamento", "Compartilhar a hipótese com o paciente e revisar ao longo do tratamento"],
    refs: ["JB", "KPD"] },
  { id: "cartoes", nome: "Cartões de enfrentamento", ab: "TCC", ficha: "cartao",
    ind: "Consolidar respostas adaptativas e estratégias para situações difíceis previsíveis.",
    passos: ["Escolha a situação-problema ou PA recorrente", "Escreva a resposta adaptativa elaborada em sessão", "Inclua uma ação concreta que o paciente possa fazer", "Ler diariamente e nos momentos de necessidade"],
    refs: ["JB"] },
  { id: "ab", nome: "Ativação comportamental + monitoramento de atividades", ab: "Comportamental", ficha: "atividades",
    ind: "Depressão (1ª linha), especialmente com inatividade, anedonia e esquiva. Eficácia comparável à terapia cognitiva.",
    passos: ["Monitorar atividades por uma semana com notas de prazer e domínio (0–10)", "Psicoeducar: “agir antes de ter vontade” — o humor segue a ação", "Identificar padrões de esquiva (modelo TRAP → TRAC)", "Agendar atividades ligadas a valores, de forma graduada", "Revisar, ajustar e resolver obstáculos a cada sessão"],
    refs: ["MARTELL", "DIM06", "JB"] },
  { id: "resolucao", nome: "Resolução de problemas", ab: "TCC",
    ind: "Problemas reais e práticos (não apenas distorções); sobrecarga, crises, desesperança.",
    passos: ["Definir o problema de forma concreta", "Gerar o máximo de alternativas sem julgar (brainstorm)", "Avaliar prós e contras de cada alternativa", "Escolher e planejar a execução (passos, quando, obstáculos)", "Executar e avaliar o resultado; ajustar se necessário"],
    refs: ["NEZU", "JB"] },
  { id: "aware", nome: "Técnica A.W.A.R.E. / A.C.A.L.M.E.-S.E.", ab: "TCC", ficha: "aware",
    ind: "Manejo de ansiedade aguda e ataques de pânico, com foco em aceitar a ansiedade em vez de lutar contra ela.",
    passos: ["A — Aceitar a ansiedade", "W — Observar (Watch) sem julgar, dando nota 0–10", "A — Agir com a ansiedade (continuar a atividade, respirar devagar)", "R — Repetir os passos", "E — Esperar o melhor", "Versão brasileira de Rangé: A.C.A.L.M.E.-S.E."],
    cuid: "Apresente como forma de atravessar a ansiedade, não de eliminá-la a qualquer custo — senão pode virar comportamento de segurança.",
    refs: ["BE85", "RANGE", "CB12"] },
  { id: "respiracao", nome: "Respiração diafragmática lenta", ab: "Neurociência", ficha: "respiracao",
    ind: "Hiperativação autonômica, tensão, ansiedade generalizada. Respiração lenta (~6/min) aumenta a variabilidade da frequência cardíaca e o tônus parassimpático.",
    passos: ["Mão no abdômen, inspirar pelo nariz ~4 s expandindo o abdômen", "Expirar devagar ~6 s", "Ritmo ~6 respirações/min por 5–10 min", "Treinar diariamente fora da crise antes de usar em situações de ansiedade"],
    cuid: "No pânico e na exposição, evitar que vire comportamento de segurança (“só sobrevivi porque respirei”).",
    refs: ["ZAC18", "CB12"] },
  { id: "rmp", nome: "Relaxamento muscular progressivo", ab: "Comportamental",
    ind: "Tensão muscular, TAG, insônia.",
    passos: ["Ambiente calmo, posição confortável", "Tensionar um grupo muscular por 5–7 s, notando a tensão", "Soltar por 20–30 s, notando a diferença", "Percorrer os grupos: mãos, braços, rosto, pescoço, ombros, abdômen, pernas, pés", "Evoluir para versões abreviadas e relaxamento por evocação"],
    refs: ["JAC38", "BB73"] },
  { id: "exposicao", nome: "Exposição gradual (aprendizado inibitório)", ab: "Comportamental",
    ind: "Fobias, pânico/agorafobia, ansiedade social, TAG (exposição à preocupação), TEPT.",
    passos: ["Psicoeducar sobre esquiva e manutenção do medo", "Montar hierarquia de situações com nota de ansiedade (SUDS 0–100)", "Antes de cada exposição: “o que você prevê que vai acontecer?”", "Expor-se sem comportamentos de segurança, tempo suficiente para testar a previsão", "Depois: “o que aconteceu? o que aprendeu?” (violação da expectativa)", "Variar contextos e repetir; avançar na hierarquia"],
    cuid: "O objetivo é aprender algo novo (violar a expectativa), não apenas esperar a ansiedade cair. Exposição interoceptiva: avaliação médica prévia se houver condição cardíaca/respiratória.",
    refs: ["CRASKE14", "CB12", "CB07"] },
  { id: "epr", nome: "Exposição e prevenção de resposta (EPR)", ab: "Comportamental",
    ind: "TOC — tratamento psicológico de 1ª linha.",
    passos: ["Psicoeducar sobre o ciclo obsessão → ansiedade → compulsão → alívio", "Listar obsessões, compulsões e evitações; montar hierarquia", "Expor-se ao gatilho e abster-se do ritual (inclusive rituais mentais e pedidos de reasseguramento)", "Registrar ansiedade antes/durante/depois", "Tarefas diárias de EPR entre sessões; envolver familiares para reduzir acomodação"],
    refs: ["FOA12", "CORD", "OST15"] },
  { id: "experimentos", nome: "Experimentos comportamentais", ab: "TCC",
    ind: "Testar na prática previsões e crenças (ansiedade social, pânico, depressão, perfeccionismo).",
    passos: ["Identificar a crença/previsão e quanto acredita (0–100%)", "Planejar um experimento que a teste (o quê, quando, onde)", "Antecipar obstáculos e comportamentos de segurança a abandonar", "Realizar o experimento", "Comparar resultado com a previsão; reavaliar a crença"],
    refs: ["BL04", "JB"] },
  { id: "worry", nome: "Tempo da preocupação (controle de estímulos da preocupação)", ab: "TCC",
    ind: "TAG e preocupação excessiva.",
    passos: ["Reservar 20–30 min fixos por dia, sempre no mesmo lugar, para se preocupar", "Ao longo do dia, ao notar a preocupação, anotar e adiar para o horário marcado", "Voltar a atenção ao momento presente", "No horário: preocupar-se e, se possível, usar resolução de problemas"],
    refs: ["BORK83", "DUGAS"] },
  { id: "crencas", nome: "Reestruturação de crenças centrais", ab: "TCC",
    ind: "Fase intermediária/avançada, quando a crença central já foi identificada e a aliança está consolidada.",
    passos: ["Psicoeducar: crença é uma ideia aprendida, não um fato", "Formular crença nova, mais realista, e medir quanto acredita na antiga e na nova", "Técnica do continuum (0–100%) para crenças tudo-ou-nada", "Registro de dados positivos (diário de evidências da crença nova)", "Role-play intelecto-emoção e reestruturação de lembranças precoces", "Agir “como se” a nova crença fosse verdadeira"],
    refs: ["JB", "PAD94", "LEAHY"] },
  { id: "decat", nome: "Descatastrofização", ab: "TCC",
    ind: "Ansiedade, preocupação, pânico.",
    passos: ["Qual o pior que pode acontecer? Qual a probabilidade real?", "Se acontecer, como você lidaria? (plano de enfrentamento)", "Qual o melhor? Qual o mais realista?", "Quanto isso importará daqui a uma semana / um ano?"],
    refs: ["JB", "LEAHY", "CB12"] },
  { id: "plano", nome: "Plano de segurança (Stanley & Brown)", ab: "Prevenção do suicídio", ficha: "plano",
    ind: "Ideação suicida, tentativa prévia, autolesão. Construir colaborativamente, por escrito, na própria sessão.",
    passos: ["1. Sinais de alerta pessoais da crise", "2. Estratégias internas de enfrentamento (o que fazer sozinho)", "3. Pessoas e locais sociais que distraem", "4. Pessoas a quem pedir ajuda", "5. Profissionais e serviços (terapeuta, supervisor, CAPS, CVV 188, SAMU 192)", "6. Tornar o ambiente seguro (restrição de acesso a meios)", "Acrescentar razões para viver; paciente fica com uma cópia"],
    cuid: "Não substitui avaliação de risco nem encaminhamento. Estagiário: comunicar o supervisor no mesmo dia.",
    refs: ["SB12", "STAN18", "WBB"] },
  { id: "mindfulness", nome: "Mindfulness (atenção plena)", ab: "Mindfulness", ficha: "mindfulness",
    ind: "Ruminação, prevenção de recaída em depressão recorrente (MBCT), estresse, ansiedade, dor crônica.",
    passos: ["Psicoeducar: observar pensamentos como eventos mentais, não fatos", "Prática formal curta: espaço de respiração de 3 minutos", "Escaneamento corporal (body scan)", "Práticas informais: atividades do dia com atenção plena", "Diário de prática"],
    cuid: "Em trauma grave, psicose ativa ou dissociação, adaptar (práticas curtas, olhos abertos, foco externo).",
    refs: ["SEGAL", "KZ", "KUY16", "GOLD18", "HOLZ11"] },
  { id: "desfusao", nome: "Desfusão cognitiva", ab: "ACT",
    ind: "Pensamentos repetitivos que o paciente “compra” como verdade; quando o questionamento direto gera discussão.",
    passos: ["“Estou tendo o pensamento de que…” antes do PA", "Repetir a palavra em voz alta até perder o sentido", "“Folhas no rio”: colocar cada pensamento numa folha e deixar passar", "Agradecer à mente: “Obrigado, mente, por esse pensamento”", "Perguntar: esse pensamento me ajuda a ir na direção do que importa?"],
    refs: ["HAYES", "ATJAK"] },
  { id: "valores", nome: "Valores e ação comprometida", ab: "ACT",
    ind: "Falta de direção, depressão, esquiva experiencial; complementa a ativação comportamental.",
    passos: ["Explorar áreas da vida: relações, trabalho/estudo, saúde, lazer, espiritualidade", "Diferenciar valores (direções) de metas (pontos de chegada)", "Escolher pequenas ações coerentes com os valores para a semana", "Antecipar barreiras internas e praticar disposição (willingness)"],
    refs: ["HAYES", "ATJAK"] },
  { id: "tipp", nome: "Tolerância ao mal-estar: TIP (DBT)", ab: "DBT", ficha: "tipp",
    ind: "Crises de emoção intensa, impulsividade, risco de comportamentos autolesivos.",
    passos: ["T — Temperatura: água fria no rosto ~30 s (reflexo de mergulho)", "I — Intensa atividade física por 10–20 min", "P — Respiração compassada (expiração mais longa)", "P — Relaxamento muscular pareado com a expiração"],
    cuid: "Água fria: cautela em cardiopatias, bradicardia e transtornos alimentares — orientar avaliação médica.",
    refs: ["LINE"] },
  { id: "dbtreg", nome: "Regulação emocional e efetividade interpessoal (DBT)", ab: "DBT",
    ind: "Desregulação emocional, conflitos interpessoais, traços borderline.",
    passos: ["Nomear e descrever emoções (função das emoções)", "Verificar os fatos: a emoção e sua intensidade combinam com a situação?", "Ação oposta quando a emoção não se justifica", "Reduzir vulnerabilidade: sono, alimentação, atividade física, evitar substâncias", "DEAR MAN: Descrever, Expressar, Afirmar, Reforçar — Manter-se atento, Aparentar confiança, Negociar"],
    refs: ["LINE", "STORE"] },
  { id: "sono", nome: "TCC para insônia (TCC-I)", ab: "Comportamental", ficha: "sono",
    ind: "Insônia crônica — tratamento de 1ª linha, antes de medicação.",
    passos: ["Diário do sono por 1–2 semanas", "Psicoeducação: regulação homeostática e circadiana do sono", "Controle de estímulos (cama só para dormir; levantar se não dormir em ~20 min; horário fixo para acordar)", "Restrição do tempo na cama (ajustada pela eficiência do sono)", "Reestruturação de crenças disfuncionais sobre o sono; relaxamento", "Higiene do sono como complemento"],
    cuid: "Restrição do sono: cautela em transtorno bipolar, epilepsia e quem dirige/opera máquinas. Suspeita de apneia ou outro distúrbio → encaminhar.",
    refs: ["RIEM", "QAS", "TRAUER", "ME03"] },
  { id: "neuro", nome: "Psicoeducação neurocientífica da ansiedade", ab: "Neurociência", ficha: "neuro",
    ind: "Ansiedade, pânico, TEPT — normalizar sintomas físicos e explicar por que a esquiva mantém o medo.",
    passos: ["Função adaptativa do medo: sistema de alarme (amígdala, eixo luta-fuga)", "Sintomas físicos explicados como ativação simpática — desconfortáveis, não perigosos", "Esquiva → alívio imediato → medo mantido (não há novo aprendizado)", "Córtex pré-frontal e reavaliação cognitiva: regular o alarme", "Exposição = criar novas memórias de segurança (aprendizado inibitório)"],
    refs: ["LEDOUX", "OG05", "CRASKE14", "BECK08", "CB12"] },
  { id: "grounding", nome: "Aterramento (grounding) 5-4-3-2-1", ab: "Mindfulness",
    ind: "Dissociação, flashbacks, ansiedade intensa — trazer para o aqui e agora.",
    passos: ["Nomear 5 coisas que vê", "4 coisas que pode tocar", "3 sons que ouve", "2 cheiros", "1 sabor (ou algo bom sobre si)", "Dizer em voz alta data, local e que está seguro(a) agora"],
    refs: ["NAJ"] },
  { id: "recaida", nome: "Prevenção de recaída e alta", ab: "TCC",
    ind: "Fase final do tratamento.",
    passos: ["Revisar o que o paciente aprendeu e as técnicas mais úteis (caixa de ferramentas)", "Identificar sinais precoces de recaída e situações de alto risco", "Plano escrito: o que fazer se os sintomas voltarem", "Atribuir o progresso ao esforço do paciente", "Espaçar as sessões e combinar sessões de reforço"],
    refs: ["JB", "KUY16"] }
];

/* ----------------------------- PROTOCOLOS POR DEMANDA ----------------------------- */
const RISCO_RE = /suic|se matar|me matar|tirar a (pr[oó]pria )?vida|n[aã]o quero (mais )?viver|vontade de morrer|queria morrer|melhor morto|acabar com tudo|autoles|me cortar|se cortar|automutila|overdose|enforc/i;

const PROTOCOLOS = [
  { id: "suicidio", nome: "Risco de suicídio / autolesão", cor: "danger", kw: RISCO_RE.source,
    aval: ["Pergunte diretamente sobre ideação suicida — perguntar não aumenta o risco", "Ideação: passiva (desejo de morrer) ou ativa (pensar em se matar)", "Plano, intenção, acesso a meios, preparação, data", "Tentativas prévias e autolesão; histórico familiar", "Fatores de risco: desesperança, isolamento, perdas recentes, uso de álcool/drogas, impulsividade, dor crônica", "Fatores de proteção: vínculos, razões para viver, religiosidade, filhos, tratamento em curso"],
    instr: ["C-SSRS — Escala de Avaliação da Gravidade do Suicídio de Columbia (versão em português disponível)", "PHQ-9, item 9 (rastreio)"],
    fases: [
      { n: "Imediato (na mesma sessão)", foco: "Avaliar o risco, construir o plano de segurança, restringir acesso a meios, acionar a rede de apoio e o supervisor.", t: ["plano"] },
      { n: "Estabilização", foco: "Habilidades de enfrentamento de crise, reduzir desesperança, razões para viver.", t: ["tipp", "resolucao", "cartoes"] },
      { n: "Tratamento", foco: "TCC para prevenção do suicídio: conceituar a crise suicida e trabalhar as crenças associadas (desesperança, ser um fardo).", t: ["rpd", "socratico", "ab", "crencas"] },
      { n: "Prevenção de recaída", foco: "Revisão guiada por imagens da crise, aplicando as habilidades aprendidas.", t: ["recaida"] }
    ],
    cuid: ["Estagiário(a): comunicar o supervisor imediatamente e registrar as condutas.", "Risco alto/iminente: não deixar a pessoa sozinha; acionar familiar ou pessoa de referência (quebra de sigilo prevista no art. 10 do Código de Ética, restrita ao estritamente necessário); SAMU 192 ou pronto-socorro.", "Encaminhar para avaliação psiquiátrica / CAPS conforme o caso.", "Registrar avaliação e condutas no prontuário.", "Violência autoprovocada é de notificação compulsória (Lei 13.819/2019) — seguir o fluxo do serviço/clínica-escola.", "CVV 188 (24 h, gratuito)."],
    refs: ["WBB", "SB12", "STAN18", "BROWN05", "POSNER", "DAZZI", "NICE225", "L13819", "CFP13", "CE"] },
  { id: "depressao", nome: "Depressão", cor: "accent", kw: "triste|deprimid|depress|desanim|sem vontade|vazio|anedonia|culpad|sem energia|n[aã]o tenho energia|chor|desesperan",
    aval: ["Humor deprimido e/ou anedonia por ≥ 2 semanas + sintomas associados (sono, apetite, energia, concentração, culpa, psicomotricidade) — DSM-5-TR", "SEMPRE rastrear ideação suicida", "Investigar episódios de mania/hipomania (bipolaridade) e uso de substâncias", "Avaliar necessidade de avaliação psiquiátrica/medicação (quadros moderados a graves)"],
    instr: ["PHQ-9 (uso livre)", "BDI-II (uso restrito — verificar parecer no SATEPSI)"],
    fases: [
      { n: "1. Avaliação e engajamento", foco: "Psicoeducação sobre depressão e modelo cognitivo; mapear a tríade; monitorar atividades.", t: ["psicoed", "triade", "ab"] },
      { n: "2. Ativação", foco: "Agendar atividades graduadas com prazer/domínio; resolver problemas práticos.", t: ["ab", "valores", "resolucao"] },
      { n: "3. Reestruturação de PAs", foco: "RPD, questionamento socrático, cartões de enfrentamento.", t: ["rpd", "socratico", "distorcoes", "cartoes"] },
      { n: "4. Crenças", foco: "Seta descendente, conceituação, reestruturação de crenças centrais.", t: ["seta", "dcc", "crencas"] },
      { n: "5. Manutenção", foco: "Prevenção de recaída; MBCT em depressão recorrente.", t: ["mindfulness", "recaida"] }
    ],
    cuid: ["Melhora da energia antes do humor pode coincidir com aumento de risco — reavaliar.", "Ruminação: preferir técnicas de atenção/mindfulness a debater cada pensamento."],
    refs: ["BECK79", "JB", "MARTELL", "DIM06", "CUIJ13", "KUY16", "NICE222", "KROENKE"] },
  { id: "tag", nome: "Ansiedade generalizada (TAG)", cor: "warn", kw: "preocup|ansios|ansiedade|nervos|tens[aã]o|apreens",
    aval: ["Preocupação excessiva e difícil de controlar na maioria dos dias por ≥ 6 meses, com inquietação, fadiga, tensão, irritabilidade, alteração do sono — DSM-5-TR", "Descartar causas médicas e substâncias (tireoide, cafeína, estimulantes) — encaminhar se indicado", "Investigar intolerância à incerteza e crenças sobre a preocupação"],
    instr: ["GAD-7 (uso livre)", "BAI (uso restrito — verificar SATEPSI)"],
    fases: [
      { n: "1. Psicoeducação", foco: "Modelo cognitivo da ansiedade, função do medo, sintomas físicos.", t: ["psicoed", "neuro", "respiracao"] },
      { n: "2. Manejo da preocupação", foco: "Tempo da preocupação, relaxamento, resolução de problemas.", t: ["worry", "rmp", "resolucao", "aware"] },
      { n: "3. Reestruturação", foco: "Avaliar previsões catastróficas e crenças sobre preocupação.", t: ["rpd", "socratico", "decat", "experimentos"] },
      { n: "4. Incerteza e aceitação", foco: "Tolerância à incerteza, exposição à preocupação, mindfulness/desfusão.", t: ["exposicao", "mindfulness", "desfusao"] },
      { n: "5. Manutenção", foco: "Prevenção de recaída.", t: ["recaida"] }
    ],
    cuid: ["Reasseguramento repetido (pelo terapeuta ou familiares) funciona como comportamento de segurança."],
    refs: ["CB12", "DUGAS", "BORK83", "HOF12", "NICE113", "SPITZER"] },
  { id: "panico", nome: "Transtorno de pânico / agorafobia", cor: "warn", kw: "p[aâ]nico|crise de ansiedade|falta de ar|cora[cç][aã]o (disparad|acelerad)|medo de morrer|vou desmaiar|agorafob|enlouquecer",
    aval: ["Ataques de pânico inesperados recorrentes + ≥ 1 mês de preocupação ou mudança de comportamento — DSM-5-TR", "Avaliação médica para descartar causas orgânicas (cardíacas, respiratórias, tireoide) antes da exposição interoceptiva", "Mapear interpretações catastróficas de sensações e comportamentos de segurança/esquiva"],
    instr: ["PDSS — Escala de Gravidade do Transtorno de Pânico", "GAD-7"],
    fases: [
      { n: "1. Psicoeducação", foco: "Ciclo do pânico (sensação → interpretação catastrófica → mais ansiedade); neurobiologia do alarme.", t: ["psicoed", "neuro"] },
      { n: "2. Reestruturação", foco: "Reavaliar interpretações catastróficas das sensações.", t: ["rpd", "socratico", "decat"] },
      { n: "3. Exposição", foco: "Exposição interoceptiva (hiperventilar, girar, correr no lugar) e in vivo às situações evitadas; abandonar comportamentos de segurança.", t: ["exposicao", "experimentos", "aware"] },
      { n: "4. Manutenção", foco: "Prevenção de recaída.", t: ["recaida"] }
    ],
    cuid: ["Respiração e distração não devem virar estratégias de “sobrevivência” — o objetivo é aprender que as sensações não são perigosas."],
    refs: ["CLARK86", "CB07", "CB12", "RANGE", "NICE113"] },
  { id: "social", nome: "Ansiedade social", cor: "warn", kw: "vergonha|t[ií]mid|julgad|falar em p[uú]blico|ansiedade social|fobia social|me acham|rid[ií]cul",
    aval: ["Medo acentuado de situações sociais em que pode ser avaliado(a) negativamente, com esquiva — DSM-5-TR", "Mapear atenção autofocada, autoimagem negativa, comportamentos de segurança e processamento pós-evento"],
    instr: ["LSAS — Escala de Ansiedade Social de Liebowitz", "SPIN — Inventário de Fobia Social"],
    fases: [
      { n: "1. Psicoeducação", foco: "Modelo cognitivo de Clark & Wells: atenção autofocada e comportamentos de segurança mantêm a ansiedade.", t: ["psicoed", "neuro"] },
      { n: "2. Experimentos", foco: "Comparar situações com e sem comportamentos de segurança; treino de atenção externa.", t: ["experimentos"] },
      { n: "3. Exposição", foco: "Exposição graduada a situações sociais.", t: ["exposicao"] },
      { n: "4. Cognição e crenças", foco: "Processamento pré e pós-evento; crenças sobre si.", t: ["rpd", "socratico", "seta", "crencas"] },
      { n: "5. Manutenção", foco: "Prevenção de recaída.", t: ["recaida"] }
    ],
    cuid: ["A TCC individual baseada no modelo de Clark & Wells tem o maior efeito entre as intervenções estudadas."],
    refs: ["CW95", "MW14", "NICE159", "CB12"] },
  { id: "toc", nome: "TOC", cor: "warn", kw: "obsess|compuls|ritual|verificar|conferir|lavar as m[aã]os|contamin|mania de|\\bTOC\\b",
    aval: ["Obsessões e/ou compulsões que consomem tempo (> 1 h/dia) ou causam sofrimento — DSM-5-TR", "Mapear rituais mentais, evitações e acomodação familiar", "Grau de insight"],
    instr: ["Y-BOCS — Escala Yale-Brown de Obsessões e Compulsões"],
    fases: [
      { n: "1. Psicoeducação", foco: "Ciclo obsessão → ansiedade → compulsão → alívio; pensamentos intrusivos são normais.", t: ["psicoed", "neuro"] },
      { n: "2. EPR", foco: "Hierarquia, exposição com prevenção de resposta, tarefas diárias.", t: ["epr", "exposicao"] },
      { n: "3. Crenças obsessivas", foco: "Responsabilidade excessiva, superestimação da ameaça, importância dos pensamentos, perfeccionismo.", t: ["socratico", "experimentos", "desfusao"] },
      { n: "4. Manutenção", foco: "Prevenção de recaída.", t: ["recaida"] }
    ],
    cuid: ["Reasseguramento é uma compulsão — combine com o paciente e a família como reduzi-lo."],
    refs: ["FOA12", "CORD", "OST15", "NICE31"] },
  { id: "tept", nome: "Trauma / TEPT", cor: "warn", kw: "trauma|abus|viol[eê]ncia|flashback|pesadel|assalt|estupr|acidente grave",
    aval: ["Exposição a evento traumático + intrusões, evitação, alterações negativas de cognição/humor e hiperexcitação por > 1 mês — DSM-5-TR", "Verificar segurança atual (violência em curso → rede de proteção)", "Dissociação, uso de substâncias, risco de suicídio"],
    instr: ["PCL-5 — Lista de Verificação de TEPT para o DSM-5"],
    fases: [
      { n: "1. Segurança e estabilização", foco: "Psicoeducação, aterramento, regulação emocional.", t: ["neuro", "grounding", "respiracao", "tipp"] },
      { n: "2. Processamento do trauma", foco: "TCC focada no trauma (Terapia de Processamento Cognitivo / Exposição Prolongada) — exige formação específica e supervisão.", t: ["rpd", "socratico", "exposicao"] },
      { n: "3. Reconstrução", foco: "Crenças sobre segurança, confiança, poder, estima e intimidade; valores.", t: ["crencas", "valores", "recaida"] }
    ],
    cuid: ["Não pressionar relato detalhado do trauma sem estabilização e sem formação específica.", "Violência contra criança/adolescente, idoso ou mulher: seguir notificações e rede de proteção previstas em lei e o fluxo do serviço."],
    refs: ["RESICK", "FOA07", "NICE116", "NAJ"] },
  { id: "insonia", nome: "Insônia", cor: "accent", kw: "ins[oô]nia|n[aã]o consigo dormir|acordo de madrugada|sono ruim|dormir mal|n[aã]o durmo",
    aval: ["Dificuldade de iniciar/manter o sono ou despertar precoce ≥ 3 noites/semana por ≥ 3 meses, com prejuízo diurno — DSM-5-TR", "Rastrear apneia (ronco, pausas respiratórias), pernas inquietas, dor, substâncias, depressão/ansiedade"],
    instr: ["ISI — Índice de Gravidade da Insônia", "Diário do sono"],
    fases: [
      { n: "1. Avaliação", foco: "Diário do sono e psicoeducação sobre regulação do sono.", t: ["sono"] },
      { n: "2. Componentes comportamentais", foco: "Controle de estímulos e restrição do tempo na cama.", t: ["sono"] },
      { n: "3. Cognitivo e relaxamento", foco: "Crenças sobre sono, preocupação na cama, relaxamento.", t: ["socratico", "rmp", "mindfulness", "worry"] },
      { n: "4. Manutenção", foco: "Prevenção de recaída.", t: ["recaida"] }
    ],
    cuid: ["Restrição do sono: cautela em bipolaridade, epilepsia e atividades de risco por sonolência."],
    refs: ["RIEM", "QAS", "TRAUER", "ME03", "BASTIEN"] },
  { id: "desregulacao", nome: "Desregulação emocional / impulsividade", cor: "accent", kw: "explos|raiva|impulsiv|instabilidade|vazio cr[oô]nico|brigas|descontrol",
    aval: ["Intensidade e labilidade emocional, impulsividade, relações instáveis, autolesão", "Avaliar risco de suicídio e autolesão em toda sessão de crise"],
    instr: ["DERS — Escala de Dificuldades de Regulação Emocional"],
    fases: [
      { n: "1. Atenção plena", foco: "Observar, descrever, participar sem julgamento.", t: ["mindfulness"] },
      { n: "2. Tolerância ao mal-estar", foco: "Atravessar crises sem piorar a situação.", t: ["tipp", "plano"] },
      { n: "3. Regulação emocional", foco: "Nomear emoções, verificar os fatos, ação oposta, reduzir vulnerabilidade.", t: ["dbtreg"] },
      { n: "4. Efetividade interpessoal", foco: "DEAR MAN, limites, manutenção de vínculos.", t: ["dbtreg", "resolucao"] }
    ],
    cuid: ["DBT completa envolve terapia individual + grupo de habilidades + coaching; a aplicação de habilidades isoladas é uma adaptação."],
    refs: ["LINE", "STORE"] }
];

/* ----------------------------- FASES GERAIS (J. Beck) ----------------------------- */
function faseGeral(n) {
  if (n === 0) return { t: "Avaliação inicial / 1ª sessão", i: ["Rapport; explicar a TCC, sigilo e limites do sigilo", "Anamnese, queixa principal e lista de problemas", "Escalas de linha de base (PHQ-9, GAD-7) e rastreio de risco", "Definir metas com o paciente", "Psicoeducação: modelo cognitivo", "Tarefa simples e feedback"] };
  if (n <= 3) return { t: "Fase inicial", i: ["Manter a estrutura: humor, ponte, agenda, tarefa, resumo, feedback", "Psicoeducação sobre a demanda principal", "Identificar pensamentos automáticos e emoções (RPD de 3 colunas)", "Técnicas comportamentais iniciais (ativação, respiração, monitoramento)", "Esboçar a conceituação com situações típicas"] };
  if (n <= 10) return { t: "Fase intermediária", i: ["Avaliar e responder PAs (RPD completo, questionamento socrático)", "Experimentos comportamentais e exposição, quando indicado", "Identificar crenças intermediárias (regras, pressupostos) com seta descendente", "Atualizar e compartilhar o diagrama de conceituação", "Reaplicar escalas para monitorar o progresso"] };
  return { t: "Fase avançada / preparação para alta", i: ["Trabalhar crenças centrais (continuum, registro de dados positivos)", "Paciente assume o papel de “terapeuta de si mesmo”", "Prevenção de recaída: sinais de alerta e plano", "Espaçar sessões e combinar sessões de reforço"] };
}

function sevPHQ(v) { v = Number(v); return v <= 4 ? "mínimo" : v <= 9 ? "leve" : v <= 14 ? "moderado" : v <= 19 ? "moderadamente grave" : "grave"; }
function sevGAD(v) { v = Number(v); return v <= 4 ? "mínimo" : v <= 9 ? "leve" : v <= 14 ? "moderado" : "grave"; }
