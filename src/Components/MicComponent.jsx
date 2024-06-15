import React, { useEffect, useRef } from 'react';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;

function MicComponent({ isListening, setIsListening, setInputMessage, handleStopTalking, language }) {
    const timeoutRef = useRef(null);

    useEffect(() => {
        mic.lang = language; // Set the language for speech recognition
        handleListen();
    }, [isListening, language]);

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

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                handleStopTalking(transcript);
            }, 1000);
        };

        mic.onerror = event => {
            console.log(event.error);
        };
    };

    return (
        <button style={{ color: 'white' }} className="circleBtn" type='button' onClick={() => setIsListening(prevState => !prevState)}>
            {isListening ? <BiMicrophone /> : <BiMicrophoneOff />}
        </button>
    );
}

export default MicComponent;
