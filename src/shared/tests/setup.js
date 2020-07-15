require('ts-node/register');

const {
    runSetup
} = require('./run');

module.exports = async function () {
    if (!process.env.TEST_RUNNING) {
        await runSetup();
    }
    return null;
};