import e, { useRef as r, useState as t, useEffect as n } from 'react';
import { io as o } from 'socket.io-client';
import { Terminal as c } from '@xterm/xterm';
import { FitAddon as a } from '@xterm/addon-fit';
function i(e, r) {
  (null == r || r > e.length) && (r = e.length);
  for (var t = 0, n = Array(r); t < r; t++) n[t] = e[t];
  return n;
}
function l(e, r) {
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
        if ('string' == typeof e) return i(e, r);
        var t = {}.toString.call(e).slice(8, -1);
        return (
          'Object' === t && e.constructor && (t = e.constructor.name),
          'Map' === t || 'Set' === t
            ? Array.from(e)
            : 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              ? i(e, r)
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
function u(i) {
  var u = i.mode,
    f = void 0 === u ? 'local' : u,
    m = i.token,
    s = void 0 === m ? '' : m,
    d = i.wsUrl,
    g = void 0 === d ? '' : d,
    b = r(null),
    h = r(null),
    v = r(null),
    p = r(null),
    y = r(null),
    w = l(t(!1), 2),
    C = w[0],
    E = w[1],
    S = r(''),
    k = r(''),
    I = 5242880,
    A = function () {
      return 'online' === f ? 'terminal-history-online-'.concat(s) : 'terminal-history-local';
    };
  n(
    function () {
      if ('online' !== f || (s && g)) {
        k.current = A();
        var e = new c({
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
          r = new a();
        (e.loadAddon(r), e.open(b.current), r.fit(), (h.current = e), (v.current = r));
        var t = (function () {
          try {
            var e = A();
            return localStorage.getItem(e) || '';
          } catch (e) {
            return (console.error('Failed to load history from localStorage:', e), '');
          }
        })();
        (t
          ? ((S.current = t), e.write(t))
          : (e.writeln('[1;36mWelcome to Claude CLI Terminal[0m'), e.writeln('[90mConnecting to server...[0m\n')),
          e.onData(function (e) {
            p.current &&
              p.current.connected &&
              ('online' === f ? p.current.emit('cli-input', { token: s, data: e }) : p.current.emit('cli-input', e));
          }));
        var n = { path: '/ws', transports: ['websocket'] },
          i = 'online' === f ? o(g, n) : o(n);
        p.current = i;
        var l = function () {
            'online' === f
              ? i.emit('register', { type: 'browser', token: s })
              : (E(!0), e.writeln('[1;32m✓ Connected to server[0m'), e.writeln('[90mStarting Claude CLI...[0m\n'));
          },
          u = function () {
            (E(!0), e.writeln('[1;32m✓ Connected to server[0m'), e.writeln('[90mWaiting for CLI session...[0m\n'));
          },
          m = function () {
            (E(!1), e.writeln('\n[1;31m✗ Disconnected[0m'));
          },
          d = function () {
            e.writeln('\n[1;33m✗ CLI session ended[0m');
          },
          w = function (r) {
            (E(!1),
              e.writeln('[1;31m✗ Connection failed: '.concat(r.message, '[0m')),
              e.writeln('[90mAttempting to reconnect...[0m\n'));
          },
          C = function (r) {
            e.writeln('[1;31m✗ Error: '.concat(r.message || r, '[0m\n'));
          },
          N = function (r) {
            r.data &&
              (e.write(r.data),
              (function (e) {
                try {
                  var r = k.current,
                    t = S.current + e;
                  t.length > I && (t = t.slice(-5242880));
                  var n = t.split('\n');
                  (n.length > 1e4 && (t = n.slice(-1e4).join('\n')), (S.current = t), localStorage.setItem(r, t));
                } catch (r) {
                  if ((console.error('Failed to save history to localStorage:', r), 'QuotaExceededError' === r.name))
                    try {
                      var o = e.slice(-2621440);
                      ((S.current = o), localStorage.setItem(k.current, o));
                    } catch (e) {}
                }
              })(r.data));
          };
        (i.on('connect', l),
          i.on('registered', u),
          i.on('disconnect', m),
          i.on('cli-disconnected', d),
          i.on('connect_error', w),
          i.on('error', C),
          i.on('cli-output', N));
        var x = new ResizeObserver(function () {
          requestAnimationFrame(function () {
            r.fit();
          });
        });
        return (
          b.current && (x.observe(b.current), (y.current = x)),
          function () {
            (y.current && y.current.disconnect(),
              i.off('connect', l),
              i.off('registered', u),
              i.off('disconnect', m),
              i.off('cli-disconnected', d),
              i.off('connect_error', w),
              i.off('error', C),
              i.off('cli-output', N),
              i.disconnect(),
              e.dispose());
          }
        );
      }
      console.error('Token and wsUrl are required for online mode');
    },
    [f, s, g],
  );
  return e.createElement(
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
          e.createElement('div', { className: 'terminal-status-indicator '.concat(C ? 'connected' : 'disconnected') }),
          e.createElement('span', null, C ? 'Connected' : 'Disconnected'),
        ),
      ),
      e.createElement(
        'div',
        { className: 'terminal-header-buttons' },
        e.createElement(
          'button',
          {
            onClick: function () {
              h.current &&
                (h.current.clear(),
                (function () {
                  try {
                    var e = k.current;
                    (localStorage.removeItem(e), (S.current = ''));
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
    e.createElement('div', { ref: b, className: 'terminal-container' }),
  );
}
export { u as default };
//# sourceMappingURL=index.esm.js.map
