import React from 'react';

function MoreOptionsModal({ show, onClose, handleQuestionClick }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ padding: "30px", position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, backgroundColor: 'rgb(152 186 40 / 84%);' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close btn" onClick={onClose} style={{ position: 'absolute', right: '15px', top: '15px', border: '1px solid black' }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("Another question 1")}>Another question 1</button>
                        <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("Another question 2")}>Another question 2</button>
                        <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("Another question 3")}>Another question 3</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoreOptionsModal;
