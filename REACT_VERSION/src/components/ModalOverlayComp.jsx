import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './ModalOverlayComp.css'

library.add(fas);

export default function ModalOverlayView({ handleClose, children }) {
    return (
        <div className="modal-overlay" onClick={handleClose}>{ children }</div>
    );
}