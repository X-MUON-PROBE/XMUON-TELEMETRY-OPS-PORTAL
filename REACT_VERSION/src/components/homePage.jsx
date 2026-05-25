import { useState } from 'react'
import './App.css'

function MainPage()
{
    return (
    <>
        <div class="hero panel">
            <img src="https://images-assets.nasa.gov/image/PIA17172/PIA17172~orig.jpg" alt="Cassini"/>
            <div class="overlay-lines"></div>
        </div>
        <div class="right panel">
            <div class="mini-title">Featured Documentary</div>
            <div class="doc-card">
                <img src="https://images-assets.nasa.gov/image/PIA11141/PIA11141~orig.jpg"/>
                <div class="doc-content">
                    <h2>The<br/>Dark Side</h2>
                </div>
            </div>
            <div class="mini-title">Missions</div>
            <div class="mission-list">
                <div class="mission">
                    <span>Voyager 1</span>
                    <div class="green-dot"></div>
                </div>
                <div class="mission">
                    <span>James Webb</span>
                    <div class="green-dot"></div>
                </div>

                <div class="mission">
                    <span>Perseverance</span>
                    <div class="green-dot"></div>
                </div>

                <div class="mission">
                    <span>Hubble</span>
                    <div class="green-dot"></div>
                </div>
            </div>
        </div>

        <div class="bottom">
            <div class="bottom-card">
                <div class="mini-title">Image of the Day</div>
                <img src="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001861/GSFC_20171208_Archive_e001861~orig.jpg"/>
            </div>

            <div class="bottom-card">
                <div class="mini-title">Explore</div>
                    <div class="explore-list">
                        <div class="explore-item">
                            <span>Planets</span>
                            <span>8</span>
                        </div>
                        <div class="explore-item">
                            <span>Moons</span>
                            <span>146</span>
                        </div>
                        <div class="explore-item">
                            <span>Asteroids</span>
                            <span>12,043</span>
                        </div>
                        <div class="explore-item">
                            <span>Galaxies</span>
                            <span>2.1M</span>
                        </div>
                    </div>
                </div>
                <div class="bottom-card telemetry">
                    <div class="mini-title">Live Telemetry</div>
                    <div class="telemetry-stats">
                    <div>
                        <h3>Signal Strength</h3>
                        <p>92%</p>
                    </div>
                    <div>
                        <h3>Data Rate</h3>
                        <p>2.48 Mbps</p>
                    </div>
                    <div>
                        <h3>System Temp</h3>
                        <p>-120°C</p>
                    </div>
                    </div>

                    <div class="graph">
                    <div class="wave">
                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
                        <path
                            d="
                            M0,60
                            C100,20 150,80 250,50
                            C350,20 400,80 500,45
                            C600,10 650,90 750,50
                            C850,20 900,70 1000,40
                            "
                            fill="none"
                            stroke="#d6b07d"
                            stroke-width="2"
                        />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default MainPage