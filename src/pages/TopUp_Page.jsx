import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleTopUp, clearMessage } from "../redux/topupSlice";
import { BsCash } from "react-icons/bs";

const TopUpPage = () => {
    const [jumlahTopUp, setJumlahTopUp] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, message, error, balance } = useSelector((state) => state.topup);
    const jwtToken = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (!jwtToken) {
            navigate('/');
        }
    }, [jwtToken, navigate]);

    useEffect(() => {
        if (message || error) {
            setTimeout(() => {
                dispatch(clearMessage());
            }, 3000);
        }
    }, [message, error, dispatch]);

    const formatCurrency = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Menambahkan titik sebagai pemisah ribuan
    };

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Menghapus karakter non-digit
        setJumlahTopUp(value);

        if (value >= 10000 && value <= 1000000) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    };

    const jumlahClick = (amount) => {
        setJumlahTopUp(amount.toString()); // Mengubah angka menjadi string
        setIsDisabled(false);
    };

    const handleSubmitTopUp = () => {
        const amount = parseInt(jumlahTopUp.replace(/\./g, ""), 10);
        dispatch(handleTopUp({ amount, token: jwtToken }));
        setJumlahTopUp(""); // Reset input setelah submit
    };

    return (
        <div className="halaman_topup">
            <h4>Silahkan masukan</h4>
            <h2>Nominal Top Up</h2>

            <div className="topup_input">
                <div className="topup_information">
                    <div className="topup_input_container">
                        <input
                            type="text"
                            placeholder="masukan nominal Top Up"
                            value={jumlahTopUp ? `${formatCurrency(jumlahTopUp)}` : ""}
                            onChange={handleInputChange}
                        />
                        <span className="cash_icon"><BsCash /></span>
                    </div>
                    <button
                        type="submit"
                        className="konfirmasi_topup"
                        disabled={isDisabled || loading}
                        onClick={handleSubmitTopUp}
                    >
                        {loading ? "Processing..." : "Top Up"}
                    </button>
                    <div className="verification_message">
                        {balance && <p className="balance">Top Up berhasil! Saldo Anda: Rp{formatCurrency(balance.toString())}</p>}
                    </div>
                </div>
                <div className="list_topup">
                    <button onClick={() => jumlahClick(10000)}>Rp10.000</button>
                    <button onClick={() => jumlahClick(20000)}>Rp20.000</button>
                    <button onClick={() => jumlahClick(50000)}>Rp50.000</button>
                    <button onClick={() => jumlahClick(100000)}>Rp100.000</button>
                    <button onClick={() => jumlahClick(250000)}>Rp250.000</button>
                    <button onClick={() => jumlahClick(500000)}>Rp500.000</button>
                </div>
            </div>
        </div>
    );
};

export default TopUpPage;
