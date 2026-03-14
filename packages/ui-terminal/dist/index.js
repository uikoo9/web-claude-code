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
          a,
          i = [],
          l = !0,
          u = !1;
        try {
          if (((c = (t = t.call(e)).next), 0 === r));
          else for (; !(l = (n = c.call(t)).done) && (i.push(n.value), i.length !== r); l = !0);
        } catch (e) {
          ((u = !0), (o = e));
        } finally {
          try {
            if (!l && null != t.return && ((a = t.return()), Object(a) !== a)) return;
          } finally {
            if (u) throw o;
          }
        }
        return i;
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
  var a = o.mode,
    i = void 0 === a ? 'local' : a,
    l = o.token,
    u = void 0 === l ? '' : l,
    f = o.wsUrl,
    s = void 0 === f ? '' : f,
    d = e.useRef(null),
    m = e.useRef(null),
    v = e.useRef(null),
    h = e.useRef(null),
    b = e.useRef(null),
    g = c(e.useState(!1), 2),
    y = g[0],
    p = g[1],
    w = e.useRef(''),
    E = e.useRef('');
  return (
    e.useEffect(
      function () {
        var e = 5242880,
          o = function () {
            return 'online' === i ? 'terminal-history-online-'.concat(u) : 'terminal-history-local';
          };
        if ('online' !== i || (u && s)) {
          E.current = o();
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
            a = new n.FitAddon();
          (c.loadAddon(a), c.open(d.current), a.fit());
          var l = function () {
              c.focus();
            },
            f = d.current;
          (f && (f.addEventListener('touchstart', l), f.addEventListener('click', l)),
            c.focus(),
            (m.current = c),
            (v.current = a));
          var g = (function () {
            try {
              var e = o();
              return localStorage.getItem(e) || '';
            } catch (e) {
              return (console.error('Failed to load history from localStorage:', e), '');
            }
          })();
          (g && ((w.current = g), c.write(g), c.write('\r\n'), c.scrollToBottom()),
            c.onData(function (e) {
              h.current &&
                h.current.connected &&
                ('online' === i ? h.current.emit('cli-input', { token: u, data: e }) : h.current.emit('cli-input', e));
            }));
          var y = { path: '/ws', transports: ['websocket'] },
            k = 'online' === i ? r.io(s, y) : r.io(y);
          h.current = k;
          var S = function () {
              'online' === i ? k.emit('register', { type: 'browser', token: u }) : p(!0);
            },
            C = function () {
              p(!0);
            },
            A = function () {
              p(!1);
            },
            N = function () {},
            R = function () {
              p(!1);
            },
            I = function () {},
            x = function (r) {
              r.data &&
                (c.write(r.data),
                (function (r) {
                  try {
                    var t = E.current,
                      n = w.current + r;
                    n.length > e && (n = n.slice(-5242880));
                    var o = n.split('\n');
                    (o.length > 1e4 && (n = o.slice(-1e4).join('\n')), (w.current = n), localStorage.setItem(t, n));
                  } catch (e) {
                    if ((console.error('Failed to save history to localStorage:', e), 'QuotaExceededError' === e.name))
                      try {
                        var c = r.slice(-2621440);
                        ((w.current = c), localStorage.setItem(E.current, c));
                      } catch (e) {}
                  }
                })(r.data));
            };
          (k.on('connect', S),
            k.on('registered', C),
            k.on('disconnect', A),
            k.on('cli-disconnected', N),
            k.on('connect_error', R),
            k.on('error', I),
            k.on('cli-output', x));
          var F = new ResizeObserver(function () {
            requestAnimationFrame(function () {
              a.fit();
            });
          });
          return (
            d.current && (F.observe(d.current), (b.current = F)),
            function () {
              (b.current && b.current.disconnect(),
                f && (f.removeEventListener('touchstart', l), f.removeEventListener('click', l)),
                k.off('connect', S),
                k.off('registered', C),
                k.off('disconnect', A),
                k.off('cli-disconnected', N),
                k.off('connect_error', R),
                k.off('error', I),
                k.off('cli-output', x),
                k.disconnect(),
                c.dispose());
            }
          );
        }
        console.error('Token and wsUrl are required for online mode');
      },
      [i, u, s],
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
              className: 'terminal-status-indicator '.concat(y ? 'connected' : 'disconnected'),
            }),
            e.createElement('span', null, y ? 'Connected' : 'Disconnected'),
          ),
        ),
        e.createElement(
          'div',
          { className: 'terminal-header-buttons' },
          e.createElement(
            'button',
            {
              onClick: function () {
                m.current &&
                  (m.current.clear(),
                  (function () {
                    try {
                      var e = E.current;
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
      e.createElement('div', { ref: d, className: 'terminal-container' }),
    )
  );
};
//# sourceMappingURL=index.js.map
