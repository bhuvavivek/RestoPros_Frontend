import { io } from 'socket.io-client';

const SOCKET_URL = 'https://restorent-managment-backend.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        path: '/Socket-new',
        transports: ['websocket'],
      });

      // Listen for the 'connect' event
      this.socket.on('connect', () => {
        console.log('Socket successfully connected');
      });

      // handle connection error
      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error: ', err);
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
}

const socketService = new SocketService();
export default socketService;
