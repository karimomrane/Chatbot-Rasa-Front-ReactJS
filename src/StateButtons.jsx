// StateButtons.js
import React from 'react';

const StateButtons = ({ initialState, handleQuestionClick, handleReset, handleMoreClick, setShowBmiModal }) => {
    return (
        <div className="col-12 mx-4" style={{ marginBottom: "20px", marginLeft: "20px" }}>
            {initialState === "initial" && (
                <>
                    <button className="btn btn-outline-light mx-2" onClick={() => handleQuestionClick("Centre d’intérêt Healthy")}>Healthy</button>
                    <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("Food Lover")}>Food Lover</button>
                </>
            )}
            {(initialState === "Centre d’intérêt Healthy") && (
                <>
                    <button className="btn btn-outline-light mx-2" onClick={() => handleQuestionClick("Proposition Des Repas Healthy")}>Proposition Des Repas Healthy</button>
                    <button className="btn btn-outline-light mx-2 my-2" onClick={() => setShowBmiModal(true)}>Régime Spécifique</button>
                    <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("healthy food")}>healthy</button>
                </>
            )}

            <button className="btn btn-outline-light mx-2 my-2" onClick={handleReset}>Reset</button>
            <button className="btn btn-outline-light mx-2 my-2" onClick={handleMoreClick}>Plus...</button>
        </div>
    );
};

export default StateButtons;
