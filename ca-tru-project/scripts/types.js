let isRecording = false;
let startTime;
let interval;

// audio
let audioContext;
let analyser;
let dataArray;
let animationId;

// canvas
const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// START / STOP
async function toggleRecording() {
  const text = document.getElementById("recordText");
  const box = document.getElementById("recordBox");

  if (!isRecording) {
    isRecording = true;
    startTime = Date.now();

    text.innerText = "Recording...";
    box.classList.add("recording");

    startTimer();
    await startWaveform();
  } else {
    isRecording = false;

    text.innerText = "Start Recording";
    box.classList.remove("recording");

    stopTimer();
    stopWaveform();
  }
}

// TIMER
function startTimer() {
  interval = setInterval(() => {
    const diff = Date.now() - startTime;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const ms = Math.floor((diff % 1000) / 10);

    document.getElementById("timer").innerText =
      `${pad(h)}:${pad(m)}:${pad(s)}:${pad(ms)}`;
  }, 50);
}

function stopTimer() {
  clearInterval(interval);
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

// WAVEFORM
async function startWaveform() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  dataArray = new Uint8Array(analyser.fftSize);

  source.connect(analyser);

  draw();
}

function draw() {
  animationId = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "orange");
  gradient.addColorStop(0.3, "purple");
  gradient.addColorStop(0.6, "blue");
  gradient.addColorStop(1, "cyan");

  ctx.strokeStyle = gradient;

  ctx.beginPath();

  const sliceWidth = canvas.width / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    x += sliceWidth;
  }

  ctx.stroke();
}

function stopWaveform() {
  cancelAnimationFrame(animationId);
  if (audioContext) audioContext.close();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}