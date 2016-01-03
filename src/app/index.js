import _ from 'lodash';
import path from 'path';
import {Base as BaseGenerator} from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';

import ownPackage from '../../package.json';

module.exports = class ESNextTestGenerator extends BaseGenerator {
  constructor(...args) {
    super(...args);

    this.option('testDir', {
      type: String,
      required: false,
      desc: 'The (relative) directory in which you place your tests.',
    });

    this.option('coverage', {
      type: Boolean,
      required: false,
      desc: 'Whether to enable coverage collection for tests.',
    });

    this.option('helper', {
      type: Boolean,
      required: false,
      desc: 'Whether to copy a simple helper file.',
    });
  }

  initializing() {
    let {options} = this;

    this.props = {
      testDir: options.testDir,
      coverage: options.coverage,
      helper: options.helper,
    };
  }

  prompting() {
    let done = this.async();
    let {options, props} = this;

    if (!options.skipWelcomeMessage) {
      this.log(yosay(`Welcome to the ${chalk.red('esnext-test')} generator!`));
    }

    let prompts = [
      {
        name: 'testDir',
        message: 'What directory are your tests in?',
        default: 'test',
        when: options.testDir == null,
      },

      {
        name: 'coverage',
        message: 'Whether to enable coverage collection for tests.',
        type: 'confirm',
        default: true,
        when: options.coverage == null,
      },

      {
        name: 'helper',
        message: 'Whether to copy a simple helper file.',
        type: 'confirm',
        default: true,
        when: options.helper == null,
      },
    ];

    this.prompt(prompts, (newProps) => {
      this.props = {...props, ...newProps};
      done();
    });
  }

  writing() {
    let {props} = this;
    let {scripts} = ownPackage;

    let scriptUpdates = {
      test: scripts.test.replace('test', props.testDir.replace(/\/$/, '')),
      'test:watch': scripts['test:watch'],
    };

    if (props.coverage) {
      scriptUpdates['test:cover'] = scripts['test:cover'];
    }

    let pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    _.merge(pkg, {scripts: scriptUpdates});
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    if (props.helper) {
      this.fs.copy(
        this.templatePath('helper.js'),
        this.destinationPath(path.join(props.testDir, 'helper.js'))
      );
    }
  }

  install() {
    let {props} = this;
    let devDependencies = [
      'mocha',
      'chai',
      'sinon',
      'sinon-chai',
      'babel-core',
    ];

    if (props.coverage) {
      devDependencies.push('isparta', 'coveralls');
    }

    this.npmInstall(devDependencies, {saveDev: true});
  }
};
