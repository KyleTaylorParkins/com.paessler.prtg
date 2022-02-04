'use strict'

const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;

const statusCodes = {
    up: 3,
    warning: 4,
    down: 5,
    down_ack: 13,
    unusual: 10,
}

module.exports = class PrtgApi {
    constructor(server, user, passhash) {
        this.server = server;
        this.user = user;
        this.passhash = passhash;
        console.log(`PRTG API initialized: server: ${server}, user: ${user}`);
    }

    // Helper function to test the connection to the API
    static async testApi(server, user, passhash) {
        const url = `http://${server}/api/getstatus.xml?username=${user}&passhash=${passhash}`;

        return await fetch(url)
            .then(res => {
                return res.status === 200;
            })
            .catch(err => {
                if (err.code) {
                    console.log(`Error whilst fetching PRTG api, code: ${err.code}`);
                } else {
                    console.log(`Unknown error whilst fetching PRTG api, probably an invalid hostname or IP.`);
                }
                return false;
            });
    }

    async apiCall(params) {
        var url = `http://${this.server}/api/table.json?username=${this.user}&passhash=${this.passhash}`;
        // Append all params from the specific API call to the URL
        var paramString = '';
        for (const key in params) {
            paramString += `&${key}=${params[key]}`;
        }

        url = url + paramString;

        return fetch(url)
        .then(async res => { 
            const json = await res.json();
            // console.log("Returning json in apiCall");
            return json;
        })
        .catch(err => {
            console.log(`Error in apiCall: ${err.code}`);
            return null;
        });
    }

    async getUpSensors() {
        return this.getSensors(statusCodes.up)
            .then(sensors => {
                return sensors;
            });
    }

    async getWarningSensors() {
        return this.getSensors(statusCodes.warning)
            .then(sensors => {
                return sensors;
            });
    }

    async getDownSensors() {
        return this.getSensors(statusCodes.down)
            .then(sensors => {
                return sensors;
            });
    }

    async getUnusualSensors() {
        return this.getSensors(statusCodes.unusual)
            .then(sensors => {
                return sensors;
            });
    }

    async getSensors(status) {
        const params = {
            content: 'sensors',
            columns: 'device,sensor,status,message',
            filter_status: status,
        }

        return this.apiCall(params)
        .then(result => {
            if (result && result.hasOwnProperty('sensors')) {
                return result.sensors;
            }
            else return {};
        });
    }
}