import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Error from "./Error";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

function Register() {
    let navigate = useNavigate();
    const { register } = useAuth();

    let [name, setName] = useState("");
    let [surname, setSurname] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [repeatedPassword, setRepeatedPassword] = useState("");
    let [accountType, setAccountType] = useState("employee");
    let [loading, setLoading] = useState(false);

    let [error, setError] = useState({ error: false, info: "" });

    function handleNameInput(e) {
        setError({ error: false, info: "" });
        setName(e.target.value);
    }

    function handleSurnameInput(e) {
        setError({ error: false, info: "" });
        setSurname(e.target.value);
    }

    function handleEmailInput(e) {
        setError({ error: false, info: "" });
        setEmail(e.target.value);
    }

    function handlePasswordInput(e) {
        setError({ error: false, info: "" });
        setPassword(e.target.value);
    }

    function handleRepeatedPasswordInput(e) {
        setError({ error: false, info: "" });
        setRepeatedPassword(e.target.value);
    }

    function handleRadioButtonInput(e) {
        setError({ error: false, info: "" });
        setAccountType(e.target.value);
    }

    async function registerNewUser() {
        setError({ error: false, info: "" });

        if (name.length === 0)
            setError({
                error: true,
                info: "Pole imie nie może być puste!",
            });
        else if (surname.length === 0)
            setError({
                error: true,
                info: "Pole nazwisko nie może być puste!",
            });
        else if (email.length === 0)
            setError({
                error: true,
                info: "Pole email nie może być puste!",
            });
        else if (password.length === 0)
            setError({
                error: true,
                info: "Pole hasło nie może być puste!",
            });
        else if (password.length < 6)
            setError({
                error: true,
                info: "Hasło musi mieć przynajmniej 6 znaków!",
            });
        else if (password !== repeatedPassword)
            setError({
                error: true,
                info: "Hasła nie są takie same!",
            });
        else {
            try {
                setLoading(true);

                const registeredUser = await register(email, password);

                const userObject = {
                    userId: registeredUser.user.uid,
                    name: name,
                    surname: surname,
                    accountType: accountType,
                    description: "",
                    imageUrl: "",
                    occupation: "",
                    technologies: [],
                    experience: "",
                    localization: "",
                    workingHours: "",
                };

                console.log(userObject);

                // await addDoc(collection(db, "users"), userObject);

                await setDoc(
                    doc(db, "users", registeredUser.user.uid),
                    userObject
                );

                navigate("/");
            } catch {
                setError({
                    error: true,
                    info: "Nie udało się stworzyć konta...",
                });
            }
            setLoading(false);

            return () => {
                setLoading(false);
                setName("");
                setSurname("");
                setEmail("");
                setPassword("");
                setRepeatedPassword("");
                setAccountType("employee");
            };
        }
    }

    return (
        <div className="Register">
            <div className="registerPanel">
                <h2>Zarejestruj się</h2>
                <div className="inputContainer">
                    <input
                        placeholder="imie..."
                        value={name}
                        onChange={(e) => handleNameInput(e)}
                        type="text"
                    />
                </div>
                <div className="inputContainer">
                    <input
                        placeholder="nazwisko..."
                        value={surname}
                        onChange={(e) => handleSurnameInput(e)}
                        type="text"
                    />
                </div>
                <div className="inputContainer">
                    <input
                        placeholder="email..."
                        value={email}
                        onChange={(e) => handleEmailInput(e)}
                        type="email"
                    />
                </div>
                <div className="inputContainer">
                    <input
                        placeholder="hasło..."
                        value={password}
                        onChange={(e) => handlePasswordInput(e)}
                        type="password"
                    />
                </div>
                <div className="inputContainer">
                    <input
                        placeholder="powtórz hasło..."
                        value={repeatedPassword}
                        onChange={(e) => handleRepeatedPasswordInput(e)}
                        type="password"
                    />
                </div>
                <div className="checkboxesContainer">
                    <label htmlFor="employee">
                        <input
                            type="radio"
                            checked={accountType === "employee"}
                            value="employee"
                            onChange={handleRadioButtonInput}
                        />
                        Szukam pracy
                    </label>
                    <label htmlFor="employer">
                        <input
                            type="radio"
                            checked={accountType === "employer"}
                            value="employer"
                            onChange={handleRadioButtonInput}
                        />
                        Szukam pracownika
                    </label>
                </div>
                <Error error={error.error} info={error.info} />
                <div className="buttonsContainer">
                    <button
                        disabled={loading}
                        className="registerButton"
                        onClick={() => registerNewUser()}
                    >
                        Zarejestruj się
                    </button>
                    <button
                        className="backButton"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Wróć
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
