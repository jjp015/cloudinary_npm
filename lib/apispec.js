// Generated by CoffeeScript 1.9.1
(function() {
  var Q, _, cloudinary, dotenv, expect, fs, utils;

  dotenv = require('dotenv');

  dotenv.load();

  expect = require("expect.js");

  cloudinary = require("../cloudinary");

  utils = require("../lib/utils");

  _ = require("underscore");

  Q = require('q');

  fs = require('fs');

  describe("api", function() {
    var find_by_attr;
    if (cloudinary.config().api_secret == null) {
      return console.warn("**** Please setup environment for api test to run!");
    }
    find_by_attr = function(elements, attr, value) {
      var element, i, len;
      for (i = 0, len = elements.length; i < len; i++) {
        element = elements[i];
        if (element[attr] === value) {
          return element;
        }
      }
      return void 0;
    };
    before(function(done) {
      var cnt, progress;
      this.timeout(0);
      this.timestamp_tag = "api_test_tag_" + cloudinary.utils.timestamp();
      cnt = 0;
      progress = function() {
        cnt += 1;
        if (cnt === 7) {
          return done();
        }
      };
      return cloudinary.api.delete_resources(["api_test", "api_test1", "api_test2"], (function(_this) {
        return function() {
          cloudinary.uploader.upload("test/logo.png", progress, {
            public_id: "api_test",
            tags: ["api_test_tag", _this.timestamp_tag],
            context: "key=value",
            eager: [
              {
                width: 100,
                crop: "scale"
              }
            ]
          });
          cloudinary.uploader.upload("test/logo.png", progress, {
            public_id: "api_test2",
            tags: ["api_test_tag", _this.timestamp_tag],
            context: "key=value",
            eager: [
              {
                width: 100,
                crop: "scale"
              }
            ]
          });
          cloudinary.api.delete_transformation("api_test_transformation", progress);
          cloudinary.api.delete_upload_preset("api_test_upload_preset1", progress);
          cloudinary.api.delete_upload_preset("api_test_upload_preset2", progress);
          cloudinary.api.delete_upload_preset("api_test_upload_preset3", progress);
          return cloudinary.api.delete_upload_preset("api_test_upload_preset4", progress);
        };
      })(this));
    });
    it("should allow listing resource_types", function(done) {
      this.timeout(10000);
      return cloudinary.api.resource_types(function(result) {
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        expect(result.resource_types).to.contain("image");
        return done();
      });
    });
    it("should allow listing resources", function(done) {
      this.timeout(10000);
      return cloudinary.api.resources(function(result) {
        var resource;
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        resource = find_by_attr(result.resources, "public_id", "api_test");
        expect(resource).not.to.eql(void 0);
        expect(resource.type).to.eql("upload");
        return done();
      });
    });
    it("should allow listing resources with cursor", function(done) {
      this.timeout(10000);
      return cloudinary.v2.api.resources({
        max_results: 1
      }, function(error, result) {
        if (error != null) {
          return done(new Error(error.message));
        }
        expect(result.resources).to.have.length(1);
        expect(result.next_cursor).not.to.eql(void 0);
        return cloudinary.v2.api.resources({
          max_results: 1,
          next_cursor: result.next_cursor
        }, function(error2, result2) {
          if (error2 != null) {
            return done(new Error(error2.message));
          }
          expect(result2.resources).to.have.length(1);
          expect(result2.next_cursor).not.to.eql(void 0);
          expect(result.resources[0].public_id).not.to.eql(result2.resources[0].public_id);
          return done();
        });
      });
    });
    it("should allow listing resources by type", function(done) {
      this.timeout(10000);
      return cloudinary.v2.api.resources({
        type: "upload"
      }, function(error, result) {
        var resource;
        if (error != null) {
          return done(new Error(error.message));
        }
        resource = find_by_attr(result.resources, "public_id", "api_test");
        expect(resource).not.to.eql(void 0);
        expect(resource.type).to.eql("upload");
        return done();
      });
    });
    it("should allow listing resources by prefix", function(done) {
      this.timeout(10000);
      return cloudinary.v2.api.resources({
        type: "upload",
        prefix: "api_test"
      }, function(error, result) {
        var public_ids, resource;
        if (error != null) {
          return done(new Error(error.message));
        }
        public_ids = (function() {
          var i, len, ref, results1;
          ref = result.resources;
          results1 = [];
          for (i = 0, len = ref.length; i < len; i++) {
            resource = ref[i];
            results1.push(resource.public_id);
          }
          return results1;
        })();
        expect(public_ids).to.contain("api_test");
        expect(public_ids).to.contain("api_test2");
        return done();
      });
    });
    it("should allow listing resources by tag", function(done) {
      this.timeout(10000);
      return cloudinary.api.resources_by_tag("api_test_tag", function(result) {
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        expect(result.resources.map(function(e) {
          return e.public_id;
        }).sort()).to.eql(["api_test", "api_test2"]);
        expect(result.resources.map(function(e) {
          return e.tags[0];
        })).to.contain("api_test_tag");
        expect(result.resources.map(function(e) {
          if (e.context != null) {
            return e.context.custom.key;
          } else {
            return null;
          }
        })).to.contain("value");
        return done();
      }, {
        context: true,
        tags: true
      });
    });
    it("should allow listing resources by public ids", function(done) {
      this.timeout(10000);
      return cloudinary.api.resources_by_ids(["api_test", "api_test2"], function(result) {
        var resource;
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        resource = find_by_attr(result.resources, "public_id", "api_test");
        expect(result.resources.map(function(e) {
          return e.public_id;
        }).sort()).to.eql(["api_test", "api_test2"]);
        expect(result.resources.map(function(e) {
          return e.tags[0];
        })).to.contain("api_test_tag");
        expect(result.resources.map(function(e) {
          return e.context.custom.key;
        })).to.contain("value");
        return done();
      }, {
        context: true,
        tags: true
      });
    });
    it("should allow listing resources specifying direction", function(done) {
      this.timeout(10000);
      return cloudinary.api.resources_by_tag(this.timestamp_tag, (function(_this) {
        return function(result) {
          var asc, resource;
          if (result.error != null) {
            return done(new Error(result.error.message));
          }
          asc = (function() {
            var i, len, ref, results1;
            ref = result.resources;
            results1 = [];
            for (i = 0, len = ref.length; i < len; i++) {
              resource = ref[i];
              results1.push(resource.public_id);
            }
            return results1;
          })();
          return cloudinary.api.resources_by_tag(_this.timestamp_tag, function(result) {
            var desc;
            if (result.error != null) {
              return done(new Error(result.error.message));
            }
            desc = (function() {
              var i, len, ref, results1;
              ref = result.resources;
              results1 = [];
              for (i = 0, len = ref.length; i < len; i++) {
                resource = ref[i];
                results1.push(resource.public_id);
              }
              return results1;
            })();
            expect(asc.reverse()).to.eql(desc);
            return done();
          }, {
            type: "upload",
            direction: "desc"
          });
        };
      })(this), {
        type: "upload",
        direction: "asc"
      });
    });
    it("should allow listing resources by start_at", function(done) {
      var start_at;
      this.timeout(10000);
      start_at = null;
      return setTimeout(function() {
        start_at = new Date();
        return setTimeout(function() {
          return cloudinary.uploader.upload("test/logo.png", function(response) {
            return cloudinary.api.resources(function(resources_response) {
              expect(resources_response.resources).to.have.length(1);
              expect(resources_response.resources[0].public_id).to.eql(response.public_id);
              return done();
            }, {
              type: "upload",
              start_at: start_at,
              direction: "asc"
            });
          });
        }, 2000);
      }, 2000);
    });
    it("should allow get resource metadata", function(done) {
      this.timeout(10000);
      return cloudinary.api.resource("api_test", function(resource) {
        expect(resource).not.to.eql(void 0);
        expect(resource.public_id).to.eql("api_test");
        expect(resource.bytes).to.eql(3381);
        expect(resource.derived).to.have.length(1);
        return done();
      });
    });
    it("should allow deleting derived resource", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(r) {
        if (r.error != null) {
          return done(new Error(r.error.message));
        }
        return cloudinary.api.resource("api_test3", function(resource) {
          var derived_resource_id;
          if (resource.error != null) {
            return done(new Error(resource.error.message));
          }
          expect(resource).not.to.eql(void 0);
          expect(resource.bytes).to.eql(3381);
          expect(resource.derived).to.have.length(1);
          derived_resource_id = resource.derived[0].id;
          return cloudinary.api.delete_derived_resources(derived_resource_id, function(r) {
            if (r.error != null) {
              return done(new Error(r.error.message));
            }
            return cloudinary.api.resource("api_test3", function(resource) {
              if (resource.error != null) {
                return done(new Error(resource.error.message));
              }
              expect(resource).not.to.eql(void 0);
              expect(resource.derived).to.have.length(0);
              return done();
            });
          });
        });
      }, {
        public_id: "api_test3",
        eager: [
          {
            width: 101,
            crop: "scale"
          }
        ]
      });
    });
    it("should allow deleting resources", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(r) {
        if (r.error != null) {
          return done(new Error(r.error.message));
        }
        return cloudinary.api.resource("api_test3", function(resource) {
          expect(resource).not.to.eql(void 0);
          return cloudinary.api.delete_resources(["apit_test", "api_test2", "api_test3"], function() {
            return cloudinary.api.resource("api_test3", function(result) {
              expect(result.error).not.to.be(void 0);
              expect(result.error.http_code).to.eql(404);
              return done();
            });
          });
        });
      }, {
        public_id: "api_test3"
      });
    });
    it("should allow deleting resources by prefix", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(r) {
        if (r.error != null) {
          return done(new Error(r.error.message));
        }
        return cloudinary.api.resource("api_test_by_prefix", function(resource) {
          expect(resource).not.to.eql(void 0);
          return cloudinary.api.delete_resources_by_prefix("api_test_by", function() {
            return cloudinary.api.resource("api_test_by_prefix", function(result) {
              expect(result.error).not.to.be(void 0);
              expect(result.error.http_code).to.eql(404);
              return done();
            });
          });
        });
      }, {
        public_id: "api_test_by_prefix"
      });
    });
    it("should allow deleting resources by tags", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(r) {
        if (r.error != null) {
          return done(new Error(r.error.message));
        }
        return cloudinary.api.resource("api_test4", function(resource) {
          expect(resource).not.to.eql(void 0);
          return cloudinary.api.delete_resources_by_tag("api_test_tag_for_delete", function(rr) {
            if (rr.error != null) {
              return done(new Error(rr.error.message));
            }
            return cloudinary.api.resource("api_test4", function(result) {
              expect(result.error).not.to.be(void 0);
              expect(result.error.http_code).to.eql(404);
              return done();
            });
          });
        });
      }, {
        public_id: "api_test4",
        tags: ["api_test_tag_for_delete"]
      });
    });
    it("should allow listing tags", function(done) {
      this.timeout(10000);
      return cloudinary.api.tags(function(result) {
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        expect(result.tags).to.contain("api_test_tag");
        return done();
      });
    });
    it("should allow listing tag by prefix ", function(done) {
      this.timeout(10000);
      return cloudinary.api.tags(function(result) {
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        expect(result.tags).to.contain("api_test_tag");
        return done();
      }, {
        prefix: "api_test"
      });
    });
    it("should allow listing tag by prefix if not found", function(done) {
      this.timeout(10000);
      return cloudinary.api.tags(function(result) {
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        expect(result.tags).to.have.length(0);
        return done();
      }, {
        prefix: "api_test_no_such_tag"
      });
    });
    it("should allow listing transformations", function(done) {
      this.timeout(10000);
      return cloudinary.api.transformations(function(result) {
        var transformation;
        if (result.error != null) {
          return done(new Error(result.error.message));
        }
        transformation = find_by_attr(result.transformations, "name", "c_scale,w_100");
        expect(transformation).not.to.eql(void 0);
        expect(transformation.used).to.be.ok;
        return done();
      });
    });
    it("should allow getting transformation metadata", function(done) {
      this.timeout(10000);
      return cloudinary.api.transformation("c_scale,w_100", function(transformation) {
        expect(transformation).not.to.eql(void 0);
        expect(transformation.info).to.eql([
          {
            crop: "scale",
            width: 100
          }
        ]);
        return done();
      });
    });
    it("should allow getting transformation metadata by info", function(done) {
      this.timeout(10000);
      return cloudinary.api.transformation({
        crop: "scale",
        width: 100
      }, function(transformation) {
        expect(transformation).not.to.eql(void 0);
        expect(transformation.info).to.eql([
          {
            crop: "scale",
            width: 100
          }
        ]);
        return done();
      });
    });
    it("should allow updating transformation allowed_for_strict", function(done) {
      this.timeout(10000);
      return cloudinary.api.update_transformation("c_scale,w_100", {
        allowed_for_strict: true
      }, function() {
        return cloudinary.api.transformation("c_scale,w_100", function(transformation) {
          expect(transformation).not.to.eql(void 0);
          expect(transformation.allowed_for_strict).to.be.ok;
          return cloudinary.api.update_transformation("c_scale,w_100", {
            allowed_for_strict: false
          }, function() {
            return cloudinary.api.transformation("c_scale,w_100", function(transformation) {
              expect(transformation).not.to.eql(void 0);
              expect(transformation.allowed_for_strict).not.to.be.ok;
              return done();
            });
          });
        });
      });
    });
    it("should allow creating named transformation", function(done) {
      this.timeout(10000);
      return cloudinary.api.create_transformation("api_test_transformation", {
        crop: "scale",
        width: 102
      }, function() {
        return cloudinary.api.transformation("api_test_transformation", function(transformation) {
          expect(transformation).not.to.eql(void 0);
          expect(transformation.allowed_for_strict).to.be.ok;
          expect(transformation.info).to.eql([
            {
              crop: "scale",
              width: 102
            }
          ]);
          expect(transformation.used).not.to.be.ok;
          return done();
        });
      });
    });
    it("should allow unsafe update of named transformation", function(done) {
      this.timeout(10000);
      return cloudinary.api.create_transformation("api_test_transformation3", {
        crop: "scale",
        width: 102
      }, function() {
        return cloudinary.api.update_transformation("api_test_transformation3", {
          unsafe_update: {
            crop: "scale",
            width: 103
          }
        }, function() {
          return cloudinary.api.transformation("api_test_transformation3", function(transformation) {
            expect(transformation).not.to.eql(void 0);
            expect(transformation.info).to.eql([
              {
                crop: "scale",
                width: 103
              }
            ]);
            expect(transformation.used).not.to.be.ok;
            return done();
          });
        });
      });
    });
    it("should allow deleting named transformation", function(done) {
      this.timeout(10000);
      return cloudinary.api.delete_transformation("api_test_transformation", function() {
        return cloudinary.api.transformation("api_test_transformation", function(transformation) {
          expect(transformation.error.http_code).to.eql(404);
          return done();
        });
      });
    });
    it("should allow deleting implicit transformation", function(done) {
      this.timeout(10000);
      return cloudinary.api.transformation("c_scale,w_100", function(transformation) {
        expect(transformation).not.to.eql(void 0);
        return cloudinary.api.delete_transformation("c_scale,w_100", function() {
          return cloudinary.api.transformation("c_scale,w_100", function(transformation) {
            expect(transformation.error.http_code).to.eql(404);
            return done();
          });
        });
      });
    });
    it("should allow creating and listing upload_presets", function(done) {
      var after_create, after_delete, create_names, delete_names, validate_presets;
      this.timeout(10000);
      create_names = ["api_test_upload_preset3", "api_test_upload_preset2", "api_test_upload_preset1"];
      delete_names = [];
      after_delete = function() {
        delete_names.pop();
        if (delete_names.length === 0) {
          return done();
        }
      };
      validate_presets = function() {
        return cloudinary.api.upload_presets(function(response) {
          expect(response.presets.slice(0, 3).map(function(p) {
            return p.name;
          })).to.eql(delete_names);
          return delete_names.forEach(function(name) {
            return cloudinary.api.delete_upload_preset(name, after_delete);
          });
        });
      };
      after_create = function() {
        var name;
        if (create_names.length > 0) {
          name = create_names.pop();
          delete_names.unshift(name);
          return cloudinary.api.create_upload_preset(after_create, {
            name: name,
            folder: "folder"
          });
        } else {
          return validate_presets();
        }
      };
      return after_create();
    });
    it("should allow getting a single upload_preset", function(done) {
      this.timeout(10000);
      return cloudinary.api.create_upload_preset(function(preset) {
        var name;
        name = preset.name;
        return cloudinary.api.upload_preset(name, function(preset) {
          expect(preset.name).to.eql(name);
          expect(preset.unsigned).to.eql(true);
          expect(preset.settings.folder).to.eql("folder");
          expect(preset.settings.transformation).to.eql([
            {
              width: 100,
              crop: "scale"
            }
          ]);
          expect(preset.settings.context).to.eql({
            a: "b",
            c: "d"
          });
          expect(preset.settings.tags).to.eql(["a", "b", "c"]);
          return cloudinary.api.delete_upload_preset(name, function() {
            return done();
          });
        });
      }, {
        unsigned: true,
        folder: "folder",
        transformation: {
          width: 100,
          crop: "scale"
        },
        tags: ["a", "b", "c"],
        context: {
          a: "b",
          c: "d"
        }
      });
    });
    it("should allow deleting upload_presets", function(done) {
      this.timeout(10000);
      return cloudinary.api.create_upload_preset(function(preset) {
        return cloudinary.api.upload_preset("api_test_upload_preset4", function() {
          return cloudinary.api.delete_upload_preset("api_test_upload_preset4", function() {
            return cloudinary.api.upload_preset("api_test_upload_preset4", function(result) {
              expect(result.error.message).to.contain("Can't find");
              return done();
            });
          });
        });
      }, {
        name: "api_test_upload_preset4",
        folder: "folder"
      });
    });
    it("should allow updating upload_presets", function(done) {
      this.timeout(10000);
      return cloudinary.api.create_upload_preset(function(preset) {
        var name;
        name = preset.name;
        return cloudinary.api.upload_preset(name, function(preset) {
          return cloudinary.api.update_upload_preset(name, function(preset) {
            return cloudinary.api.upload_preset(name, function(preset) {
              expect(preset.name).to.eql(name);
              expect(preset.unsigned).to.eql(true);
              expect(preset.settings).to.eql({
                folder: "folder",
                colors: true,
                disallow_public_id: true
              });
              return cloudinary.api.delete_upload_preset(name, function() {
                return done();
              });
            });
          }, utils.merge(preset.settings, {
            colors: true,
            unsigned: true,
            disallow_public_id: true
          }));
        });
      }, {
        folder: "folder"
      });
    });
    it("should support the usage API call", function(done) {
      this.timeout(10000);
      return cloudinary.api.usage(function(usage) {
        expect(usage.last_update).not.to.eql(null);
        return done();
      });
    });
    it.skip("should allow deleting all resources", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.resource("api_test5", function(resource) {
          expect(resource).to.not.eql(null);
          expect(resource.derived.length).to.eql(1);
          return cloudinary.api.delete_all_resources(function(delete_result) {
            return cloudinary.api.resource("api_test5", function(resource) {
              expect(resource.derived.length).to.eql(0);
              return done();
            });
          }, {
            keep_original: true
          });
        });
      }, {
        public_id: "api_test5",
        eager: {
          transformation: {
            width: 101,
            crop: "scale"
          }
        }
      });
    });
    it("should support setting manual moderation status", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.moderation[0].status).to.eql("approved");
          return done();
        }, {
          moderation_status: "approved"
        });
      }, {
        moderation: "manual"
      });
    });
    it("should support requesting ocr info", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.error.message).to.contain("Illegal value");
          return done();
        }, {
          ocr: "illegal"
        });
      });
    });
    it("should support requesting raw conversion", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.error.message).to.contain("Illegal value");
          return done();
        }, {
          raw_convert: "illegal"
        });
      });
    });
    it("should support requesting categorization", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.error.message).to.contain("Illegal value");
          return done();
        }, {
          categorization: "illegal"
        });
      });
    });
    it("should support requesting detection", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.error.message).to.contain("Illegal value");
          return done();
        }, {
          detection: "illegal"
        });
      });
    });
    it("should support requesting background_removal", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.error.message).to.contain("Illegal value");
          return done();
        }, {
          background_removal: "illegal"
        });
      });
    });
    it("should support requesting similarity_search", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.error.message).to.contain("Illegal value");
          return done();
        }, {
          similarity_search: "illegal"
        });
      });
    });
    it("should support requesting auto_tagging", function(done) {
      this.timeout(10000);
      return cloudinary.uploader.upload("test/logo.png", function(upload_result) {
        return cloudinary.api.update(upload_result.public_id, function(api_result) {
          expect(api_result.error.message).to.contain("Must use");
          return done();
        }, {
          auto_tagging: "illegal"
        });
      });
    });
    it("should support listing by moderation kind and value", function(done) {
      var after_listing, after_update, after_upload, api_results, ids, lists;
      this.timeout(10000);
      ids = [];
      api_results = [];
      lists = {};
      after_listing = function(list) {
        return function(list_result) {
          lists[list] = list_result.resources.map(function(r) {
            return r.public_id;
          });
          if (_.keys(lists).length === 3) {
            expect(lists.approved).to.contain(ids[0]);
            expect(lists.approved).not.to.contain(ids[1]);
            expect(lists.approved).not.to.contain(ids[2]);
            expect(lists.rejected).to.contain(ids[1]);
            expect(lists.rejected).not.to.contain(ids[0]);
            expect(lists.rejected).not.to.contain(ids[2]);
            expect(lists.pending).to.contain(ids[2]);
            expect(lists.pending).not.to.contain(ids[0]);
            expect(lists.pending).not.to.contain(ids[1]);
            return done();
          }
        };
      };
      after_update = function(api_result) {
        api_results.push(api_result);
        if (api_results.length === 2) {
          cloudinary.api.resources_by_moderation("manual", "approved", after_listing("approved"), {
            max_results: 1000,
            moderations: true
          });
          cloudinary.api.resources_by_moderation("manual", "rejected", after_listing("rejected"), {
            max_results: 1000,
            moderations: true
          });
          return cloudinary.api.resources_by_moderation("manual", "pending", after_listing("pending"), {
            max_results: 1000,
            moderations: true
          });
        }
      };
      after_upload = function(upload_result) {
        ids.push(upload_result.public_id);
        if (ids.length === 3) {
          cloudinary.api.update(ids[0], after_update, {
            moderation_status: "approved"
          });
          return cloudinary.api.update(ids[1], after_update, {
            moderation_status: "rejected"
          });
        }
      };
      cloudinary.uploader.upload("test/logo.png", after_upload, {
        moderation: "manual"
      });
      cloudinary.uploader.upload("test/logo.png", after_upload, {
        moderation: "manual"
      });
      return cloudinary.uploader.upload("test/logo.png", after_upload, {
        moderation: "manual"
      });
    });
    return it.skip("should list folders in cloudinary", function(done) {
      this.timeout(20000);
      return Q.all([
        cloudinary.v2.uploader.upload("test/logo.png", {
          public_id: 'test_folder1/item'
        }), cloudinary.v2.uploader.upload("test/logo.png", {
          public_id: 'test_folder2/item'
        }), cloudinary.v2.uploader.upload("test/logo.png", {
          public_id: 'test_folder2/item'
        }), cloudinary.v2.uploader.upload("test/logo.png", {
          public_id: 'test_folder1/test_subfolder1/item'
        }), cloudinary.v2.uploader.upload("test/logo.png", {
          public_id: 'test_folder1/test_subfolder2/item'
        })
      ]).then(function(results) {
        return Q.all([cloudinary.v2.api.root_folders(), cloudinary.v2.api.sub_folders('test_folder1')]);
      }).then(function(results) {
        var folder, root, root_folders, sub_1;
        root = results[0];
        root_folders = (function() {
          var i, len, ref, results1;
          ref = root.folders;
          results1 = [];
          for (i = 0, len = ref.length; i < len; i++) {
            folder = ref[i];
            results1.push(folder.name);
          }
          return results1;
        })();
        sub_1 = results[1];
        expect(root_folders).to.contain('test_folder1');
        expect(root_folders).to.contain('test_folder2');
        expect(sub_1.folders[0].path).to.eql('test_folder1/test_subfolder1');
        expect(sub_1.folders[1].path).to.eql('test_folder1/test_subfolder2');
        return cloudinary.v2.api.sub_folders('test_folder_not_exists');
      }).then(function(result) {
        console.log('error test_folder_not_exists should not pass to "then" handler but "catch"');
        return expect(true).to.eql(false);
      })["catch"](function(err) {
        expect(err.error.message).to.eql('Can\'t find folder with path test_folder_not_exists');
        return done();
      });
    });
  });

}).call(this);

//# sourceMappingURL=apispec.js.map