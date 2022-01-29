import "../styles/Error.css";

function Error({ error, info, style }) {
    return (
        <div>
            {error ? (
                <p style={style} className="Error">
                    {info}
                </p>
            ) : null}
        </div>
    );
}

export default Error;
