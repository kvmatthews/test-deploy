import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { fetchServices, fetchBanners } from "../redux/homePageSlice"; // Import thunks
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Ambil state dari Redux store
    const { services, banner, servicesStatus, bannerStatus, error } = useSelector((state) => state.services);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/');
            return;
        }

        // Dispatch aksi untuk mengambil services dan banners
        dispatch(fetchServices());
        dispatch(fetchBanners());
    }, [dispatch, navigate]);

    // Function to handle service click
    const handleServiceClick = (service_code) => {
        navigate(`/service/${service_code}`);
    };

    return (
        <div className="home_page">
            <div className="home_services">
                {servicesStatus === 'loading' ? (
                    <p>Loading...</p>
                ) : servicesStatus === 'failed' ? (
                    <p>{error}</p>
                ) : (
                    <div className="services_list">
                        {services.length > 0 ? (
                            services.map((service) => (
                                <div
                                    key={service.service_code}
                                    className="service_item"
                                    onClick={() => handleServiceClick(service.service_code)}
                                >
                                    <img src={service.service_icon} alt={service.service_name} />
                                    <p>{service.service_name}</p>
                                </div>
                            ))
                        ) : (
                            <p>Tidak ada layanan tersedia saat ini.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="home_banner">
                <h4>Temukan promo menarik</h4>
                {bannerStatus === 'loading' ? (
                    <p>Loading...</p>
                ) : bannerStatus === 'failed' ? (
                    <p>{error}</p>
                ) : (
                    <Swiper spaceBetween={26} slidesPerView={4}>
                        {banner.length > 0 ? (
                            banner.map((banner) => (
                                <SwiperSlide key={banner.banner_name} className="banner_item">
                                    <img src={banner.banner_image} alt={banner.banner_name} />
                                </SwiperSlide>
                            ))
                        ) : (
                            <p>Tidak ada banner tersedia saat ini.</p>
                        )}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default HomePage;
