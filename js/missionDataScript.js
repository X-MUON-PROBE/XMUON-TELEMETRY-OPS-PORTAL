import * as global from "./global.js";

async function initMissionDashboardPage() {
    const urlGETVariablesSection = window.location.href.split("?")[1];
    const _missionIDField = urlGETVariablesSection.split("&")[0];
    const _missionID = _missionIDField.split("=")[1];
    const missionData = await loadMissionData(Number(_missionID));

    console.log(missionData.missionMeasurementRecords.length);

    for(let i = 0; i < missionData.missionMeasurementRecords.length; i++) {
        document.getElementById("sessionList").innerHTML += `<tr>
                    <td style="padding: 20px;">${i}</td>
                    <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].totalGeigerCounts}</td>
                    <td style="padding: 20px;">${missionData.missionMeasurementRecords[i].geigerCountsPerMinute}</td>
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
}

initMissionDashboardPage();

//#region METHODS

function loadMissionData(missionID) {
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