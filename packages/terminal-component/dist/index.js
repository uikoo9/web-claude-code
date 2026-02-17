'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
var e = require('react'),
  r = require('socket.io-client'),
  t = require('@xterm/xterm'),
  n = require('@xterm/addon-fit');
function o(e, r) {
  (null == r || r > e.length) && (r = e.length);
  for (var t = 0, n = Array(r); t < r; t++) n[t] = e[t];
  return n;
}
function c(e, r) {
  return (
    (function (e) {
      if (Array.isArray(e)) return e;
    })(e) ||
    (function (e, r) {
      var t = null == e ? null : ('undefined' != typeof Symbol && e[Symbol.iterator]) || e['@@iterator'];
      if (null != t) {
        var n,
          o,
          c,
          i,
          a = [],
          l = !0,
          u = !1;
        try {
          if (((c = (t = t.call(e)).next), 0 === r));
          else for (; !(l = (n = c.call(t)).done) && (a.push(n.value), a.length !== r); l = !0);
        } catch (e) {
          ((u = !0), (o = e));
        } finally {
          try {
            if (!l && null != t.return && ((i = t.return()), Object(i) !== i)) return;
          } finally {
            if (u) throw o;
          }
        }
        return a;
      }
    })(e, r) ||
    (function (e, r) {
      if (e) {
        if ('string' == typeof e) return o(e, r);
        var t = {}.toString.call(e).slice(8, -1);
        return (
          'Object' === t && e.constructor && (t = e.constructor.name),
          'Map' === t || 'Set' === t
            ? Array.from(e)
            : 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              ? o(e, r)
              : void 0
        );
      }
    })(e, r) ||
    (function () {
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
      );
    })()
  );
}
exports.default = function (o) {
  var i = o.mode,
    a = void 0 === i ? 'local' : i,
    l = o.token,
    u = void 0 === l ? '' : l,
    s = o.wsUrl,
    f = void 0 === s ? '' : s,
    m = e.useRef(null),
    d = e.useRef(null),
    v = e.useRef(null),
    b = e.useRef(null),
    g = e.useRef(null),
    h = c(e.useState(!1), 2),
    p = h[0],
    y = h[1],
    w = e.useRef(''),
    C = e.useRef('');
  return (
    e.useEffect(
      function () {
        var e = 5242880,
          o = function () {
            return 'online' === a ? 'terminal-history-online-'.concat(u) : 'terminal-history-local';
          };
        if ('online' !== a || (u && f)) {
          C.current = o();
          var c = new t.Terminal({
              cursorBlink: !0,
              fontSize: 14,
              fontFamily: '"Cascadia Code", "Fira Code", "Courier New", monospace',
              theme: {
                background: '#1e1e1e',
                foreground: '#e8e8e8',
                cursor: '#6bcf7f',
                black: '#000000',
                red: '#ff6b6b',
                green: '#6bcf7f',
                yellow: '#ffd93d',
                blue: '#74b9ff',
                magenta: '#e066ff',
                cyan: '#4ecdc4',
                white: '#e8e8e8',
                brightBlack: '#888888',
                brightRed: '#ff6b6b',
                brightGreen: '#6bcf7f',
                brightYellow: '#ffd93d',
                brightBlue: '#74b9ff',
                brightMagenta: '#e066ff',
                brightCyan: '#4ecdc4',
                brightWhite: '#ffffff',
              },
              scrollback: 1e4,
              allowProposedApi: !0,
            }),
            i = new n.FitAddon();
          (c.loadAddon(i), c.open(m.current), i.fit(), (d.current = c), (v.current = i));
          var l = (function () {
            try {
              var e = o();
              return localStorage.getItem(e) || '';
            } catch (e) {
              return (console.error('Failed to load history from localStorage:', e), '');
            }
          })();
          (l
            ? ((w.current = l), c.write(l))
            : (c.writeln('[1;36mWelcome to Claude CLI Terminal[0m'), c.writeln('[90mConnecting to server...[0m\n')),
            c.onData(function (e) {
              b.current &&
                b.current.connected &&
                ('online' === a ? b.current.emit('cli-input', { token: u, data: e }) : b.current.emit('cli-input', e));
            }));
          var s = { path: '/ws', transports: ['websocket'] },
            h = 'online' === a ? r.io(f, s) : r.io(s);
          b.current = h;
          var p = function () {
              'online' === a
                ? h.emit('register', { type: 'browser', token: u })
                : (y(!0), c.writeln('[1;32m✓ Connected to server[0m'), c.writeln('[90mStarting Claude CLI...[0m\n'));
            },
            E = function () {
              (y(!0), c.writeln('[1;32m✓ Connected to server[0m'), c.writeln('[90mWaiting for CLI session...[0m\n'));
            },
            S = function () {
              (y(!1), c.writeln('\n[1;31m✗ Disconnected[0m'));
            },
            k = function () {
              c.writeln('\n[1;33m✗ CLI session ended[0m');
            },
            I = function (e) {
              (y(!1),
                c.writeln('[1;31m✗ Connection failed: '.concat(e.message, '[0m')),
                c.writeln('[90mAttempting to reconnect...[0m\n'));
            },
            A = function (e) {
              c.writeln('[1;31m✗ Error: '.concat(e.message || e, '[0m\n'));
            },
            N = function (r) {
              r.data &&
                (c.write(r.data),
                (function (r) {
                  try {
                    var t = C.current,
                      n = w.current + r;
                    n.length > e && (n = n.slice(-5242880));
                    var o = n.split('\n');
                    (o.length > 1e4 && (n = o.slice(-1e4).join('\n')), (w.current = n), localStorage.setItem(t, n));
                  } catch (e) {
                    if ((console.error('Failed to save history to localStorage:', e), 'QuotaExceededError' === e.name))
                      try {
                        var c = r.slice(-2621440);
                        ((w.current = c), localStorage.setItem(C.current, c));
                      } catch (e) {}
                  }
                })(r.data));
            };
          (h.on('connect', p),
            h.on('registered', E),
            h.on('disconnect', S),
            h.on('cli-disconnected', k),
            h.on('connect_error', I),
            h.on('error', A),
            h.on('cli-output', N));
          var R = new ResizeObserver(function () {
            requestAnimationFrame(function () {
              i.fit();
            });
          });
          return (
            m.current && (R.observe(m.current), (g.current = R)),
            function () {
              (g.current && g.current.disconnect(),
                h.off('connect', p),
                h.off('registered', E),
                h.off('disconnect', S),
                h.off('cli-disconnected', k),
                h.off('connect_error', I),
                h.off('error', A),
                h.off('cli-output', N),
                h.disconnect(),
                c.dispose());
            }
          );
        }
        console.error('Token and wsUrl are required for online mode');
      },
      [a, u, f],
    ),
    e.createElement(
      'div',
      { className: 'terminal-app-container' },
      e.createElement(
        'div',
        { className: 'terminal-app-header' },
        e.createElement(
          'div',
          { className: 'terminal-header-left' },
          e.createElement('h1', { className: 'terminal-app-title' }, 'Claude CLI Terminal'),
          e.createElement(
            'div',
            { className: 'terminal-connection-status' },
            e.createElement('div', {
              className: 'terminal-status-indicator '.concat(p ? 'connected' : 'disconnected'),
            }),
            e.createElement('span', null, p ? 'Connected' : 'Disconnected'),
          ),
        ),
        e.createElement(
          'div',
          { className: 'terminal-header-buttons' },
          e.createElement(
            'button',
            {
              onClick: function () {
                d.current &&
                  (d.current.clear(),
                  (function () {
                    try {
                      var e = C.current;
                      (localStorage.removeItem(e), (w.current = ''));
                    } catch (e) {
                      console.error('Failed to clear history from localStorage:', e);
                    }
                  })());
              },
              className: 'terminal-header-button',
            },
            'Clear Terminal',
          ),
        ),
      ),
      e.createElement('div', { ref: m, className: 'terminal-container' }),
    )
  );
};
//# sourceMappingURL=index.js.map
