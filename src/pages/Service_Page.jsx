import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, processPayment, selectService, clearMessage } from "../redux/serviceSlice";
import { BsCash } from "react-icons/bs";

const ServicePage = () => {
    const { services, service, error, loading, message } = useSelector((state) => state.service); // Ambil state dari Redux
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const jwtToken = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (!jwtToken) {
            navigate('/');
        } else {
            dispatch(fetchServices(jwtToken)); // Ambil data layanan dari Redux
        }
    }, [dispatch, jwtToken, navigate]);

    useEffect(() => {
        if (services.length > 0) {
            const selectedService = services.find((service) => service.service_code === id);
            if (selectedService) {
                dispatch(selectService(selectedService)); // Setel layanan yang dipilih di Redux
            }
        }
    }, [services, id, dispatch]);

    const formatNumber = (value) => {
        return Number(value).toLocaleString('id-ID');
    };

    const parseNumber = (value) => {
        return String(value).replace(/\./g, '');
    };

    const handlePayment = () => {
        if (jwtToken && service) {
            const amount = parseInt(parseNumber(service.service_tariff), 10);
            dispatch(processPayment({ serviceCode: service.service_code, amount, token: jwtToken }));
        }
    };

    useEffect(() => {
        if (message || error) {
            setTimeout(() => {
                dispatch(clearMessage());
            }, 3000);
        }
    }, [message, error, dispatch]);

    return (
        <div className="halaman_service">
            <h4>Pembayaran</h4>
            {error && <p className="error">{error}</p>}
            {service ? (
                <div className="pembayaran_service">
                    <div className="nama_service">
                        <img src={service.service_icon} alt={service.service_code} />
                        <h3>{service.service_name}</h3>
                    </div>
                    <div className="input_service_container">
                        <input
                            type="text"
                            value={formatNumber(service.service_tariff)}
                            readOnly
                            placeholder="Nominal Pembayaran"
                        />
                        <span className="cash_icon_service"><BsCash /></span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handlePayment}
                    >
                        {loading ? "Loading" : "Bayar"}
                    </button>
                </div>
            ) : (
                !error && <p>Loading...</p>
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ServicePage;
