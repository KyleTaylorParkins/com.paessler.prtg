'use strict';

const { Driver } = require('homey');
const PRTG = require('../../lib/PrtgApi');

class PRTGStatusDriver extends Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        this.log('PRTG Status driver has been initialized');
    }

    /**
     * onPairListDevices is called when a user is adding a device
     * and the 'list_devices' view is called.
     * This should return an array with the data of devices that are available for pairing.
     */
    async onPairListDevices() {
        return [
            // Example device data, note that `store` is optional
            // {
            //   name: 'My Device',
            //   data: {
            //     id: 'my-device',
            //   },
            //   store: {
            //     address: '127.0.0.1',
            //   },
            // },
        ];
    }

    async onPair(session) {
        let server   = "";
        let username = "";
        let passhash = "";

        session.setHandler("prtg-login", async function (data) {
            server   = data.server;
            username = data.username;
            passhash = data.passhash;

            console.dir(data);

            const version = await PRTG.testApi(server, username, passhash);
            console.log(`Result from version check: ${version}`);
            return version;
        });
      }

}

module.exports = PRTGStatusDriver;
