import "../styles/Chats.css";
import ChatLabel from "./ChatLabel";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    getDoc,
    doc,
} from "firebase/firestore";
import "../styles/Chat.css";
import { useAuth } from "../contexts/AuthContext";

function Chats() {
    const [chats, setChats] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        setChats([]);

        let unsubscribe;

        async function getChats() {
            let databaseQuery;

            const userDataQuery = await getDoc(
                doc(db, "users", currentUser.uid)
            );
            const userData = userDataQuery.data();

            if (userData.accountType === "employer") {
                databaseQuery = query(
                    collection(db, "chats"),
                    where("employerId", "==", currentUser.uid),
                    where("employerAgreed", "==", "true"),
                    where("employeeAgreed", "==", "true")
                );
            } else {
                databaseQuery = query(
                    collection(db, "chats"),
                    where("employeeId", "==", currentUser.uid),
                    where("employerAgreed", "==", "true"),
                    where("employeeAgreed", "==", "true")
                );
            }

            unsubscribe = onSnapshot(databaseQuery, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().employeeId === currentUser.uid) {
                        setChats((oldArray) => [
                            ...oldArray,
                            {
                                chatId: doc.id,
                                chatPartner: doc.data().employerId,
                                ...doc.data(),
                            },
                        ]);
                    } else if (doc.data().employerId === currentUser.uid) {
                        setChats((oldArray) => [
                            ...oldArray,
                            {
                                chatId: doc.id,
                                chatPartner: doc.data().employeeId,
                                ...doc.data(),
                            },
                        ]);
                    }
                });
            });
        }
        getChats();

        return unsubscribe;
    }, []);

    return (
        <div className="Chats">
            <div className="chatsPanel">
                <h2>Wiadomości</h2>
                <div className="chatLabelsContainer">
                    {chats.length > 0
                        ? chats.map((chat) => (
                              <ChatLabel
                                  key={chat.chatId}
                                  employeeId={chat.employeeId}
                                  employerId={chat.employerId}
                                  chatPartner={chat.chatPartner}
                                  chatId={chat.chatId}
                              />
                          ))
                        : null}
                </div>
            </div>
        </div>
    );
}

export default Chats;

// const databaseQuery = query(
//     collection(db, "users"),
//     where("userId", "==", user.uid)
// );
// const querySnapshot = await getDocs(databaseQuery);
// querySnapshot.forEach((doc) => {
//     console.log(doc.data());
//     setCurrentUserData(doc.data());
// });

//const messagesCollection = collection(db, "messages");

// await getDocs(messagesCollection).then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         console.log(doc.data());
//         setMessages((oldArray) => [...oldArray, doc.data()]);
//     });

// console.log(
//     snapshot.docs.forEach((doc) => {
//         setMessages(...messages, { id: doc.id, ...doc.data() });
//     })
//     //_document.data.value.map.value.fields.text.stringValue
// );
//});

// const queryResponse = await getDocs(databaseQuery);
// queryResponse.forEach((doc) => {
//     console.log(doc.data().employeeId);
//     console.log(doc.data().employerId);

//     if (doc.data().employeeId === currentUser.uid) {
//         setChats((oldArray) => [
//             ...oldArray,
//             {
//                 chatId: doc.id,
//                 chatPartner: doc.data().employerId,
//                 ...doc.data(),
//             },
//         ]);
//     } else if (doc.data().employerId === currentUser.uid) {
//         setChats((oldArray) => [
//             ...oldArray,
//             {
//                 chatId: doc.id,
//                 chatPartner: doc.data().employeeId,
//                 ...doc.data(),
//             },
//         ]);
//     }
// });
