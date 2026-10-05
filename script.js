const FOTOS = [
  "Foto%201.jpg",
  "foto%202.jpg",
  "img%203.jpg",
];

let audioContext = null;

function inicializarAudio() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function tocarNota(frecuencia, inicio, duracion, tipo = "sine", volumen = 0.05) {
  const contexto = inicializarAudio();

  if (!contexto) {
    return;
  }

  const oscilador = contexto.createOscillator();
  const gainNode = contexto.createGain();

  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frecuencia, contexto.currentTime + inicio);

  gainNode.gain.setValueAtTime(0.0001, contexto.currentTime + inicio);
  gainNode.gain.exponentialRampToValueAtTime(
    volumen,
    contexto.currentTime + inicio + 0.02,
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    contexto.currentTime + inicio + duracion,
  );

  oscilador.connect(gainNode);
  gainNode.connect(contexto.destination);

  oscilador.start(contexto.currentTime + inicio);
  oscilador.stop(contexto.currentTime + inicio + duracion + 0.03);
}

function tocarSecuenciaFelicitacion() {
  const secuencia = [
    [392, 0, 0.22, "triangle", 0.06],
    [523.25, 0.18, 0.24, "triangle", 0.06],
    [659.25, 0.36, 0.3, "sine", 0.05],
    [783.99, 0.7, 0.42, "triangle", 0.06],
  ];

  secuencia.forEach(([frecuencia, inicio, duracion, tipo, volumen]) => {
    tocarNota(frecuencia, inicio, duracion, tipo, volumen);
  });
}

function tocarApertura() {
  const secuencia = [
    [261.63, 0, 0.18, "sine", 0.05],
    [329.63, 0.14, 0.18, "sine", 0.05],
    [392, 0.28, 0.26, "triangle", 0.05],
  ];

  secuencia.forEach(([frecuencia, inicio, duracion, tipo, volumen]) => {
    tocarNota(frecuencia, inicio, duracion, tipo, volumen);
  });
}

const boton = document.getElementById("abrirCollage");
const collage = document.getElementById("collage");
const rejilla = document.getElementById("rejilla");
const verSorpresa = document.getElementById("verSorpresa");
const sorpresa = document.getElementById("sorpresa");
const volver = document.getElementById("volver");
const confeti = document.getElementById("confeti");

FOTOS.forEach((ruta, indice) => {
  const marco = document.createElement("figure");
  marco.className = "marco";
  marco.style.setProperty("--i", indice);

  const img = document.createElement("img");
  img.className = "foto";
  img.src = ruta;
  img.alt = `Foto ${indice + 1}`;

  marco.append(img);
  rejilla.append(marco);
});

boton.addEventListener("click", () => {
  inicializarAudio();
  tocarApertura();
  collage.hidden = false;
  collage.classList.add("visible");
  boton.hidden = true;
  const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  collage.scrollIntoView({ behavior: suave, block: "center" });
});

const coloresConfeti = ["#f3c4df", "#f4c95d", "#ffffff", "#e63962", "#b8e0d2"];

for (let indice = 0; indice < 36; indice += 1) {
  const pieza = document.createElement("span");
  pieza.style.setProperty("--x", `${(indice * 37) % 100}%`);
  pieza.style.setProperty("--retraso", `${(indice % 12) * 0.08}s`);
  pieza.style.setProperty(
    "--color",
    coloresConfeti[indice % coloresConfeti.length],
  );
  confeti.append(pieza);
}

verSorpresa.addEventListener("click", () => {
  inicializarAudio();
  tocarSecuenciaFelicitacion();
  collage.hidden = true;
  sorpresa.hidden = false;
  confeti.classList.remove("animando");
  void confeti.offsetWidth;
  confeti.classList.add("animando");
  sorpresa.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "center",
  });
});

volver.addEventListener("click", () => {
  inicializarAudio();
  tocarApertura();
  sorpresa.hidden = true;
  collage.hidden = false;
  collage.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "center",
  });
});
