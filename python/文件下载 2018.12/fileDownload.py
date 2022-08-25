from tkinter import *
from tkinter.messagebox import *
from tkinter import ttk

import fileDownload_client, threading

root = Tk()
root.title("藿香文件下载")
width = 400
height = 250
screenwidth = root.winfo_screenwidth()  
screenheight = root.winfo_screenheight() 
alignstr = '%dx%d+%d+%d' % (width, height, (screenwidth-width)/2, (screenheight-height)/2)
root.geometry(alignstr) 
root.resizable(width=False,height=False) 
#root.attributes("-alpha", 0.95) #窗口透明


class fileDownloadPage(Frame):
    def __init__(self):
        super().__init__()
        #开启子线程，下载文件
        deal_Thread = threading.Thread(target = self.deal)
        deal_Thread.start()
       	self.serverMode = StringVar() 
        self.srcfile = StringVar() 
        self.dstfile = StringVar() 
        self.download()


    def download(self):    
        #Label(root, text = "可下载文件列表").grid(row=0,column=0, columnspan=3, pady=5)  

        #self.messageList = Text(root, width=60, height=35, borderwidth=4, state="disabled")
        #self.messageList.grid(row=1, columnspan=3, rowspan=8)

        Label(root, text = "服务器模式").grid(row=2, column=3, pady=25, padx=35, sticky=W)
        serverModelist = ttk.Combobox(root, width=21, textvariable=self.serverMode)
        serverModelist["values"]=("单线程","多线程","select","asyncio")  
        serverModelist.current(0)  #选择第一个  
        serverModelist.grid(row=2, column=4, sticky=E, padx=9)

        Label(root, text = "源文件名").grid(row=3, column=3, pady=5, padx=35, sticky=W)
        srcfileEntry = Entry(root, textvariable=self.srcfile, width=30).grid(row=3, column=4, pady=5)
        Label(root, text = "目标文件名").grid(row=4, column=3, pady=5, padx=35, sticky=W)
        dstfileEntry = Entry(root, textvariable=self.dstfile, width=30).grid(row=4, column=4, pady=20)

        Button(root, text="下载", command=self.send, width=35).grid(row=5, column=3, columnspan=3, padx=70, pady=10)


    def send(self):
        serverMode = self.serverMode.get()
        srcfile = self.srcfile.get()
        dstfile = self.dstfile.get()
        if srcfile == "":
            showinfo(title="error", message="source filename can not be empty")
        elif dstfile == "":
            showinfo(title="error", message="destination filename can not be empty")
        else:
            if serverMode in ["单线程","多线程","select","asyncio"]:
                flag = fileDownload_client.sendsrcfile(serverMode, srcfile, dstfile)
                if flag == "True":
                    showinfo(title="downloading", message="download {}, send request successfully".format(srcfile))
                else:
                    showinfo(title="error", message="fail to connect server")
                    showinfo(title="error", message="current window will be closed")
                    root.destroy()
            else:
                showinfo(title="error", message="please choose serverMode from the list")
            

    #下载文件线程
    def deal(self):
        while True: 
            data = fileDownload_client.recvData()
            if data["success"] == "true" :
                fileDownload_client.client_download(data["dstfile"], data["content"])
                showinfo(title="success", message="File {} is download to {} successfully".format(data["srcfile"], data["dstfile"]))
            elif data["success"] == "false":
                showinfo(title="error", message=data["error"])



def callback():
    try:
        fileDownload_client.sendOffline()
    except:
        showinfo(title="error", message="fail to connect server")
        showinfo(title="error", message="current window will be closed")
    root.destroy()


fileDownloadPage()

root.protocol("WM_DELETE_WINDOW", callback)
root.mainloop()
