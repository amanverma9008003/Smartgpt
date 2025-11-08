import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import React, { useContext, useState } from "react";
import { SyncLoader } from "react-spinners";
import {SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function ChatWindow() {
    ////`${API_URL}/api/threads`
    const API_URL = "https://smartgpt-y0kw.onrender.com/api";
    const { prompt, setPrompt, setReply, currentThreadId, setNewChat, setPrevChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const showid=()=>{
        setIsOpen(!isOpen);
    }
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const extractText = (item) => {
        if (item == null) return "";
        if (typeof item === "string") return item;
        if (typeof item === "object") {
            // common shapes
            if (typeof item.content === "string") return item.content;
            if (typeof item.text === "string") return item.text;
            if (typeof item.message === "string") return item.message;
            // OpenAI-like choices/messages
            if (Array.isArray(item.choices) && item.choices.length) {
                const ch = item.choices[0];
                return extractText(ch.message ?? ch.delta ?? ch);
            }
            if (item.message && typeof item.message === "object") {
                // message: { content: "..." } or message: { text: "..." }
                return extractText(item.message.content ?? item.message.text ?? item.message);
            }
            // fallback: if object contains nested content-like fields
            for (const key of ["content","text","message","body","result"]) {
                if (key in item) {
                    const v = extractText(item[key]);
                    if (v) return v;
                }
            }
        }
        return "";
    };

    const getReply = async () => {
        if (!prompt || !prompt.trim()) return;
        setLoading(true);
        setNewChat(false);

        const userMessage = prompt;
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: userMessage,
                Id: currentThreadId
            })
        };

        try {
            const response = await fetch(`${API_URL}/chat`, options);
            const data = await response.json();
            /* console.log("raw response:", data); */

            // normalize assistant text when data.reply is an array of objects
            let assistantText = "";

            const replyPayload = data.reply ?? data; // prefer data.reply, fallback to data
            if (Array.isArray(replyPayload)) {
                // find the most recent assistant object
                const lastAssistant = [...replyPayload].reverse().find(i => (i && i.role && i.role.toLowerCase() === "assistant") || (i && ("content" in i || "text" in i || "message" in i)));
                assistantText = extractText(lastAssistant ?? replyPayload[replyPayload.length - 1]);
            } else {
                assistantText = extractText(replyPayload);
            }

            // Append user + assistant as plain text
            setPrevChats(prev => ([
                ...prev,
                { role: "user", content: userMessage },
                { role: "assistant", content: assistantText }
            ]));

            setReply(assistantText);
            setPrompt("");
        } catch (err) {
            console.log("Error in fetching reply:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-window">
            <div className="navbar">
                <span>SmartGpt <i className="fa-solid fa-chevron-down"></i></span>
                <div className="auth-container" onMouseEnter={showid}>
                    <SignedOut>
                        <SignInButton mode="modal" />
                    </SignedOut>
                    
                    <SignedIn>
                        <div className="profile-container">
                            <div className="userIconDiv" onClick={toggleDropdown}>
                                <UserButton />
                            </div>
                        </div>
                    </SignedIn>
                </div>
            </div>


            <Chat />
            {loading && (
                <div className="loaderOverlay">
                    <SyncLoader color="white" loading={loading} size={10} />
                </div>
            )}

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask Anything" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && getReply()}></input>
                    <div id="submit" className="sendIcon" onClick={getReply}>
                        <span><i className="fa-solid fa-paper-plane"></i></span>
                    </div>
                </div>
                <p className="info">
                    Smartgpt can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
            
        </div>
    )
};

export default ChatWindow;

