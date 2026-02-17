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
                // New Palette
                indigo: {
                    DEFAULT: "#541388",
                    50: "#f2e9f8",
                    100: "#e0cceb",
                    200: "#c79dd9",
                    300: "#ab6cc5",
                    400: "#9140b3",
                    500: "#7A1DA5", // Adjusted base slightly for better steps, but sticking to requested
                    600: "#5d1594",
                    700: "#541388", // Primary
                    800: "#440f6e",
                    900: "#320b52",
                    950: "#1f0636"
                },
                berry: {
                    DEFAULT: "#d90368",
                    50: "#fbe6ee",
                    100: "#f6c3d5",
                    200: "#ef90b0",
                    300: "#e65d8a",
                    400: "#df2d6d",
                    500: "#d90368", // Primary
                    600: "#ae0253",
                    700: "#82023e",
                    800: "#57012a",
                    900: "#2b0115",
                    950: "#19000c"
                },
                eggshell: {
                    DEFAULT: "#f1e9da",
                    50: "#fcfbf9",
                    100: "#f9f6f2",
                    200: "#f5f0e9",
                    300: "#f1e9da", // Primary
                    400: "#e6dac4",
                    500: "#dacab0",
                    600: "#ceb99c",
                    700: "#ad9574",
                    800: "#8c785d",
                    900: "#6b5c47",
                    950: "#4a3f31"
                },
                space: {
                    DEFAULT: "#2e294e",
                    50: "#ececf0",
                    100: "#d0cfda",
                    200: "#aba9bd",
                    300: "#8683a0",
                    400: "#656087",
                    500: "#48436e",
                    600: "#36315c",
                    700: "#2e294e", // Primary
                    800: "#24203d",
                    900: "#19162b",
                    950: "#0f0d19"
                },
                gold: {
                    DEFAULT: "#ffd400",
                    50: "#fffbe6",
                    100: "#fff5bf",
                    200: "#ffed99",
                    300: "#ffe473",
                    400: "#ffdc4d",
                    500: "#ffd400", // Primary
                    600: "#ccaa00",
                    700: "#998000",
                    800: "#665500",
                    900: "#332b00",
                    950: "#1a1500"
                },

                // Keep keeping legacy names mapped to new palette for compatibility or just replacing usage
                granite: { // Mapping space/greyish tones
                    50: "#f8f8fa",
                    100: "#ececf0",
                    200: "#d0cfda",
                    800: "#2e294e", // using Space Indigo
                    900: "#19162b",
                },
                rosewood: { // Mapping berry tones
                    50: "#fbe6ee",
                    100: "#f6c3d5",
                    400: "#e65d8a",
                    500: "#d90368", // Berry Lipstick
                    600: "#ae0253",
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
