import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../../services/apiService'
import styles from './Order.module.scss'

export default function Order() {
    const navigate = useNavigate()

    // States for menu items and cart
    const [menuItems, setMenuItems] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // States for order form
    const [orderForm, setOrderForm] = useState({
        customer_name: '',
        order_type: 'takeaway',
        table_number: '',
        notes: '',
    })

    // States for UI
    const [showOrderForm, setShowOrderForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showCategoryMenu, setShowCategoryMenu] = useState(false)

    // Shared category label logic
    const categories = [
        { value: 'all', label: '📋 Tất cả' },
        { value: 'yaourt', label: '🍦 Yaourt' },
        { value: 'milkTea', label: '🧋 Trà sữa' },
        { value: 'soda', label: '🥤 Nước ngọt' },
        { value: 'fruitTea', label: '🍑 Trà trái cây' },
        { value: 'topping', label: '🍡 Topping' },
        { value: 'latte', label: '🥛 Latte' },
        { value: 'food', label: '🍟 Ăn vặt' },
        { value: 'coffee', label: '☕ Cà phê' },
        { value: 'milo-cacao', label: '🍫 Milo/Cacao' },
        { value: 'juice', label: '🍊 Nước ép' },
        { value: 'bottleDrink', label: '🍼 Nước chai' },
        { value: 'other', label: '✨ Khác' },
    ]

    const getCategoryLabel = (category) => {
        const found = categories.find((cat) => cat.value === category)
        return found ? found.label : '🍽️ Khác'
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
        setShowCategoryMenu(false)
    }

    // Load menu items when component mounts
    useEffect(() => {
        fetchMenuItems()
    }, [])

    const fetchMenuItems = async () => {
        try {
            setLoading(true)
            const data = await apiService.menu.getAll()
            setMenuItems(Array.isArray(data) ? data : [])
            setError(null)
        } catch (err) {
            setError('Không thể tải danh sách menu. Vui lòng thử lại sau.')
            console.error('Error fetching menu items:', err)
            setMenuItems([])
        } finally {
            setLoading(false)
        }
    }

    // Filter menu items
    const filteredItems = menuItems.filter((item) => {
        const matchesSearch =
            item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())

        if (selectedCategory === 'all') return matchesSearch

        // Use category field from database
        return matchesSearch && item.category === selectedCategory
    })

    // Cart functions
    const addToCart = (menuItem) => {
        const existingItem = cartItems.find((item) => item.menu_item_id === menuItem.id)

        if (existingItem) {
            setCartItems(
                cartItems.map((item) =>
                    item.menu_item_id === menuItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                ),
            )
        } else {
            setCartItems([
                ...cartItems,
                {
                    menu_item_id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    unit: menuItem.unit,
                    quantity: 1,
                },
            ])
        }
    }

    const updateCartQuantity = (menu_item_id, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(menu_item_id)
        } else {
            setCartItems(
                cartItems.map((item) =>
                    item.menu_item_id === menu_item_id ? { ...item, quantity: newQuantity } : item,
                ),
            )
        }
    }

    const removeFromCart = (menu_item_id) => {
        setCartItems(cartItems.filter((item) => item.menu_item_id !== menu_item_id))
    }

    const clearCart = () => {
        setCartItems([])
    }

    // Calculate total
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    // Handle order submission
    const handleSubmitOrder = async (e) => {
        e.preventDefault()

        if (cartItems.length === 0) {
            setError('Vui lòng chọn ít nhất một món để đặt hàng.')
            return
        }

        // Validate dine_in orders must have table number
        if (orderForm.order_type === 'dine_in' && !orderForm.table_number) {
            setError('Vui lòng nhập số bàn cho đơn hàng ngồi uống tại quán.')
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            const orderData = {
                items: cartItems.map((item) => ({
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                })),
                customer_name: orderForm.customer_name || null,
                order_type: orderForm.order_type,
                table_number:
                    orderForm.order_type === 'dine_in' ? parseInt(orderForm.table_number) : null,
                notes: orderForm.notes || null,
            }

            // Sử dụng API mới theo order_type
            if (orderForm.order_type === 'takeaway') {
                await apiService.order.createTakeaway(orderData)
            } else {
                // dine_in - tạo order cho bàn
                await apiService.order.createForTable(orderData.table_number, orderData)
            }

            // Reset form and cart
            setCartItems([])
            setOrderForm({
                customer_name: '',
                order_type: 'takeaway',
                table_number: '',
                notes: '',
            })
            setShowOrderForm(false)

            alert('Đặt hàng thành công! Hóa đơn đã được tạo.')
        } catch (err) {
            setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.')
            console.error('Error creating order:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price)
    }

    if (loading) {
        return (
            <div className="page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải menu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles['page']}>
            {/* Header */}
            <div className={styles['page-header']}>
                <div className={styles['header-content']}>
                    <button className={styles['back-button']} onClick={() => navigate('/')}>
                        <i className="fas fa-arrow-left"></i>
                        <span className={styles['btn-text']}>Về trang chủ</span>
                    </button>

                    <div className={styles['header-center']}>
                        <h1 className={styles['page-title']}>
                            <i className="fas fa-receipt"></i>
                            Đặt hàng
                        </h1>
                    </div>

                    <button
                        className={`${styles['header-action-btn']} ${styles['cart-button']} ${
                            cartItems.length > 0 ? styles['has-items'] : ''
                        }`}
                        onClick={() => setShowOrderForm(true)}
                        disabled={cartItems.length === 0}
                    >
                        <i className="fas fa-shopping-cart"></i>
                        <span className={styles['cart-count']}>{cartItems.length}</span>
                        <span className={styles['btn-text']}>Tạo hóa đơn</span>
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className={styles['error-message']}>
                    <i className="fas fa-exclamation-triangle"></i>
                    {error}
                    <button onClick={() => setError(null)} className={styles['close-error']}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            {/* Page Content */}
            <div className={styles['page-content']}>
                {/* Search and Filter */}
                <div className={styles['search-container']}>
                    <div className={styles['search-box']}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm món..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles['input-field']}
                        />
                    </div>

                    <div className={styles['category-dropdown']}>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`${styles['category-select']} ${styles['input-field']}`}
                        >
                            {categories.map((category) => (
                                <option
                                    className={styles['category-option']}
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </option>
                            ))}
                        </select>

                        <button
                            className={styles['category-toggle']}
                            onClick={() => setShowCategoryMenu((prev) => !prev)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>

                        {showCategoryMenu === true ? (
                            <div className={styles['category-menu']}>
                                <button
                                    className={styles['close-btn']}
                                    onClick={() => setShowCategoryMenu((prev) => !prev)}
                                >
                                    <i className="fas fa-times" />
                                </button>
                                {categories.map((category) => (
                                    <div
                                        key={category.value}
                                        className={`${styles['category-option']} ${
                                            selectedCategory === category.value
                                                ? styles['active']
                                                : ''
                                        }`}
                                        onClick={() => handleCategorySelect(category.value)}
                                    >
                                        {category.label}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>

            {/* Order Form Modal */}
            {showOrderForm && (
                <div className={styles['modal-overlay']}>
                    <div className={`${styles['modal-content']} ${styles['order-modal']}`}>
                        <div className={styles['modal-header']}>
                            <h2>Tạo hóa đơn</h2>
                            <button
                                onClick={() => setShowOrderForm(false)}
                                className={styles['close-modal']}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Cart Summary */}
                        <div className={styles['cart-summary']}>
                            <h3>Danh sách món đã chọn</h3>
                            {cartItems.length === 0 ? (
                                <p className={styles['empty-cart']}>Chưa có món nào được chọn</p>
                            ) : (
                                <div className={styles['cart-items']}>
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.menu_item_id}
                                            className={styles['cart-item']}
                                        >
                                            <div className={styles['cart-item-info']}>
                                                <span className={styles['item-name']}>
                                                    {item.name}
                                                </span>
                                                <span className={styles['item-price']}>
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>
                                            <div className={styles['quantity-controls']}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.menu_item_id,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <span className={styles['quantity']}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.menu_item_id,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles['remove-item']}
                                                    onClick={() =>
                                                        removeFromCart(item.menu_item_id)
                                                    }
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className={styles['cart-total']}>
                                        <strong>Tổng cộng: {formatPrice(calculateTotal())}</strong>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Form */}
                        <form onSubmit={handleSubmitOrder} className={styles['order-form']}>
                            <div className={styles['form-group']}>
                                <label>Tên khách hàng</label>
                                <input
                                    type="text"
                                    value={orderForm.customer_name}
                                    onChange={(e) =>
                                        setOrderForm({
                                            ...orderForm,
                                            customer_name: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên khách hàng (không bắt buộc)"
                                />
                            </div>

                            <div className={styles['form-group']}>
                                <label>Loại đơn hàng *</label>
                                <select
                                    value={orderForm.order_type}
                                    onChange={(e) =>
                                        setOrderForm({
                                            ...orderForm,
                                            order_type: e.target.value,
                                            table_number:
                                                e.target.value === 'takeaway'
                                                    ? ''
                                                    : orderForm.table_number,
                                        })
                                    }
                                    required
                                >
                                    <option value="takeaway">Mang đi</option>
                                    <option value="dine_in">Ngồi uống tại quán</option>
                                </select>
                            </div>

                            {orderForm.order_type === 'dine_in' && (
                                <div className={styles['form-group']}>
                                    <label>Số bàn *</label>
                                    <input
                                        type="number"
                                        value={orderForm.table_number}
                                        onChange={(e) =>
                                            setOrderForm({
                                                ...orderForm,
                                                table_number: e.target.value,
                                            })
                                        }
                                        placeholder="Nhập số bàn"
                                        min="1"
                                        required
                                    />
                                </div>
                            )}

                            <div className={styles['form-group']}>
                                <label>Ghi chú</label>
                                <textarea
                                    value={orderForm.notes}
                                    onChange={(e) =>
                                        setOrderForm({
                                            ...orderForm,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Ghi chú đặc biệt (không bắt buộc)"
                                    rows="3"
                                />
                            </div>

                            <div className={styles['form-actions']}>
                                <button
                                    type="button"
                                    onClick={() => setShowOrderForm(false)}
                                    className={styles['cancel-btn']}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className={styles['clear-cart-btn']}
                                    disabled={cartItems.length === 0}
                                >
                                    Xóa tất cả
                                </button>
                                <button
                                    type="submit"
                                    className={styles['submit-btn']}
                                    disabled={cartItems.length === 0 || isSubmitting}
                                >
                                    {isSubmitting ? 'Đang tạo...' : 'Tạo hóa đơn'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Menu Items Grid */}
            <div className={styles['menu-content']}>
                {filteredItems.length === 0 ? (
                    <div className={styles['empty-state']}>
                        <i className="fas fa-coffee"></i>
                        <h3>Không tìm thấy món nào</h3>
                        <p>Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.</p>
                    </div>
                ) : (
                    <div className={styles['menu-grid']}>
                        {filteredItems.map((item) => {
                            const cartItem = cartItems.find(
                                (cartItem) => cartItem.menu_item_id === item.id,
                            )
                            const quantityInCart = cartItem ? cartItem.quantity : 0

                            return (
                                <div key={item.id} className={styles['menu-item-card']}>
                                    <div className={styles['item-image']}>
                                        {item.image_url ? (
                                            <>
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        // Ẩn ảnh lỗi và hiện phần tử kế tiếp (placeholder)
                                                        e.currentTarget.style.display = 'none'
                                                        const sib =
                                                            e.currentTarget.nextElementSibling
                                                        if (sib) sib.style.display = 'flex'
                                                    }}
                                                />
                                                {/* placeholder đặt NGAY SAU <img/> để nextElementSibling hoạt động */}
                                                <div
                                                    className={styles['image-placeholder']}
                                                    style={{ display: 'none' }}
                                                >
                                                    <i className="fas fa-coffee"></i>
                                                </div>
                                            </>
                                        ) : (
                                            <div className={styles['image-placeholder']}>
                                                <i className="fas fa-coffee"></i>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles['item-content']}>
                                        <div className={styles['item-header']}>
                                            <h3 className={styles['item-name']}>{item.name}</h3>
                                            <span className={styles['item-price']}>
                                                {formatPrice(item.price)}
                                            </span>
                                        </div>
                                        <div className={styles['item-details']}>
                                            {item.category && (
                                                <span className={styles['item-category']}>
                                                    {getCategoryLabel(item.category)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles['item-actions']}>
                                        {quantityInCart > 0 ? (
                                            <div className={styles['quantity-controls']}>
                                                <button
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.id,
                                                            quantityInCart - 1,
                                                        )
                                                    }
                                                    className={styles['quantity-btn']}
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <span className={styles['quantity-display']}>
                                                    {quantityInCart}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.id,
                                                            quantityInCart + 1,
                                                        )
                                                    }
                                                    className={styles['quantity-btn']}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className={styles['add-to-cart-btn']}
                                                onClick={() => addToCart(item)}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
