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
    s = i.token,
    d = void 0 === s ? '' : s,
    m = i.wsUrl,
    v = void 0 === m ? '' : m,
    h = r(null),
    b = r(null),
    g = r(null),
    p = r(null),
    y = r(null),
    w = l(t(!1), 2),
    E = w[0],
    k = w[1],
    S = r(''),
    C = r('');
  n(
    function () {
      var e = 5242880,
        r = function () {
          return 'online' === f ? 'terminal-history-online-'.concat(d) : 'terminal-history-local';
        };
      if ('online' !== f || (d && v)) {
        C.current = r();
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
        (t.loadAddon(n), t.open(h.current), n.fit());
        var i = function () {
            t.focus();
          },
          l = h.current;
        (l && (l.addEventListener('touchstart', i), l.addEventListener('click', i)),
          t.focus(),
          (b.current = t),
          (g.current = n));
        var u = (function () {
          try {
            var e = r();
            return localStorage.getItem(e) || '';
          } catch (e) {
            return (console.error('Failed to load history from localStorage:', e), '');
          }
        })();
        (u && ((S.current = u), t.write(u), t.write('\r\n'), t.scrollToBottom()),
          t.onData(function (e) {
            p.current &&
              p.current.connected &&
              ('online' === f ? p.current.emit('cli-input', { token: d, data: e }) : p.current.emit('cli-input', e));
          }));
        var s = { path: '/ws', transports: ['websocket'] },
          m = 'online' === f ? o(v, s) : o(s);
        p.current = m;
        var w = function () {
            'online' === f ? m.emit('register', { type: 'browser', token: d }) : k(!0);
          },
          E = function () {
            k(!0);
          },
          N = function () {
            k(!1);
          },
          A = function () {},
          I = function () {
            k(!1);
          },
          x = function () {},
          F = function (r) {
            r.data &&
              (t.write(r.data),
              (function (r) {
                try {
                  var t = C.current,
                    n = S.current + r;
                  n.length > e && (n = n.slice(-5242880));
                  var o = n.split('\n');
                  (o.length > 1e4 && (n = o.slice(-1e4).join('\n')), (S.current = n), localStorage.setItem(t, n));
                } catch (e) {
                  if ((console.error('Failed to save history to localStorage:', e), 'QuotaExceededError' === e.name))
                    try {
                      var c = r.slice(-2621440);
                      ((S.current = c), localStorage.setItem(C.current, c));
                    } catch (e) {}
                }
              })(r.data));
          };
        (m.on('connect', w),
          m.on('registered', E),
          m.on('disconnect', N),
          m.on('cli-disconnected', A),
          m.on('connect_error', I),
          m.on('error', x),
          m.on('cli-output', F));
        var L = new ResizeObserver(function () {
          requestAnimationFrame(function () {
            n.fit();
          });
        });
        return (
          h.current && (L.observe(h.current), (y.current = L)),
          function () {
            (y.current && y.current.disconnect(),
              l && (l.removeEventListener('touchstart', i), l.removeEventListener('click', i)),
              m.off('connect', w),
              m.off('registered', E),
              m.off('disconnect', N),
              m.off('cli-disconnected', A),
              m.off('connect_error', I),
              m.off('error', x),
              m.off('cli-output', F),
              m.disconnect(),
              t.dispose());
          }
        );
      }
      console.error('Token and wsUrl are required for online mode');
    },
    [f, d, v],
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
          e.createElement('div', { className: 'terminal-status-indicator '.concat(E ? 'connected' : 'disconnected') }),
          e.createElement('span', null, E ? 'Connected' : 'Disconnected'),
        ),
      ),
      e.createElement(
        'div',
        { className: 'terminal-header-buttons' },
        e.createElement(
          'button',
          {
            onClick: function () {
              b.current &&
                (b.current.clear(),
                (function () {
                  try {
                    var e = C.current;
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
    e.createElement('div', { ref: h, className: 'terminal-container' }),
  );
}
export { u as default };
//# sourceMappingURL=index.esm.js.map
