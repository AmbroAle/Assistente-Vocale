import Server from "./server/instance";

const server : Server = new Server(8000);
server.start();