import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/Search";
import Navbar from "./components/Navbar";
import Chats from "./components/Chats";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import ErrorPage from "./components/ErrorPage";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import EditProfile from "./components/EditProfile";

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route
                            path="/search"
                            element={
                                <PrivateRoute>
                                    <Search />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/chats"
                            element={
                                <PrivateRoute>
                                    <Chats />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/chats/chat/:id"
                            element={
                                <PrivateRoute>
                                    <Chat />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/editprofile"
                            element={
                                <PrivateRoute>
                                    <EditProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        {/*<Route path="/statistics" element={<Statistics />} />
                <Route path="/highlight/:id" element={<Highlight />} /> */}
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                    <Navbar />
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
