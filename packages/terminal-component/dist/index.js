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
    b = e.useRef(null),
    g = e.useRef(null),
    v = e.useRef(null),
    h = c(e.useState(!1), 2),
    p = h[0],
    y = h[1],
    w = e.useRef(''),
    C = e.useRef(''),
    E = 5242880,
    S = function () {
      return 'online' === a ? 'terminal-history-online-'.concat(u) : 'terminal-history-local';
    };
  return (
    e.useEffect(
      function () {
        if ('online' !== a || (u && f)) {
          C.current = S();
          var e = new t.Terminal({
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
            o = new n.FitAddon();
          (e.loadAddon(o), e.open(m.current), o.fit(), (d.current = e), (b.current = o));
          var c = (function () {
            try {
              var e = S();
              return localStorage.getItem(e) || '';
            } catch (e) {
              return (console.error('Failed to load history from localStorage:', e), '');
            }
          })();
          (c
            ? ((w.current = c), e.write(c))
            : (e.writeln('[1;36mWelcome to Claude CLI Terminal[0m'), e.writeln('[90mConnecting to server...[0m\n')),
            e.onData(function (e) {
              g.current &&
                g.current.connected &&
                ('online' === a ? g.current.emit('cli-input', { token: u, data: e }) : g.current.emit('cli-input', e));
            }));
          var i = { path: '/ws', transports: ['websocket'] },
            l = 'online' === a ? r.io(f, i) : r.io(i);
          g.current = l;
          var s = function () {
              'online' === a
                ? l.emit('register', { type: 'browser', token: u })
                : (y(!0), e.writeln('[1;32m✓ Connected to server[0m'), e.writeln('[90mStarting Claude CLI...[0m\n'));
            },
            h = function () {
              (y(!0), e.writeln('[1;32m✓ Connected to server[0m'), e.writeln('[90mWaiting for CLI session...[0m\n'));
            },
            p = function () {
              (y(!1), e.writeln('\n[1;31m✗ Disconnected[0m'));
            },
            k = function () {
              e.writeln('\n[1;33m✗ CLI session ended[0m');
            },
            I = function (r) {
              (y(!1),
                e.writeln('[1;31m✗ Connection failed: '.concat(r.message, '[0m')),
                e.writeln('[90mAttempting to reconnect...[0m\n'));
            },
            A = function (r) {
              e.writeln('[1;31m✗ Error: '.concat(r.message || r, '[0m\n'));
            },
            N = function (r) {
              r.data &&
                (e.write(r.data),
                (function (e) {
                  try {
                    var r = C.current,
                      t = w.current + e;
                    t.length > E && (t = t.slice(-5242880));
                    var n = t.split('\n');
                    (n.length > 1e4 && (t = n.slice(-1e4).join('\n')), (w.current = t), localStorage.setItem(r, t));
                  } catch (r) {
                    if ((console.error('Failed to save history to localStorage:', r), 'QuotaExceededError' === r.name))
                      try {
                        var o = e.slice(-2621440);
                        ((w.current = o), localStorage.setItem(C.current, o));
                      } catch (e) {}
                  }
                })(r.data));
            };
          (l.on('connect', s),
            l.on('registered', h),
            l.on('disconnect', p),
            l.on('cli-disconnected', k),
            l.on('connect_error', I),
            l.on('error', A),
            l.on('cli-output', N));
          var R = new ResizeObserver(function () {
            requestAnimationFrame(function () {
              o.fit();
            });
          });
          return (
            m.current && (R.observe(m.current), (v.current = R)),
            function () {
              (v.current && v.current.disconnect(),
                l.off('connect', s),
                l.off('registered', h),
                l.off('disconnect', p),
                l.off('cli-disconnected', k),
                l.off('connect_error', I),
                l.off('error', A),
                l.off('cli-output', N),
                l.disconnect(),
                e.dispose());
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
