import "./Chat.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
function Chat() {
    const { newChat, prevChats } = useContext(MyContext);
    const chats = Array.isArray(prevChats) ? prevChats : [];

    const extractContent = (c) => {
        if (c == null) return "";
        if (typeof c === "string") return c;
        if (typeof c === "object") {
            if (typeof c.content === "string") return c.content;
            if (typeof c.text === "string") return c.text;
            if (typeof c.message === "string") return c.message;
            if (c.message && typeof c.message === "object") return extractContent(c.message);
            if (Array.isArray(c.choices) && c.choices.length) {
                const ch = c.choices[0];
                return extractContent(ch.message ?? ch.delta ?? ch);
            }
        }
        return "";
    };

    return (
        <>
            {newChat && <h1>Start a new Chat</h1>}
            <div className="chats">
                {chats.length === 0 ? (
                    <p className="info">No messages yet</p>
                ) : (
                    chats.map((chat, index) => {
                        const key = chat._id ?? chat.timestamp ?? index;
                        const text = extractContent(chat.content);
                        return (
                            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={key}>
                                {chat.role === "user" ? (
                                    <p className="userMsg">{text}</p>
                                ) : (
                                    // ensure we pass a string to ReactMarkdown
                                    <div className="gptMsg">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]} children={text} />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

export default Chat;