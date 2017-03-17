'use strict';
var Code = require('code'); // the assertions library
var Lab = require('lab'); // the test framework
var PermissionModel = require('../../lib/models/permission');
var Model = require('../../lib/models/base');

var lab = exports.lab = Lab.script(); // export the test script

// make lab feel like jasmine
var describe = lab.experiment;
var it = lab.test;
var expect = Code.expect;

describe('Model: permission', function() {

    it('extends from base model', function(done) {

        var permissionModel = new PermissionModel();
        expect(permissionModel).to.be.an.instanceof(Model);
        done();
    });

    it('should persist to a table named permission', function(done) {
        expect(PermissionModel.tableName).to.equals('permission');
        done();
    });

    it('should contain a schema', function(done) {
        expect(PermissionModel.jsonSchema).to.be.an.object();
        done();
    });

    it('should contain has-one relation mappings to resource model', function(done) {
        expect(PermissionModel.relationMappings).to.be.an.object();
        expect(PermissionModel.relationMappings.resource).to.exist();
        expect(PermissionModel.relationMappings.resource.relation).to.equals(Model.HasOneRelation);
        done();
    });

    it('should contain many-to-many relation mappings to role model', function(done) {
        expect(PermissionModel.relationMappings).to.be.an.object();
        expect(PermissionModel.relationMappings.roles).to.exist();
        expect(PermissionModel.relationMappings.roles.relation).to.equals(Model.ManyToManyRelation);
        done();
    });
});
