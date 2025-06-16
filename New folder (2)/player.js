// DOM shortcuts
const wrap   = document.getElementById('playerWrapper');
const drop   = document.getElementById('dropZone');
const fileIn = document.getElementById('fileInput');
const nameEl = document.getElementById('filenameDisplay');

let player = null;

// ---------- Core ----------
function loadFile(file) {
  if (!file) return;
  nameEl.textContent = file.name;

  const url = URL.createObjectURL(file);
  const tag = file.type.startsWith('video/') ? 'video'
            : file.type.startsWith('audio/') ? 'audio'
            : null;
  if (!tag) return alert('Unsupported file type');

  wrap.innerHTML = '';
  player = document.createElement(tag);
  player.className = 'rounded shadow max-w-full';
  player.controls = true;
  player.src = url;
  player.style.maxHeight = '70vh';          // responsive video height
  wrap.appendChild(player);
  player.play();
}

// ---------- Drag & drop ----------
['dragenter','dragover'].forEach(evt =>
  drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('border-blue-400'); })
);
['dragleave','drop'].forEach(evt =>
  drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('border-blue-400'); })
);
drop.addEventListener('drop',  e => loadFile(e.dataTransfer.files[0]));

// ---------- Buttons ----------
document.getElementById('openBtn').onclick   = () => fileIn.click();
fileIn.onchange = () => loadFile(fileIn.files[0]);
document.getElementById('playBtn' ).onclick  = () => player?.play();
document.getElementById('pauseBtn').onclick  = () => player?.pause();
document.getElementById('stopBtn' ).onclick  = () => { if (player){player.pause(); player.currentTime = 0;} };
