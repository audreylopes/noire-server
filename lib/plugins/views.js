/**
 * Plugin for server side rendered views using handlebars templates
 * @module
 */
const Vision = require('vision');
const Path = require('path');
const Package = require('package.json');
const ViewsConfig = require('config-views');
const Config = require('config');

const internals = {};

// gets user credentials from request object
internals.getUserCredentials = request =>
    request.auth.isAuthenticated ? request.auth.credentials : null;

// gets view name from request object
internals.getPageName = request =>
    Path.relative(Config.build.pages, request.response.source.template);

// decorates the view context with additional properties to be exposed as handlebars identifiers
internals.decorateViewContext = function(request) {
    const response = request.response;
    response.source.context = response.source.context || {};
    const context = response.source.context;

    context[ViewsConfig.contextVariables.VERSION] = Package.version;
    context[ViewsConfig.contextVariables.CREDENTIALS] = internals.getUserCredentials(request);
    context[ViewsConfig.contextVariables.VIEW] = internals.getPageName(request);
};

// inject view properties in the view context
internals.injectProperties = function(request, h) {
    const response = request.response;

    // not a view response, continue processing
    if (response.variety !== 'view') {
        return h.continue;
    }

    internals.decorateViewContext(request);
    return h.continue;
};

/**
 * Plugin registration function
 * @param {Hapi.Server} server the hapi server
 */
const register = async function(server) {
    // register the vision view template manager
    await server.register(Vision);

    // insert additional properties in every view context
    server.ext('onPreResponse', internals.injectProperties);

    server
        .logger()
        .child({ plugin: exports.plugin.name })
        .debug('started');
};

exports.plugin = {
    name: 'views',
    pkg: Package,
    register
};
