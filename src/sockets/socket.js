import { io } from 'socket.io-client';

import { HOST_API } from 'src/config-global';

// const SOCKET_URL = 'http://localhost:8083';
const SOCKET_URL = HOST_API;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        path: '/socket-new',
        transports: ['websocket'],
      });

      // Listen for the 'connect' event
      this.socket.on('connect', () => {
        console.log('Connected to the server');
      });

      // handle connection error
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error: ', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data, callback) {
    if (this.socket) {
      this.socket.emit(event, data, callback);
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  getSocket() {
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;
