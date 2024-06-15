const API_URL = 'http://127.0.0.1:5000'; // Update this with your Flask server address

export const sendMessageToApi = async (question) => {
    try {
        const response = await fetch(`${API_URL}/api`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });
        const data = await response.json();
        return data.response; // Assume response is directly the bot's message
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
