import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ModalOverlayView from '../ModalOverlayComp.jsx';
import * as _globalConfig from '../../businessLogic/global.js';
import './NewMissionTrackingModal.css';

library.add(fas);

//####################################################################################################################################
//####################################################################################################################################

export default function NewMissionTrackingModal({ isOpen, onClose, onMissionCreated }) {
    // ==================== STATE MANAGEMENT ====================

    const [step, setStep] = useState('form'); // 'form' | 'success' | 'error'
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        missionCodename: '',
        receiverIP: '',
        launchNotes: '',
        latitude: '',
        longitude: ''
    });

    const [connectionStatus, setConnectionStatus] = useState(null);
    // null | 'testing' | 'connected' | 'failed'

    const [newMissionData, setNewMissionData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // ==================== UTILITIES ====================

    // Validate IP address format
    const isValidIP = (ip) => {
        const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
        return ipRegex.test(ip);
    };

    // Validate form fields
    const validateForm = () => {
        const errors = {};

        if (!formData.missionCodename.trim()) {
            errors.missionCodename = 'Nome da missão é obrigatório';
        } else if (formData.missionCodename.trim().length < 3) {
            errors.missionCodename = 'Nome deve ter pelo menos 3 caracteres';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.missionCodename)) {
            errors.missionCodename = 'Apenas alfanuméricos e underscore permitidos';
        }

        if (!formData.receiverIP.trim()) {
            errors.receiverIP = 'Endereço IP é obrigatório';
        } else if (!isValidIP(formData.receiverIP.trim())) {
            errors.receiverIP = 'Formato de IP inválido (ex: 192.168.1.100)';
        }

        if (formData.latitude && !/^-?([0-9]|[1-8][0-9]|90)(\.[0-9]+)?$/.test(formData.latitude)) {
            errors.latitude = 'Latitude inválida (-90 a 90)';
        }

        if (formData.longitude && !/^-?([0-9]|[1-9][0-9]|1[0-7][0-9]|180)(\.[0-9]+)?$/.test(formData.longitude)) {
            errors.longitude = 'Longitude inválida (-180 a 180)';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Test connection to receiver IP
    const testConnection = async () => {
        if (!formData.receiverIP.trim()) {
            setValidationErrors({ ...validationErrors, receiverIP: 'IP é obrigatório para testar' });
            return;
        }

        if (!isValidIP(formData.receiverIP.trim())) {
            setValidationErrors({ ...validationErrors, receiverIP: 'Formato de IP inválido' });
            return;
        }

        setConnectionStatus('testing');
        setValidationErrors({});

        try {
            // TODO: Replace with actual API endpoint from your backend
            const response = await fetch(`http://${formData.receiverIP}/api/testConnection`, {
                method: 'GET'
            });

            if (response.ok) {
                setConnectionStatus('connected');
            } else {
                setConnectionStatus('failed');
                setValidationErrors({
                    ...validationErrors,
                    receiverIP: `Receptor respondeu com erro: ${response.status}`
                });
            }
        } catch (err) {
            setConnectionStatus('failed');
            setValidationErrors({
                ...validationErrors,
                receiverIP: 'Receptor não respondeu. Verifique IP e conectividade de rede.'
            });
            console.error('Connection test failed:', err);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Reset form and state
    const resetForm = () => {
        setFormData({
            missionCodename: '',
            receiverIP: '',
            launchNotes: '',
            latitude: '',
            longitude: ''
        });
        setConnectionStatus(null);
        setValidationErrors({});
        setErrorMessage('');
        setNewMissionData(null);
        setStep('form');
    };

    // Submit form to create mission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!validateForm()) {
            return;
        }

        // Check connection was tested and succeeded
        if (connectionStatus !== 'connected') {
            setValidationErrors({
                ...validationErrors,
                receiverIP: 'Você deve validar a conexão com sucesso primeiro'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Replace with your actual API endpoint
            const response = await fetch(`http://${_globalConfig.API_IP_ADDESS}:${_globalConfig.API_PORT}/telemetry/missionInit/${formData.missionCodename}`, {
                //method: 'POST',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                const arduinoMissionNegotiation = await fetch(`http://${formData.receiverIP}/api/establishConnection?missionID=${data.missionID}`, {
                    method: 'GET'
                });

                const missionDataBatch = {
                    missionID: data.missionID,
                    codename: formData.missionCodename,
                    receiverIP: formData.receiverIP,
                    location: formData.launchNotes,
                    createdAt: new Date().toLocaleTimeString('pt-PT')
                };

                setNewMissionData(missionDataBatch);
                setStep('success');

                // Auto-redirect after 5 seconds
                setTimeout(() => {
                    if (onMissionCreated) {
                        onMissionCreated(data.missionID);
                    }
                }, 5000);
            } else {
                setErrorMessage(data.message || 'Erro ao criar missão. Tente novamente.');
                setStep('error');
            }
        } catch (err) {
            setErrorMessage('Erro de conexão com servidor. Tente novamente.');
            setStep('error');
            console.error('Submit error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle close
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Handle error retry
    const handleRetry = () => {
        setStep('form');
        setErrorMessage('');
        setConnectionStatus(null);
    };

    // Handle success redirect
    const handleGoToDashboard = () => {
        if (newMissionData && onMissionCreated) {
            onMissionCreated(newMissionData.missionID);
        }
    };

    // ==================== RENDER FUNCTIONS ====================

    if (!isOpen) return null;

    return (
        <ModalOverlayView>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleClose}>
                    <FontAwesomeIcon icon="fa-solid fa-times" size="lg" />
                </button>

                {step === 'form' && (
                    <>
                        <h2 className="modal-title">INICIAR NOVA MISSÃO</h2>

                        <form onSubmit={handleSubmit} className="mission-form">
                            {/* Mission Codename Field */}
                            <div className="form-group">
                                <label className="form-label">
                                    NOME DA MISSÃO (Codename) <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="missionCodename"
                                    value={formData.missionCodename}
                                    onChange={handleInputChange}
                                    placeholder="Ex: VOO_27/05"
                                    className={`form-input ${validationErrors.missionCodename ? 'error' : ''}`}
                                    disabled={isSubmitting}
                                />
                                {validationErrors.missionCodename && (
                                    <p className="error-message">{validationErrors.missionCodename}</p>
                                )}
                            </div>

                            {/* Receiver IP Field */}
                            <div className="form-group">
                                <label className="form-label">ENDEREÇO IP DO MTC (MÓDULO TERRESTRE DE COMUNICAÇÃO) <span className="required">*</span></label>
                                <input type="text" name="receiverIP" value={formData.receiverIP} onChange={handleInputChange} placeholder="Ex: 192.168.1.100" className={`form-input ${validationErrors.receiverIP ? 'error' : ''}`} disabled={isSubmitting} />
                                {validationErrors.receiverIP && (
                                    <p className="error-message">{validationErrors.receiverIP}</p>
                                )}

                                {/* Connection Status Indicator */}
                                <div className="connection-status-container">
                                    <button
                                        type="button"
                                        onClick={testConnection}
                                        disabled={!formData.receiverIP.trim() || isSubmitting || connectionStatus === 'testing'}
                                        className={`validate-btn ${connectionStatus}`}
                                    >
                                        {connectionStatus === 'testing' && (
                                            <>
                                                <FontAwesomeIcon icon="fa-solid fa-spinner" spin /> Testando...
                                            </>
                                        )}
                                        {connectionStatus !== 'testing' && (
                                            <>
                                                <FontAwesomeIcon icon="fa-solid fa-wifi" /> VALIDAR CONEXÃO
                                            </>
                                        )}
                                    </button>

                                    <span className={`status-indicator ${connectionStatus || 'idle'}`}>
                                        {connectionStatus === null && '⚪ Não testado'}
                                        {connectionStatus === 'testing' && '⏳ Testando...'}
                                        {connectionStatus === 'connected' && '✅ Conectado!'}
                                        {connectionStatus === 'failed' && '❌ Falha'}
                                    </span>
                                </div>
                            </div>

                            {/* Launch Notes Field */}
                            <div className="form-group">
                                <label className="form-label">
                                    DESCRIÇÃO / NOTAS
                                </label>
                                <textarea
                                    name="launchNotes"
                                    value={formData.launchNotes}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Missão de deteção de muões dentro de um edifício."
                                    className="form-input textarea"
                                    rows="3"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Coordinates Fields */}
                            <div className="coordinates-group">
                                <div className="form-group coordinate-field">
                                    <label className="form-label">
                                        LATITUDE (IPS)
                                    </label>
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        placeholder="40.7128"
                                        className={`form-input ${validationErrors.latitude ? 'error' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.latitude && (
                                        <p className="error-message">{validationErrors.latitude}</p>
                                    )}
                                </div>

                                <div className="form-group coordinate-field">
                                    <label className="form-label">
                                        LONGITUDE (IPS)
                                    </label>
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        placeholder="-74.0060"
                                        className={`form-input ${validationErrors.longitude ? 'error' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.longitude && (
                                        <p className="error-message">{validationErrors.longitude}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="btn-cancel"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={isSubmitting || connectionStatus !== 'connected'}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FontAwesomeIcon icon="fa-solid fa-spinner" spin /> Criando...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon="fa-solid fa-rocket" size='2x' /> INICIAR MISSÃO & MONITORIZAÇÃO
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* SUCCESS STEP */}
                {step === 'success' && newMissionData && (
                    <>
                        <div className="success-header">
                            <FontAwesomeIcon icon="fa-solid fa-check-circle" className="success-icon" />
                            <h2 className="modal-title">MISSÃO CRIADA COM SUCESSO!</h2>
                        </div>

                        <div className="success-details">
                            <div className="detail-box">
                                <div className="detail-row">
                                    <span className="detail-label">🎯 ID MISSÃO</span>
                                    <span className="detail-value">#{newMissionData.missionID}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">📝 NOME</span>
                                    <span className="detail-value">{newMissionData.codename}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">📡 RECEPTOR</span>
                                    <span className="detail-value">{newMissionData.receiverIP}</span>
                                </div>
                                {newMissionData.location && (
                                    <div className="detail-row">
                                        <span className="detail-label">📍 LOCALIZAÇÃO</span>
                                        <span className="detail-value">{newMissionData.location}</span>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="detail-label">🕐 CRIADA EM</span>
                                    <span className="detail-value">{newMissionData.createdAt}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">⏱️ STATUS</span>
                                    <span className="detail-value status-pending">AGUARDANDO DADOS</span>
                                </div>
                            </div>
                        </div>

                        <div className="countdown-message">
                            ⏳ Redirecionando para painel em breve...
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn-cancel"
                            >
                                Fechar
                            </button>
                            <Link
                                to={`/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist/missionDashboard?missionID=${newMissionData.missionID}`}
                                className="btn-submit"
                            >
                                <FontAwesomeIcon icon="fa-solid fa-arrow-right" /> IR PARA PAINEL AGORA
                            </Link>
                        </div>
                    </>
                )}

                {/* ERROR STEP */}
                {step === 'error' && (
                    <>
                        <div className="error-header">
                            <FontAwesomeIcon icon="fa-solid fa-exclamation-circle" className="error-icon" />
                            <h2 className="modal-title">ERRO AO CRIAR MISSÃO</h2>
                        </div>

                        <div className="error-message-container">
                            <p className="error-text">⚠️ {errorMessage}</p>
                            <p className="error-hint">Por favor, tente novamente.</p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn-cancel"
                            >
                                Fechar
                            </button>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="btn-submit"
                            >
                                <FontAwesomeIcon icon="fa-solid fa-redo" /> TENTAR NOVAMENTE
                            </button>
                        </div>
                    </>
                )}
            </div>
        </ModalOverlayView>
    );
}