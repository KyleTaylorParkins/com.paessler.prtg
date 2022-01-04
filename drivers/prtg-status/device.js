'use strict';

const { Device } = require('homey');
const PRTG = require('../../lib/PrtgApi');

//let updaterLoop = null;
class PRTGStatusDevice extends Device {
    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('PRTG Status has been initialized');

        // Get the device settings and construct an PRTG API
        const settings = this.getSettings();
        this.api = new PRTG(settings.server, settings.username, settings.passhash);

        // Obtain current sensor information through the API and set the updater loop.
        this.pushSensorsToDevice();
        this.setUpdaterLoop(settings.refresh);
    }

    /**
     * Function to push the sensor count from the PRTG API to the device's capabilities.
     */
    async pushSensorsToDevice() {
        this.api.getUpSensors()
        .then(sensors => {
            const sensorCount = Object.keys(sensors).length;
            this.log(`Device count with status up: ${sensorCount}`);
            this.setCapabilityValue('measure_sensors_up', sensorCount);
        });

        this.api.getDownSensors()
        .then(sensors => {
            const sensorCount = Object.keys(sensors).length;
            this.log(`Device count with status down: ${sensorCount}`);
            this.setCapabilityValue('measure_sensors_down', sensorCount);
        });

        this.api.getWarningSensors()
        .then(sensors => {
            const sensorCount = Object.keys(sensors).length;
            this.log(`Device count with status warning: ${sensorCount}`);
            this.setCapabilityValue('measure_sensors_warning', sensorCount);
        });

        this.api.getUnusualSensors()
        .then(sensors => {
            const sensorCount = Object.keys(sensors).length;
            this.log(`Device count with status unusual: ${sensorCount}`);
            this.setCapabilityValue('measure_sensors_unusual', sensorCount);
        });
    }

    /**
     * Function to set the update interval.
     * @param {Number} time interval time in minutes
     */
    setUpdaterLoop(time) {
        const timer = time * 60 * 1000; // Time in minutes to miliseconds.

        if (this.updaterLoop) clearInterval(this.updaterLoop);

        this.updaterLoop = setInterval(() => {
			this.log('Updating data from API');
			this.pushSensorsToDevice();
		}, timer);
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        // TODO add the site name
        this.log('Device has been added');
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
        this.log('Settings where changed');

        if (changedKeys.includes('refresh')) {
            this.setUpdaterLoop(newSettings.refresh);
        }

        if (changedKeys.includes('server') ||
            changedKeys.includes('username') ||
            changedKeys.includes('passhash')
        ) {
            const testResult = await PRTG.testApi(newSettings.server, newSettings.username, newSettings.passhash);
            if (testResult) {
                this.api = null;
                this.api = new PRTG(newSettings.server, newSettings.username, newSettings.passhash)
                this.log("New PRTG info is correct");
            } else {
                throw new Error("Can't connect to PRTG, please check your settings!");
            }
        }
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name) {
        this.log('Renamed');
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        this.log('Deleted');
        this.api = null;
    }

}

module.exports = PRTGStatusDevice;
