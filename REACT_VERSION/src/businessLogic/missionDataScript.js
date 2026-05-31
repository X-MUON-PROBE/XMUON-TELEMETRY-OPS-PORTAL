import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import * as global from "./global.js";

//####################################################################################################################################
//####################################################################################################################################

let connection = null;

//#region METHODS

/**
 * Loads mission data for a given mission ID.
 * @param {Number} missionID - The ID of the mission for which to load data.
 * @returns {Promise} A promise resolving to the mission data or rejecting with an error.
 */
export function loadMissionData(missionID) {
    return new Promise((resolve, reject) => {
        const name = fetch(`http://${global.API_IP_ADDESS}:${global.API_PORT}/telemetry/getMissionData_${missionID}`, {
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
                resolve(LOGS);
            }
            else{
                reject("Promise Rejected! HTTP Request Fault!");
            }
        });
    });
}

/**
 * Convert magnetic field heading to compass point (16-point)
 * @param {Number} headingDeg - Heading in degrees (0-360)
 * @returns {string} Compass point, with intermidiate point-precision (e.g., N, NNE, NE, etc.).
 */
export function getCompassPoint16(headingDeg) {
    //const MAGNETIC_DECLINATION = -3.5;
    const MAGNETIC_DECLINATION = 0;
    let trueHeadingDeg = headingDeg + MAGNETIC_DECLINATION; // adding a negative value = subtracting
    const points = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    
    if (trueHeadingDeg < 0) trueHeadingDeg += 360;
  
    //headingDeg = (headingDeg + 360) % 360;
    
    //const index = Math.floor((headingDeg + 11.25) / 22.5) % 16;
    console.log(`True Heading: ${trueHeadingDeg}°`);
    const index = Math.floor(trueHeadingDeg / 22.50);
  
    return points[index];
}

/**
 * This function initializes a signalR WebSockets connection with the API, for live dashboard updates.
 * @param {Number} missionID - The ID of the mission to observe.
 * @returns {HubConnection} The active SignalR connection object, or null if connection fails.
 */
export async function startSignalRConnection(missionID)
{
  if (connection && connection.state !== HubConnectionState.Disconnected) connection.stop();
  connection = new HubConnectionBuilder().withUrl(`http://${global.API_IP_ADDESS}:${global.API_PORT}/fileDashboardDataChannel?missionID=${missionID}`).withAutomaticReconnect().build();
  
  try {
    await connection.start();
    console.log('SignalR Connected from JS file.');
    return connection;
  }
  catch (err) {
    console.error('SignalR Connection Error: ', err);

    setTimeout(() => {
      startSignalRConnection(missionID)
    }, 5000);
  }
}

/**
 * Adds a listener for a SignalR event.
 * @param {string} eventName - The name of the event to listen for.
 * @param {function} callback - The function to call when the event is received.
 */
export function addSignalRListener(eventName, callback)
{
  if (connection) {
    connection.on(eventName, callback);
  }
};

/**
 * Removes a listener for a SignalR event.
 * @param {string} eventName - The name of the event for which to remove the listener.
 */
export function removeSignalRListener(eventName)
{
  if (connection) {
    connection.off(eventName);
  }
};

/**
 * Sends a message through the SignalR connection.
 * @param {string} methodName - The name of the method to invoke.
 * @param {...*} args - The arguments to pass to the method.
 * @returns {Promise} A promise resolving when the message is sent or rejecting with an error.
 */
export async function sendSignalRMessage(methodName, ...args) {
  if (connection && connection.state === HubConnectionState.Connected)
  {
    try
    {
      await connection.invoke(methodName, ...args);
    }
    catch (err) {
      console.error(`Error invoking ${methodName}: `, err);
    }
  }
  else
  {
    console.warn('Cannot send message; SignalR is not connected.');
  }
};

//#endregion METHODS