import './llama.css';
import React, { useState, useEffect, useCallback } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiUser } from 'react-icons/bi';

function Llama() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setBotTyping] = useState(false);

    useEffect(() => {
        const messageArea = document.getElementById('messageArea');
        messageArea.scrollTo({ top: messageArea.scrollHeight, behavior: 'smooth' });
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

    const handleSubmit = useCallback(async (evt) => {
        evt.preventDefault();
        const name = "montasser";
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage.trim() };

        if (inputMessage.trim() !== "") {
            setChat(chat => [...chat, request_temp]);
            setBotTyping(true);
            setInputMessage('');
            try {
                const response = await fetch('http://localhost:3000/ask', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: inputMessage.trim() }),
                });
                const data = await response.json();
                const botResponse = data.answer;
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

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="card stylecard">
                    <div className="cardHeader styleHeader">
                        <h3>Assistant Ben Yaghlane Shops with LLAMA</h3>
                    </div>
                    <div className="cardBody styleBody" id="messageArea">
                        {chat.map((message, index) => (
                            <div key={index} className={message.sender === 'bot' ? 'msgalignstart' : 'msgalignend'}>
                                {message.sender === 'bot' && <img src="/src/assets/yaghlane.jpg" alt="bot" className="botImage" />}
                                <h6 className={message.sender === 'bot' ? 'botmsg' : 'usermsg'} dangerouslySetInnerHTML={{ __html: message.msg }} />
                            </div>
                        ))}
                        {botTyping && <h6>Bot saisie....</h6>}
                    </div>
                    <div className="cardFooter styleFooter">
                        <form className="row" style={{ display: 'flex' }} onSubmit={handleSubmit}>

                            <div className="col-10" style={{ paddingRight: '0px',width:'100%' }}>
                                <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} placeholder='Posez votre question ici' type="text" className="msginp" />
                            </div>
                            <div className="col-2">
                                <button type="submit" className="circleBtn" aria-label="Send message"><IoMdSend className="sendBtn" /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Llama;
