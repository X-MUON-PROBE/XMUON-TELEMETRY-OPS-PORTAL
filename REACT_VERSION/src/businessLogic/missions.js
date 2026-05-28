import * as global from "./global.js";

//####################################################################################################################################
//####################################################################################################################################

//#region METHODS

/**
 * This function loads the list of flight missions from the DB, contacting the API.
 * @returns {Promise} A promise resolving to the list of missions or rejecting with an error.
 */
export function loadMissionsListData() {
    return new Promise((resolve, reject) => {
        const name = fetch(`http://${global.API_IP_ADDESS}:${global.API_PORT}/telemetry/getMissionList/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS != null)
            {
		        console.log(LOGS);
                resolve(LOGS);
            }
            else{
                reject("Promise Rejected! HTTP Request Fault!");
            }
        });
    });
}

//#endregion METHODS