import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Check, X } from 'lucide-react';

const MessageEditor = ({ template, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localTemplate, setLocalTemplate] = useState(template);

    const handleSave = () => {
        onSave(localTemplate);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setLocalTemplate(template);
        setIsOpen(false);
    };

    return (
        <div className="message-editor-container">
            {!isOpen && (
                <button
                    className="customize-btn"
                    onClick={() => setIsOpen(true)}
                >
                    <Settings size={18} />
                    <span>Customize Message</span>
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="editor-panel glass-card"
                        style={{ marginTop: '1rem', padding: '1rem' }}
                    >
                        <h3 style={{ marginTop: 0, color: 'white', fontSize: '1.1rem' }}>Edit Message Template</h3>
                        <p className="editor-hint">
                            Use placeholders: <span className="tag">{`{name}`}</span>, <span className="tag">{`{state}`}</span>, <span className="tag">{`{phone}`}</span>
                        </p>
                        <textarea
                            className="template-input"
                            value={localTemplate}
                            onChange={(e) => setLocalTemplate(e.target.value)}
                            rows={4}
                        />
                        <div className="editor-actions">
                            <button className="action-btn cancel" onClick={handleCancel}>
                                <X size={16} /> Cancel
                            </button>
                            <button className="action-btn save" onClick={handleSave}>
                                <Check size={16} /> Save Template
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessageEditor;
