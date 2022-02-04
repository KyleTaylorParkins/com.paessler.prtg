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

    async onPair(session) {
        let server   = "";
        let username = "";
        let passhash = "";

        session.setHandler("prtg-login", async function (data) {
            server   = data.server;
            username = data.username;
            passhash = data.passhash;

            const version = await PRTG.testApi(server, username, passhash);
            console.log(`Result from version check: ${version}`);
            return version;
        });
      }

}

module.exports = PRTGStatusDriver;
