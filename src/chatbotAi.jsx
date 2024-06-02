import './chatBot.css';
import React, { useEffect, useState, useCallback } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import { BsFillMicFill } from 'react-icons/bs';

function ChatbotAi() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setBotTyping] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const [InitialEtat, setInitialEtat] = useState("initial")

    const handleMoreClick = () => {
        setShowMoreOptions(!showMoreOptions);
    };


    useEffect(() => {
        const objDiv = document.getElementById('messageArea');
        objDiv.scrollTo({ top: objDiv.scrollHeight, behavior: 'smooth' });
    }, [chat]);

    useEffect(() => {
        sendWelcomeMessage();
    }, []);

    const sendWelcomeMessage = () => {
        const welcomeMessage = {
            sender: "bot",
            msg: "Bienvenue chez BYBot Je suis votre assistant virtuel et je suis là pour vous guider dans le choix de vos produits alimentaires. <br/> Pour quelle raison avez-vous choisi de visiter notre magasin aujourd'hui ?"
        };
        setChat([welcomeMessage]);
    }

    const handleSubmit = useCallback((evt) => {
        evt.preventDefault();
        const name = "montasser";
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage.trim() };

        if (inputMessage !== "") {
            setChat(chat => [...chat, request_temp]);
            setBotTyping(true);
            setInputMessage('');
            rasaAPI(name, inputMessage);
        } else {
            window.alert("Veuillez entrer un message valide");
        }
    }, [inputMessage]);

    const rasaAPI = async (name, msg) => {
        try {
            const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'charset': 'UTF-8',
                },
                credentials: "same-origin",
                body: JSON.stringify({ "sender": name, "message": msg }),
            });
            const data = await response.json();
            let botResponse = '';
            if (data && data.length > 0) {
                botResponse = data.map(item => item.text).join('<br/>');
                const message = {
                    sender: "bot",
                    msg: botResponse
                };
                setChat(chat => [...chat, message]);
            }
            setBotTyping(false);
        } catch (error) {
            console.error('Error:', error);
            setBotTyping(false);
        }
    }

    const handleQuestionClick = useCallback((question) => {
        const name = "montasser";
        setChat(chat => [...chat, { sender: "user", sender_id: name, msg: question }]);
        setBotTyping(true);
        rasaAPI(name, question);
        setInitialEtat(question);
        setShowMoreOptions(false)
    }, []);

    return (
        <div>
            {showMoreOptions && (
                <>
                    <div className="modal" style={{ padding: "30px", position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, backgroundColor: '#ffffff' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="modal-title text-center">More Options</h2>
                                    <button type="button" className="close" onClick={handleMoreClick} style={{ position: 'absolute', right: '15px', top: '15px', border: '1px solid black' }}>
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
                    <div className="chatbot-blur"></div>
                </>
            )}

            <div className="container">
                <div className="row justify-content-center">
                    <div className="card stylecard">
                        <div className="cardHeader styleHeader">
                            <h3>Assistant Ben Yaghlane Shops</h3>
                        </div>
                        <div className="cardBody styleBody" id="messageArea">
                            <div className="row msgarea">
                                {chat.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ?
                                            (
                                                <div className='msgalignstart'>
                                                    <img src="/src/assets/yaghlane.jpg" alt="bot" className="botImage" />
                                                    <h6 className='botmsg' dangerouslySetInnerHTML={{ __html: user.msg }} />
                                                </div>
                                            )
                                            : (
                                                <div className='msgalignend'>
                                                    <h6 className="usermsg">{user.msg}</h6><BiUser className="userIcon" />
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                                {botTyping ? <h6>Bot saisie....</h6> : null}
                            </div>
                        </div>

                        <div className="col-12 mx-4" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                            {InitialEtat === "initial" && (
                                <>
                                    <button className="btn btn-outline-light mx-2" onClick={() => handleQuestionClick("C'est ma première visite")}>C'est ma première visite</button>
                                    <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("Je suis un client régulier")}>Je suis un client régulier</button>
                                </>
                            )}
                            {(InitialEtat === "C'est ma première visite" || InitialEtat === "sucré" || InitialEtat === "salé" || InitialEtat === "healthy") && (
                                <>
                                    <button className="btn btn-outline-light mx-2" onClick={() => handleQuestionClick("sucré")}>sucré</button>
                                    <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("salé")}>salé</button>
                                    <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("healthy")}>healthy</button>
                                </>
                            )}

                            {InitialEtat === "Je suis un client régulier" && (
                                <>
                                    <button className="btn btn-outline-light mx-2" onClick={() => handleQuestionClick("Je suis intéressé")}>Je suis intéressé</button>
                                    <button className="btn btn-outline-light mx-2 my-2" onClick={() => handleQuestionClick("je cherche autre chose")}>je cherche autre chose</button>
                                </>
                            )}


                            <button className="btn btn-outline-light mx-2 my-2" onClick={handleMoreClick}>Plus...</button>
                        </div>


                        <div className="cardFooter styleFooter">
                            <div className="row">
                                <form style={{ display: 'flex', width: '100%' }} onSubmit={handleSubmit}>
                                    <div className="col-10" style={{ paddingRight: '0px' }}>
                                        <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} placeholder='Posez votre question ici' type="text" className="msginp" />
                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn" aria-label="Send message"><IoMdSend className="sendBtn" /></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatbotAi;