import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundSaldo from "../assets/Website Assets/Background Saldo.png";
import FotoProfil from "../assets/Website Assets/Profile Photo.png";

const DataProfile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImage, setProfileImage] = useState(FotoProfil);
    const [balance, setBalance] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isBalanceVisible, setIsBalanceVisible] = useState(false);

    const navigate = useNavigate();

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('https://take-home-test-api.nutech-integrasi.com/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                console.log("Profile Response Status:", response.status);
                console.log("Profile Data:", data);

                if (response.ok) {
                    setFirstName(data.data.first_name);
                    setLastName(data.data.last_name);

                    const profileImageUrl = data.data.profile_image;

                    if (profileImageUrl && profileImageUrl !== "https://minio.nutech-integrasi.com/take-home-test/null") {
                        setProfileImage(profileImageUrl);
                    } else {
                        setProfileImage(FotoProfil);
                    }
                } else {
                    setErrorMessage(data.message || 'Gagal mengambil data profil.');
                }
            } catch (error) {
                console.error("Profile Fetch Error:", error);
                setErrorMessage('Gagal mengambil data profil. Silakan coba lagi.');
            }
        };

        fetchProfile();
    }, [navigate]);

    // Fetch balance data
    useEffect(() => {
        const fetchBalance = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('https://take-home-test-api.nutech-integrasi.com/balance', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setBalance(data.data.balance);
                } else {
                    setErrorMessage(data.message || 'Gagal mengambil saldo.');
                }
            } catch (error) {
                console.error("Balance Fetch Error:", error);
                setErrorMessage('Gagal mengambil saldo. Silakan coba lagi.');
            }
        };

        fetchBalance();
    }, [navigate]);

    const toggleBalanceVisibility = () => {
        setIsBalanceVisible(!isBalanceVisible);
    };

    return (
        <div className="comp_data_pribadi">
            <div className="beranda_user">
                <img src={profileImage} alt="Foto_Profil" />
                <h2>Selamat datang,</h2>
                {errorMessage ? (
                    <h1>{errorMessage}</h1>
                ) : (
                    <h1>{firstName} {lastName}</h1>
                )}
            </div>
            <div className="beranda_saldo">
                <img src={BackgroundSaldo} alt="Background_Saldo_SIMS_PPOB" />
                <h3>Saldo anda</h3>
                {balance !== null ? (
                    isBalanceVisible ? (
                        <h4>Rp {balance.toLocaleString()}</h4>
                    ) : (
                        <h4>Rp • • • • • • •</h4>
                    )
                ) : (
                    <h4>Loading</h4>
                )}
                <h5 onClick={toggleBalanceVisibility}>
                    {isBalanceVisible ? "Sembunyikan saldo" : "Lihat saldo"}
                </h5>
            </div>
        </div>
    );
};

export default DataProfile;
