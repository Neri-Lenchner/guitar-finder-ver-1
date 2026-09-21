import React, { JSX, useEffect, useRef } from 'react';
import './AlertModal.css';

interface AlertModalProps {
    message: string;
    onClose: () => void;
}

function AlertModal({ message, onClose }: AlertModalProps): JSX.Element {
    const okButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        okButtonRef.current?.focus();
        return () => previouslyFocused?.focus();
    }, []);

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        if (event.key === 'Escape') {
            onClose();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            okButtonRef.current?.focus();
        }
    }

    return (
        <div className="alert-overlay" onClick={onClose}>
            <div
                className="alert-panel"
                role="alertdialog"
                aria-modal="true"
                aria-describedby="alert-message"
                onClick={e => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <p id="alert-message" className="alert-message">{message}</p>
                <button ref={okButtonRef} className="alert-btn" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default AlertModal;
