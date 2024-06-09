import './gemini.css';
import React, { useEffect, useState, useCallback } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import StateButtons from './StateButtons.jsx';
import BmiModal from './BmiModal.jsx';
import MoreOptionsModal from './MoreOptionsModal.jsx';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

function Gemini() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setBotTyping] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [initialState, setInitialState] = useState("initial");
    const [isListening, setIsListening] = useState(false);
    const [showBmiModal, setShowBmiModal] = useState(false);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState('');

    useEffect(() => {
        handleListen();
    }, [isListening]);

    const handleListen = () => {
        if (isListening) {
            mic.start();
            mic.onend = () => {
                console.log("Mic stopped and will restart because listening is true.");
                mic.start();
            };
        } else {
            mic.stop();
            mic.onend = () => {
                console.log("Mic stopped.");
            };
        }
        mic.onstart = () => {
            console.log("Mic is on.");
        };

        mic.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join("");
            console.log(transcript);
            setInputMessage(transcript);
            mic.onerror = event => {
                console.log(event.error);
            };
        };
    };

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
            msg: "Bienvenue chez BYBot Je suis votre assistant virtuel et je suis là pour vous guider dans le choix de vos produits alimentaires. <br/> Quel est votre centre d'intérêt ?"
        };
        setChat([welcomeMessage]);
    };

    const handleSubmit = useCallback(async (evt) => {
        evt.preventDefault();
        const name = "Karim";
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage.trim() };

        if (inputMessage !== "") {
            setChat(chat => [...chat, request_temp]);
            setBotTyping(true);
            setInputMessage('');
            try {
                const response = await fetch('http://127.0.0.1:5000/api', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: inputMessage.trim() }),
                });
                const data = await response.json();
                let botResponse = data.response.replace(/\n/g, '<br/>'); // Replace newline characters with <br/>
                botResponse = botResponse.replace(/\*/g, ''); // Remove all asterisks
                const message = {
                    sender: "bot",
                    msg: botResponse
                };
                setChat(chat => [...chat, message]);
            } catch (error) {
                console.error('Error:', error);
            }
            setBotTyping(false);
        } else {
            window.alert("Veuillez entrer un message valide");
        }
    }, [inputMessage]);

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
            const response = await fetch('http://127.0.0.1:5000/api', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question }),
            });
            const data = await response.json();
            let botResponse = data.response.replace(/\n/g, '<br/>'); // Replace newline characters with <br/>
            botResponse = botResponse.replace(/\*/g, ''); // Remove all asterisks
            const message = {
                sender: "bot",
                msg: botResponse
            };
            setChat(chat => [...chat, message]);
        } catch (error) {
            console.error('Error:', error);
        }
        setBotTyping(false);
        setInitialState(question);
        setShowMoreOptions(false);
    }, []);

    const handleBmiCalculation = async () => {
        if (height > 0 && weight > 0) {
            try {
                const response = await fetch('http://127.0.0.1:5000/bmi', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ height: Number(height), weight: Number(weight) }),
                });
                const data = await response.json();
                const imc = data.bmi;
                if ((imc > 0) && (imc < 18.5)) {
                    setBmi("Votre IMC : " + data.bmi + " Maigreur");
                }
                if ((imc > 18.5) && (imc < 24.9)) {
                    setBmi("Votre IMC : " + data.bmi + " Normal");
                }
                if ((imc > 24.9) && (imc < 29.9)) {
                    setBmi("Votre IMC : " + data.bmi + " Surpoinds");
                }
                if ((imc > 29.9) && (imc < 40)) {
                    setBmi("Votre IMC : " + data.bmi + " Obésité");
                }
                if (imc > 40) {
                    setBmi("Votre IMC : " + data.bmi + " Obésité Massive");
                }

            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert("Veuillez entrer une taille et un poids valides");
        }
    };

    return (
        <div>
            <MoreOptionsModal
                show={showMoreOptions}
                onClose={handleMoreClick}
                handleQuestionClick={handleQuestionClick}
            />

            <BmiModal
                show={showBmiModal}
                onClose={() => setShowBmiModal(false)}
                weight={weight}
                height={height}
                bmi={bmi}
                setWeight={setWeight}
                setHeight={setHeight}
                handleBmiCalculation={handleBmiCalculation}
            />

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
                            setShowBmiModal={setShowBmiModal}
                        />

                        <div className="cardFooter styleFooter">
                            <div className="row">
                                <form style={{ display: 'flex', width: '100%' }} onSubmit={handleSubmit}>
                                    <div className="col-10" style={{ paddingRight: '0px' }}>
                                        <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} placeholder='Posez votre question ici' type="text" className="msginp" />
                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn" aria-label="Send message"><IoMdSend className="sendBtn" /></button>

                                    </div>
                                    <div className="col-2 cola">
                                        <button style={{ color: 'white' }} className="circleBtn" type='button' onClick={() => setIsListening(prevState => !prevState)}>
                                            {isListening ? <BiMicrophone /> : <BiMicrophoneOff />}
                                        </button>
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
