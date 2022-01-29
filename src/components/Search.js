import "../styles/Search.css";
import { useAuth } from "../contexts/AuthContext";
import profileImg from "../images/default_image.png";
import { IoLocationSharp } from "react-icons/io5";
import { GiSkills } from "react-icons/gi";
import { MdWork } from "react-icons/md";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { CgArrowLeft, CgArrowRight } from "react-icons/cg";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    getDoc,
    getDocs,
    doc,
    updateDoc,
} from "firebase/firestore";

function Search() {
    const { currentUser } = useAuth();

    const [offers, setOffers] = useState([]);
    const [offersIndex, setOffersIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [currentUserData, setCurrentUserData] = useState({
        name: "",
        surname: "",
        technologies: [],
        experience: "",
        localization: "",
        workingHours: "",
    });

    const acceptOffer = async () => {
        let databaseQuery;

        if (offers[offersIndex].accountType === "employer") {
            databaseQuery = query(
                collection(db, "chats"),
                where("employerId", "==", offers[offersIndex].userId),
                where("employeeId", "==", currentUser.uid)
            );
        } else {
            databaseQuery = query(
                collection(db, "chats"),
                where("employeeId", "==", offers[offersIndex].userId),
                where("employerId", "==", currentUser.uid)
            );
        }

        const querySnapshot = await getDocs(databaseQuery);

        if (querySnapshot.docs.length > 0) {
            if (offers[offersIndex].accountType === "employer") {
                const offerDoc = doc(db, "chats", querySnapshot.docs[0].id);
                const newFields = { employeeAgreed: "true" };
                await updateDoc(offerDoc, newFields);
            } else {
                const offerDoc = doc(db, "chats", querySnapshot.docs[0].id);
                const newFields = { employerAgreed: "true" };
                await updateDoc(offerDoc, newFields);
            }
        } else {
            if (offers[offersIndex].accountType === "employer") {
                await addDoc(collection(db, "chats"), {
                    employerId: offers[offersIndex].userId,
                    employeeId: currentUser.uid,
                    employeeAgreed: "true",
                    employerAgreed: "null",
                });
            } else {
                await addDoc(collection(db, "chats"), {
                    employerId: currentUser.uid,
                    employeeId: offers[offersIndex].userId,
                    employeeAgreed: "null",
                    employerAgreed: "true",
                });
            }
        }

        if (offersIndex < offers.length)
            setOffersIndex((prevCount) => prevCount + 1);
    };

    const rejectOffer = async () => {
        let databaseQuery;

        if (offers[offersIndex].accountType === "employer") {
            databaseQuery = query(
                collection(db, "chats"),
                where("employerId", "==", offers[offersIndex].userId),
                where("employeeId", "==", currentUser.uid)
            );
        } else {
            databaseQuery = query(
                collection(db, "chats"),
                where("employeeId", "==", offers[offersIndex].userId),
                where("employerId", "==", currentUser.uid)
            );
        }

        const querySnapshot = await getDocs(databaseQuery);

        if (querySnapshot.docs.length > 0) {
            if (offers[offersIndex].accountType === "employer") {
                const offerDoc = doc(db, "chats", querySnapshot.docs[0].id);
                const newFields = { employeeAgreed: "false" };
                await updateDoc(offerDoc, newFields);
            } else {
                const offerDoc = doc(db, "chats", querySnapshot.docs[0].id);
                const newFields = { employerAgreed: "false" };
                await updateDoc(offerDoc, newFields);
            }
        } else {
            if (offers[offersIndex].accountType === "employer") {
                await addDoc(collection(db, "chats"), {
                    employerId: offers[offersIndex].userId,
                    employeeId: currentUser.uid,
                    employeeAgreed: "false",
                    employerAgreed: "null",
                });
            } else {
                await addDoc(collection(db, "chats"), {
                    employerId: currentUser.uid,
                    employeeId: offers[offersIndex].userId,
                    employeeAgreed: "null",
                    employerAgreed: "false",
                });
            }
        }

        if (offersIndex < offers.length)
            setOffersIndex((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        setLoading(true);
        setOffers([]);

        let unsubscribe;

        async function getOffers() {
            let databaseQuery;
            const dontWantThisOffers = [];

            const userDataQuery = await getDoc(
                doc(db, "users", currentUser.uid)
            );
            const userData = userDataQuery.data();
            setCurrentUserData(userDataQuery.data());

            if (userData.accountType === "employer") {
                databaseQuery = query(
                    collection(db, "chats"),
                    where("employerId", "==", currentUser.uid),
                    where("employerAgreed", "!=", "null")
                );
            } else {
                databaseQuery = query(
                    collection(db, "chats"),
                    where("employeeId", "==", currentUser.uid),
                    where("employeeAgreed", "!=", "null")
                );
            }

            const acceptedOrRejectedOffers = await getDocs(databaseQuery);

            if (userData.accountType === "employer") {
                acceptedOrRejectedOffers.forEach((doc) => {
                    dontWantThisOffers.push(doc.data().employeeId);
                });
            } else {
                acceptedOrRejectedOffers.forEach((doc) => {
                    dontWantThisOffers.push(doc.data().employerId);
                });
            }

            if (userData.accountType === "employer") {
                databaseQuery = query(
                    collection(db, "users"),
                    where("accountType", "==", "employee"),
                    where("experience", "==", userData.experience),
                    where("localization", "==", userData.localization),
                    where("occupation", "==", userData.occupation),
                    where("workingHours", "==", userData.workingHours)
                );
            } else {
                databaseQuery = query(
                    collection(db, "users"),
                    where("accountType", "==", "employer"),
                    where("experience", "==", userData.experience),
                    where("localization", "==", userData.localization),
                    where("occupation", "==", userData.occupation),
                    where("workingHours", "==", userData.workingHours)
                );
            }

            unsubscribe = onSnapshot(databaseQuery, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let dontWantThisOffer = false;
                    dontWantThisOffers.forEach((offer) => {
                        if (doc.id === offer) dontWantThisOffer = true;
                    });
                    console.log(dontWantThisOffer);
                    if (!dontWantThisOffer) {
                        setOffers((oldArray) => [
                            ...oldArray,
                            {
                                userId: doc.id,
                                ...doc.data(),
                            },
                        ]);
                    }
                    setLoading(false);
                });
            });
        }
        getOffers();

        return unsubscribe;
    }, []);

    if (offersIndex === -1) setOffersIndex((prevCount) => prevCount + 1);

    return (
        <div className="Search">
            {loading === false &&
            (currentUserData.experience === "" ||
                currentUserData.description === "" ||
                currentUserData.localization === "" ||
                currentUserData.occupation === "" ||
                currentUserData.technologies.length === 0 ||
                currentUserData.workingHours === "") ? (
                <div className="loading">
                    Uzupełnij profil aby wyświetlić oferty...
                </div>
            ) : (
                <>
                    {offersIndex !== -1 &&
                    offers.length > 0 &&
                    offersIndex < offers.length ? (
                        <>
                            <div className="imageContainer">
                                <img
                                    src={
                                        offers[offersIndex].imageUrl === ""
                                            ? profileImg
                                            : offers[offersIndex].imageUrl
                                    }
                                    alt=""
                                />
                            </div>
                            <div className="infoContainer">
                                <p>
                                    {offers[offersIndex].name}{" "}
                                    {offers[offersIndex].surname}
                                </p>
                                <p>
                                    {offers[offersIndex].accountType ===
                                    "employer"
                                        ? `STANOWISKO: ${offers[offersIndex].occupation}`
                                        : `${offers[offersIndex].occupation}`}
                                </p>
                            </div>
                            <div className="moreInfoContainer">
                                <div className="moreInfoElement">
                                    <h2>
                                        {currentUserData.accountType ===
                                        "employee"
                                            ? "O FIRMIE"
                                            : "O MNIE"}
                                    </h2>
                                    <p>{offers[offersIndex].description}</p>
                                </div>
                                <div className="moreInfoElement">
                                    <h2>
                                        {currentUserData.accountType ===
                                        "employee"
                                            ? "WYMAGANE TECHNOLOGIE"
                                            : "TECHNOLOGIE"}
                                    </h2>
                                    <div className="technologiesContainer">
                                        {offers[offersIndex].technologies.map(
                                            (technology) => (
                                                <div className="technology">
                                                    {technology}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="moreInfoElement">
                                    <h2>
                                        {currentUserData.accountType ===
                                        "employee"
                                            ? "WYMAGANE DOŚWIADCZENIE"
                                            : "DOŚWIADCZENIE"}
                                    </h2>
                                    <div className="skillLevelContainer">
                                        <GiSkills />{" "}
                                        <p>{offers[offersIndex].experience}</p>
                                    </div>
                                </div>
                                <div className="moreInfoElement">
                                    <h2>
                                        {currentUserData.accountType ===
                                        "employee"
                                            ? "WYMAGANA LOKALIZACJA"
                                            : "LOKALIZACJA"}
                                    </h2>
                                    <div className="locationContainer">
                                        <IoLocationSharp />{" "}
                                        <p>
                                            {offers[offersIndex].localization}
                                        </p>
                                    </div>
                                </div>
                                <div className="moreInfoElement">
                                    <h2>
                                        {currentUserData.accountType ===
                                        "employee"
                                            ? "WYMAGANY WYMIAR PRACY"
                                            : "WYMIAR PRACY"}
                                    </h2>
                                    <div className="hoursOfWorkContainer">
                                        <MdWork />{" "}
                                        <p>
                                            {offers[offersIndex].workingHours}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="loading">Brak ofert...</div>
                    )}
                </>
            )}
            <div className="navbarAddicionalContent">
                <button className="reject" onClick={() => rejectOffer()}>
                    {/* <AiOutlineArrowLeft /> */}
                    <CgArrowLeft />
                </button>
                <button className="accept" onClick={() => acceptOffer()}>
                    {/* <AiOutlineArrowRight /> */}
                    <CgArrowRight />
                </button>
            </div>
        </div>
    );
}

export default Search;

//potrzebna optymalizacja
// if (userData.accountType === "employer") {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employee"),
//         where("description", "==", "")
//     );
// } else {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employer"),
//         where("description", "==", "")
//     );
// }

// const emptyDescriptionProfiles = await getDocs(databaseQuery);

// if (userData.accountType === "employer") {
//     emptyDescriptionProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// } else {
//     emptyDescriptionProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// }

// if (userData.accountType === "employer") {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employee"),
//         where("experience", "==", "")
//     );
// } else {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employer"),
//         where("experience", "==", "")
//     );
// }

// const emptyExperienceProfiles = await getDocs(databaseQuery);

// if (userData.accountType === "employer") {
//     emptyExperienceProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// } else {
//     emptyExperienceProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// }

// if (userData.accountType === "employer") {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employee"),
//         where("localization", "==", "")
//     );
// } else {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employer"),
//         where("localization", "==", "")
//     );
// }

// const emptyLocalizationProfiles = await getDocs(databaseQuery);

// if (userData.accountType === "employer") {
//     emptyLocalizationProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// } else {
//     emptyLocalizationProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// }

// if (userData.accountType === "employer") {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employee"),
//         where("occupation", "==", "")
//     );
// } else {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employer"),
//         where("occupation", "==", "")
//     );
// }

// const emptyOccupationProfiles = await getDocs(databaseQuery);

// if (userData.accountType === "employer") {
//     emptyOccupationProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// } else {
//     emptyOccupationProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// }

// if (userData.accountType === "employer") {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employee"),
//         where("technologies", "==", [])
//     );
// } else {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employer"),
//         where("technologies", "==", [])
//     );
// }

// const emptyTechnologiesProfiles = await getDocs(databaseQuery);

// if (userData.accountType === "employer") {
//     emptyTechnologiesProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().employeeId);
//     });
// } else {
//     emptyTechnologiesProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().employerId);
//     });
// }

// if (userData.accountType === "employer") {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employee"),
//         where("workingHours", "==", "")
//     );
// } else {
//     databaseQuery = query(
//         collection(db, "users"),
//         where("accountType", "==", "employer"),
//         where("workingHours", "==", "")
//     );
// }

// const emptyWorkingHoursProfiles = await getDocs(databaseQuery);

// if (userData.accountType === "employer") {
//     emptyWorkingHoursProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// } else {
//     emptyWorkingHoursProfiles.forEach((doc) => {
//         dontWantThisOffers.push(doc.data().userId);
//     });
// }
