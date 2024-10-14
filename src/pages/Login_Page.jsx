import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'; // Import useDispatch
import { loginSuccess } from '../redux/userSlice'; // Import loginSuccess action
import logo from "../assets/Website Assets/Logo.png";
import illustrasi from "../assets/Website Assets/Illustrasi Login.png";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { CiAt } from "react-icons/ci";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('https://take-home-test-api.nutech-integrasi.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // CORS
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            console.log("Response Status:", response.status);
            console.log("Response Data:", data);

            if (response.ok) {
                const token = data.data.token;
                // Simpan token dan profil ke Redux store
                dispatch(loginSuccess({
                    token: token,
                    profile: data.data.user // Jika profil user juga tersedia
                }));
                localStorage.setItem('jwtToken', token); // Simpan token ke localStorage
                console.log("Login Berhasil, token:", token);
                setErrorMessage(null);
                navigate('/home');
            } else if (response.status === 400 || response.status === 401) {
                setErrorMessage(data.message);
            } else {
                setErrorMessage("Login gagal, mohon dicoba kembali.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage("Login gagal, mohon dicoba kembali.");
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
                    <h2>Masuk atau buat akun<br />untuk memulai</h2>
                </div>
                <form onSubmit={handleLogin}>
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
                    <div className="error_message_login">
                        {errorMessage && <p className="error_message">{errorMessage}</p>}
                    </div>
                    <button type="submit" className="tombol_masuk">Masuk</button>
                </form>
                <p>Belum punya akun? Registrasi <Link to="/register">di sini</Link></p>
            </div>
            <div className="illustrasi_container">
                <img src={illustrasi} alt="Illustasi_login_SIMS_PPOB" className="illustrasi_img" />
            </div>
        </div>
    );
};

export default Login;
