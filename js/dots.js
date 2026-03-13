window.Portfolio = window.Portfolio || {};

window.Portfolio.Dots = (function () {
  var canvas, ctx;
  var dots = [];
  var spacing = 24;
  var dotRadius = 1;
  var cols, rows;
  var mouseX = -9999, mouseY = -9999;
  var magnetRadius = 120;
  var magnetStrength = 8;
  var animId = null;
  var lastFrame = 0;
  var frameInterval = 1000 / 40; // 40fps
  var dotColor = 'rgba(39, 40, 34, 0.10)';

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(window.innerWidth / spacing) + 1;
    rows = Math.ceil(window.innerHeight / spacing) + 1;

    dots = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        dots.push({
          ox: c * spacing,
          oy: r * spacing,
          x: c * spacing,
          y: r * spacing
        });
      }
    }
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  function updateDotColor() {
    var style = getComputedStyle(document.documentElement);
    var raw = style.getPropertyValue('--dot-color').trim();
    dotColor = raw || 'rgba(39, 40, 34, 0.10)';
  }

  function render(timestamp) {
    animId = requestAnimationFrame(render);

    if (document.hidden) return;
    if (timestamp - lastFrame < frameInterval) return;
    lastFrame = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < dots.length; i++) {
      var dot = dots[i];
      var dx = dot.ox - mouseX;
      var dy = dot.oy - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < magnetRadius) {
        var force = (1 - dist / magnetRadius) * magnetStrength;
        var angle = Math.atan2(dy, dx);
        dot.x = dot.ox + Math.cos(angle) * force;
        dot.y = dot.oy + Math.sin(angle) * force;
      } else {
        // Ease back to original position
        dot.x += (dot.ox - dot.x) * 0.15;
        dot.y += (dot.oy - dot.y) * 0.15;
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }
  }

  function init() {
    canvas = document.getElementById('dot-bg');
    if (!canvas) return;

    ctx = canvas.getContext('2d');

    updateDotColor();
    resize();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('theme-changed', updateDotColor);

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    });

    animId = requestAnimationFrame(render);
  }

  return { init: init };
})();
