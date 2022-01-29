import "../styles/ChatLabel.css";
import profileImg from "../images/default_image.png";
import { db } from "../firebase";
import React, { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    getDoc,
    doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function ChatLabel({ chatId, chatPartner }) {
    let navigate = useNavigate();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [messages, setMessages] = useState([]);

    function firstMessage() {
        let max = 0;
        let firstMessage;

        messages.forEach((message) => {
            if (message.date > max) {
                max = message.date;
                firstMessage = message.text;
            }
        });

        if (firstMessage.length > 25) {
            firstMessage = firstMessage.substring(0, 25) + "...";
        }

        return firstMessage;
    }

    useEffect(() => {
        let unsubscribe;
        setName("");
        setSurname("");
        setMessages([]);

        async function getUserNameAndSurname() {
            const queryResponse = await getDoc(doc(db, "users", chatPartner));

            setName(queryResponse.data().name);
            setSurname(queryResponse.data().surname);
        }

        async function getMessages() {
            let databaseQuery = query(
                collection(db, "messages"),
                where("chatId", "==", chatId)
            );

            unsubscribe = onSnapshot(databaseQuery, (queryResponse) => {
                setMessages([]);
                queryResponse.forEach((doc) => {
                    setMessages((oldArray) => [
                        ...oldArray,
                        { messageId: doc.id, ...doc.data() },
                    ]);
                });
            });
        }

        getUserNameAndSurname();
        getMessages();
        return unsubscribe;
    }, []);

    return (
        <div
            className="ChatLabel"
            onClick={() =>
                navigate(`/chats/chat/${chatId}`, {
                    state: { chatId, chatPartner },
                })
            }
        >
            <div className="imageContainer">
                <img src={profileImg} className="profileImg" alt="profile" />
            </div>
            <div className="descriptionContainer">
                <p className="contactName">
                    {name} {surname}
                </p>
                <p className="lastMessage">
                    {messages.length > 0
                        ? firstMessage()
                        : "Przywitaj się z nową osobą!"}
                </p>
            </div>
        </div>
    );
}

export default ChatLabel;
