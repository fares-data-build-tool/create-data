module.exports = {
  presets: ['next/babel', ['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
  ],
};
