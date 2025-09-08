import { useNavigate } from 'react-router-dom'
import styles from './Home.module.scss'

export default function Home() {
    const navigate = useNavigate()

    const features = [
        {
            id: 'order',
            title: 'Đặt hàng',
            description:
                'Tạo đơn hàng mới, quản lý order của khách hàng và theo dõi trạng thái phục vụ',
            icon: 'fas fa-receipt',
            onClick: () => navigate('/order'),
        },
        {
            id: 'menu',
            title: 'Danh sách đồ uống',
            description: 'Xem và chỉnh sửa menu đồ uống, cập nhật giá cả và thông tin sản phẩm',
            icon: 'fas fa-coffee',
            onClick: () => navigate('/menu'),
        },
        {
            id: 'revenue',
            title: 'Doanh thu',
            description:
                'Theo dõi doanh số bán hàng, thống kê theo ngày, tuần, tháng và báo cáo tài chính',
            icon: 'fas fa-chart-line',
            onClick: () => navigate('/revenue'),
        },
    ]

    return (
        <div className={styles['home']}>
            <div className={styles['content']}>
                {/* Left Side - Logo Section */}
                <div className={styles['logo-section']}>
                    <div className={styles['logo-container']}>
                        <div className={styles['logo']}>
                            <img src="/logo.jpg" alt="DRIFT Coffee Logo" />
                        </div>
                        <div className={styles['brand-info']}>
                            <h1 className={styles['brand-name']}>DRIFT Coffee</h1>
                            <p className={styles['tagline']}>
                                If you can dream it, you can do it {'>..<'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Features Section */}
                <div className={styles['features-section']}>
                    <div className={styles['features-grid']}>
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className={styles['feature-card']}
                                onClick={feature.onClick}
                            >
                                <div className={styles['feature-icon']}>
                                    <i className={feature.icon}></i>
                                </div>
                                <div className={styles['feature-content']}>
                                    <h3 className={styles['feature-title']}>{feature.title}</h3>
                                    <p className={styles['feature-description']}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className={styles['footer']}>
                <p>© 2025 DRIFT Coffee Management System</p>
            </footer>
        </div>
    )
}
