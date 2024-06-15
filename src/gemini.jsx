import React, { useEffect, useState, useCallback } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiUser } from 'react-icons/bi';
import { sendMessageToApi } from './Services/services.js';
import './gemini.css';
import MicComponent from './Components/MicComponent.jsx';
import StateButtons from './Components/StateButtons.jsx';
import ImageUpload from './Components/ImageUpload.jsx';

function Gemini() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setBotTyping] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [initialState, setInitialState] = useState("initial");
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState("en-US");

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
            msg: "Bienvenue chez BYBot Je suis votre assistant virtuel et je suis là pour vous guider dans le choix de vos produits alimentaires. <br/> Comment puis-je vous aider aujourd'hui?"
        };
        setChat([welcomeMessage]);
    };

    const handleSubmit = useCallback(async (message) => {
        const name = "Karim";
        const request_temp = { sender: "user", sender_id: name, msg: message.replace(/\n/g, "<br/>") };
    
        if (message.trim() !== "") {
            setChat(chat => [...chat, request_temp]);
            setBotTyping(true);
            setInputMessage('');
            try {
                const botResponse = await sendMessageToApi(message.trim());
                const responseMessage = {
                    sender: "bot",
                    msg: botResponse.replace(/\n/g, "<br/>")
                };
                setChat(chat => [...chat, responseMessage]);
            } catch (error) {
                console.error('Error:', error);
            }
            setBotTyping(false);
        } else {
            window.alert("Veuillez entrer un message valide");
        }
    }, []);
    

    const handleStopTalking = (transcript) => {
        setInputMessage(transcript);
        setIsListening(false);
        handleSubmit(transcript);
    };

    const handleReset = () => {
        setChat([]);
        sendWelcomeMessage();
        setInitialState("initial");
    };

    const handleQuestionClick = useCallback(async (question) => {
        const name = "Karim";
        setChat(chat => [...chat, { sender: "user", sender_id: name, msg: question }]);
        setBotTyping(true);
        try {
            const botResponse = await sendMessageToApi(question);
            const responseMessage = {
                sender: "bot",
                msg: botResponse
            };
            setChat(chat => [...chat, responseMessage]);
        } catch (error) {
            console.error('Error:', error);
        }
        setBotTyping(false);
        setInitialState(question);
        setShowMoreOptions(false);
    }, []);

    const handleMoreClick = () => {
        setShowMoreOptions(!showMoreOptions);
    };

    const handleImageText = (text) => {
        const message = {
            sender: "bot",
            msg: text
        };
        setChat(chat => [...chat, message]);
    };

    return (
        <div>
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
                                                    <div className='botmsg' dangerouslySetInnerHTML={{ __html: user.msg }} />
                                                </div>
                                            )
                                            : (
                                                <div className='msgalignend'>
                                                    <div className="usermsg">{user.msg}</div><BiUser className="userIcon" />
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                                {botTyping ? <h6>Bot saisie....</h6> : null}
                            </div>
                        </div>

                        <StateButtons
                            initialState={initialState}
                            handleQuestionClick={handleQuestionClick}
                            handleReset={handleReset}
                            handleMoreClick={handleMoreClick}
                        />

                        <div className="cardFooter styleFooter">
                            <div className="row">
                                <form style={{ display: 'flex', width: '100%' }} className='col' onSubmit={(e) => { e.preventDefault(); handleSubmit(inputMessage); }}>
                                    <div className="col-10" style={{ paddingRight: '0px' }}>
                                        <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} placeholder='Posez votre question ici' type="text" className="msginp" />
                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn" aria-label="Send message"><IoMdSend className="sendBtn" /></button>
                                    </div>
                                    <div className="col-2 cola">
                                        <MicComponent
                                            isListening={isListening}
                                            setIsListening={setIsListening}
                                            setInputMessage={setInputMessage}
                                            handleStopTalking={handleStopTalking}
                                            language={language}
                                        />
                                    </div>
                                    <div className="col-2 cola">
                                        <select id="languageSelect" value={language} onChange={(e) => setLanguage(e.target.value)} className="languageSelect">
                                            <option value="en-US">English</option>
                                            <option value="fr-FR">French</option>
                                            <option value="es-ES">Spanish</option>
                                            <option value="de-DE">German</option>
                                            <option value="ar-SA">Arabic</option>
                                        </select>
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

export default Gemini;
