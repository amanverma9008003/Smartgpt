import React from'react'
import './App.css'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import {MyContext} from './MyContext.jsx'
import { useState } from 'react'
import {v1 as uuid} from "uuid";


function App() {
  const [prompt,setPrompt]=useState("");
  const [reply,setReply]=useState("");
  const [currentThreadId, setCurrentThreadId] = React.useState(uuid());
  const [prevChats,setPrevChats]=useState([]);
  const [newChat,setNewChat]=useState(true);
  const [allThreads,setAllThreads]=useState([]);

  const providerValue={
    prompt,
    setPrompt,
    reply,
    setReply,
    currentThreadId, setCurrentThreadId,
    newChat,setNewChat,
    prevChats,setPrevChats,
    allThreads,setAllThreads
  };

  return (
    <div className="main">
      <MyContext.Provider value={providerValue}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App
