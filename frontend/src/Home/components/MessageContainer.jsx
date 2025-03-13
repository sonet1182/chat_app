import React, { useEffect, useRef, useState } from "react";
import userConversations from "../../zustand/useConversations";
import { useAuth } from "../../context/AuthContext";
import { TiMessage } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/socketContext";
import notify from "../../assets/notification.wav"

function MessageContainer({ onBackUser }) {
  const {
    messages,
    selectedConversation,
    setMessages,
    setSelectedConversation,
  } = userConversations();
  const { authUser } = useAuth();
  const [sendData, setSendData] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const lastMessageRef = useRef();
  const {socket} = useSocketContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("new message", newMessage);
      
      // Check if the new message belongs to the currently selected conversation
      if (newMessage.senderId === selectedConversation?._id) {
        const sound = new Audio(notify);
        sound.play();
        
        setMessages([...messages, newMessage]);
      }
    });
  
    return () => {
      socket?.off("newMessage");
    };
  }, [socket, setMessages, messages, selectedConversation]);
  

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView(
        {
          behavior: "smooth",
        },
        100
      );
    });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = get.data;
        if (data.success === false) {
          setLoading(false);
        }
        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setMessages([]);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  const handleMessage = (e) => {
    setSendData(e.target.value);
  };

  const handleSbmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const send = await axios.post(`/api/message/send/${selectedConversation?._id}`, {message: sendData});
      const data = send.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setMessages([...messages, data]);
      e.target.reset();
      setSendData('');
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="md:min-w-[500px] h-[99%] flex flex-col py-2">
      {selectedConversation === null ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-white-950 font-semibold flex flex-col items-center justify-center">
            <p className="text-2x">
              Welcome!! 🤞{" "}
              <span className="text-yellow-500">{authUser?.username} 😊</span>
            </p>
            <p className="text-lg">Select a chat to start Messaging</p>
            <TiMessage className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="md:hidden ml-1 self-center">
                <button
                  onClick={() => onBackUser(true)}
                  className="bg-white px-2 py-1 self-center rounded-full text-gray-950"
                >
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center">
                  <img
                    src={selectedConversation?.profilepic}
                    alt="profile"
                    className="w-6 h-6 rounded-full md:w-10 md:h-10 cursor-pointer"
                  />
                </div>
                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                <div className="loading loading-spinner"></div>
              </div>
            )}

            {!loading && messages?.length == 0 && (
              <p className="text-center text-white items-center">
                Send a message to start Conversation
              </p>
            )}

            {!loading &&
              messages?.length > 0 &&
              messages?.map((message) => (
                <div
                  className="text-white"
                  key={message?._id}
                  ref={lastMessageRef}
                >
                  <div
                    className={`chat ${
                      message.senderId == authUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avater"></div>
                    <div
                      className={`chat-bubble ${
                        message.senderId == authUser._id ? "bg-sky-600" : ""
                      }`}
                    >
                      {message?.message}
                    </div>
                    <div className="chat-footer text-[10px] opacity-80">
                      {new Date(message?.createdAt).toLocaleTimeString("en-BN", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })} &nbsp;
                      {new Date(message?.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <form onSubmit={handleSbmit} className="rounded-full text-black">
            <div className="w-full rounded-full flex items-center bg-white">
              <input value={sendData} onChange={handleMessage} required id="message" type="text" className="w-full bg-transparent outline-none px-4 rounded-full"/>
              <button type="submit">
                {sending ? <div className="loading loading-spinner"></div> : <IoSend size={20} className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"/>}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default MessageContainer;
