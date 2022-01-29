import "../styles/Login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Error from "./Error";

function Login() {
    let navigate = useNavigate();
    const { login } = useAuth();

    let [loginError, setLoginError] = useState(false);
    let [loading, setLoading] = useState(false);

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    async function loginUser() {
        setLoginError(false);

        try {
            setLoading(true);
            await login(email, password);
            navigate("/");
        } catch {
            setLoginError(true);
        }
        return () => {
            setLoading(false);
        };
    }

    return (
        <div className="Login">
            <div className="loginPanel">
                <h2>Zaloguj się</h2>
                <div className="inputContainer">
                    <input
                        placeholder="email..."
                        value={email}
                        onChange={(e) => handleEmailChange(e)}
                        type="text"
                    />
                </div>
                <div className="inputContainer">
                    <input
                        placeholder="password..."
                        value={password}
                        onChange={(e) => handlePasswordChange(e)}
                        type="password"
                    />
                </div>
                <Error
                    error={loginError}
                    info={"Niepoprawny e-mail lub hasło!"}
                />
                <div className="buttonsContainer">
                    <button disabled={loading} onClick={() => loginUser()}>
                        Zaloguj się
                    </button>
                    <button
                        className="registerButton"
                        onClick={() => {
                            navigate("/register");
                        }}
                    >
                        Zarejestruj się
                    </button>
                </div>
                <div className="forgotPasswordContainer">
                    Zapomniałeś hasła?{" "}
                    <Link to="/forgot-password">Zresetuj hasło!</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
