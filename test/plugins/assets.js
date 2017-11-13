const Hapi = require('hapi');
const Lab = require('lab'); // the test framework
const Inert = require('inert');
const Assets = require('../../lib/plugins/assets');
const Path = require('path');

const { afterEach, beforeEach, describe, expect, it } = exports.lab = Lab.script();

describe('Plugin: assets', () => {

    let server;
    let inertRegister;

    beforeEach(() => {
        inertRegister = Inert.plugin.register;

    });

    beforeEach(async () => {

        server = Hapi.server({
            routes: {
                files: {
                    relativeTo: Path.join(__dirname, '../../client/dist')
                }
            }
        });
        await server.register(Assets);
    });

    afterEach(() => {
        // make sure inert monkey patching is removed
        Inert.plugin.register = inertRegister;
    });

    it('returns the favicon', async () => {

        // exercise
        const response = await server.inject('/favicon.ico');

        // validate
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.a.string();
    });

    it('returns an image', async () => {

        // exercise
        const response = await server.inject('/img/low_contrast_linen.png');

        // validate
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.a.string();
    });

    it('returns css', async () => {

        // exercise
        const response = await server.inject('/css/commons.css');

        // validate
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.a.string();
    });

    it('returns javascript', async () => {

        // exercise
        const response = await server.inject('/js/commons.bundle.js');

        // validate
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.a.string();
    });

    it('returns fonts', async () => {

        // exercise
        const response = await server.inject('/fonts/OpenSans.woff2');

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.a.string();
    });

    it('handles inert plugin registration failures', async () => {

        // setup
        const PLUGIN_ERROR = 'plugin error';
        Inert.plugin.register = async function() {
            throw new Error(PLUGIN_ERROR);
        };
        const server = Hapi.server();

        // exercise and validate
        await expect(server.register(Assets)).to.reject(PLUGIN_ERROR);
    });
});
