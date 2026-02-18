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
    b = void 0 === m ? '' : m,
    h = r(null),
    v = r(null),
    g = r(null),
    p = r(null),
    y = r(null),
    w = l(t(!1), 2),
    E = w[0],
    S = w[1],
    k = r(''),
    C = r('');
  n(
    function () {
      var e = 5242880,
        r = function () {
          return 'online' === f ? 'terminal-history-online-'.concat(d) : 'terminal-history-local';
        };
      if ('online' !== f || (d && b)) {
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
        (t.loadAddon(n), t.open(h.current), n.fit(), (v.current = t), (g.current = n));
        var i = (function () {
          try {
            var e = r();
            return localStorage.getItem(e) || '';
          } catch (e) {
            return (console.error('Failed to load history from localStorage:', e), '');
          }
        })();
        (i && ((k.current = i), t.write(i), t.write('\r\n'), t.scrollToBottom()),
          t.onData(function (e) {
            p.current &&
              p.current.connected &&
              ('online' === f ? p.current.emit('cli-input', { token: d, data: e }) : p.current.emit('cli-input', e));
          }));
        var l = { path: '/ws', transports: ['websocket'] },
          u = 'online' === f ? o(b, l) : o(l);
        p.current = u;
        var s = function () {
            'online' === f ? u.emit('register', { type: 'browser', token: d }) : S(!0);
          },
          m = function () {
            S(!0);
          },
          w = function () {
            S(!1);
          },
          E = function () {},
          N = function () {
            S(!1);
          },
          A = function () {},
          I = function (r) {
            r.data &&
              (t.write(r.data),
              (function (r) {
                try {
                  var t = C.current,
                    n = k.current + r;
                  n.length > e && (n = n.slice(-5242880));
                  var o = n.split('\n');
                  (o.length > 1e4 && (n = o.slice(-1e4).join('\n')), (k.current = n), localStorage.setItem(t, n));
                } catch (e) {
                  if ((console.error('Failed to save history to localStorage:', e), 'QuotaExceededError' === e.name))
                    try {
                      var c = r.slice(-2621440);
                      ((k.current = c), localStorage.setItem(C.current, c));
                    } catch (e) {}
                }
              })(r.data));
          };
        (u.on('connect', s),
          u.on('registered', m),
          u.on('disconnect', w),
          u.on('cli-disconnected', E),
          u.on('connect_error', N),
          u.on('error', A),
          u.on('cli-output', I));
        var x = new ResizeObserver(function () {
          requestAnimationFrame(function () {
            n.fit();
          });
        });
        return (
          h.current && (x.observe(h.current), (y.current = x)),
          function () {
            (y.current && y.current.disconnect(),
              u.off('connect', s),
              u.off('registered', m),
              u.off('disconnect', w),
              u.off('cli-disconnected', E),
              u.off('connect_error', N),
              u.off('error', A),
              u.off('cli-output', I),
              u.disconnect(),
              t.dispose());
          }
        );
      }
      console.error('Token and wsUrl are required for online mode');
    },
    [f, d, b],
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
              v.current &&
                (v.current.clear(),
                (function () {
                  try {
                    var e = C.current;
                    (localStorage.removeItem(e), (k.current = ''));
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
