export const request_chat = {
    request_create_chat: async (newChat) => {
        const requestCreateChat = await fetch('http://localhost:3000/api/chat/CreateChat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newChat)
        });
        const responseCreateChat = await requestCreateChat.json();
        return responseCreateChat;
    },

    get_chat: async (clientId) => {
        const requestGetChat = await fetch(`http://localhost:3000/api/chat/GetChat?clientId=${clientId}`, { method: 'GET' });
        const responseGetChat = await requestGetChat.json();
        return responseGetChat;
    },

    end_chat: async (chatId) => {
        const requestGetChat = await fetch('http://localhost:3000/api/chat/EndChat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({salaId: chatId})
        });
        const responseGetChat = await requestGetChat.json();
        return responseGetChat;
    }
}