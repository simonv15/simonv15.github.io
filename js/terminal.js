window.Portfolio = window.Portfolio || {};

window.Portfolio.Terminal = (function () {
  var body, cursor;

  var COMMANDS = [
    { type: 'cmd', text: 'whoami', delay: 0 },
    { type: 'output', text: 'Van Sy — AI Engineer', cls: 'term-accent', delay: 300 },
    { type: 'cmd', text: 'cat skills.txt', delay: 600 },
    { type: 'output', text: 'Data · AI · Software · Coffee · Badminton', cls: 'term-muted', delay: 300 },
    { type: 'cmd', text: './start-portfolio', delay: 600 },
    { type: 'output', text: 'Loading portfolio...', cls: 'term-success', delay: 300 },
    { type: 'output', text: '✓ Ready.', cls: 'term-success', delay: 800 },
    { type: 'pause', delay: 3000 },
    { type: 'clear', delay: 0 }
  ];

  function createLine() {
    var line = document.createElement('div');
    line.className = 'term-line';
    body.insertBefore(line, cursor);
    return line;
  }

  function typeText(line, text, speed, cb) {
    var i = 0;
    cursor.style.display = 'inline';
    function next() {
      if (i < text.length) {
        line.textContent += text[i];
        i++;
        setTimeout(next, speed + Math.random() * speed * 0.6);
      } else {
        if (cb) cb();
      }
    }
    next();
  }

  function printLine(text, cls) {
    var line = createLine();
    if (cls) line.classList.add(cls);
    line.textContent = text;
    return line;
  }

  function printPrompt(line) {
    var prompt = document.createElement('span');
    prompt.className = 'term-prompt';
    prompt.textContent = '$ ';
    line.appendChild(prompt);
  }

  function clearScreen() {
    var lines = body.querySelectorAll('.term-line');
    lines.forEach(function (l) { l.remove(); });
  }

  function runSequence(cmds, index) {
    if (index >= cmds.length) {
      // Loop: restart from beginning
      setTimeout(function () {
        runSequence(cmds, 0);
      }, 500);
      return;
    }

    var cmd = cmds[index];

    setTimeout(function () {
      if (cmd.type === 'cmd') {
        var line = createLine();
        printPrompt(line);
        var cmdSpan = document.createElement('span');
        cmdSpan.className = 'term-cmd';
        line.appendChild(cmdSpan);
        typeText(cmdSpan, cmd.text, 45, function () {
          cursor.style.display = 'none';
          runSequence(cmds, index + 1);
        });
      } else if (cmd.type === 'output') {
        printLine(cmd.text, cmd.cls);
        runSequence(cmds, index + 1);
      } else if (cmd.type === 'clear') {
        clearScreen();
        runSequence(cmds, index + 1);
      } else if (cmd.type === 'pause') {
        cursor.style.display = 'inline';
        runSequence(cmds, index + 1);
      }
    }, cmd.delay);
  }

  function init() {
    body = document.getElementById('terminal-body');
    cursor = document.getElementById('terminal-cursor');
    if (!body || !cursor) return;

    document.addEventListener('theme-changed', function () {});

    setTimeout(function () {
      runSequence(COMMANDS, 0);
    }, 500);
  }

  return { init: init };
})();
