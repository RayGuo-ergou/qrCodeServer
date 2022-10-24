module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },

    extends: [
        'prettier',
        'eslint:recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['prettier', '@typescript-eslint'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                trailingComma: 'es5',
                tabWidth: 4,
                semi: true,
                singleQuote: true,
            },
        ],
    },
    root: true,
};
