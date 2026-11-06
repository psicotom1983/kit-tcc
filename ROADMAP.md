# Kit Clínico TCC — Pedidos e andamento

Todos os pedidos feitos até agora, com a situação de cada um.
✅ feito · 🧪 feito, falta testar no seu aparelho · ⏳ falta fazer · 👤 depende de você

## v1 (05/11/2026)
- ✅ Prontuário por paciente: sessões (estrutura J. Beck), conceituação, tríade, RPD, seta descendente, AWARE, risco e plano de segurança, evolução
- ✅ Direcionamento: fases do tratamento, protocolos por demanda, próximo passo sugerido, alertas de risco
- ✅ Base de conhecimento com referências: 9 protocolos, 30 técnicas, 13 fichas para imprimir, página de Ética e CFP
- ✅ Tudo criptografado com senha

## Pedidos de 06/11/2026
- ✅ Botão Salvar visível + Ctrl+S → agora **flutuante embaixo à direita**, longe dos botões de excluir
- ✅ Escalas com explicação curta, ＋ para detalhes técnicos, exemplos e referências
- ✅ Responder lembretes → **caixinha à direita** (Atenção, Verificar, Resolvido, Não é problema, Levar para a sessão, **Outros** com campo de texto)
- ✅ Lista “Para abordar com a paciente” (mesmo estilo enxuto)
- ✅ Tudo registrado: histórico de alterações + lixeira com restaurar
- ✅ Seletor de técnicas com **busca**, **＋ Ver todas**, estilo quadradinho
- ✅ Adicionar técnica nova **com referência científica obrigatória** (fica ⚠ e vira pendência até ter a fonte; a IA sugere o embasamento)
- ✅ Trocar senha + **código de recuperação** (redefinir senha esquecida)
- ✅ Enviar fotos e documentos (criptografados), inclusive câmera do celular
- ✅ Assistente de IA na lateral (Claude), com resumo do paciente opcional; chave guardada dentro do cofre
- 🧪 Gravar a sessão + transcrição ao vivo (com registro de consentimento) + resumo da transcrição pela IA
- ✅ Indicador de salvamento **no meio da barra**: ✓ verde / ✗ vermelho / ⟳ âmbar, discreto; toque para ver os detalhes
- ✅ Excluir com **confirmação dupla** em janelas de posições diferentes (botão de excluir troca de lado)
- 🧪 Funcionar no celular (layout responsivo + app instalável/offline – PWA)
- 🧪 Salvar direto no Google Drive (login com Google), com versões diárias e anexos
- ✅ Lembretes mais limpos: uma linha por lembrete, caixinha à direita, campo de texto só em “Outros”
- ✅ Área **📚 Literatura Científica**: as 81 obras do kit (livros, artigos, diretrizes, normas), busca, “citado em”, link para Google Acadêmico, resumo pela IA, e suas próprias referências com fichamento
- ✅ **⚙ Engrenagem de Configurações**: Google Drive, pasta, senha e recuperação, IA, instalar no celular, tema claro/escuro, tamanho do texto, tempo de bloqueio, supervisor padrão
- ✅ Redundância: aparelho (IndexedDB) + cópia no navegador + versões automáticas + Drive + pasta vinculada + backup completo
- 👤 Publicar o kit num endereço https (GitHub Pages) — necessário para celular e login com Google
- 👤 Criar o “Client ID” do Google (Google Cloud Console), uma vez
- 👤 Criar a chave da API da Anthropic para a IA

## Pedidos de 06/11/2026 (tarde)
- ✅ **📅 Agenda**: atendimentos (ligados ao paciente), supervisão, alertas/prazos; dia, hora, duração; repetir semanal/quinzenal/mensal; visão Mês e Próximos 60 dias; situação de cada atendimento (realizado, faltou, desmarcado, remarcado); “📝 Registrar sessão” direto da agenda; “📅 Agendar” no paciente; próximos compromissos na tela inicial
- ✅ **Avisos escalonados** com o kit aberto: discreto → notificação → alerta piscando com som e vibração, repetindo (1 h → 10 min → 3 min) até tocar em **✓ Lembrei**
- ✅ Levar eventos para a **agenda do celular / Google Agenda** (arquivo .ics com vários alarmes, ou link do Google Agenda) — alarmes tocam mesmo com o kit fechado
- ✅ Correção: mensagem da tela de entrada aparecia espremida
- ⏳ Avisos por **e-mail** com o kit fechado (via Google Apps Script na sua conta Google — só horário e código do paciente)
- ⏳ Avisos por **WhatsApp** (precisa de serviço pago, ex.: API oficial do WhatsApp Business/Twilio)
- ⏳ **Alarme escalonado nativo** no celular mesmo com o kit fechado (exige versão aplicativo/APK)

## Pedidos de 06/11/2026 (noite) — Google para usuários leigos
- 🧪 Client ID do Google já embutido (campo nas Configurações continua, já preenchido)
- 🧪 Login com Google só com permissão `drive.file` (o kit só enxerga os arquivos que ele mesmo criou)
- 🧪 Botão “☁ Entrar com Google” na primeira abertura e em ⚙ Configurações › Drive; ao criar a senha depois de entrar, o backup no Drive já liga sozinho
- 🧪 Backup automático na pasta **“Kit TCC - Backups”** (cofre .tcc criptografado + cópia diária + anexos)
- 🧪 Sessão do Google expirada: renova em silêncio; se não der, faixa fina **“↻ Reconectar Google”** (1 toque); nada se perde, tudo continua salvo no aparelho
- 🧪 Publicado em https://psicotom1983.github.io/kit-tcc/

## Ideias para depois
- ⏳ Área do paciente (fichas preenchidas entre sessões)
- ⏳ Transcrição de gravações já feitas (sem ser ao vivo)
