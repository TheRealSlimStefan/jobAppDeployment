import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import "../styles/SendMessage.css";
import { GrSend } from "react-icons/gr";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

function SendMessage() {
    const [message, setMessage] = useState("");
    const { currentUser } = useAuth();
    const { state } = useLocation();
    const { chatId } = state;

    async function sendMessage() {
        let messageObject = {
            chatId: chatId,
            date: Date.now(),
            sender: currentUser.uid,
            text: message,
        };
        setMessage("");

        await addDoc(collection(db, "messages"), messageObject);
    }

    return (
        <div className="SendMessage">
            <div className="textAreaContainer">
                <textarea
                    placeholder="Message..."
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <button onClick={sendMessage}>
                <GrSend />
            </button>
        </div>
    );
}

export default SendMessage;
