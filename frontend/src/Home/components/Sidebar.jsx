import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { IoArrowBackSharp, IoBackspaceSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import userConversations from "../../zustand/useConversations.js";
import { useSocketContext } from "../../context/socketContext.jsx";

function Sidebar({ onSelectUser }) {
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = userConversations();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);

  //Chats Functions
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chat = await axios.get("/api/user/current_chatters");
        const data = chat.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    chatUserHandler();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handleLogout = async () => {
    const confirmLogout = window.prompt("Type 'Username' to Logout");

    if (confirmLogout == authUser.username) {
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data.success === false) {
          console.log(data.message);
        }
        toast.info("You are logout!");
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        Navigate("/login");
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Invalid Username");
    }
  };

  return (
    <div className="h-full w-auto px-1">
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handleSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full p-1"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search User"
            className="px-4 w-auto bg-transparent outline-none rounded-full text-black"
          />
          <button
            type="submit"
            className="btn btn-circle bg-sky-700 border-none hover:bg-sky-950 scale-105"
          >
            <FaSearch />
          </button>
        </form>
        <img
          onClick={() => Navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          alt=""
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer"
        />
      </div>

      <div className="divider divide-solid px-3 h-[1px]"></div>

      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[85%] max-h-[80%] m overflow-y-auto scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 cursor-pointer ${
                      selectedUserId === user?._id ? "bg-sky-700" : ""
                    }`}
                  >
                    <div
                      className={`avatar ${
                        isOnline[index] ? "avatar-online" : ""
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full">
                        <img src={user.profilepic} alt="user image" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-white-950">
                        {user.username}
                      </p>
                    </div>
                  </div>

                  <div className="divider divide-solid px-3 h-[1px]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={() => handleSearchBack()}
              className="bg-white text-sky-700 rounded-full px-2 py-1 self-center"
            >
              <IoArrowBackSharp size={25} className="cursor-pointer text-2xl" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[85%] max-h-[80%] m overflow-y-auto scrollbar">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>Why are you alone!</h1>
                    <h1>Search username to chat</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handleUserClick(user)}
                        className={`flex gap-3 items-center rounded p-2 cursor-pointer ${
                          selectedUserId === user?._id ? "bg-sky-700" : ""
                        }`}
                      >
                        <div
                          className={`avatar ${
                            isOnline[index] ? "avatar-online" : ""
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full">
                            <img src={user.profilepic} alt="user image" />
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="font-bold text-white-950">
                            {user.username}
                          </p>
                        </div>
                        <div>
                          {newMessageUsers.receiverId === authUser._id &&
                            newMessageUsers.senderId === user._id && (
                              <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                                +1
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="divider divide-solid px-3 h-[1px]"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-auto px-1 py-1 flex">
            <button
              className="hover:bg-red-600 px-1 cursor-pointer hover:scale-105 text-white rounded-lg"
              onClick={handleLogout}
            >
              <div className="flex gap-2">
                <BiLogOut size={25} />
                <p className="text-sm py-1">Logout</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
