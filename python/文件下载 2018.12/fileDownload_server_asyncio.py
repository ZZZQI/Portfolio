#发送数据格式
#{
#   "funSelec": "act/dealerSaid/playerSaid/tc1/tc2/tz1/tz2/coin/silver/gold/ended",
#   "success": "True/False",
#   "money": {"coin":0,"silver":3,"gold":5}
#   "message": "", 
#   "error": "",
#   "fromFriendName":""
#   "changeMoney":-3
#}#


import argparse, socket, json, os, base64, asyncio
import utils

HOST = "127.0.0.1"
PORT = 1060
PATH = "./srcfile/"

def sendJson(sendDataBuf):
    sendDataBuf = json.dumps(sendDataBuf) + "#"
    sendDataBuf = sendDataBuf.encode("ascii")
    return sendDataBuf

    
class ZenServer(asyncio.Protocol):

    def connection_made(self, transport):
        self.transport = transport
        self.address = transport.get_extra_info('peername')
        self.data = ""
        print('Accepted connection from {}'.format(self.address))

    def data_received(self, more):
        try:
            self.data += more.decode("ascii")
        except Exception as e:
            sendDataBuf = { "success": "error", "error": e }
            self.transport.write(sendJson(sendDataBuf))
            self.data = ""

        if more.endswith(b"#"):
            self.data = self.data[0:-1]
            jsonData = json.loads(self.data)
            if ( jsonData["serverMode"] == "asyncio" ):
                sendDataBuf = utils.download(jsonData["srcfile"], jsonData["dstfile"])
                self.transport.write(sendJson(sendDataBuf))
            else:
                sendDataBuf = {"success":"false","error":"this is asyncio server, please choose asyncio server mode"}
                self.transport.write(sendJson(sendDataBuf))
            self.data = ""


    def connection_lost(self, exc):
        if exc:
            print('Client {} error: {}'.format(self.address, exc))
        elif self.data:
            print('Client {} sent {} but then closed'
                  .format(self.address, self.data))
        else:
            print('Client {} closed socket'.format(self.address))


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    address = (HOST, PORT)
    coro = loop.create_server(ZenServer, *address)
    server = loop.run_until_complete(coro)
    print('Listening at {}'.format(address))
    try:
        loop.run_forever()
    finally:
        server.close()
        loop.close()