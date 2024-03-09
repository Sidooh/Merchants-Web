module.exports = {
    root: true,
    env: { browser: true, es2021: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'src/components/ui/*.tsx'],
    parser: '@typescript-eslint/parser',
    plugins: ['prettier', 'react', 'react-refresh'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
