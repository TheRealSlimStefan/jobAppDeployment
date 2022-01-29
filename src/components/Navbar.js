import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

function Navbar() {
    const { currentUser } = useAuth();
    const location = useLocation();

    function getLocationPathname() {
        let locationPathname = location.pathname;
        return locationPathname.substring(0, 12);
    }

    return getLocationPathname() !== "/chats/chat/" &&
        location.pathname !== "/register" &&
        currentUser ? (
        <div className="Navbar">
            <NavLink to="profile">
                <CgProfile />
            </NavLink>
            <NavLink to="search">
                <AiOutlineSearch />
            </NavLink>
            <NavLink to="chats">
                <BsChatDots />
            </NavLink>
        </div>
    ) : null;
}

export default Navbar;
