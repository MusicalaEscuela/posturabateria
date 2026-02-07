'use strict';

/* =========================================================
  Postura en la Batería · App educativa desde cero
  - Vanilla JS
  - Progreso en localStorage
  - Mejoras: rutas de imágenes con nombres reales, fallback si no carga,
            progreso en 2 lugares (sidebar + hero), teclado, mejor modal,
            quiz con feedback y guardado de respuestas, navegación robusta
========================================================= */

const LS_KEY = 'postura_bateria_progress_v2';

/* =========================
   CONFIG: Imágenes (nombres reales)
   - Si renombraste archivos, cambia aquí y listo.
   - Evita espacios/tildes si puedes, pero esto soporta tus nombres actuales.
========================= */
const IMG = {
  m0: 'images/Antes de tocar.png',
  m1: 'images/Silla y altura.png',
  m2: 'images/Distancia al kit.png',
  m3: 'images/Espalda, cuello y hombros.png',
  m4: 'images/Muñecas y agarre.png',
  m5: 'images/Pies y pedales.png',
  m6: 'images/Setup básico del kit.png',
};

// Módulos (7 total: 0–6)
const MODULES = [
  {
    id: 'm0',
    order: 0,
    title: 'Antes de tocar (base)',
    desc: 'Entiende la idea principal: tu cuerpo manda.',
    img: IMG.m0,
    caption: 'Tip: el kit debe acercarse a ti, no tú al kit.',
    explain: [
      'Postura no es “sentarse recto como robot”. Es estar <b>estable, relajado y alineado</b>.',
      'Si el cuerpo tiene que hacer trampa para llegar (estirar hombros, girar tronco), te vas a cansar rápido.',
      'Regla de oro: <b>comodidad primero</b>. Si duele o se tensa, algo está mal ubicado.',
    ],
    practice: [
      'Siéntate en la silla y suelta los hombros.',
      'Respira 3 veces lento.',
      'Simula tocar caja y hi-hat: <b>sin</b> levantar hombros ni inclinarte hacia adelante.',
    ],
    hint: [
      'Si sientes <b>cuello tenso</b> → baja hombros y acerca el kit.',
      'Si sientes <b>espalda baja cargada</b> → revisa altura de silla.',
      'Si sientes <b>hombro cansado</b> → probablemente un plato está lejos.',
    ],
    quiz: [
      { q: '¿Tu cuerpo se acomoda al kit o el kit a tu cuerpo?', a: 'kit', opts: ['cuerpo', 'kit'] },
      { q: '¿“Recto” significa estar tenso?', a: 'no', opts: ['sí', 'no'] },
      { q: '¿Si estiras hombros para llegar al ride, está bien?', a: 'no', opts: ['sí', 'no'] },
    ],
  },

  {
    id: 'm1',
    order: 1,
    title: 'Silla y altura',
    desc: 'La base para que todo lo demás funcione.',
    img: IMG.m1,
    caption: 'Cadera ligeramente más alta que las rodillas.',
    explain: [
      'La altura de la silla define tu equilibrio y cómo trabajan piernas y espalda.',
      'Meta: <b>cadera un poquito más alta que las rodillas</b>. Ni encogido ni “en puntas”.',
      'Si quedas muy bajo: espalda baja sufre. Si quedas muy alto: pierdes control en pedales.',
    ],
    practice: [
      'Ajusta la silla: busca que tus rodillas queden un poco por debajo de tu cadera.',
      'Prueba levantar talones un poquito: no deberías tambalear.',
      'Repite 10 golpes suaves de bombo: sin que la cadera se vaya hacia adelante.',
    ],
    hint: [
      'Espalda baja cargada → sube 1–2 cm la silla.',
      'Piernas “quemadas” muy rápido → puede estar muy alta o el pedal muy lejos.',
      'Sientes que te deslizas → revisa inclinación o superficie de la silla.',
    ],
    quiz: [
      { q: 'Idealmente, la cadera va…', a: 'más alta', opts: ['más baja', 'igual', 'más alta'] },
      { q: 'Si estás muy bajo, ¿qué suele sufrir?', a: 'espalda baja', opts: ['cuello', 'espalda baja', 'dedos'] },
      { q: '¿La silla se ajusta al cuerpo o el cuerpo a la silla?', a: 'silla', opts: ['cuerpo', 'silla'] },
    ],
  },

  {
    id: 'm2',
    order: 2,
    title: 'Distancia al kit',
    desc: 'No te estires. No gires. No sufras.',
    img: IMG.m2,
    caption: 'Si “alcanzas” estirando, está lejos.',
    explain: [
      'Tu torso no debería estar “buscando” los tambores.',
      'Caja y hi-hat deben quedar accesibles <b>sin</b> irte hacia adelante con los hombros.',
      'Tu alcance cómodo es el que haces con el codo relajado, no con el hombro estirado.',
    ],
    practice: [
      'Siéntate y coloca manos como si tocaras caja y hi-hat.',
      'Acerca el redoblante hasta que el antebrazo se sienta natural.',
      'Acerca el ride/crash si notas que tu hombro sube o tu cuello se tensa.',
    ],
    hint: [
      'Hombro derecho cansado → ride muy lejos o muy alto.',
      'Te inclinas para caja → caja muy lejos o muy baja.',
      'Sientes torsión para hi-hat → hi-hat muy hacia la izquierda o muy lejos.',
    ],
    quiz: [
      { q: 'Si estiras el hombro para llegar al plato…', a: 'está lejos', opts: ['está bien', 'está lejos'] },
      { q: 'Caja + hi-hat se tocan idealmente sin…', a: 'mover hombros', opts: ['mover hombros', 'respirar', 'parpadear'] },
      { q: '¿El alcance correcto es con hombro estirado?', a: 'no', opts: ['sí', 'no'] },
    ],
  },

  {
    id: 'm3',
    order: 3,
    title: 'Espalda, cuello y hombros',
    desc: 'Relajado, estable y sin joroba.',
    img: IMG.m3,
    caption: 'Neutro: ni encorvado ni tieso.',
    explain: [
      'Piensa en una “columna larga”: pecho abierto suave, sin inflarte.',
      'Hombros: abajo y sueltos (no “subidos” con cada golpe).',
      'Cuello: mentón suave hacia atrás (como haciendo doble mentón mínimo).',
    ],
    practice: [
      'Haz 3 respiraciones lentas, y en cada exhalación baja hombros.',
      'Simula 10 golpes suaves en caja: si tu cuello se pone duro, pausa y relaja.',
      'Revisa: ¿tu espalda está neutra o te “doblas” hacia adelante? Ajusta silla/distancia.',
    ],
    hint: [
      'Cuello duro → hombros arriba o kit lejos.',
      'Duele espalda media → estás encorvado o muy lejos del kit.',
      'Te “tiras” hacia el frente → silla muy baja o caja lejos.',
    ],
    quiz: [
      { q: '“Recto” significa…', a: 'neutro', opts: ['tenso', 'neutro', 'rígido'] },
      { q: 'Hombros al tocar deberían estar…', a: 'abajo', opts: ['arriba', 'abajo'] },
      { q: 'Cuello largo se logra con…', a: 'mentón suave atrás', opts: ['mirar arriba', 'mentón suave atrás'] },
    ],
  },

  {
    id: 'm4',
    order: 4,
    title: 'Muñecas y agarre',
    desc: 'Golpear sin romperte la mano.',
    img: IMG.m4,
    caption: 'Muñeca alineada, agarre sin estrangular.',
    explain: [
      'La baqueta se controla con rebote. No necesitas apretar como si fuera tu última esperanza.',
      'Muñeca alineada: evita “quebrarla” hacia los lados.',
      'Usa el mínimo esfuerzo que produzca el sonido que quieres (sí, toca suave también es tocar).',
    ],
    practice: [
      'Toma la baqueta y aprieta fuerte 2 segundos… luego suelta hasta que esté firme, no rígida.',
      'Haz 10 golpes suaves dejando rebotar. Si se te cansa el antebrazo rápido, estás apretando.',
      'Revisa que tu muñeca no se doble raro al pegar.',
    ],
    hint: [
      'Dolor en muñeca → alineación mala o estás forzando ángulo de caja.',
      'Antebrazo arde → agarre demasiado apretado.',
      'Sonido feo y duro → falta rebote, exceso de fuerza.',
    ],
    quiz: [
      { q: 'Agarre ideal es…', a: 'firme pero suelto', opts: ['estrangulado', 'firme pero suelto'] },
      { q: 'Muñeca debe ir…', a: 'alineada', opts: ['quebrada', 'alineada'] },
      { q: 'Si te arde el antebrazo rápido, probable causa:', a: 'aprietas', opts: ['aprietas', 'respiras mucho'] },
    ],
  },

  {
    id: 'm5',
    order: 5,
    title: 'Pies y pedales',
    desc: 'Control sin torcer rodillas.',
    img: IMG.m5,
    caption: 'Rodillas alineadas, pies cómodos.',
    explain: [
      'Tus rodillas deberían apuntar más o menos hacia donde van tus pies, no hacia afuera por obligación.',
      'Si el pedal está muy lejos, tu cadera se desestabiliza.',
      'La técnica (talón arriba/abajo) puede variar, pero la alineación y comodidad no se negocian.',
    ],
    practice: [
      'Coloca el bombo donde puedas pisar sin estirar la pierna al máximo.',
      'Haz 20 golpes suaves de bombo: la rodilla debe sentirse estable.',
      'Revisa hi-hat: que no te obligue a abrir la pierna demasiado.',
    ],
    hint: [
      'Dolor rodilla → pedal lejos o postura torcida.',
      'Cadera se mueve → altura/distancia incorrecta.',
      'Pantorrilla se fatiga demasiado → revisa altura y ángulo del pie.',
    ],
    quiz: [
      { q: 'Rodillas deberían estar…', a: 'alineadas', opts: ['torcidas', 'alineadas'] },
      { q: 'Si el pedal está muy lejos, pasa que…', a: 'pierdes estabilidad', opts: ['tocas mejor', 'pierdes estabilidad'] },
      { q: '¿La comodidad importa?', a: 'sí', opts: ['sí', 'no'] },
    ],
  },

  {
    id: 'm6',
    order: 6,
    title: 'Setup básico del kit',
    desc: 'Cómo acomodar todo para tocar sin “hacer trampa”.',
    img: IMG.m6,
    caption: 'Ajustes simples que cambian todo.',
    explain: [
      'Caja: a una altura donde tu antebrazo quede natural.',
      'Hi-hat: cerca, sin girar el tronco.',
      'Ride: lo suficientemente cerca para no subir hombro.',
      'Toms: inclinación moderada, que no obligue a doblar muñeca.',
    ],
    practice: [
      'Haz el “test de 3 ajustes”: (1) acerca ride, (2) ajusta caja, (3) acerca hi-hat.',
      'Toca 30 segundos suave: si tu cuello/hombros se tensan, reajusta distancia.',
      'Tómate una foto (opcional) para comparar en una semana.',
    ],
    hint: [
      'Hombros arriba → platos muy altos/lejos.',
      'Muñeca doblada → caja/toms con ángulo raro.',
      'Espalda adelante → caja lejos o silla baja.',
    ],
    quiz: [
      { q: 'Caja ideal queda…', a: 'natural', opts: ['muy alta', 'natural', 'muy baja'] },
      { q: 'Hi-hat debe obligarte a girar el tronco:', a: 'no', opts: ['sí', 'no'] },
      { q: 'Ride lejos causa…', a: 'hombro arriba', opts: ['hombro arriba', 'más paz'] },
    ],
  },
];

/* =========================
   Estado + persistencia
========================= */
const state = {
  currentId: null,
  progress: loadProgress(), // { done:{}, quiz:{}, answers:{}, lastId:null }
};

function loadProgress(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return { done:{}, quiz:{}, answers:{}, lastId:null };
    const parsed = JSON.parse(raw);
    return {
      done: parsed.done || {},
      quiz: parsed.quiz || {},
      answers: parsed.answers || {},
      lastId: parsed.lastId || null,
    };
  }catch{
    return { done:{}, quiz:{}, answers:{}, lastId:null };
  }
}

function saveProgress(){
  localStorage.setItem(LS_KEY, JSON.stringify(state.progress));
}

/* =========================
   DOM helpers
========================= */
const $  = (sel, root=document) => root.querySelector(sel);

const moduleList      = $('#moduleList');
const progressText    = $('#progressText');
const progressTextHero= $('#progressTextHero'); // existe en el index mejorado; si no, no pasa nada

const lessonKicker   = $('#lessonKicker');
const lessonTitle    = $('#lessonTitle');
const lessonDesc     = $('#lessonDesc');

const lessonImg      = $('#lessonImg');
const lessonCaption  = $('#lessonCaption');

const lessonExplain  = $('#lessonExplain');
const lessonPractice = $('#lessonPractice');
const lessonHint     = $('#lessonHint');

const quizForm       = $('#quizForm');
const quizResult     = $('#quizResult');

const btnPrev        = $('#btnPrev');
const btnNext        = $('#btnNext');
const btnMarkDone    = $('#btnMarkDone');
const doneBadge      = $('#doneBadge');

const btnReset       = $('#btnReset');
const btnAbout       = $('#btnAbout');

const modal          = $('#modal');
const btnCloseModal  = $('#btnCloseModal');
const btnOkModal     = $('#btnOkModal');
const modalTitle     = $('#modalTitle');
const modalBody      = $('#modalBody');

const btnCheckQuiz   = $('#btnCheckQuiz');

/* =========================
   Render
========================= */
function renderModuleList(){
  if(!moduleList) return;
  moduleList.innerHTML = '';

  const total = MODULES.length;
  const doneCount = MODULES.filter(m => !!state.progress.done[m.id]).length;
  const progressLabel = `${doneCount}/${total} completados`;

  if(progressText) progressText.textContent = progressLabel;
  if(progressTextHero) progressTextHero.textContent = progressLabel;

  MODULES.forEach(m => {
    const isDone = !!state.progress.done[m.id];
    const isActive = state.currentId === m.id;

    const btn = document.createElement('button');
    btn.className = 'moduleItem';
    btn.type = 'button';
    btn.dataset.id = m.id;
    btn.setAttribute('role','listitem');
    btn.setAttribute('aria-current', isActive ? 'true' : 'false');

    btn.innerHTML = `
      <div class="moduleTop">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="dot ${isDone ? 'done':''}"></span>
          <div class="moduleTitle">${m.order}. ${escapeHTML(m.title)}</div>
        </div>
        <div class="moduleMeta">${isDone ? 'Hecho ✅' : (isActive ? 'Viendo' : 'Pendiente')}</div>
      </div>
      <div class="moduleSmall">${escapeHTML(m.desc)}</div>
    `;

    btn.addEventListener('click', () => openModule(m.id));
    moduleList.appendChild(btn);
  });
}

function renderLesson(m){
  if(!m) return;

  if(lessonKicker) lessonKicker.textContent = `MÓDULO ${m.order}`;
  if(lessonTitle)  lessonTitle.textContent  = m.title;
  if(lessonDesc)   lessonDesc.textContent   = m.desc;

  // Imagen + fallback
  setLessonImage(m);

  if(lessonCaption) lessonCaption.textContent = m.caption || '';

  if(lessonExplain)  lessonExplain.innerHTML  = toBulletHTML(m.explain, true);
  if(lessonPractice) lessonPractice.innerHTML = toStepsHTML(m.practice);
  if(lessonHint)     lessonHint.innerHTML     = toBulletHTML(m.hint, true);

  const isDone = !!state.progress.done[m.id];
  if(doneBadge) doneBadge.classList.toggle('hidden', !isDone);

  renderQuiz(m);

  if(btnPrev) btnPrev.disabled = (m.order === 0);
  if(btnNext) btnNext.disabled = (m.order === MODULES.length - 1);

  // Guardar último visto
  state.progress.lastId = m.id;
  saveProgress();

  renderModuleList();
}

function setLessonImage(m){
  if(!lessonImg) return;

  const src = m.img || '';
  lessonImg.alt = m.title || 'Imagen del módulo';
  lessonImg.src = src;

  // Si falla, muestra placeholder elegante (sin reventar la app)
  lessonImg.onerror = () => {
    lessonImg.onerror = null;
    lessonImg.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#0C41C4" stop-opacity=".18"/>
              <stop offset=".5" stop-color="#680DBF" stop-opacity=".16"/>
              <stop offset="1" stop-color="#CE0071" stop-opacity=".12"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
          <text x="50%" y="46%" text-anchor="middle" font-family="Roboto, Arial" font-size="26" fill="#220A63" opacity=".9">
            Imagen no encontrada
          </text>
          <text x="50%" y="54%" text-anchor="middle" font-family="Roboto, Arial" font-size="16" fill="#220A63" opacity=".65">
            Revisa el nombre del archivo en /images
          </text>
        </svg>
      `);
    if(lessonCaption) lessonCaption.textContent = `No se encontró: ${src}`;
  };
}

function renderQuiz(m){
  if(!quizForm) return;

  quizForm.innerHTML = '';
  if(quizResult) quizResult.textContent = '';

  const saved = state.progress.answers[m.id] || {}; // {0:'no', 1:'kit', ...}

  m.quiz.forEach((item, idx) => {
    const qWrap = document.createElement('div');
    qWrap.className = 'q';

    const name = `q_${m.id}_${idx}`;

    qWrap.innerHTML = `
      <label>${idx + 1}. ${escapeHTML(item.q)}</label>
      <div class="opts">
        ${item.opts.map(opt => {
          const val = normalize(opt);
          const checked = (saved[idx] === val) ? 'checked' : '';
          return `
            <label class="radio">
              <input type="radio" name="${name}" value="${val}" ${checked}>
              <span>${escapeHTML(opt)}</span>
            </label>
          `;
        }).join('')}
      </div>
    `;

    quizForm.appendChild(qWrap);

    // Guardar selección en caliente
    qWrap.addEventListener('change', (e) => {
      const input = e.target;
      if(!(input instanceof HTMLInputElement)) return;
      if(input.name !== name) return;

      const cur = state.progress.answers[m.id] || {};
      cur[idx] = input.value;
      state.progress.answers[m.id] = cur;
      saveProgress();
    });
  });

  // Si ya había resultado guardado, lo mostramos suave
  const prior = state.progress.quiz[m.id];
  if(prior && quizResult){
    quizResult.textContent = `Último intento: ${prior.ok}/${prior.total}.`;
  }
}

/* =========================
   Actions
========================= */
function openModule(id){
  const m = MODULES.find(x => x.id === id);
  if(!m) return;
  state.currentId = id;
  renderLesson(m);
}

function openPrev(){
  const m = getCurrent();
  if(!m) return;
  const prev = MODULES.find(x => x.order === m.order - 1);
  if(prev) openModule(prev.id);
}

function openNext(){
  const m = getCurrent();
  if(!m) return;
  const next = MODULES.find(x => x.order === m.order + 1);
  if(next) openModule(next.id);
}

function markDone(){
  const m = getCurrent();
  if(!m) return;

  state.progress.done[m.id] = true;
  saveProgress();

  if(doneBadge) doneBadge.classList.remove('hidden');
  renderModuleList();
}

function checkQuiz(){
  const m = getCurrent();
  if(!m || !quizForm) return;

  let ok = 0;
  let answered = 0;

  m.quiz.forEach((item, idx) => {
    const name = `q_${m.id}_${idx}`;
    const sel = quizForm.querySelector(`input[name="${name}"]:checked`);
    if(sel){
      answered++;
      if(sel.value === normalize(item.a)) ok++;
    }
  });

  if(answered < m.quiz.length){
    if(quizResult) quizResult.textContent = `Te faltan ${m.quiz.length - answered} preguntas por responder.`;
    return;
  }

  state.progress.quiz[m.id] = { ok, total: m.quiz.length };
  saveProgress();

  if(!quizResult) return;

  if(ok === m.quiz.length){
    quizResult.textContent = `Perfecto: ${ok}/${m.quiz.length}. ✅`;
  }else if(ok === m.quiz.length - 1){
    quizResult.textContent = `Casi: ${ok}/${m.quiz.length}. Ajusta una cosita y listo.`;
  }else{
    quizResult.textContent = `Vas bien: ${ok}/${m.quiz.length}. Repite el módulo sin afán.`;
  }
}

function resetAll(){
  state.progress = { done:{}, quiz:{}, answers:{}, lastId:null };
  saveProgress();
  renderModuleList();

  // Mantener el módulo actual si existe
  if(state.currentId) openModule(state.currentId);
}

function showAbout(){
  openModal(
    '¿Qué es esto?',
    `
      <p>Una mini app educativa para aprender postura en batería desde cero.</p>
      <ul>
        <li>7 módulos cortos (0–6)</li>
        <li>Prácticas simples</li>
        <li>Auto-chequeo en 3 preguntas</li>
        <li>Progreso guardado en tu navegador</li>
      </ul>
    `
  );
}

/* =========================
   Modal
========================= */
function openModal(title, html){
  if(!modal) return;
  if(modalTitle) modalTitle.textContent = title;
  if(modalBody) modalBody.innerHTML = html;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');

  // foco decente
  setTimeout(() => {
    (btnOkModal || btnCloseModal)?.focus?.();
  }, 0);
}

function closeModal(){
  if(!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
}

/* =========================
   Helpers
========================= */
function getCurrent(){
  return MODULES.find(x => x.id === state.currentId) || null;
}

function toBulletHTML(arr, allowInlineHTML=false){
  if(!arr || !arr.length) return '<div class="muted">Sin contenido.</div>';
  // allowInlineHTML = true: permite <b> en tu contenido (ya viene controlado por ti)
  if(allowInlineHTML){
    return `<ul>${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  }
  return `<ul>${arr.map(x => `<li>${escapeHTML(x)}</li>`).join('')}</ul>`;
}

function toStepsHTML(arr){
  if(!arr || !arr.length) return '<div class="muted">Sin contenido.</div>';
  // Aquí escapamos para evitar que se cuele HTML raro
  return `<ol>${arr.map(x => `<li>${escapeHTML(x)}</li>`).join('')}</ol>`;
}

function escapeHTML(s){
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");
}

function normalize(s){
  return String(s).trim().toLowerCase()
    .replaceAll('á','a').replaceAll('é','e').replaceAll('í','i').replaceAll('ó','o').replaceAll('ú','u')
    .replaceAll('ñ','n');
}

/* =========================
   Eventos
========================= */
btnPrev?.addEventListener('click', openPrev);
btnNext?.addEventListener('click', openNext);
btnMarkDone?.addEventListener('click', markDone);
btnCheckQuiz?.addEventListener('click', checkQuiz);

btnReset?.addEventListener('click', () => {
  openModal('Reiniciar progreso', `<p>Esto borra tus módulos completados y resultados de quiz.</p>`);
  // Confirmar reset desde el modal
  if(btnOkModal){
    btnOkModal.onclick = () => { closeModal(); resetAll(); };
  }
});

btnAbout?.addEventListener('click', showAbout);
btnCloseModal?.addEventListener('click', closeModal);
btnOkModal?.addEventListener('click', closeModal);

modal?.addEventListener('click', (e) => {
  if(e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeModal();

  // Atajos suaves (no molestan al escribir porque no hay inputs de texto)
  if(e.key === 'ArrowLeft') openPrev();
  if(e.key === 'ArrowRight') openNext();
});

/* =========================
   Init
========================= */
(function init(){
  // abrir último módulo visto o el primero
  const startId = state.progress.lastId || MODULES[0].id;
  state.currentId = startId;

  renderModuleList();
  openModule(startId);
})();
