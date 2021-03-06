var test = require('./fixtures')().test;

describe('BEMJSON mix', function() {
  it('should support mix in json', function() {
    test(function() {
      }, { block: 'b1', mix: { block: 'b2' } },
        ['div', { className: 'b1 b2' }]);
  });

  describe('the same block', function() {
    // Weird case, but for completeness why not to check it.
    // Because we don’t know about difference of entity.block
    // and context.block. See next test.
    it('should duplicate block class if mix block to itself', function() {
      test(function() {
        }, { block: 'b', mix: { block: 'b' } },
          ['div', { className: 'b b' }]);
    });

    it('should mix with block itself to elem in block', function() {
      test(function() {
        }, {
          block: 'b1',
          content: {
            elem: 'e1',
            mix: { block: 'b1' }
          }
        },
        ['div', { className: 'b1' }, ['div', { className: 'b1__e1 b1' }]]);
    });

    it('should mix block to the same block’s elem', function() {
      test(function() {
        }, { block: 'b1', elem: 'e1', mix: { block: 'b1' } },
          ['div', { className: 'b1__e1 b1' }]);
    });

    it('should not duplicate block class if mix mods without block to the same block', function() {
      test(function() {
        }, { block: 'b', mix: { mods: { m: 'v' } } },
          ['div', { className: 'b b_m_v' }]);
    });
  });

  describe('the same block with mods', function() {
    it('should mix block with mods to elem in the same block', function() {
      test(function() {
        }, {
          block: 'b',
          content: {
            elem: 'e',
            mix: { block: 'b', mods: { m: 'v' } }
          }
        },
        ['div', { className: 'b' }, ['div', { className: 'b__e b b_m_v' }]]);
    });

    it('should duplicate block class if mix several block with mods to elem in the same block', function() {
      test(function() {
        }, {
          block: 'b',
          content: {
            elem: 'e',
            mix: [
              { block: 'b', mods: { m1: 'v1' } },
              { block: 'b', mods: { m2: 'v2' } }
            ]
          }
        },
        ['div', { className: 'b' }, ['div', { className: 'b__e b b_m1_v1 b b_m2_v2' }]]);
    });

    it('should not duplicate block class if mix mods without block to the same block with mods', function() {
      test(function() {
        }, {
          block: 'b',
          mods: { m1: 'v1' },
          mix: { mods: { m2: 'v2' } }
        },
        ['div', { className: 'b b_m1_v1 b_m2_v2' }]);
    });

    it('should duplicate mix mods class if mix the same block with mods', function() {
      test(function() {
        }, {
          block: 'b',
          mods: { m: 'v' },
          mix: { mods: { m: 'v' } }
        },
        ['div', { className: 'b b_m_v b_m_v' }]);
    });

    it('should not duplicate block class if mix is the same block with mods', function() {
      test(function() {
        }, {
          block: 'b',
          mix: [
            { block: 'b', mods: { m1: 'v1' } },
            { block: 'b', mods: { m2: 'v2' } }
          ]
        },
        ['div', { className: 'b b_m1_v1 b_m2_v2' }]);
    });

    it('should duplicate block mods class if mix is the same block with mods', function() {
      // Because who cares? It’s pretty rare case.
      // To fix this we need to compare each key/val pairs.
      // It’s too expansive.
      // We believe that developers should not want to do this.
      test(function() {
        }, {
          block: 'b',
          mods: { m: 'v' },
          mix: { block: 'b', mods: { m: 'v' } }
        },
        ['div', { className: 'b b_m_v b_m_v' }]);
    });
  });

  describe('the same elem', function() {
    // Weird case, but for completeness why not to check it
    it('should not duplicate elem class if mix is the same elem', function() {
      test(function() {
        }, {
          block: 'b',
          elem: 'e',
          mix: { elem: 'e' }
        },
        ['div', { className: 'b__e' }]);
    });

    // Weird case, but for completeness why not to check it
    it('should not duplicate elem class if mix is the same block elem', function() {
      test(function() {
        }, {
          block: 'b',
          elem: 'e',
          mix: { block: 'b', elem: 'e' }
        },
        ['div', { className: 'b__e' }]);
    });

    // Weird case, but for completeness why not to check it
    it('should not duplicate elem class if mix the same elem to elem in block', function() {
      test(function() {
        }, {
          block: 'b',
          content: {
            elem: 'e',
            mix: { elem: 'e' }
          }
        },
        ['div', { className: 'b' }, ['div', { className: 'b__e' }]]);
    });
  });

  describe('the same elem with elemMods', function() {
    it('should not duplicate elem class if mix is the same elem with elemMod', function() {
      test(function() {
        }, {
          block: 'b',
          elem: 'e',
          mix: { elem: 'e', elemMods: { modname: 'modval' } }
        },
        ['div', { className: 'b__e b__e_modname_modval' }]);
    });

    it('should not duplicate elem class if mix is the same block elem with elemMods', function() {
      test(function() {
        }, {
          block: 'b',
          elem: 'e',
          mix: { block: 'b', elem: 'e', elemMods: { modname: 'modval' } }
        },
        ['div', { className: 'b__e b__e_modname_modval' }]);
    });

    // Because who cares? It’s pretty rare case.
    // To fix this we need to compare each key/val pairs.
    // It’s too expansive.
    // We believe that developers should not want to do this.
    it('should duplicate elem elemMod class if mix is the same elem elemMod to elem with elemMods in block', function() {
      test(function() {
        }, {
          block: 'b',
          content: {
            elem: 'e',
            elemMods: { modname: 'modval' },
            mix: { elem: 'e', elemMods: { modname: 'modval' } }
          }
        },
        ['div', { className: 'b' }, ['div', { className: 'b__e b__e_modname_modval b__e_modname_modval' }]]);
    });
  });
});
