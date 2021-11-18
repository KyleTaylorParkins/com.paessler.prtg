'use strict';

const { Device } = require('homey');
const PRTG = require('../../lib/PrtgApi');

class PRGTStatusDevice extends Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('PRTG Status has been initialized');

        // Create an API instance with the saved settings
        // TODO obtain values from settings/store
        const settings = this.getSettings();

        console.log("Current settings in device");
        console.dir(settings);

        this.api = new PRTG(settings.server, settings.username, settings.passhash);

        this.api.getUpSensors()
        .then(sensors => {
            console.log(`Device count with status up: ${Object.keys(sensors).length}`);
            this.setCapabilityValue('sensors_up', Object.keys(sensors).length);
        });

        this.api.getDownSensors()
        .then(sensors => {
            console.log(`Device count with status down: ${Object.keys(sensors).length}`);
            this.setCapabilityValue('sensors_down', Object.keys(sensors).length);
        });

        this.api.getWarningSensors()
        .then(sensors => {
            console.log(`Device count with status warning: ${Object.keys(sensors).length}`);
            this.setCapabilityValue('sensors_warning', Object.keys(sensors).length);
        });
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        // TODO add the site name
        this.log('PRTG Status has been added');
    }

    /**
     * onSettings is called when the user updates the device's settings.
     * @param {object} event the onSettings event data
     * @param {object} event.oldSettings The old settings object
     * @param {object} event.newSettings The new settings object
     * @param {string[]} event.changedKeys An array of keys changed since the previous version
     * @returns {Promise<string|void>} return a custom message that will be displayed
     */
    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.log('PRTGDevice settings where changed');
        // TODO re-setup the api object when settings have changed!
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name) {
        this.log('PRTGDevice was renamed');
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        this.log('PRTGDevice has been deleted');
    }

}

module.exports = PRGTStatusDevice;
