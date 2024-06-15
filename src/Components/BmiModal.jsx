import React from 'react';

function BmiModal({ show, onClose, weight, height, bmi, setWeight, setHeight, handleBmiCalculation }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ width: '400px', color: 'white', padding: "50px", position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, backgroundColor: 'rgb(125 186 40 / 90%)' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title text-center">Calculate IMC</h2>
                        <button type="button" className="close btn" onClick={onClose} style={{ position: 'absolute', right: '15px', top: '15px', border: '1px solid black' }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" style={{ color: 'black' }}>
                        <div className="form-group">
                            <label htmlFor="weight"><h3>Poids (KG)</h3></label>
                            <input type="number" className="form-control" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="height"><h3>Hauteur (CM)</h3></label>
                            <input type="number" className="form-control" id="height" value={height} onChange={(e) => setHeight(e.target.value)} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleBmiCalculation}>Calculate BMI</button>
                        <button type="button" className="btn btn-secondary" onClick={() => { onClose(); }}>Close</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default BmiModal;
