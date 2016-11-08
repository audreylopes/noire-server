'use strict';

var Boom = require('boom');
var Error = require('../error');
var RoleService = require('../services/role');

exports.list = function(request, reply) {

    if (!request.params.id) {
        RoleService.list().then(function(data) {

            request.log(['debug', 'role'], data);
            return reply(data);

        }).catch(function(error) {

            return Boom.badImplementation(error);
        });
    } else {

        RoleService.findById(request.params.id).then(function(data) {

            if (!data) {
                return reply(Boom.notFound(Error.ROLE_NOT_FOUND));
            }

            request.log(['debug', 'role'], data);
            return reply(data);

        }).catch(function(error) {
            return Boom.badImplementation(error);
        });

    }

};

exports.create = function(request, reply) {

    RoleService.add(request.payload).then(function(data) {

        request.log(['debug', 'role'], data);
        return reply(data);

    }).catch(function(error) {


        if (error === Error.ROLE_EXISTS) {

            request.log(['error', 'role'], error);
            return reply(Boom.badRequest(error, request.payload));
        }

        return Boom.badImplementation(error);

    });

};