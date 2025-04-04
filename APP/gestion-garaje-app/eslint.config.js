import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginNext from "eslint-plugin-next";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node, // Incluye variables globales de Node.js
            },
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    globalIgnores(["build/**/*", "dist/**/*"]),
    tseslint.configs.recommended, // Configuración recomendada para TypeScript
    pluginReact.configs.flat.recommended, // Configuración recomendada para React
    pluginNext.configs.recommended, // Configuración recomendada para Next.js
    {
        rules: {
            "no-undef": "warn", // Advertencia para variables no definidas
            eqeqeq: "warn", // Requiere el uso de === y !==
            "react/react-in-jsx-scope": "off", // No es necesario importar React en Next.js
            "react/jsx-uses-react": "off", // Desactiva la regla obsoleta
            "no-unused-vars": "off", // Desactiva la regla de JS para evitar conflictos con TypeScript
            "@typescript-eslint/no-unused-vars": ["error"], // Error para variables no usadas en TypeScript
            "@typescript-eslint/explicit-function-return-type": "warn", // Advertencia si falta el tipo de retorno
            "@typescript-eslint/no-explicit-any": "warn", // Advertencia si se usa `any`
        },
    },
]);