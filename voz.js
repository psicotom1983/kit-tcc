/* ============ 🎤 Falar em vez de digitar (ditado) ============
   Coloca um botão 🎤 em todo campo de texto grande (paciente, sessões, registros, caderno...).
   Toque para falar; toque de novo para parar. O texto entra no fim do campo e é salvo como se fosse digitado. */
(() => {
  const SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SRc) return; /* navegador sem reconhecimento de voz: nada muda */
  const st = document.createElement("style");
  st.textContent = `.dit-w{position:relative}.dit-w textarea{padding-right:46px}
.dit{position:absolute;right:6px;bottom:8px;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink);font-size:17px;cursor:pointer;display:grid;place-items:center;z-index:2}
.dit.on{background:var(--danger);border-color:var(--danger);color:#fff;animation:ditp 1s infinite}@keyframes ditp{50%{opacity:.6}}`;
  document.head.appendChild(st);
  let atual = null; /* { sr, ta, btn } */

  function parar() { if (!atual) return; const a = atual; atual = null; try { a.sr.stop(); } catch (e) {} a.btn.classList.remove("on"); a.btn.textContent = "🎤"; a.btn.title = "Falar em vez de digitar"; }
  function iniciar(ta, btn) {
    if (typeof REC !== "undefined" && REC.on && REC.transcribe) return alert("A transcrição da gravação está usando o microfone. Pare a gravação para ditar.");
    const sr = new SRc(); sr.lang = "pt-BR"; sr.continuous = true; sr.interimResults = false;
    atual = { sr, ta, btn };
    sr.onresult = e => {
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) {
        const t = e.results[i][0].transcript.trim(); if (!t) continue;
        const v = ta.value, sep = !v || /\s$/.test(v) ? "" : " ";
        ta.value = v + sep + t.charAt(0).toUpperCase() + t.slice(1);
        ta.dispatchEvent(new Event("input", { bubbles: true })); ta.dispatchEvent(new Event("change", { bubbles: true }));
        ta.scrollTop = ta.scrollHeight;
      }
    };
    sr.onerror = e => { if (e.error === "not-allowed" || e.error === "service-not-allowed") alert("O navegador bloqueou o microfone. Libere o microfone para este site."); };
    sr.onend = () => { if (atual && atual.sr === sr) { try { sr.start(); } catch (x) { parar(); } } }; /* continua até tocar de novo */
    try { sr.start(); } catch (e) { atual = null; return; }
    btn.classList.add("on"); btn.textContent = "■"; btn.title = "Parar de ditar";
  }
  function decorar() {
    document.querySelectorAll("textarea:not([data-dit]):not(#iaIn)").forEach(ta => {
      ta.dataset.dit = "1";
      const w = document.createElement("span"); w.className = "dit-w"; w.style.display = "block";
      ta.parentNode.insertBefore(w, ta); w.appendChild(ta);
      const b = document.createElement("button"); b.type = "button"; b.className = "dit"; b.textContent = "🎤"; b.title = "Falar em vez de digitar"; b.setAttribute("aria-label", "Falar em vez de digitar");
      w.appendChild(b);
    });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest(".dit"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const ta = b.parentNode.querySelector("textarea");
    if (atual && atual.btn === b) return parar();
    parar(); iniciar(ta, b);
  }, true);
  let t; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { if (atual && !document.contains(atual.btn)) parar(); decorar(); }, 60); }).observe(document.body, { childList: true, subtree: true });
  decorar();
})();
