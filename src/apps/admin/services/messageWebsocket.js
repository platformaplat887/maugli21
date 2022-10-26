import io from 'socket.io-client';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';
import EventEmitter from 'eventemitter3';

const WEBSOCKET_URL = process.env.NODE_ENV === 'production' ? 'wss://platforma.maugli21.online:5050' : 'ws://localhost:5050';

class MessageWebsocketController {
    events = new EventEmitter();

    connect () {
        const socket = io(WEBSOCKET_URL, { transports: ['websocket'] });

        this.socket = socket;

        socket.on('connect', () => {
            const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

            socket.emit('token', {
                type: 'admin',
                token
            });
        });

        socket.on('message', data => {
            this.events.emit('message', data);
        });
    }

    disconnect () {
        this.socket && this.socket.disconnect();
        this.socket = null;
    }

    sendMessage ({ receiverId, text }) {
        if (!this.socket) {
            return;
        }

        this.socket.emit('message', {
            receiverId,
            text
        });
    }
}

const messageWebsocketController = new MessageWebsocketController();

export default messageWebsocketController;
