import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    onSnapshot,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import Message from "./Message";
import SendMessage from "./SendMessage";
import "../styles/Chat.css";
import { BsArrowLeftShort } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Chat() {
    const { currentUser } = useAuth();
    const { state } = useLocation();
    const { chatId, chatPartner } = state;

    const [messages, setMessages] = useState([]);
    const [chatPartnerName, setChatPartnerName] = useState("");
    const [chatPartnerSurname, setChatPartnerSurname] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        let unsubscribe;

        async function getMessages() {
            const chatPartnerData = query(
                collection(db, "users"),
                where("userId", "==", chatPartner)
            );

            await getDocs(chatPartnerData).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    setChatPartnerName(doc.data().name);
                    setChatPartnerSurname(doc.data().surname);
                });
            });

            const databaseQuery = query(
                collection(db, "messages"),
                where("chatId", "==", chatId)
            );

            unsubscribe = onSnapshot(databaseQuery, (querySnapshot) => {
                setMessages([]);
                querySnapshot.forEach((doc) => {
                    setMessages((oldArray) =>
                        [
                            ...oldArray,
                            { messageId: doc.id, ...doc.data() },
                        ].sort(function (a, b) {
                            return a.date - b.date;
                        })
                    );
                });
            });
        }

        getMessages();

        return () => {
            setMessages([]);
            setChatPartnerName("");
            setChatPartnerSurname("");

            return unsubscribe;
        };
    }, []);

    return (
        <div className="Chat">
            <div className="chatNavigation">
                <div
                    onClick={() => navigate("/chats")}
                    className="backButtonContainer"
                >
                    <BsArrowLeftShort />
                </div>
                <div className="chatDescription">
                    {chatPartnerName} {chatPartnerSurname}
                </div>
            </div>
            <div className="messages">
                <>
                    {messages.length > 0
                        ? messages.map((message) => {
                              let componentType;
                              if (message.sender === currentUser.uid) {
                                  componentType = "sender";
                              } else {
                                  componentType = "reciever";
                              }

                              return (
                                  <Message
                                      key={message.messageId}
                                      text={message.text}
                                      componentType={componentType}
                                  />
                              );
                          })
                        : null}
                </>
            </div>
            <SendMessage />
        </div>
    );
}

export default Chat;
