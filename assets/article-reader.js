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
  const VOICE_KEY = 'ce-reader-voice';
  const RATE_KEY = 'ce-reader-rate';
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
        <label class="ce-reader-choice">Voix
          <select class="ce-reader-voice" aria-label="Voix de lecture">
            <option value="">Voix française automatique</option>
          </select>
        </label>
        <button type="button" class="ce-reader-btn ce-reader-test" aria-label="Tester la voix sélectionnée">Tester la voix</button>
        <label class="ce-reader-choice">Vitesse
          <select class="ce-reader-rate" aria-label="Vitesse de lecture">
            <option value="0.85">0,85×</option>
            <option value="0.95" selected>0,95×</option>
            <option value="1">1×</option>
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
  const testVoice = panel.querySelector('.ce-reader-test');
  const voiceSelect = panel.querySelector('.ce-reader-voice');
  const speed = panel.querySelector('.ce-reader-rate');
  const status = panel.querySelector('.ce-reader-status');

  let index = 0;
  let state = 'idle';
  let pausedNeedsRestart = false;
  let utterance = null;
  let frenchVoices = [];
  let selectedVoice = null;
  let rate = Number(localStorage.getItem(RATE_KEY)) || 0.95;
  if (![0.85, 0.95, 1, 1.15, 1.3, 1.5].includes(rate)) rate = 0.95;
  speed.value = String(rate);

  function voiceScore(voice) {
    const name = `${voice.name || ''} ${voice.voiceURI || ''}`.toLowerCase();
    let score = 0;
    if (/^fr-FR$/i.test(voice.lang)) score += 30;
    else if (/^fr([_-]|$)/i.test(voice.lang)) score += 20;
    if (/natural|neural|premium|enhanced|online/.test(name)) score += 50;
    if (/compact|desktop/.test(name)) score -= 8;
    if (voice.default) score += 5;
    return score;
  }

  function voiceId(voice) {
    return `${voice.voiceURI || voice.name}|||${voice.lang || ''}`;
  }

  function populateVoices() {
    const all = synth.getVoices();
    frenchVoices = all.filter(v => /^fr([_-]|$)/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name, 'fr'));
    const saved = localStorage.getItem(VOICE_KEY) || '';
    const current = voiceSelect.value || saved;
    voiceSelect.innerHTML = '<option value="">Meilleure voix française disponible</option>';
    for (const voice of frenchVoices) {
      const option = document.createElement('option');
      option.value = voiceId(voice);
      option.textContent = `${voice.name} · ${voice.lang}${/natural|neural|premium|enhanced|online/i.test(`${voice.name} ${voice.voiceURI}`) ? ' · qualité +' : ''}`;
      voiceSelect.appendChild(option);
    }
    const match = frenchVoices.find(v => voiceId(v) === current) || frenchVoices.find(v => voiceId(v) === saved);
    if (match) {
      selectedVoice = match;
      voiceSelect.value = voiceId(match);
    } else {
      selectedVoice = frenchVoices[0] || null;
      voiceSelect.value = '';
    }
    if (!frenchVoices.length) {
      voiceSelect.innerHTML = '<option value="">Voix française du système</option>';
      voiceSelect.disabled = true;
      testVoice.disabled = true;
    }
  }

  function currentVoice() {
    if (voiceSelect.value) {
      const exact = frenchVoices.find(v => voiceId(v) === voiceSelect.value);
      if (exact) return exact;
    }
    return selectedVoice || frenchVoices[0] || null;
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

  function makeUtterance(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = rate;
    u.pitch = 0.98;
    u.volume = 1;
    const voice = currentVoice();
    if (voice) u.voice = voice;
    return u;
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

    utterance = makeUtterance(chunks[index]);
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

  voiceSelect.addEventListener('change', () => {
    const voice = frenchVoices.find(v => voiceId(v) === voiceSelect.value) || frenchVoices[0] || null;
    selectedVoice = voice;
    if (voiceSelect.value) localStorage.setItem(VOICE_KEY, voiceSelect.value);
    else localStorage.removeItem(VOICE_KEY);
    if (state === 'playing') {
      synth.cancel();
      speakCurrent();
    } else if (state === 'paused') {
      synth.cancel();
      pausedNeedsRestart = true;
      setUi('En pause');
    }
  });

  testVoice.addEventListener('click', () => {
    const wasActive = state === 'playing' || state === 'paused';
    if (wasActive) {
      synth.cancel();
      state = 'idle';
      index = 0;
    } else {
      synth.cancel();
    }
    const sample = makeUtterance('Voici un aperçu de cette voix pour la lecture des articles de Contre-Évidence.');
    sample.onstart = () => setUi('Aperçu de la voix');
    sample.onend = () => setUi('Prêt');
    sample.onerror = () => setUi('Cette voix n’est pas disponible');
    synth.speak(sample);
  });

  speed.addEventListener('change', () => {
    rate = Number(speed.value) || 0.95;
    localStorage.setItem(RATE_KEY, String(rate));
    if (state === 'playing') {
      synth.cancel();
      speakCurrent();
    } else if (state === 'paused') {
      synth.cancel();
      pausedNeedsRestart = true;
      setUi('En pause');
    }
  });

  populateVoices();
  if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', populateVoices);
  window.addEventListener('pagehide', () => synth.cancel(), { once: true });
  setUi('Prêt');
})();