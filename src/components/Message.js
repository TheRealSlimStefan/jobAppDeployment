import React from "react";
import "../styles/Message.css";
import profileImg from "../images/default_image.png";

export default function Message({ text, componentType, messageId }) {
    return (
        <div className={`Message ${componentType}`}>
            <div className="imageContainer">
                <img src={profileImg} alt="" />
            </div>
            <p>{text.length > 0 ? text : null}</p>
        </div>
    );
}
