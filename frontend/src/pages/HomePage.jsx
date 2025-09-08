import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            id: "order",
            title: "Đặt hàng",
            description:
                "Tạo đơn hàng mới, quản lý order của khách hàng và theo dõi trạng thái phục vụ",
            icon: "fas fa-receipt",
            onClick: () => navigate("/order"),
        },
        {
            id: "menu",
            title: "Danh sách đồ uống",
            description:
                "Xem và chỉnh sửa menu đồ uống, cập nhật giá cả và thông tin sản phẩm",
            icon: "fas fa-coffee",
            onClick: () => navigate("/menu"),
        },
        {
            id: "revenue",
            title: "Doanh thu",
            description:
                "Theo dõi doanh số bán hàng, thống kê theo ngày, tuần, tháng và báo cáo tài chính",
            icon: "fas fa-chart-line",
            onClick: () => navigate("/revenue"),
        },
    ];

    return (
        <div className="homepage">
            <div className="homepage-container">
                {/* Left Side - Logo Section */}
                <div className="logo-section">
                    <div className="logo-container">
                        <div className="logo">
                            <img src="/logo.jpg" alt="DRIFT Coffee Logo" />
                        </div>
                        <div className="brand-info">
                            <h1 className="brand-name">DRIFT Coffee</h1>
                            <p className="tagline">
                                If you can dream it, you can do it {">..<"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Features Section */}
                <div className="features-section">
                    <div className="features-grid">
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className="feature-card"
                                onClick={feature.onClick}
                            >
                                <div className="feature-icon">
                                    <i className={feature.icon}></i>
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">
                                        {feature.title}
                                    </h3>
                                    <p className="feature-description">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="homepage-footer">
                <p>© 2025 DRIFT Coffee Management System</p>
            </footer>
        </div>
    );
};

export default HomePage;
