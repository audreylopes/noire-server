const Lab = require('lab');
const Sinon = require('sinon');
const mock = require('mock-require');
const Hapi = require('hapi');
const Package = require('package.json');
const Logger = require('test/fixtures/logger-plugin');

const { after, before, describe, expect, it } = (exports.lab = Lab.script());

describe('Plugin: web-tls', () => {
    const fakeRouteId = 'fake-route';
    const fakeRouteConfig = {
        endpoints: [
            {
                method: 'GET',
                path: '/',
                config: {
                    id: fakeRouteId,
                    handler: () => {}
                }
            }
        ]
    };

    let WebTls;

    before(() => {
        mock('routes/web-tls', fakeRouteConfig);
        WebTls = mock.reRequire('plugins/web-tls');
    });

    after(() => {
        mock.stopAll();
    });

    it('registers the view handler', async () => {
        // setup
        const fakeViewsPlugin = { name: 'views', pkg: Package, register: function() {} };
        const server = Hapi.server();
        const viewsStub = Sinon.stub().returns({
            registerHelper: () => {}
        });
        server.decorate('server', 'views', viewsStub);
        server.register(Logger);

        // exercise
        await server.register([fakeViewsPlugin, WebTls]);
        await server.initialize();

        // validate
        expect(viewsStub.calledOnce).to.be.true();
    });

    it('registers the route handlers', async () => {
        // setup
        const fakeViewsPlugin = {
            name: 'views',
            pkg: Package,
            register: server => {
                server.decorate('server', 'views', () => ({
                    registerHelper: () => {}
                }));
            }
        };
        const server = Hapi.server();
        server.register(Logger);

        // exercise
        await server.register([fakeViewsPlugin, WebTls]);
        await server.initialize();

        // validate
        expect(server.lookup(fakeRouteId)).be.an.object();
        expect(server.lookup(fakeRouteId).settings).to.be.an.object();
        expect(server.lookup(fakeRouteId).settings.id).to.equals(fakeRouteId);
    });
});
