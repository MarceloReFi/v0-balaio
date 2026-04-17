/**
 * Balaio — Tailwind Config Patch
 * Direction: "Papel"
 *
 * Merge this into your existing tailwind.config.js / tailwind.config.ts.
 * The `balaio` key keeps all new tokens namespaced so they don't clash
 * with any Tailwind defaults you already use.
 *
 * Usage in components:
 *   bg-balaio-sage       → background: #4A7B5E
 *   text-balaio-ink      → color: #16161A
 *   border-balaio-rule   → border-color: #E4E8E5
 *   font-display         → fontFamily: Instrument Serif
 *   rounded-balaio-sheet → borderRadius: 18px
 */

const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...your existing config,
  theme: {
    extend: {

      // ── Colors ────────────────────────────────────────────
      colors: {
        balaio: {
          bg:      '#FFFFFF',
          ink:     '#16161A',
          sage:    '#4A7B5E',
          surface: '#F2F4F1',
          rule:    '#E4E8E5',
          muted:   '#7A8784',

          // Status
          'open-bg':       '#EAF4EE',
          'open-text':     '#4A7B5E',
          'pending-bg':    '#FEF9E7',
          'pending-text':  '#8A6D00',
          'claimed-bg':    '#F2F4F1',
          'claimed-text':  '#7A8784',

          // Crypto tokens
          'token-g':    '#00B4A0',
          'token-celo': '#FCFF52',
          'token-usdt': '#26A17B',
        },
      },

      // ── Typography ────────────────────────────────────────
      fontFamily: {
        display: ["'Instrument Serif'", 'Georgia', ...fontFamily.serif],
        body:    ["'DM Sans'", ...fontFamily.sans],
        sans:    ["'DM Sans'", ...fontFamily.sans],  // override default sans
      },

      // ── Border Radius ─────────────────────────────────────
      borderRadius: {
        'balaio-sm':    '8px',
        'balaio-md':    '10px',
        'balaio-lg':    '12px',
        'balaio-xl':    '14px',
        'balaio-pill':  '20px',
        'balaio-sheet': '18px',
      },

      // ── Box Shadows ───────────────────────────────────────
      boxShadow: {
        'balaio-card':  '0 2px 12px rgba(22, 22, 26, 0.06)',
        'balaio-sheet': '0 -4px 24px rgba(22, 22, 26, 0.10)',
      },

      // ── Letter Spacing ────────────────────────────────────
      letterSpacing: {
        'balaio-label': '0.08em',  // for UPPERCASE section labels
      },

    },
  },
};
