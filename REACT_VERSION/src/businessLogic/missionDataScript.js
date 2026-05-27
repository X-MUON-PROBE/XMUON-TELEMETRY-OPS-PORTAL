import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import * as global from "./global.js";

let connection = null;

async function initMissionDashboardPage() {
    const urlGETVariablesSection = window.location.href.split("?")[1];
    const _missionIDField = urlGETVariablesSection.split("&")[0];
    const _missionID = _missionIDField.split("=")[1];
    const missionData = await loadMissionData(Number(_missionID));

    document.getElementById("missionNameH1").innerHTML = missionData.missionData.missioN_NAME;

    let tableRowsDOMSTR = "";
    for(let i = 0; i < missionData.missionMeasurementRecords.length; i++) {
           tableRowsDOMSTR += `<tr>
                        <td style="padding: 20px;">${i}</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].totalGeigerCounts}</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].geigerCountsPerSecond}</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].geigerDose}</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].temperature}</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].atmPressure}</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].altitude}</td>
                        <td style="padding: 20px;">(${missionData.missionMeasurementRecords[i].accelVector.ax}, ${missionData.missionMeasurementRecords[i].accelVector.ay}, ${missionData.missionMeasurementRecords[i].accelVector.az})</td>
                        <td style="padding: 20px;">(${missionData.missionMeasurementRecords[i].gyroVector.gx}, ${missionData.missionMeasurementRecords[i].gyroVector.gy}, ${missionData.missionMeasurementRecords[i].gyroVector.gz})</td>
                        <td style="padding: 20px;">(${missionData.missionMeasurementRecords[i].magneticFieldVector.mx}, ${missionData.missionMeasurementRecords[i].magneticFieldVector.my}, ${missionData.missionMeasurementRecords[i].magneticFieldVector.mz})</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].headingFloat}</td>
                        <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].gyroChipTemperature}</td>
                    </tr>`;
    }
    
    requestAnimationFrame(() => {
    document.getElementById("sessionList").innerHTML = tableRowsDOMSTR;
        document.getElementById("TIME_HOURGLASS").style.display = "none";
    });
}

//initMissionDashboardPage();

//#region METHODS

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
        console.log(data);
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

// Convert magnetic field heading to compass point (16-point)
export function getCompassPoint16(headingDeg) {
    const MAGNETIC_DECLINATION = -3.5;
    let trueHeadingDeg = headingDeg + MAGNETIC_DECLINATION; // adding a negative value = subtracting
    const points = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    
    if (trueHeadingDeg < 0) trueHeadingDeg += 360;
  
    headingDeg = (headingDeg + 360) % 360;
    const index = Math.floor((headingDeg + 11.25) / 22.5) % 16;
  
    return points[index];
}

// 1. Initialize and start the connection
export const startSignalRConnection = async () => {
  if (connection && connection.state !== HubConnectionState.Disconnected) {
    return connection; // Avoid creating duplicate connections
  }

  connection = new HubConnectionBuilder()
    .withUrl(`http://${global.API_IP_ADDESS}:${global.API_PORT}/fileDashboardDataChannel`).withAutomaticReconnect().build();

  try {
    await connection.start();
    console.log('SignalR Connected from JS file.');
    return connection;
  } catch (err) {
    console.error('SignalR Connection Error: ', err);
    setTimeout(startSignalRConnection, 5000); // Optional: retry logic
  }
};

// 2. Register listeners using a callback function to send data back to React
export function addSignalRListener(eventName, callback) {
  if (connection) {
    connection.on(eventName, callback);
  }
};

// 3. Remove listeners when React components unmount
export const removeSignalRListener = (eventName) => {
  if (connection) {
    connection.off(eventName);
  }
};

// 4. Send data to the backend server
export const sendSignalRMessage = async (methodName, ...args) => {
  if (connection && connection.state === HubConnectionState.Connected) {
    try {
      await connection.invoke(methodName, ...args);
    } catch (err) {
      console.error(`Error invoking ${methodName}: `, err);
    }
  } else {
    console.warn('Cannot send message; SignalR is not connected.');
  }
};

//#endregion METHODS
