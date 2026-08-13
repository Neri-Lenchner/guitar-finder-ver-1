import { JSX } from 'react';
import './AlertModal.css';

interface AlertModalProps {
    message: string;
    onClose: () => void;
}

function AlertModal({ message, onClose }: AlertModalProps): JSX.Element {
    return (
        <div className="alert-overlay" onClick={onClose}>
            <div className="alert-panel" onClick={e => e.stopPropagation()}>
                <p className="alert-message">{message}</p>
                <button className="alert-btn" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default AlertModal;
