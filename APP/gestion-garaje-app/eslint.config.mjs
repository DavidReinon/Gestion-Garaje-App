import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript", "prettier"],
        rules: {
            eqeqeq: "warn",
            "@typescript-eslint/no-unused-vars": ["warn"],
            "@typescript-eslint/explicit-function-return-type": [
                "warn",
                { allowExpressions: true }, // Opcional: Permite omitir tipos en funciones de flecha
            ],
        },
    }),
];

export default eslintConfig;
