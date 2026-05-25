import * as global from "./global.js";

async function initMissionsPage() {
    const missionData = await loadMissionsListData();

    for(let i = 0; i < missionData.length; i++) {
        document.getElementById("sessionList").innerHTML += `<tr>
                    <td style="padding: 20px;">${missionData[i].missioN_ID}</td>
                    <td style="padding: 20px;">${missionData[i].missioN_NAME}</td>
                    <td style="padding: 20px;">${missionData[i].missioN_START_TIMESTAMP}</td>
                    <td style="padding: 0px !important;"><button class="openMissionButton" id="openButton_${i}">ABRIR</button></td>
                </tr>`;

        requestAnimationFrame(() => {
            document.getElementById(`openButton_${i}`).addEventListener("click", () => {
                openMissionDashboard(missionData[i].missioN_ID);
            });
        });
    }
}

//initMissionsPage();

//#region METHODS

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

function openMissionDashboard(missionID) {
    const splitedURL = window.location.href.split("/");
    window.location.href = splitedURL[0] + splitedURL[1] + `missionPage.html?missionID=${missionID}`;
}

//#endregion METHODS
