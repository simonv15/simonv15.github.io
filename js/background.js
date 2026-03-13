window.Portfolio = window.Portfolio || {};

window.Portfolio.Background = (function () {
  var canvas, ctx;
  var cols, rows;
  var cellW = 16;
  var cellH = 22;
  var current, previous, next;
  var mouseX = -1, mouseY = -1;
  var charPool = '01アイウエカキクサシスセタチツテナニヌネハヒフヘホマミメモラリルレロ@#$%&*+=<>{}[]|/\\~^.:;';
  var charGrid = [];
  var damping = 0.955;
  var mouseRadius = 10;
  var lastFrame = 0;
  var frameInterval = 1000 / 30; // 30fps cap
  var gridColor = '100, 120, 140';
  var animId = null;

  function idx(r, c) {
    return r * cols + c;
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Use larger cells on mobile
    var isMobile = window.innerWidth < 768;
    cellW = isMobile ? 20 : 16;
    cellH = isMobile ? 28 : 22;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(window.innerWidth / cellW) + 1;
    rows = Math.ceil(window.innerHeight / cellH) + 1;

    var size = rows * cols;
    current = new Float32Array(size);
    previous = new Float32Array(size);
    next = new Float32Array(size);

    // Initialize character grid
    charGrid = new Array(size);
    for (var i = 0; i < size; i++) {
      charGrid[i] = charPool[Math.floor(Math.random() * charPool.length)];
    }
  }

  function onMouseMove(e) {
    mouseX = Math.floor(e.clientX / cellW);
    mouseY = Math.floor(e.clientY / cellH);
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouseX = Math.floor(e.touches[0].clientX / cellW);
      mouseY = Math.floor(e.touches[0].clientY / cellH);
    }
  }

  function onMouseLeave() {
    mouseX = -1;
    mouseY = -1;
  }

  function injectEnergy() {
    if (mouseX < 0 || mouseY < 0 || mouseX >= cols || mouseY >= rows) return;

    for (var dy = -mouseRadius; dy <= mouseRadius; dy++) {
      for (var dx = -mouseRadius; dx <= mouseRadius; dx++) {
        var r = mouseY + dy;
        var c = mouseX + dx;
        if (r < 0 || r >= rows || c < 0 || c >= cols) continue;

        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > mouseRadius) continue;

        var energy = 1.0 - (dist / mouseRadius);
        var i = idx(r, c);
        if (energy > current[i]) {
          current[i] = energy;
        }
      }
    }
  }

  function propagate() {
    for (var r = 1; r < rows - 1; r++) {
      for (var c = 1; c < cols - 1; c++) {
        var i = idx(r, c);
        next[i] = (
          (current[idx(r - 1, c)] +
            current[idx(r + 1, c)] +
            current[idx(r, c - 1)] +
            current[idx(r, c + 1)]) / 2
        ) - previous[i];
        next[i] *= damping;

        // Clamp
        if (next[i] < 0.001) next[i] = 0;
        if (next[i] > 1) next[i] = 1;
      }
    }

    // Swap buffers
    var tmp = previous;
    previous = current;
    current = next;
    next = tmp;
  }

  function render(timestamp) {
    animId = requestAnimationFrame(render);

    if (document.hidden) return;

    // Frame rate limiting
    if (timestamp - lastFrame < frameInterval) return;
    lastFrame = timestamp;

    injectEnergy();
    propagate();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = (cellH * 0.65) + 'px JetBrains Mono, monospace';
    ctx.textBaseline = 'top';

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var i = idx(r, c);
        var energy = current[i];

        // Base dim alpha for idle cells + energy-driven alpha
        var alpha = 0.025 + energy * 0.6;
        if (alpha < 0.03) continue; // Skip nearly invisible cells

        // Re-randomize character when energy spikes
        if (energy > 0.15 && Math.random() < 0.3) {
          charGrid[i] = charPool[Math.floor(Math.random() * charPool.length)];
        }

        ctx.fillStyle = 'rgba(' + gridColor + ', ' + alpha.toFixed(3) + ')';
        ctx.fillText(charGrid[i], c * cellW, r * cellH);
      }
    }
  }

  function onThemeChanged() {
    var style = getComputedStyle(document.documentElement);
    gridColor = style.getPropertyValue('--grid-char-color').trim();
  }

  function init() {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');

    onThemeChanged();
    resize();

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('theme-changed', onThemeChanged);

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    });

    animId = requestAnimationFrame(render);
  }

  return { init: init };
})();
