import React, { useState } from 'react';

const ImageUpload = ({ setChat }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
    };

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file to upload.');
            return;
        }
        if (!question.trim()) {
            setError('Please enter a question.');
            return;
        }
        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('question', question);

        try {
            // Add the selected image and question as a user message to the chat
            const userMessage = {
                sender: "user",
                msg: (
                    <>
                        <div><img src={URL.createObjectURL(selectedFile)} alt="Uploaded" style={{ maxWidth: '200px' }} /></div>
                        <div>{question}</div>
                    </>
                )
            };
            setChat(chat => [...chat, userMessage]);

            // Send the image and question to the backend for processing
            const response = await fetch('http://127.0.0.1:5000/image', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            // Add the bot's response as a bot message to the chat
            const botMessage = {
                sender: "bot",
                msg: data.response
            };
            setChat(chat => [...chat, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            setError('Error uploading file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <input type="text" value={question} onChange={handleQuestionChange} placeholder="Enter a question" />
            <button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ImageUpload;
