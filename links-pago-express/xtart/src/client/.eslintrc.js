module.exports = {
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: "./src/client",
    sourceType: 'module',
  },
  extends: [
    'next/core-web-vitals',
  ],
  settings: {
      next: {
          rootDir : "./src/client/"
      }
  },
  rules: {
    'prettier/prettier': 0,
  },
};
