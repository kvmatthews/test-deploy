import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerSuccess, registerFailure } from "../redux/userSlice";
import logo from "../assets/Website Assets/Logo.png";
import illustrasi from "../assets/Website Assets/Illustrasi Login.png";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { CiAt } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    // API
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const dispatch = useDispatch();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // API
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

        const registrasiData = {
            email: email,
            first_name: formattedFirstName,
            last_name: formattedLastName,
            password: password
        };

        try {
            const response = await fetch('https://take-home-test-api.nutech-integrasi.com/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrasiData)
            });

            const data = await response.json();
            console.log("Response Status:", response.status);
            console.log("Response Data:", data);

            if (response.ok) {
                setSuccessMessage("Registrasi berhasil silahkan login");
                setErrorMessage(null);
                dispatch(registerSuccess(data)); // Dispatch to Redux
            } else if (response.status === 400) {
                setErrorMessage(data.message);
                setSuccessMessage(null);
                dispatch(registerFailure()); // Dispatch to Redux
            } else {
                setErrorMessage("Registration gagal, mohon dicoba kembali.");
                setSuccessMessage(null);
                dispatch(registerFailure()); // Dispatch to Redux
            }
        } catch (error) {
            console.error("Registrasi Error:", error);
            setErrorMessage("Registration gagal, mohon dicoba kembali");
            setSuccessMessage(null);
            dispatch(registerFailure()); // Dispatch to Redux
        }
    };

    return (
        <div className="halaman_login">
            <div className="sims_login_container">
                <div className="konten_logo">
                    <div className="logo">
                        <img src={logo} alt="Logo_SIMS_PPOB" />
                        <h1>SIMS PPOB</h1>
                    </div>
                    <h2>Lengkapi data untuk<br />membuat akun</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input_box">
                        <input
                            type="email"
                            placeholder="Masukan email anda"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <span className="at_icon"><CiAt /></span>
                    </div>
                    <div className="input_box">
                        <input
                            type="text"
                            placeholder="Masukan nama depan anda"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <span className="at_icon"><FaRegUser /></span>
                    </div>
                    <div className="input_box">
                        <input
                            type="text"
                            placeholder="Masukan nama belakang anda"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <span className="at_icon"><FaRegUser /></span>
                    </div>
                    <div className="input_box">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukan password anda"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="lock_icon"><CiLock /></span>
                        <span className="eye_icon" onClick={togglePasswordVisibility}>
                            {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                        </span>
                    </div>
                    <div className="error_message_regis border">
                        {errorMessage && <p className="error_message">{errorMessage}</p>}
                        {successMessage && <p className="success_message">{successMessage}</p>}
                    </div>
                    <button type="submit" className="tombol_masuk">Daftar</button>
                </form>
                <p>Sudah punya akun? Login <Link to="/">di sini</Link></p>
            </div>
            <div className="illustrasi_container">
                <img src={illustrasi} alt="Illustasi_login_SIMS_PPOB" className="illustrasi_img" />
            </div>
        </div>
    );
};

export default Register;
