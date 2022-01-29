import "../styles/ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Error from "./Error";

function ForgotPassword() {
    let navigate = useNavigate();
    const { resetPassword } = useAuth();

    let [email, setEmail] = useState("");
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState({ error: false, info: "", style: {} });

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setError({ error: false, info: "" });
    }

    async function resetUserPassword() {
        setError({ error: false, info: "" });

        if (email.length === 0)
            setError({
                error: true,
                info: "Pole email nie może być puste!",
            });
        else {
            try {
                setLoading(true);
                setError({
                    error: true,
                    info: "Sprawdź skrzynkę mailową!",
                    style: { color: "green" },
                });
                await resetPassword(email);
                setTimeout(() => {
                    setError({ error: false, info: "" });
                    navigate("/");
                }, 1000);
            } catch {
                setError({
                    error: true,
                    info: "Nie udało się zresetować hasła!",
                });
            }
            setLoading(false);
        }
    }

    return (
        <div className="ForgotPassword">
            <div className="resetPasswordPanel">
                <h2>Zresetuj hasło</h2>
                <div className="inputContainer">
                    <input
                        placeholder="email..."
                        value={email}
                        onChange={(e) => handleEmailChange(e)}
                        type="text"
                    />
                </div>
                <Error
                    error={error.error}
                    info={error.info}
                    style={error.style}
                />
                <div className="buttonsContainer">
                    <button
                        disabled={loading}
                        onClick={() => resetUserPassword()}
                    >
                        Zresetuj
                    </button>
                    <button
                        className="registerButton"
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

export default ForgotPassword;
