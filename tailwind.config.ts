import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-league-spartan)", "sans-serif"],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                granite: {
                    "50": "#f0f4f2",
                    "100": "#e2e9e4",
                    "200": "#c4d4c9",
                    "300": "#a7beaf",
                    "400": "#8aa894",
                    "500": "#6c9379",
                    "600": "#577561",
                    "700": "#415849",
                    "800": "#2b3b30",
                    "900": "#161d18",
                    "950": "#0f1511"
                },
                rosewood: {
                    "50": "#faebee",
                    "100": "#f4d7dd",
                    "200": "#eaaebb",
                    "300": "#df8699",
                    "400": "#d45e77",
                    "500": "#c93656",
                    "600": "#a12b44",
                    "700": "#792033",
                    "800": "#511522",
                    "900": "#280b11",
                    "950": "#1c070c"
                },
                "rosy-taupe": {
                    "50": "#f8f0ec",
                    "100": "#f1e0da",
                    "200": "#e3c1b5",
                    "300": "#d6a28f",
                    "400": "#c8836a",
                    "500": "#ba6445",
                    "600": "#955037",
                    "700": "#703c29",
                    "800": "#4a281c",
                    "900": "#25140e",
                    "950": "#1a0e0a"
                },
                "almond-silk": {
                    "50": "#f6efee",
                    "100": "#eee0dd",
                    "200": "#ddc0bb",
                    "300": "#cca199",
                    "400": "#bb8177",
                    "500": "#aa6255",
                    "600": "#884e44",
                    "700": "#663b33",
                    "800": "#442722",
                    "900": "#221411",
                    "950": "#180e0c"
                },
                "alabaster-grey": {
                    "50": "#f2f1f3",
                    "100": "#e6e3e8",
                    "200": "#cdc8d0",
                    "300": "#b4acb9",
                    "400": "#9b91a1",
                    "500": "#82758a",
                    "600": "#685e6e",
                    "700": "#4e4653",
                    "800": "#342f37",
                    "900": "#1a171c",
                    "950": "#121013"
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
};
export default config;
