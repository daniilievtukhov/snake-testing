import React, { useState, FormEvent, useContext } from "react";
import { Link } from "react-router-dom";
import "./NameInputForm.css";
import { createUser } from "../services/api";
import { UserContext } from "../context/UserContext";
interface NameInputFormProps {
    onSubmit: (name: string) => void;
}

const NameInputForm: React.FC<NameInputFormProps> = ({ onSubmit }) => {
    const [username, setUsername] = useState("");
    const [isNameValid, setIsNameValid] = useState(false);

    const { setUser } = useContext(UserContext);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.value;
        setUsername(inputName);
        setIsNameValid(inputName.trim() !== "");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isNameValid) {
            onSubmit(username);
        }
    };

    const create = () => {
        if (isNameValid) {
            createUser(username).then((response) => {
                setUser(response.data);
            });
        }
    };

    return (
        <form className="centered-form" onSubmit={handleSubmit}>
            <label>
                Введіть ваше ім'я:
                <input
                    className="input"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleNameChange}
                />
            </label>
            <Link to={isNameValid ? "/game" : ""}>
                <button
                    className={`btn ${isNameValid ? "active" : ""}`}
                    onClick={create}
                    type="submit"
                    disabled={!isNameValid}
                >
                    Підтвердити
                </button>
            </Link>
        </form>
    );
};

export default NameInputForm;
