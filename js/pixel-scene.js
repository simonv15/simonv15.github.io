window.Portfolio = window.Portfolio || {};

window.Portfolio.PixelScene = (function () {
  var canvas, ctx;
  var W = 480, H = 280;
  var frame = 0;
  var animId = null;
  var lastFrame = 0;
  var isDark = false;

  // Monokai-inspired palette
  var C = {};

  function setPalette() {
    isDark = document.documentElement.dataset.theme === 'dark';
    C = {
      bg:        isDark ? '#272822' : '#e8e6d8',
      wall:      isDark ? '#2e2e28' : '#dfdcd0',
      floor:     isDark ? '#1e1e1a' : '#c8c4b4',
      desk:      isDark ? '#75715e' : '#a09882',
      deskTop:   isDark ? '#8a8477' : '#b8b0a0',
      deskEdge:  isDark ? '#5c5850' : '#908878',
      monitor:   isDark ? '#3e3d32' : '#2a2a22',
      monFrame:  isDark ? '#49483e' : '#3e3d32',
      screen:    '#272822',
      text1:     '#f92672',
      text2:     '#66d9ef',
      text3:     '#e6db74',
      text4:     '#a6e22e',
      text5:     '#ae81ff',
      keyboard:  isDark ? '#3e3d32' : '#4a4940',
      keys:      isDark ? '#49483e' : '#5c5b50',
      keyLight:  isDark ? '#75715e' : '#8a8670',
      coffee:    isDark ? '#8a8477' : '#a09888',
      coffeeLiq: '#ae81ff',
      plant:     '#a6e22e',
      plantDk:   '#4a7a10',
      pot:       '#f92672',
      potDk:     '#c4175a',
      cable:     isDark ? '#49483e' : '#75715e',
      white:     '#f8f8f2',
      lamp:      '#f8f8f2',
      lampShade: '#e6db74',
      lampPost:  isDark ? '#75715e' : '#8a8477',
      mouse:     isDark ? '#49483e' : '#5c5b50',
      mousePad:  isDark ? '#3e3d32' : '#4a4940',
      // Window
      windowFrame: isDark ? '#5c5850' : '#b8b0a0',
      windowPane:  isDark ? '#1a1a2e' : '#87ceeb',
      sky:         isDark ? '#0d0d1a' : '#6bb3d9',
      sun:         '#e6db74',
      moon:        '#f8f8f2',
      moonShadow:  '#c8c8c0',
      stars:       '#f8f8f2',
      // Books
      book1:     '#f92672',
      book2:     '#66d9ef',
      book3:     '#e6db74',
      book4:     '#a6e22e',
      book5:     '#ae81ff',
      // Character
      skin:      isDark ? '#d4a574' : '#c89668',
      skinDk:    isDark ? '#b8885c' : '#a87848',
      hair:      '#272822',
      beanie:    '#f92672',
      beanieRim: '#c4175a',
      beanieTip: '#e6db74',
      headphone: '#49483e',
      hpCushion: '#3e3d32',
      hpBand:    '#5c5850',
      shirt:     isDark ? '#66d9ef' : '#4a9ab5',
      shirtDk:   isDark ? '#4a9ab5' : '#3a7a95',
      // Gamepad
      gpBody:    isDark ? '#49483e' : '#3e3d32',
      gpBtn1:    '#a6e22e',
      gpBtn2:    '#f92672',
      gpBtn3:    '#66d9ef',
      gpBtn4:    '#e6db74',
      gpStick:   '#75715e',
    };
  }

  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawWindow() {
    // Window frame
    rect(340, 20, 120, 90, C.windowFrame);
    // Window pane
    rect(345, 25, 110, 80, C.windowPane);
    // Cross bar
    rect(399, 25, 3, 80, C.windowFrame);
    rect(345, 63, 110, 3, C.windowFrame);

    // Sky gradient
    for (var sy = 25; sy < 105; sy++) {
      var t = (sy - 25) / 80;
      if (isDark) {
        var r = Math.round(13 + t * 10);
        var g = Math.round(13 + t * 5);
        var b = Math.round(42 - t * 15);
        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      } else {
        var r2 = Math.round(105 + t * 40);
        var g2 = Math.round(180 + t * 20);
        var b2 = Math.round(220 - t * 30);
        ctx.fillStyle = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';
      }
      ctx.fillRect(345, sy, 54, 1);
      ctx.fillRect(402, sy, 53, 1);
    }

    if (isDark) {
      // Moon
      rect(370, 38, 16, 16, C.moon);
      // Moon crater shadows
      rect(374, 42, 4, 3, C.moonShadow);
      rect(378, 48, 3, 2, C.moonShadow);
      rect(372, 47, 2, 2, C.moonShadow);
      // Moon shadow (crescent effect)
      rect(382, 38, 6, 16, C.windowPane);

      // Stars
      var starPositions = [
        [350, 30], [362, 50], [390, 32], [355, 70], [385, 65],
        [410, 35], [425, 55], [440, 40], [415, 75], [435, 68],
        [448, 30], [420, 48]
      ];
      for (var si = 0; si < starPositions.length; si++) {
        var twinkle = Math.sin(frame * 0.05 + si * 1.7) > 0.3;
        if (twinkle) {
          rect(starPositions[si][0], starPositions[si][1], 1, 1, C.stars);
        }
      }
    } else {
      // Sun
      rect(415, 35, 20, 20, C.sun);
      // Sun glow
      ctx.fillStyle = 'rgba(230, 219, 116, 0.15)';
      ctx.fillRect(411, 31, 28, 28);

      // Sun rays (animated)
      var rayLen = 3 + Math.round(Math.sin(frame * 0.04) * 1);
      rect(423, 28 - rayLen, 2, rayLen, C.sun);  // top
      rect(423, 57, 2, rayLen, C.sun);             // bottom
      rect(408 - rayLen, 44, rayLen, 2, C.sun);   // left
      rect(437, 44, rayLen, 2, C.sun);             // right

      // Clouds
      var cx = 355 + Math.round(Math.sin(frame * 0.01) * 3);
      rect(cx, 45, 18, 5, 'rgba(248,248,242,0.6)');
      rect(cx + 3, 42, 12, 4, 'rgba(248,248,242,0.5)');
    }

    // Window sill
    rect(335, 110, 130, 6, C.windowFrame);
  }

  function drawWall() {
    rect(0, 0, W, 180, C.wall);

    // Subtle wall texture
    for (var wy = 0; wy < 180; wy += 12) {
      ctx.fillStyle = isDark ? 'rgba(248,248,242,0.008)' : 'rgba(0,0,0,0.01)';
      ctx.fillRect(0, wy, W, 1);
    }
  }

  function drawDesk() {
    // Desk surface
    rect(10, 180, 460, 10, C.deskTop);
    // Desk edge
    rect(10, 190, 460, 3, C.deskEdge);
    // Desk front
    rect(10, 193, 460, 40, C.desk);
    // Desk legs
    rect(20, 193, 10, 87, C.desk);
    rect(450, 193, 10, 87, C.desk);
    // Desk drawer
    rect(180, 198, 120, 30, C.monFrame);
    rect(235, 210, 14, 5, C.keyLight);
  }

  function drawMonitor() {
    // Monitor stand base
    rect(180, 168, 60, 14, C.monFrame);
    // Stand neck
    rect(200, 160, 20, 10, C.monFrame);

    // Monitor body
    rect(110, 65, 200, 100, C.monFrame);
    // Inner bezel
    rect(116, 70, 188, 88, C.monitor);
    // Screen
    rect(120, 74, 180, 80, C.screen);

    // Scanlines
    for (var sy = 74; sy < 154; sy += 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(120, sy, 180, 1);
    }

    // Code lines on screen (animated)
    var lines = [
      { x: 126, w: 45, c: C.text1 },
      { x: 126, w: 75, c: C.text4 },
      { x: 126, w: 55, c: C.text2 },
      { x: 126, w: 35, c: C.text3 },
      { x: 126, w: 65, c: C.text4 },
      { x: 136, w: 50, c: C.text2 },
      { x: 136, w: 40, c: C.text5 },
      { x: 136, w: 30, c: C.text1 },
      { x: 126, w: 80, c: C.text3 },
      { x: 126, w: 28, c: C.text4 },
      { x: 136, w: 55, c: C.text2 },
      { x: 136, w: 42, c: C.text1 },
      { x: 126, w: 60, c: C.text5 },
      { x: 126, w: 70, c: C.text4 },
    ];

    var scrollOffset = Math.floor(frame / 25) % lines.length;
    for (var i = 0; i < 12; i++) {
      var li = lines[(i + scrollOffset) % lines.length];
      var ly = 79 + i * 6;
      if (ly + 3 > 152) break;
      rect(li.x, ly, li.w, 3, li.c);
    }

    // Cursor blink
    if (Math.floor(frame / 18) % 2 === 0) {
      var cl = lines[(11 + scrollOffset) % lines.length];
      rect(cl.x + cl.w + 3, 79 + 11 * 6, 4, 4, C.white);
    }

    // Monitor LED
    rect(208, 162, 5, 3, frame % 60 < 30 ? C.text4 : C.monitor);
  }

  function drawKeyboard() {
    rect(155, 183, 130, 12, C.keyboard);
    for (var row = 0; row < 3; row++) {
      for (var k = 0; k < 16; k++) {
        rect(159 + k * 8, 184 + row * 4, 6, 3, C.keys);
      }
    }
    // Space bar
    rect(185, 192, 50, 3, C.keys);

    // Typing animation
    if (frame % 8 < 4) {
      var rk = Math.floor(Math.random() * 16);
      var rr = Math.floor(Math.random() * 3);
      rect(159 + rk * 8, 184 + rr * 4, 6, 3, C.keyLight);
    }
  }

  function drawMouse() {
    rect(300, 183, 35, 18, C.mousePad);
    var my = 185 + Math.round(Math.sin(frame * 0.05));
    rect(310, my, 14, 10, C.mouse);
    rect(315, my, 3, 4, C.keyLight);
  }

  function drawCoffee() {
    // Saucer
    rect(50, 176, 30, 6, C.coffee);
    // Cup
    rect(54, 158, 22, 22, C.coffee);
    // Liquid
    rect(57, 162, 16, 12, C.coffeeLiq);
    // Handle
    rect(76, 163, 5, 3, C.coffee);
    rect(79, 163, 3, 9, C.coffee);
    rect(76, 170, 5, 3, C.coffee);

    // Steam (animated)
    var steamPhase = frame % 50;
    if (steamPhase < 30) {
      var sy1 = 150 - steamPhase * 0.4;
      rect(61, sy1, 2, 3, 'rgba(248,248,242,0.25)');
      rect(66, sy1 - 3, 2, 3, 'rgba(248,248,242,0.18)');
      rect(71, sy1 - 1, 2, 3, 'rgba(248,248,242,0.2)');
    }
  }

  function drawPlant() {
    // Pot
    rect(415, 160, 28, 22, C.pot);
    rect(412, 157, 34, 5, C.potDk);
    rect(419, 181, 20, 3, C.potDk);

    // Main stem
    rect(428, 130, 3, 28, C.plantDk);
    // Branch stems
    rect(420, 140, 8, 2, C.plantDk);
    rect(431, 135, 10, 2, C.plantDk);

    var sway = Math.round(Math.sin(frame * 0.025) * 2);

    // Leaves
    rect(414 + sway, 132, 10, 5, C.plant);
    rect(412 + sway, 140, 9, 4, C.plant);
    rect(436 - sway, 128, 10, 5, C.plant);
    rect(438 - sway, 136, 8, 4, C.plant);
    // Top leaves
    rect(422 + sway, 122, 12, 5, C.plant);
    rect(426, 117, 6, 6, C.plant);
    rect(424, 114, 4, 4, C.plant);
  }

  function drawBooks() {
    // Tall stack on desk left
    rect(18, 170, 28, 7, C.book1);
    rect(16, 163, 32, 7, C.book2);
    rect(20, 156, 26, 7, C.book3);
    rect(17, 149, 30, 7, C.book4);
    rect(19, 142, 27, 7, C.book5);
    rect(15, 135, 33, 7, C.book1);
    // Book spines detail
    rect(20, 171, 2, 5, C.white);
    rect(25, 164, 2, 5, C.white);
    rect(30, 150, 2, 5, C.white);

    // Second smaller stack on desk right near plant
    rect(395, 172, 22, 6, C.book5);
    rect(393, 166, 26, 6, C.book2);
    rect(396, 160, 20, 6, C.book3);

    // Leaning book
    rect(48, 145, 6, 32, C.book5);
    rect(55, 148, 5, 29, C.book2);
  }

  function drawCharacter() {
    // Sitting in front of desk/monitor — big head style (chibi)

    // Body / shirt (sitting on chair implied)
    rect(210, 200, 30, 20, C.shirt);
    rect(212, 200, 26, 18, C.shirtDk);
    // Shirt collar
    rect(218, 198, 14, 4, C.shirt);

    // Arms on desk
    // Left arm
    rect(195, 188, 18, 8, C.shirt);
    rect(193, 186, 6, 6, C.skin); // left hand
    // Right arm
    rect(237, 188, 18, 8, C.shirt);
    rect(251, 186, 6, 6, C.skin); // right hand

    // Neck
    rect(220, 193, 10, 7, C.skin);

    // Head (big! chibi proportions)
    rect(205, 145, 40, 48, C.skin);
    // Face shadow
    rect(205, 175, 40, 10, C.skinDk);

    // Eyes
    rect(215, 165, 5, 5, C.hair);
    rect(230, 165, 5, 5, C.hair);
    // Eye shine
    rect(216, 166, 2, 2, C.white);
    rect(231, 166, 2, 2, C.white);
    // Eye blink
    if (frame % 180 > 175) {
      rect(215, 165, 5, 5, C.skin);
      rect(230, 165, 5, 5, C.skin);
      rect(215, 167, 5, 2, C.hair);
      rect(230, 167, 5, 2, C.hair);
    }

    // Mouth (slight smile)
    rect(221, 177, 8, 2, C.skinDk);
    rect(222, 179, 6, 1, C.skinDk);

    // Nose
    rect(223, 172, 4, 3, C.skinDk);

    // Ears
    rect(202, 164, 4, 8, C.skin);
    rect(244, 164, 4, 8, C.skin);

    // Hair peaking under beanie
    rect(205, 155, 4, 14, C.hair);
    rect(241, 155, 4, 14, C.hair);
    rect(207, 185, 36, 5, C.hair); // back of head hair

    // Woolen beanie
    rect(203, 140, 44, 20, C.beanie);
    // Beanie rim (folded edge)
    rect(201, 155, 48, 6, C.beanieRim);
    // Beanie top pom-pom
    rect(221, 133, 8, 8, C.beanieTip);
    rect(223, 131, 4, 3, C.beanieTip);
    // Beanie texture lines
    rect(210, 143, 2, 10, C.beanieRim);
    rect(218, 143, 2, 10, C.beanieRim);
    rect(226, 143, 2, 10, C.beanieRim);
    rect(234, 143, 2, 10, C.beanieRim);

    // Headphones
    // Band over beanie
    rect(200, 140, 4, 4, C.hpBand);
    rect(200, 137, 50, 4, C.hpBand);
    rect(246, 140, 4, 4, C.hpBand);
    // Left ear cup
    rect(196, 160, 8, 16, C.headphone);
    rect(194, 162, 4, 12, C.hpCushion);
    // Right ear cup
    rect(246, 160, 8, 16, C.headphone);
    rect(252, 162, 4, 12, C.hpCushion);
  }

  function drawGamepad() {
    // Xbox-style gamepad hung on wall
    var gx = 330, gy = 130;

    // Nail/hook
    rect(gx + 14, gy - 6, 3, 6, C.lampPost);

    // Main body
    rect(gx + 5, gy, 22, 16, C.gpBody);
    // Grips (left and right wings)
    rect(gx, gy + 3, 8, 14, C.gpBody);
    rect(gx + 24, gy + 3, 8, 14, C.gpBody);
    // Rounded bottom of grips
    rect(gx + 1, gy + 16, 6, 3, C.gpBody);
    rect(gx + 25, gy + 16, 6, 3, C.gpBody);

    // D-pad (left side)
    rect(gx + 8, gy + 5, 2, 8, C.hpBand);
    rect(gx + 5, gy + 8, 8, 2, C.hpBand);

    // Face buttons (right side - ABXY)
    rect(gx + 22, gy + 5, 3, 3, C.gpBtn1);  // A - green
    rect(gx + 18, gy + 3, 3, 3, C.gpBtn2);  // B - pink
    rect(gx + 18, gy + 9, 3, 3, C.gpBtn3);  // X - blue
    rect(gx + 22, gy + 9, 3, 3, C.gpBtn4);  // Y - yellow

    // Analog sticks
    rect(gx + 9, gy + 13, 3, 3, C.gpStick);
    rect(gx + 20, gy + 13, 3, 3, C.gpStick);

    // Xbox button (center)
    rect(gx + 14, gy + 6, 4, 4, C.white);
  }

  function drawLamp() {
    // Base
    rect(92, 175, 20, 5, C.lampPost);
    // Post
    rect(100, 120, 4, 56, C.lampPost);
    // Arm
    rect(96, 118, 30, 4, C.lampPost);
    // Shade
    rect(116, 110, 18, 12, C.lampShade);
    // Light cone
    if (isDark) {
      ctx.fillStyle = 'rgba(230, 219, 116, 0.06)';
      ctx.fillRect(110, 122, 30, 58);
      ctx.fillStyle = 'rgba(230, 219, 116, 0.03)';
      ctx.fillRect(105, 140, 40, 40);
    }
  }

  function drawPaper() {
    // Sticky notes on wall
    rect(50, 55, 16, 14, C.text3);
    rect(53, 58, 10, 2, C.desk);
    rect(53, 62, 7, 2, C.desk);

    rect(72, 60, 14, 12, C.text1);
    rect(75, 63, 8, 2, C.white);
    rect(75, 67, 6, 2, C.white);

    rect(58, 75, 12, 10, C.text2);
    rect(60, 77, 8, 2, C.white);
  }

  function drawCable() {
    rect(210, 193, 3, 12, C.cable);
    rect(207, 204, 8, 3, C.cable);
  }

  function drawScanlineOverlay() {
    for (var y = 0; y < H; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.02)';
      ctx.fillRect(0, y, W, 1);
    }
  }

  function draw() {
    drawWall();
    rect(0, 180, W, 100, C.floor); // floor behind desk

    drawWindow();
    drawGamepad();
    drawLamp();
    drawPaper();
    drawBooks();
    drawMonitor();
    drawCable();
    drawDesk();
    drawKeyboard();
    drawMouse();
    drawCoffee();
    drawPlant();
    drawScanlineOverlay();
  }

  function loop(timestamp) {
    animId = requestAnimationFrame(loop);
    if (document.hidden) return;
    // ~15fps for a slower, retro feel
    if (timestamp - lastFrame < 66) return;
    lastFrame = timestamp;
    frame++;
    draw();
  }

  function init() {
    canvas = document.getElementById('pixel-scene');
    if (!canvas) return;

    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    setPalette();

    function resize() {
      var maxW = Math.min(window.innerWidth * 0.85, 1200);
      var maxH = window.innerHeight * 0.5;
      var sW = maxW / W;
      var sH = maxH / H;
      var s = Math.max(Math.floor(Math.min(sW, sH)), 2);
      canvas.style.width = (W * s) + 'px';
      canvas.style.height = (H * s) + 'px';
      canvas.style.imageRendering = 'pixelated';
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('theme-changed', function () {
      setPalette();
    });

    draw();
    animId = requestAnimationFrame(loop);
  }

  return { init: init };
})();
