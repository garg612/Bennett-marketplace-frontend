/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {

        md: {
          background: "#FFFBFE",
          'on-background': "#1C1B1F",
          onBackground: "#1C1B1F",

          primary: "#6750A4",
          'on-primary': "#FFFFFF",
          onPrimary: "#FFFFFF",

          'secondary-container': "#E8DEF8",
          secondaryContainer: "#E8DEF8",
          'on-secondary-container': "#1D192B",
          onSecondaryContainer: "#1D192B",

          tertiary: "#7D5260",
          'on-tertiary': "#FFFFFF",

          'surface-container': "#F3EDF7",
          surfaceContainer: "#F3EDF7",
          'surface-container-low': "#E7E0EC",
          surfaceContainerLow: "#E7E0EC",

          outline: "#79747E"
        }

      },

      borderRadius: {

        'md-hero': "48px",
        'md-card': "24px",
        mdsm: "8px",
        mdmd: "16px",
        mdlg: "24px",
        mdxl: "32px",
        md2xl: "48px"

      },

      boxShadow: {

        'md-sm': "0 1px 3px rgba(28, 27, 31, 0.12)",
        'md-md': "0 4px 12px rgba(28, 27, 31, 0.16)",
        'md-lg': "0 12px 24px rgba(28, 27, 31, 0.2)",
        md1: "0 1px 2px rgba(0,0,0,0.08)",
        md2: "0 4px 8px rgba(0,0,0,0.08)",
        md3: "0 8px 16px rgba(0,0,0,0.10)"

      },

      transitionTimingFunction: {

        material: "cubic-bezier(0.2,0,0,1)"

      },

      fontFamily: {

        roboto: ["Roboto", "sans-serif"]

      },

      fontSize: {

        'hero': ["56px", { lineHeight: "1.05", fontWeight: "500" }],
        'section': ["48px", { lineHeight: "1.08", fontWeight: "500" }],
        'subtitle': ["32px", { lineHeight: "1.2", fontWeight: "500" }],
        'card-title': ["24px", { lineHeight: "1.25", fontWeight: "500" }],
        'body': ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        'label': ["14px", { lineHeight: "1.4", fontWeight: "500" }]

      }

    },
  },

  plugins: [],
}