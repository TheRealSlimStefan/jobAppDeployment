import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { AiFillSetting } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";
import profileImg from "../images/default_image_original.jpg";
import { IoLocationSharp } from "react-icons/io5";
import { GiSkills } from "react-icons/gi";
import { MdWork } from "react-icons/md";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
    let navigate = useNavigate();
    const { logOut, currentUser } = useAuth();
    const [userData, setUserData] = useState({
        name: "",
        surname: "",
        technologies: [],
        experience: "",
        localization: "",
        workingHours: "",
        imageUrl: "",
    });

    async function logOutUser() {
        await logOut();
        navigate("/login");
    }

    useEffect(() => {
        let unsubscribe;

        async function getUserData() {
            const userDataQuery = await getDoc(
                doc(db, "users", currentUser.uid)
            );

            console.log(userDataQuery.data());
            setUserData(userDataQuery.data());
        }
        getUserData();

        return unsubscribe;
    }, []);

    return (
        <>
            <div className="profile">
                <div className="profileUp">
                    <button
                        className="logoutBtn"
                        onClick={() => {
                            logOutUser();
                        }}
                    >
                        <BiLogOut />
                    </button>
                    <button
                        className="settingsBtn"
                        onClick={() => navigate("/editprofile")}
                    >
                        <AiFillSetting />
                    </button>
                    {userData.imageUrl !== "" ? (
                        <img
                            src={userData.imageUrl}
                            className="profileImg"
                            alt="profile"
                        ></img>
                    ) : (
                        <img
                            src={profileImg}
                            className="profileImg"
                            alt="profile"
                        ></img>
                    )}

                    <p className="name">
                        {userData.name} {userData.surname}
                    </p>
                </div>

                <div className="moreInfoContainer">
                    <div className="moreInfoElement">
                        <h2>
                            {userData.accountType === "employer"
                                ? "O FIRMIE"
                                : "O MNIE"}
                        </h2>
                        <p>{userData.description}</p>
                    </div>
                    <div className="moreInfoElement">
                        <h2>
                            {userData.accountType === "employer"
                                ? "WYMAGANE TECHNOLOGIE"
                                : "TECHNOLOGIE"}
                        </h2>
                        <div className="technologiesContainer">
                            {userData.technologies.length > 0
                                ? userData.technologies.map((technology) => (
                                      <div
                                          key={technology}
                                          className="technology"
                                      >
                                          {technology}
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>
                    <div className="moreInfoElement">
                        <h2>
                            {userData.accountType === "employer"
                                ? "WYMAGANE DOŚWIADCZENIE"
                                : "DOŚWIADCZENIE"}
                        </h2>
                        <div className="skillLevelContainer">
                            <GiSkills /> <p>{userData.experience}</p>
                        </div>
                    </div>
                    <div className="moreInfoElement">
                        <h2>
                            {userData.accountType === "employer"
                                ? "WYMAGANA LOKALIZACJA"
                                : "LOKALIZACJA"}
                        </h2>
                        <div className="locationContainer">
                            <IoLocationSharp /> <p>{userData.localization}</p>
                        </div>
                    </div>
                    <div className="moreInfoElement">
                        <h2>
                            {userData.accountType === "employer"
                                ? "WYMAGANY WYMIAR PRACY"
                                : "WYMIAR PRACY"}
                        </h2>
                        <div className="hoursOfWorkContainer">
                            <MdWork /> <p>{userData.workingHours}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
