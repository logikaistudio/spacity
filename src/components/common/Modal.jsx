import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: { maxWidth: '400px' },
        md: { maxWidth: '600px' },
        lg: { maxWidth: '900px' }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                style={sizeStyles[size]}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between" style={{
                        padding: 'var(--spacing-lg)',
                        borderBottom: '1px solid var(--color-border)'
                    }}>
                        <h3 className="heading-3" style={{ margin: 0 }}>{title}</h3>
                        <button
                            onClick={onClose}
                            className="btn-icon btn-secondary"
                            style={{ fontSize: '1.25rem' }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Content */}
                <div style={{ padding: 'var(--spacing-lg)' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
