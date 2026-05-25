import { useState } from 'react'
import './App.css'

function MissionsPage() {
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
                    <tbody id="sessionList"></tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MissionsPage