import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { fetchProfile, updateProfile, updateProfileImage, clearMessage } from "../redux/profileSlice"; // Import actions
import DefaultProfileImage from "../assets/Website Assets/Profile Photo.png";
import { CiAt } from "react-icons/ci";
import { FaRegUser, FaPen } from "react-icons/fa";

const AccountPage = () => {
    const { email, first_name, last_name, profile_image, message, error } = useSelector((state) => state.profile); // Ambil state dari Redux
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem("jwtToken");

    // State lokal untuk menyimpan input yang diedit
    const [localEmail, setLocalEmail] = useState("");
    const [localFirstName, setLocalFirstName] = useState("");
    const [localLastName, setLocalLastName] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Fetch data profil saat komponen di-mount
    useEffect(() => {
        if (!jwtToken) {
            navigate("/");
        } else {
            dispatch(fetchProfile(jwtToken)); // Fetch data profil dari Redux
        }
    }, [dispatch, jwtToken, navigate]);

    // Update local state ketika profil dari Redux berubah
    useEffect(() => {
        setLocalEmail(email);
        setLocalFirstName(first_name);
        setLocalLastName(last_name);
    }, [email, first_name, last_name]);

    useEffect(() => {
        if (message || error) {
            setTimeout(() => {
                dispatch(clearMessage());
            }, 3000); // Hapus pesan setelah 3 detik
        }
    }, [message, error, dispatch]);

    // Handle perubahan gambar profil
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            dispatch(updateProfileImage({ token: jwtToken, formData }));
        }
    };

    // Handle perubahan input teks
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setLocalEmail(value); // Update email di state lokal
        } else if (name === "first_name") {
            setLocalFirstName(value); // Update first_name di state lokal
        } else if (name === "last_name") {
            setLocalLastName(value); // Update last_name di state lokal
        }
    };

    // Menyimpan profil
    const handleSaveClick = () => {
        if (isEditing) {
            dispatch(updateProfile({ token: jwtToken, firstName: localFirstName, lastName: localLastName }));
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    // Batalkan perubahan profil
    const handleCancelClick = () => {
        setLocalEmail(email); // Kembalikan email ke Redux state
        setLocalFirstName(first_name); // Kembalikan first_name ke Redux state
        setLocalLastName(last_name); // Kembalikan last_name ke Redux state
        setIsEditing(false);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate('/');
    };

    return (
        <div className="halaman_akun">
            <div className="profil_image">
                <div className="image_container" onClick={() => document.getElementById('imageUpload').click()}>
                    <img src={profile_image || DefaultProfileImage} alt="Profile" />
                    <span className="edit_icon">
                        <FaPen style={{ fontSize: "10px" }} />
                    </span>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/jpeg, image/png"
                        onChange={handleImageChange}
                    />
                </div>
                <h1>{localFirstName} {localLastName}</h1>
            </div>
            <div className="account_information">
                <div className="account_details">
                    <h2>Email</h2>
                    <div className="input_container">
                        <input
                            type="email"
                            name="email"
                            value={localEmail}
                            onChange={handleInputChange}
                            readOnly={!isEditing} // Buat editable saat isEditing true
                        />
                        <span className="account_icon"><CiAt style={{ fontSize: "16px" }} /></span>
                    </div>
                </div>
                <div className="account_details">
                    <h2>Nama Depan</h2>
                    <div className="input_container">
                        <input
                            type="text"
                            name="first_name"
                            value={localFirstName}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                        />
                        <span className="account_icon"><FaRegUser style={{ fontSize: "13px" }} /></span>
                    </div>
                </div>
                <div className="account_details">
                    <h2>Nama Belakang</h2>
                    <div className="input_container">
                        <input
                            type="text"
                            name="last_name"
                            value={localLastName}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                        />
                        <span className="account_icon"><FaRegUser style={{ fontSize: "13px" }} /></span>
                    </div>
                </div>
            </div>
            <div className="account_button">
                {isEditing ? (
                    <>
                        <button onClick={handleSaveClick}>Simpan</button>
                        <button onClick={handleCancelClick}>Batalkan</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AccountPage;
