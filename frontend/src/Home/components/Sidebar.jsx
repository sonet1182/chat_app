import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

function Sidebar() {
  const { authUser } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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
  });

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
    setSelectedUserId(user._id);
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

      <div className="divider px-3"></div>

      {searchUser?.length > 0 ? (
        <div></div>
      ) : (
        <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
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
                {chatUser.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                      selectedUserId === user?._id ? "bg-sky-700" : ""
                    }`}
                  >
                    <div className="avater">
                      <div className="w-12 h-12 rounded-full">
                        <img src={user.profilepic} alt="user image" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-bold text-gray-950">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
