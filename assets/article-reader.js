(() => {
  'use strict';

  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  const synth = window.speechSynthesis;
  const root = document.querySelector('main#contenu, main, article');
  if (!root || root.querySelector('[data-ce-reader]')) return;

  const EXCLUDED = [
    '[data-ce-reader]', 'header', 'footer', 'nav', 'form', 'table',
    '.follow-section', '.ce-related', '.related', '.sources', '.references',
    '.breadcrumbs', '.ce-update-meta', '[aria-hidden="true"]'
  ].join(',');

  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();

  function readableBlocks() {
    const nodes = [...root.querySelectorAll('h1,h2,h3,p,li,blockquote,.formula')];
    const blocks = [];
    let previous = '';
    for (const node of nodes) {
      if (node.closest(EXCLUDED)) continue;
      if (node.matches('.formula') && node.querySelector('p,li,h1,h2,h3')) continue;
      const text = clean(node.textContent);
      if (!text || text.length < 2 || text === previous) continue;
      previous = text;
      blocks.push(text);
    }
    return blocks;
  }

  function splitLong(text, max = 240) {
    if (text.length <= max) return [text];
    const sentences = text.split(/(?<=[.!?…:;])\s+/u).filter(Boolean);
    const out = [];
    let current = '';
    const pushWords = sentence => {
      const words = sentence.split(/\s+/).filter(Boolean);
      let part = '';
      for (const word of words) {
        const candidate = part ? `${part} ${word}` : word;
        if (candidate.length > max && part) {
          out.push(part);
          part = word;
        } else {
          part = candidate;
        }
      }
      if (part) out.push(part);
    };
    for (const sentence of sentences.length ? sentences : [text]) {
      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length <= max) {
        current = candidate;
      } else {
        if (current) out.push(current);
        current = '';
        if (sentence.length > max) pushWords(sentence);
        else current = sentence;
      }
    }
    if (current) out.push(current);
    return out;
  }

  const blocks = readableBlocks();
  const chunks = blocks.flatMap(block => splitLong(block));
  if (!chunks.length || chunks.join(' ').length < 120) return;

  const panel = document.createElement('section');
  panel.className = 'ce-article-reader';
  panel.dataset.ceReader = '1';
  panel.setAttribute('aria-label', 'Lecture vocale de l’article');
  panel.innerHTML = `
    <div class="ce-reader-inner">
      <div class="ce-reader-copy">
        <span class="ce-reader-kicker">Lecture vocale</span>
        <strong>Écouter cet article</strong>
        <span class="ce-reader-status" role="status" aria-live="polite">Prêt</span>
      </div>
      <div class="ce-reader-controls">
        <button type="button" class="ce-reader-btn ce-reader-play" aria-label="Lire l’article">▶ Écouter</button>
        <button type="button" class="ce-reader-btn ce-reader-pause" aria-label="Mettre la lecture en pause" disabled>Ⅱ Pause</button>
        <button type="button" class="ce-reader-btn ce-reader-stop" aria-label="Arrêter la lecture" disabled>■ Arrêter</button>
        <label class="ce-reader-speed">Vitesse
          <select aria-label="Vitesse de lecture">
            <option value="0.85">0,85×</option>
            <option value="1" selected>1×</option>
            <option value="1.15">1,15×</option>
            <option value="1.3">1,3×</option>
            <option value="1.5">1,5×</option>
          </select>
        </label>
      </div>
    </div>`;

  const anchor = root.querySelector(':scope > .article-hero, :scope > .hero, :scope > section.article-hero, :scope > section.hero') || root.firstElementChild;
  if (anchor && anchor.parentNode === root) anchor.insertAdjacentElement('afterend', panel);
  else root.insertAdjacentElement('afterbegin', panel);

  const play = panel.querySelector('.ce-reader-play');
  const pause = panel.querySelector('.ce-reader-pause');
  const stop = panel.querySelector('.ce-reader-stop');
  const speed = panel.querySelector('select');
  const status = panel.querySelector('.ce-reader-status');

  let index = 0;
  let state = 'idle';
  let rate = 1;
  let pausedNeedsRestart = false;
  let utterance = null;

  function preferredVoice() {
    const voices = synth.getVoices();
    return voices.find(v => /^fr-FR$/i.test(v.lang)) ||
      voices.find(v => /^fr([_-]|$)/i.test(v.lang)) || null;
  }

  function setUi(message) {
    status.textContent = message;
    const active = state === 'playing' || state === 'paused';
    play.textContent = state === 'paused' ? '▶ Reprendre' : (state === 'playing' ? '▶ Lecture' : '▶ Écouter');
    play.disabled = state === 'playing';
    pause.disabled = state !== 'playing';
    stop.disabled = !active;
  }

  function progressText() {
    const pct = Math.min(100, Math.max(1, Math.round(((index + 1) / chunks.length) * 100)));
    return `Lecture · ${pct} %`;
  }

  function speakCurrent() {
    if (state !== 'playing') return;
    if (index >= chunks.length) {
      state = 'idle';
      index = 0;
      utterance = null;
      setUi('Lecture terminée');
      return;
    }

    utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = 'fr-FR';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = preferredVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      if (state !== 'playing') return;
      index += 1;
      speakCurrent();
    };
    utterance.onerror = event => {
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      state = 'idle';
      index = 0;
      setUi('Lecture indisponible sur cet appareil');
    };

    setUi(progressText());
    synth.speak(utterance);
  }

  function start() {
    synth.cancel();
    pausedNeedsRestart = false;
    if (state === 'idle') index = 0;
    state = 'playing';
    speakCurrent();
  }

  function resume() {
    if (state !== 'paused') return;
    state = 'playing';
    if (pausedNeedsRestart) {
      pausedNeedsRestart = false;
      speakCurrent();
    } else {
      synth.resume();
      setUi(progressText());
    }
  }

  play.addEventListener('click', () => {
    if (state === 'paused') resume();
    else if (state === 'idle') start();
  });

  pause.addEventListener('click', () => {
    if (state !== 'playing') return;
    synth.pause();
    state = 'paused';
    setUi('En pause');
  });

  stop.addEventListener('click', () => {
    synth.cancel();
    state = 'idle';
    index = 0;
    pausedNeedsRestart = false;
    utterance = null;
    setUi('Lecture arrêtée');
  });

  speed.addEventListener('change', () => {
    rate = Number(speed.value) || 1;
    if (state === 'playing') {
      synth.cancel();
      speakCurrent();
    } else if (state === 'paused') {
      synth.cancel();
      pausedNeedsRestart = true;
      setUi('En pause');
    }
  });

  window.addEventListener('pagehide', () => synth.cancel(), { once: true });
  setUi('Prêt');
})();
