import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Website Assets/Logo.png"


const Navigasi = () => {
    const location = useLocation();
    return (
        <nav>
            <div className="nav_logo">
                <Link to="/home">
                    <img src={logo} alt="Logo_SIMS_PPOB" />
                    <h1>SIMS PPOB</h1>
                </Link>
            </div>
            <ul>
                <li><Link
                    to="/topup"
                    className={location.pathname === "/topup" ? "active" : ""}>
                    Top Up
                </Link></li>
                <li><Link
                    to="/transaction"
                    className={location.pathname === "/transaction" ? "active" : ""}>
                    Transaction</Link></li>
                <li><Link to="/akun"
                    className={location.pathname === "/akun" ? "active" : ""}>
                    Akun</Link></li>
            </ul>
        </nav>
    )
};

export default Navigasi;