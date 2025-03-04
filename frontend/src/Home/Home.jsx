import React from "react";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { authUser } = useAuth();

  console.log('sonet username', authUser)

  return <div className="text-3xl  text-white">Hi, {authUser?.username}</div>;
}

export default Home;
