import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import "./NameInputForm.css";
import { createUser } from "../services/api";
interface NameInputFormProps {
    onSubmit: (name: string) => void;
}

const NameInputForm: React.FC<NameInputFormProps> = ({ onSubmit }) => {
    const [username, setUsername] = useState("");
    const [isNameValid, setIsNameValid] = useState(false);

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
                setUsername(response.data);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                    className="btn"
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
