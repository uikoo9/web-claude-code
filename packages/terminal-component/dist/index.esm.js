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
    k = r('');
  n(
    function () {
      var e = 5242880,
        r = function () {
          return 'online' === f ? 'terminal-history-online-'.concat(s) : 'terminal-history-local';
        };
      if ('online' !== f || (s && g)) {
        k.current = r();
        var t = new c({
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
          n = new a();
        (t.loadAddon(n), t.open(b.current), n.fit(), (h.current = t), (v.current = n));
        var i = (function () {
          try {
            var e = r();
            return localStorage.getItem(e) || '';
          } catch (e) {
            return (console.error('Failed to load history from localStorage:', e), '');
          }
        })();
        (i
          ? ((S.current = i), t.write(i))
          : (t.writeln('[1;36mWelcome to Claude CLI Terminal[0m'), t.writeln('[90mConnecting to server...[0m\n')),
          t.onData(function (e) {
            p.current &&
              p.current.connected &&
              ('online' === f ? p.current.emit('cli-input', { token: s, data: e }) : p.current.emit('cli-input', e));
          }));
        var l = { path: '/ws', transports: ['websocket'] },
          u = 'online' === f ? o(g, l) : o(l);
        p.current = u;
        var m = function () {
            'online' === f
              ? u.emit('register', { type: 'browser', token: s })
              : (E(!0), t.writeln('[1;32m✓ Connected to server[0m'), t.writeln('[90mStarting Claude CLI...[0m\n'));
          },
          d = function () {
            (E(!0), t.writeln('[1;32m✓ Connected to server[0m'), t.writeln('[90mWaiting for CLI session...[0m\n'));
          },
          w = function () {
            (E(!1), t.writeln('\n[1;31m✗ Disconnected[0m'));
          },
          C = function () {
            t.writeln('\n[1;33m✗ CLI session ended[0m');
          },
          I = function (e) {
            (E(!1),
              t.writeln('[1;31m✗ Connection failed: '.concat(e.message, '[0m')),
              t.writeln('[90mAttempting to reconnect...[0m\n'));
          },
          A = function (e) {
            t.writeln('[1;31m✗ Error: '.concat(e.message || e, '[0m\n'));
          },
          N = function (r) {
            r.data &&
              (t.write(r.data),
              (function (r) {
                try {
                  var t = k.current,
                    n = S.current + r;
                  n.length > e && (n = n.slice(-5242880));
                  var o = n.split('\n');
                  (o.length > 1e4 && (n = o.slice(-1e4).join('\n')), (S.current = n), localStorage.setItem(t, n));
                } catch (e) {
                  if ((console.error('Failed to save history to localStorage:', e), 'QuotaExceededError' === e.name))
                    try {
                      var c = r.slice(-2621440);
                      ((S.current = c), localStorage.setItem(k.current, c));
                    } catch (e) {}
                }
              })(r.data));
          };
        (u.on('connect', m),
          u.on('registered', d),
          u.on('disconnect', w),
          u.on('cli-disconnected', C),
          u.on('connect_error', I),
          u.on('error', A),
          u.on('cli-output', N));
        var x = new ResizeObserver(function () {
          requestAnimationFrame(function () {
            n.fit();
          });
        });
        return (
          b.current && (x.observe(b.current), (y.current = x)),
          function () {
            (y.current && y.current.disconnect(),
              u.off('connect', m),
              u.off('registered', d),
              u.off('disconnect', w),
              u.off('cli-disconnected', C),
              u.off('connect_error', I),
              u.off('error', A),
              u.off('cli-output', N),
              u.disconnect(),
              t.dispose());
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
