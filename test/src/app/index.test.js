import '../../helper';

import path from 'path';
import helpers from 'yeoman-test';

import ownPackage from '../../../package.json';

describe('generator-esnext-test:app', () => {
  let generator;
  const generatorIndex = path.join(__dirname, '../../../src/app');

  function spyOnGenerator(gen) {
    generator = gen;
    sinon.spy(generator, 'npmInstall');
  }

  afterEach(() => {
    if (generator && generator.npmInstall.restore) {
      generator.npmInstall.restore();
    }

    generator = null;
  });

  describe('defaults', () => {
    beforeEach((done) => {
      helpers
        .run(generatorIndex)
        .on('ready', spyOnGenerator)
        .on('end', done);
    });

    it('creates the helper file', () => {
      assert.file(['test/helper.js']);
    });

    it('installs all required dependencies', () => {
      let args = generator.npmInstall.lastCall.args;

      expect(args[0]).to.include('mocha', 'chai', 'sinon', 'sinon-chai', 'babel-core', 'isparta', 'coveralls');
      expect(args[1]).to.deep.equal({saveDev: true});
    });

    it('adds all testing scripts', () => {
      assert.jsonFileContent('package.json', {
        scripts: {
          test: ownPackage.scripts.test,
          'test:watch': ownPackage.scripts['test:watch'],
          'test:cover': ownPackage.scripts['test:cover'],
        },
      });
    });
  });

  describe('--testDir', () => {
    const testDir = 'custom-test-dir/spec/';

    context('when provided as options', () => {
      beforeEach((done) => {
        helpers
          .run(generatorIndex)
          .withOptions({testDir})
          .on('end', done);
      });

      it('puts the test helper in the correct directory', () => {
        assert.file([`${testDir.replace(/\/$/, '')}/helper.js`]);
      });

      it('updates the test npm script', () => {
        assert.jsonFileContent('package.json', {
          scripts: {test: ownPackage.scripts.test.replace('test/', testDir)},
        });
      });
    });

    context('when provided as prompts', () => {
      beforeEach((done) => {
        helpers
          .run(generatorIndex)
          .withPrompts({testDir})
          .on('end', done);
      });

      it('puts the test helper in the correct directory', () => {
        assert.file([`${testDir.replace(/\/$/, '')}/helper.js`]);
      });

      it('updates the test npm script', () => {
        assert.jsonFileContent('package.json', {
          scripts: {test: ownPackage.scripts.test.replace('test/', testDir)},
        });
      });
    });
  });

  describe('--coverage', () => {
    context('when set to false as options', () => {
      beforeEach((done) => {
        helpers
          .run(generatorIndex)
          .on('ready', spyOnGenerator)
          .withOptions({coverage: false})
          .on('end', done);
      });

      it('does not add a test cover script', () => {
        assert.noFileContent('package.json', /"test:cover"/);
      });

      it('does not install the cover dependencies', () => {
        expect(generator.npmInstall.lastCall.args[0]).not.to.include('isparta', 'coveralls');
      });
    });

    context('when set to false as prompts', () => {
      beforeEach((done) => {
        helpers
          .run(generatorIndex)
          .on('ready', spyOnGenerator)
          .withPrompts({coverage: false})
          .on('end', done);
      });

      it('does not add a test cover script', () => {
        assert.noFileContent('package.json', /"test:cover"/);
      });

      it('does not install the cover dependencies', () => {
        expect(generator.npmInstall.lastCall.args[0]).not.to.include('isparta', 'coveralls');
      });
    });
  });
});
