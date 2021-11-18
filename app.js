'use strict';

const Homey = require('homey');
const PRTG = require('./lib/PrtgApi');

class PrtgApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('PRTG has been initialized');
  }

}

module.exports = PrtgApp;
