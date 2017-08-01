'use strict';

const chalk = require('chalk');
const Generator = require('yeoman-generator');
const detectInstalled = require('detect-installed');
const banner = require('../../lib/banner');
const defaults = require('../../lib/defaults');
const questions = require('./questions');

const greeting = `Hi there! You're just a few steps of creating your project.
But first, could you tell some details about your new game?
`;

module.exports = class extends Generator {
  initializing() {
    this.log(banner(this.rootGeneratorVersion()));
    this.log(greeting);
  }

  prompting() {
    return this
      .prompt(questions)
      .then(variables => Object.assign(this, {variables}));
  }

  writing() {
    const baseTemplate = this.variables.baseTemplate;

    //  Copy dotfiles.
    this.fs.copy(
      this.templatePath('dotfiles/editorconfig'),
      this.destinationPath('.editorconfig'));
    this.fs.copy(
      this.templatePath('dotfiles/gitattributes'),
      this.destinationPath('.gitattributes'));
    this.fs.copy(
      this.templatePath('dotfiles/gitignore'),
      this.destinationPath('.gitignore'));

    //  Write project README.
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.variables);

    //  Copy scripts and related files.
    this.fs.copyTpl(
      this.templatePath(`${baseTemplate}/**`),
      this.destinationPath(),
      this.variables, {}, {
        globOptions: {
          dot: true
        }
      });

    //  Copy shared game project assets.
    this.fs.copy(
      this.templatePath('shared/**'),
      this.destinationPath('app/'));

    //  Copy Webpack configuration.
    this.fs.copyTpl(
      this.templatePath('config/'),
      this.destinationPath('config/'),
      this.variables);

    //  Set default configuration values.
    this.config.defaults(Object.assign({
      meta: {
        createdWith: this.rootGeneratorVersion(),
        creationDate: new Date().toISOString()
      }
    }, defaults[baseTemplate]));
  }

  install() {
    //  Prefer Yarn package manager, if available.
    if (detectInstalled.sync('yarn')) {
      this.yarnInstall();
    } else {
      this.npmInstall();
    }
  }

  end() {
    if (!this.options['skip-install']) {
      const command = `${detectInstalled.sync('yarn') ? 'yarn' : 'npm'} start`;
      this.log([
        '',
        'Congrats! Now, launch your project using',
        chalk`{yellow ${command}} and happy hacking :)`
      ].join('\n'));
    }
  }
};
