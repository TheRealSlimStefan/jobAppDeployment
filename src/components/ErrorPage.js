import { Navigate } from "react-router-dom";
import "../styles/ErrorPage.css";

function ErrorPage() {
    return <Navigate to="/search" />;
}

export default ErrorPage;
