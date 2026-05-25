import { useState } from 'react'
import '../App.css'
import * as missionsScript from '../businessLogic/missions.js'

/*
 *{sessionLIST.map(session => (<tr>
                    <td style={{padding: "20px"}}>{session.missioN_ID}</td>
                    <td style={{padding: "20px"}}>{session.missioN_NAME}</td>
                    <td style={{padding: "20px"}}>{session.missioN_START_TIMESTAMP}</td>
                    <td style={{padding: "0px !important"}}><button class={openMissionButton} id={`openButton_${session}`}>ABRIR</button></td></tr>))}
 * */

async function MissionsPage() {
	let missionData = await missionsScript.loadMissionsListData();
	
	return (
        <>
            <div class="missionsHero">
                <h1>SESSÕES DE MEDIÇÃO:</h1>
                <div class="missionsTableContainer">
                    <table class="missionsTable">
                    <thead style={{backgroundColor: "#27221a", position: "sticky", top: 0}}>
                        <tr>
                        <th>ID SESSÃO</th>
                        <th>NOME SESSÃO</th>
                        <th>DATA DE CRIAÇÃO (TIMESTAMP)</th>
                        <th>ABRIR SESSÃO</th>
                        </tr>
                    </thead>
                    <tbody id="sessionList">{missionData.map(session => (<tr>
                    <td style={{padding: "20px"}}>{session.missioN_ID}</td>
                    <td style={{padding: "20px"}}>{session.missioN_NAME}</td>
                    <td style={{padding: "20px"}}>{session.missioN_START_TIMESTAMP}</td>
                    <td style={{padding: "0px !important"}}><button class="openMissionButton" id={`openButton_${session}`}>ABRIR</button></td></tr>))}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MissionsPage
