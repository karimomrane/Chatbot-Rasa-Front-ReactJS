import './chatBot.css';
import React, { useEffect, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import { BsFillMicFill } from 'react-icons/bs';

function ChatbotAi() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setBotTyping] = useState(false);

    useEffect(() => {
        const objDiv = document.getElementById('messageArea');
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [chat]);

    useEffect(() => {
        sendWelcomeMessage();
    }, []);

    const sendWelcomeMessage = () => {
        const welcomeMessage = {
            sender: "bot",
            msg: "Bonjour, je suis EspritNetworkBot. Comment puis-je vous aider ?"
        };
        setChat([welcomeMessage]);
    }

    const handleSubmit = (evt) => {
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
    }

    const rasaAPI = async (name, msg) => {
        await fetch('http://localhost:5005/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'charset': 'UTF-8',
            },
            credentials: "same-origin",
            body: JSON.stringify({ "sender": name, "message": msg }),
        })
            .then(response => response.json())
            .then((response) => {
                let botResponse = ''; // Initialize an empty string to store bot responses
                if (response && response.length > 0) {
                    botResponse = response.map(item => item.text).join('<br/>'); // Concatenate all bot responses into one string with newline characters
                    const message = {
                        sender: "bot",
                        msg: botResponse
                    };
                    setChat(chat => [...chat, message]);
                }
                setBotTyping(false);
            });
    }


    const handleQuestionClick = (question) => {
        const name = "montasser";
        setChat(chat => [...chat, { sender: "user", sender_id: name, msg: question }]);
        setBotTyping(true);
        rasaAPI(name, question);
    }

    return (
        <div style={{ marginTop: "100px" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="card stylecard">
                        <div className="cardHeader styleHeader">
                            <h3>Assistant Esprit Network</h3>
                        </div>
                        <div className="cardBody styleBody" id="messageArea">
                            <div className="row msgarea">
                                {chat.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ?
                                            (
                                                <div className='msgalignstart'>
                                                    <BiBot className="botIcon" /><h6 className='botmsg' dangerouslySetInnerHTML={{ __html: user.msg }} />
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
                        <div className="col-12 mx-4 my-2">
                            <button className="btn btn-outline-dark mx-2" onClick={() => handleQuestionClick("Comment créer une offre ?")}>Comment créer une offre ?</button>
                            <button className="btn btn-outline-dark mx-2 my-1" onClick={() => handleQuestionClick("Comment lister mes offres ?")}>Comment lister mes offres ?</button>
                            <button className="btn btn-outline-dark mx-2 my-1" onClick={() => handleQuestionClick("Comment lister mes archive ?")}>Comment lister mes archives des offres ?</button>
                        </div>
                        <div className="cardFooter styleFooter">
                            <div className="row">
                                <form style={{ display: 'flex', width: '100%' }} onSubmit={handleSubmit}>
                                    <div className="col-10" style={{ paddingRight: '0px' }}>
                                        <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} placeholder='Posez votre question ici' type="text" className="msginp" />
                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn"><IoMdSend className="sendBtn" /></button>
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
