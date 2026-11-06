# Kit Clínico TCC — resumo do projeto (para o Projeto no chat do Claude)

## Quem sou
Estudante de Psicologia (formatura prevista para 2027), estagiário(a) em clínica-escola, atendendo sob supervisão, principalmente em TCC. A supervisora aprovou o uso de IA e de gravação com consentimento.

## O que é o kit
Um app (HTML instalável no celular, PWA) que funciona como prontuário de apoio e dá direcionamento clínico. Tudo fica criptografado com a minha senha. Ele é construído pelo Claude Code no meu computador (pasta `E:\ARQUIVOS\CLAUDE\kit-tcc`).

## O que já existe (v2)
- **Pacientes** (só código, nunca nome) com abas:
  - **Direcionamento:** alertas de risco, lembretes com caixinha de resposta e opção de arquivar, lista "Para abordar com a paciente", fase do tratamento (J. Beck), protocolos com o próximo passo sugerido e escalas.
  - **Sessões:** estrutura J. Beck; escalas Humor, PHQ-9, item 9, GAD-7, BDI-II e BAI com explicação ＋; seletor de técnicas com busca; gravação com transcrição; anexos.
  - **Conceituação:** tríade e diagrama cognitivo.
  - **Registros:** RPD, seta descendente e AWARE.
  - **Risco:** avaliação e plano de segurança Stanley & Brown.
  - **Documentos:** fotos e arquivos criptografados.
  - **Evolução:** gráfico.
  - **Cadastro:** inclui lixeira e histórico de alterações.
- **📅 Agenda:** atendimentos, supervisão e alertas, com repetição; lembretes que ficam mais insistentes até eu tocar em "✓ Lembrei"; exporta para o Google Agenda ou .ics.
- **Protocolos (9):** risco de suicídio, depressão, TAG, pânico, ansiedade social, TOC, TEPT, insônia, desregulação emocional.
- **Técnicas (30):** TCC, comportamentais, mindfulness, ACT, DBT e neurociência. Posso adicionar técnicas minhas, mas elas exigem referência científica.
- **📚 Literatura Científica:** 81 obras do kit + minhas referências com fichamento.
- **Ética e CFP:** sigilo, prontuário, SATEPSI, LGPD, gravação.
- **Dados:** salva no aparelho + Google Drive, versões automáticas, backup completo, indicador ✓/✗ de salvamento.
- **⚙ Configurações:** Drive, senha e código de recuperação, IA (Claude na lateral), tema, fonte, bloqueio.

## Minhas preferências
- Visual enxuto, pouco poluído.
- Não posso perder NENHUM dado (redundância sempre).
- Excluir sempre com confirmação dupla.
- Tudo com embasamento científico e referência.
- Uso principalmente no celular.

## Pendências (dependem de mim)
- Testar o login com Google no celular em https://psicotom1983.github.io/kit-tcc/ (o Client ID já vem embutido; backups vão para a pasta “Kit TCC - Backups”).
- Criar a chave da API da Anthropic.

## Ideias futuras
- Avisos por e-mail ou WhatsApp com o kit fechado.
- Alarme nativo (versão APK).
- Área do paciente.

## Como trabalhar comigo no chat
Aqui eu tiro dúvidas, estudo e penso em melhorias. Quando eu disser **"fechar limbo"**, gere um bloco pronto para eu colar no arquivo `LIMBO.md`, neste formato:

```
## AAAA-MM-DD — <assunto>
- [ ] Pedido 1: o que mudar, onde (tela/aba/campo) e por quê
- [ ] Pedido 2: ...
Contexto/decisões: <resumo do que decidimos e referências científicas, se houver>
```
