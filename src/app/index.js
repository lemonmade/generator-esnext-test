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
  }

  initializing() {
    let {options} = this;

    this.props = {
      testDir: options.testDir,
      coverage: options.coverage,
    };
  }

  prompting() {
    let done = this.async();
    let {options} = this;

    this.log(yosay(`Welcome to the ${chalk.red('esnext-test')} generator!`));

    let prompts = [
      {
        name: 'testDir',
        message: 'What directory are your tests in?',
        default: 'test',
        when: options.testDir == null,
      },

      {
        name: 'coverage',
        type: 'confirm',
        default: true,
        when: options.coverage == null,
      },
    ];

    this.prompt(prompts, (props) => {
      this.props = {...this.props, ...props};
      done();
    });
  }

  writing() {
    let {scripts} = ownPackage;

    let scriptUpdates = {
      test: scripts.test.replace('test', this.props.testDir.replace(/\/$/, '')),
      'test:watch': scripts['test:watch'],
    };

    if (this.props.coverage) {
      scriptUpdates['test:cover'] = scripts['test:cover'];
    }

    let pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    _.merge(pkg, {scripts: scriptUpdates});
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.fs.copy(
      this.templatePath('helper.js'),
      this.destinationPath(path.join(this.props.testDir, 'helper.js'))
    );
  }

  install() {
    let devDependencies = [
      'mocha',
      'chai',
      'sinon',
      'sinon-chai',
      'babel-core',
    ];

    if (this.props.coverage) {
      devDependencies.push('isparta', 'coveralls');
    }

    this.npmInstall(devDependencies, {saveDev: true});
  }
};
