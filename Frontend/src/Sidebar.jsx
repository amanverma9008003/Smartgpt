import "./Sidebar.css";
import {useContext, useEffect} from "react";
import {MyContext} from "./MyContext.jsx";
import {v1 as uuid} from "uuid";
import { blacklogo } from "./assets/assets.js";
import React from "react";

function Sidebar() {
    const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrentThreadId,setPrevChats}=useContext(MyContext);
    const API_URL = "https://smartgpt-y0kw.onrender.com/api";//`${API_URL}/api/threads`
    useEffect(()=>{
        const getallThreads = async () => {
            try{
                const response = await fetch(`${API_URL}/threads`);
                const data = await response.json();
               //console.log("raw response:", data);
                const filteredData = data.map(thread => ({
                    ThreadId: thread.threadId,
                    title: thread.title
                }));
                setAllThreads(filteredData);
                console.log("filtered threads:", filteredData);
            }
            catch(err){
                console.log("error fetching threads:",err);
            }
        };

        getallThreads();
    },[currThreadId, setAllThreads]);

    const reloading = () => {
        window.location.reload();
    };

    const createNewChat =()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setReply("");
        setPrevChats([]); // clear messages for new chat if desired
        setCurrentThreadId(uuid());
        reloading();
        
    }

    const changeThread= async(threadId)=>{
        setCurrentThreadId(threadId);
        setNewChat(false);
        //console.log("check1",threadId,typeof threadId);
        try{
            //console.log("check2");
            const response = await fetch(`${API_URL}/thread/${threadId}`);
            //console.log("check3");
            const data = await response.json();
            //console.log("fetched thread messages:",data);
            setPrevChats(data);
        }catch(err){
            console.log("error fetching thread messages:",err);
        }
    };
    const deleteThread= async(threadId)=>{
        try{
            const response =await fetch(`${API_URL}/thread/${threadId}`,{
                method:"DELETE"
            }) ;
            if(response.ok){
                console.log("Thread deleted successfully");
                setAllThreads(prevThreads=>prevThreads.filter(thread=>thread.ThreadId!==threadId));
                if(currThreadId===threadId){
                    createNewChat();
                }
            }else{
                console.log("Failed to delete thread");
            }
        }catch(err){
            console.log("error deleting thread:",err);
        }
    };

    return (
    <section className="sidebar">

    <button onClick={createNewChat}>
        <img src={blacklogo} alt="gpt logo" className="logo"></img>
        <span><i className="fa-solid fa-pen"></i></span>
    </button>

    <ul className="history">
            {
                allThreads && allThreads.map(thread => (
                    <li key={thread.ThreadId} onClick={() => changeThread(thread.ThreadId)}
                    className="highlight">{thread.title}
                            <i className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.ThreadId);
                            }}></i>
                    </li>
                ))
            }
    </ul>

    <div className="sign">
        <p>Smart Gpt <i className="fa-brands fa-slack"></i> </p>
    </div>

    </section>
)};

export default Sidebar;