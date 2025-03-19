from server.instance import Server

server = Server(port = 5001)

if __name__ == "__main__":
    server.run()