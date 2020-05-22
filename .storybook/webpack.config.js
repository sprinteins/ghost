const path = require("path");
const SRC_PATH = path.join(__dirname, '../src/frontend');
const NODE_MODULES = path.join(__dirname, '../node_modules');

module.exports = ({ config }) => {
    config.module.rules.push({
        test: /^(?!.*spec\.ts).*\.(ts|tsx)/,
        include: [SRC_PATH],
        exclude: [NODE_MODULES],
        use: [
            {
                loader: require.resolve('awesome-typescript-loader'),
            }
        ]
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
};