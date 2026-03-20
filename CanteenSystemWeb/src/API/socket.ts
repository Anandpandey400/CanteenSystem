// socket.ts
import { io } from "socket.io-client";


// const link ="http://localhost:5000" // local
const link ="http://172.16.90.26:8015/" // prod

const socket = io(link); // your backend URL

export default socket;