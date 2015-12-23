var global = this;

(function() {
  'use strict';

  var standardOperators = {
    present: function(actual, target) {
      return !!actual;
    },
    blank: function(actual, target) {
      return !actual;
    },
    equalTo: function(actual, target) {
      return "" + actual === "" + target;
    },
    notEqualTo: function(actual, target) {
      return "" + actual !== "" + target;
    },
    greaterThan: function(actual, target) {
      return parseFloat(actual, 10) > parseFloat(target, 10);
    },
    greaterThanEqual: function(actual, target) {
      return parseFloat(actual, 10) >= parseFloat(target, 10);
    },
    lessThan: function(actual, target) {
      return parseFloat(actual, 10) < parseFloat(target, 10);
    },
    lessThanEqual: function(actual, target) {
      return parseFloat(actual, 10) <= parseFloat(target, 10);
    },
    includes: function(actual, target) {
      return ("" + actual).indexOf("" + target) > -1;
    },
    matchesRegex: function(actual, target) {
      var r = target.replace(/^\/|\/$/g, "");
      var regex = new RegExp(r);
      return regex.test("" + actual);
    }
  };

  var RuleEngine = global.RuleEngine = function RuleEngine(rule) {
    rule = rule || {};
    this.operators = {};
    this.actions = rule.actions || [];
    this.conditions = rule.conditions || {
      kind: "all",
      conditions: []
    };
    this.addOperators(standardOperators);
  }

  RuleEngine.prototype = {
    run: function(conditionsAdapter, actionsAdapter, cb) {
      var out, error, _this = this;
      this.matches(conditionsAdapter, function(err, result) {
        out = result;
        error = err;
        if (result && !err) _this.runActions(actionsAdapter);
        if (cb) cb(err, result);
      });
      if (error) throw error;
      return out;
    },

    matches: function(conditionsAdapter, cb) {
      var out, err;
      handleNode(this.conditions, conditionsAdapter, this, function(e, result) {
        if (e) {
          err = e;
          console.log("ERR", e.message, e.stack);
        }
        out = result;
        if (cb) cb(e, result);
      });
      if (err) throw err;
      if (!cb) return out;
    },

    operator: function(name) {
      return this.operators[name];
    },

    addOperators: function(newOperators) {
      var _this = this;
      for (var key in newOperators) {
        if (newOperators.hasOwnProperty(key)) {
          (function() {
            var op = newOperators[key];
            // synchronous style operator, needs to be wrapped
            if (op.length == 2) {
              _this.operators[key] = function(actual, target, cb) {
                try {
                  var result = op(actual, target);
                  cb(null, result);
                } catch (e) {
                  cb(e);
                }
              };
            }
            // asynchronous style, no wrapping needed
            else if (op.length == 3) {
              _this.operators[key] = op;
            } else {
              throw "Operators should have an arity of 2 or 3; " + key + " has " + op.length;
            }
          })();
        }
      }
    },

    runActions: function(actionsAdapter) {
      for (var i = 0; i < this.actions.length; i++) {
        var actionData = this.actions[i];
        var actionName = actionData.actionName;
        var actionFunction = actionsAdapter[actionName]
        if (actionFunction) {
          actionFunction(actionData);
        }
      }
    }
  };

  function handleNode(node, obj, engine, cb) {
    var kind = node.kind;
    if (kind === "all" || kind === "any" || kind === "none") {
      handleConditionalNode(node, obj, engine, cb);
    } else {
      handleRuleNode(node, obj, engine, cb);
    }
  }

  function handleConditionalNode(node, obj, engine, cb) {
    try {
      var kind = node.kind;
      var isAll = kind === "all";
      var isAny = kind === "any";
      var isNone = kind === "none";
      var nodes = node.conditions;
      if (nodes.length === 0) {
        return cb(null, true);
      }
      var currentNode, i = 0;
      var next = function() {
        try {
          currentNode = nodes[i];
          i++;
          if (currentNode) {
            handleNode(currentNode, obj, engine, done);
          } else {
            // If we have gone through all of the nodes and gotten
            // here, either they have all been true (success for `all`)
            // or all false (failure for `any`);
            var r = isNone ? true : isAll;
            cb(null, r);
          }
        } catch (e) {
          cb(e);
        }
      };

      var done = function(err, result) {
        if (err) return cb(err);
        if (isAll && !result) return cb(null, false);
        if (isAny && !!result) return cb(null, true);
        if (isNone && !!result) return cb(null, false);
        next();
      }
      next();
    } catch (e) {
      cb(e);
    }
  }

  function handleRuleNode(node, obj, engine, cb) {
    try {
      var value = obj[node.name];
      if (value && value.call) {
        if (value.length === 1) {
          return value(function(result) {
            compareValues(result, node.operator, node.value, engine, cb);
          });
        } else {
          value = value()
        }
      }
      var nodeValue = node.compareTo === "field" ? obj[node.value] : node.value;
      compareValues(value, node.operator, nodeValue, engine, cb);
    } catch (e) {
      cb(e);
    }
  }

  function compareValues(actual, operator, value, engine, cb) {
    try {
      var operatorFunction = engine.operator(operator);
      if (!operatorFunction) throw "Missing " + operator + " operator";
      operatorFunction(actual, value, cb);
    } catch (e) {
      cb(e);
    }
  }

  if (typeof module !== "undefined") {
    module.exports = RuleEngine;
    delete global.RuleEngine;
  }

  /**
   * Created for AT-22
   */
  var DataValidator = global.DataValidator = function DataValidator() {
    // last validated data is the JSON string of the last data that was validated using rules
    this._lastValidatedData = '';
  };

  DataValidator.prototype.observeDataFor = function(element) {
    if (!element) {
      console.log('Can not observe data changes for <b>' + element + '</b> element');
      return;
    }
    if (element.is === 'at-core-form') {
      this.element = element;
      element.addEventListener('data-changed', this.onElementDataChanged.bind(this));
    } else if (element.is === 'at-form-complex') {
      this.element = element;
      element.addEventListener('value-changed', this.onElementDataChanged.bind(this));
    } else if (element.is === 'at-form-array') {
      this.element = element;
      element.addEventListener('value-changed', this.onFormArrayValueChanged.bind(this));
    }
  };

  // this is the handler for at-core-form.data-changed and at-form-complex.value-changed
  DataValidator.prototype.onElementDataChanged = function(event) {
    if (!this.element) { return; }
    var schemaExists = Boolean(this.element.schema);
    var rulesExist = Boolean(this.element.schema.rules);
    if (!schemaExists || !rulesExist) {
      // console.log('Element <b>' + this.element + '</b> does not have any rules to validate');
      return;
    }
    var newValue = event.detail.value;
    var newValueJsonStr = JSON.stringify(newValue);
    if (newValue !== this._lastValidatedData) {
      this._lastValidatedData = newValueJsonStr;
      // for at-core-form ruleset is in schema.rules
      var rules = this.element.schema.rules;
      // rules should be an array
      var self = this;
      rules.forEach(function(rule, index) {
        var ruleEngine = new RuleEngine(rule.rule);
        ruleEngine.run(newValue, self.coreFormActionsAdapter, undefined);
      });
    }
  };

  // this is the handler for at-form-array.value-changed
  DataValidator.prototype.onFormArrayValueChanged = function(event) {
    console.log('Not implemented yet.');

  };

  DataValidator.prototype.coreFormActionsAdapter = {
    alert: function(data) {
      alert(data.message);
    },
    updateField: function(data) {
      var fieldId = data.fieldName;
      var val = data.updateTo;

      if (val === "true") {
        val = true;
      }
      if (val === "false") {
        val = false;
      }
      this.element.updateFormElementData(fieldId, val);
    },
    setFieldState: function(data) {
      var fieldId = data.fieldName;
      var val = data.state;
      this.element.setElementState(fieldId, val, val);
    },
    copyFieldValue: function(data) {
      var srcFieldId = data.fieldName;
      var destFieldId = data.copyTo;

      var srcValue = this.element.data[srcFieldId];
      this.element.updateFormElementData(destFieldId, srcValue);
    }
  };

})();
