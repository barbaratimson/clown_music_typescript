/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // add this line
  ],
  theme: {
    extend: {
      colors: {
        // Main colors from _vars.scss
        primary: {
          light: '#ffffff', // $font-color-main-light
          DEFAULT: 'rgba(255, 255, 255, 1)', // --font-color-main
        },
        background: {
          main: 'rgba(0, 0, 0, 0.5)', // --bg-color-main
          secondary: 'rgba(255, 255, 255, 0.08)', // $bg-color-secondary / --bg-color-secondary
          'secondary-hover': 'rgba(255, 247, 247, 0.19)', // $bg-color-secondary_hover / --bg-color-secondary_hover
        },

        // Additional colors from the SCSS
        overlay: 'rgba(0, 0, 0, 0.6)',
        'scrollbar-thumb': 'rgba(255, 255, 255, 0.18)',
        'scrollbar-track': 'rgba(73, 73, 73, 0.11)',
        'player-bg': 'rgba(0, 0, 0, 1)',
        'track-current': 'rgba(255, 255, 255, 0.1)',
        'track-hover': 'rgba(255, 255, 255, 0.06)',
        'track-current-hover': 'rgba(255, 255, 255, 0.12)',
        'playlist-card-hover': 'rgba(255, 255, 255, 0.3)',
        'artist-hover': 'rgba(255, 255, 255, 0.3)',
        'modal-bg': 'rgba(0, 0, 0, 1)',
        'gradient-red': {
          start: '#E32636',
          end: '#320A18',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'system-ui',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Ubuntu',
          'sans-serif',
        ],
      },
      zIndex: {
        player: 1, // $player-Z_layer
        modal: 2, // $modal-Z_layer
        message: 3, // $message-Z_layer
        interface: 1, // $interface-Z_layer
      },
      screens: {
        small: '575px', // $small
      },
      fontSize: {
        'track-title': '15px', // $track-title-size
        'track-title-mobile': '14px', // $track-title-size_mobile
        'track-artist': '14px', // $track-artist-size
        'track-artist-mobile': '12px', // $track-artist-size_mobile
      },
    },
  },
  plugins: [],
}