import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "./MenuPage.css";

const MenuPage = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    // Form data cho thêm/sửa item
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "other",
        image_url: "",
    });

    // Lấy danh sách menu khi component mount
    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const data = await apiService.menu.getAll();
            setMenuItems(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError("Không thể tải danh sách menu. Vui lòng thử lại sau.");
            console.error("Error fetching menu items:", err);
            setMenuItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Lọc menu items theo tìm kiếm và category
    const filteredItems = Array.isArray(menuItems)
        ? menuItems.filter((item) => {
              const matchesSearch =
                  item.name &&
                  item.name.toLowerCase().includes(searchTerm.toLowerCase());

              if (selectedCategory === "all") return matchesSearch;

              return matchesSearch && item.category === selectedCategory;
          })
        : [];

    // Xử lý form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await apiService.menu.update(editingItem.id, formData);
            } else {
                await apiService.menu.create(formData);
            }

            setFormData({
                name: "",
                price: "",
                category: "other",
                image_url: "",
            });
            setShowAddForm(false);
            setEditingItem(null);
            await fetchMenuItems();
        } catch (err) {
            setError("Có lỗi xảy ra khi lưu dữ liệu.");
            console.error("Error saving menu item:", err);
        }
    };

    // Xử lý xóa item
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa món này?")) {
            try {
                await apiService.menu.delete(id);
                await fetchMenuItems();
            } catch (err) {
                setError("Có lỗi xảy ra khi xóa món.");
                console.error("Error deleting menu item:", err);
            }
        }
    };

    // Bắt đầu edit
    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price,
            category: item.category || "other",
            image_url: item.image_url || "",
        });
        setShowAddForm(true);
    };

    // Cancel form
    const cancelForm = () => {
        setShowAddForm(false);
        setEditingItem(null);
        setFormData({ name: "", price: "", category: "other", image_url: "" });
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Shared category label logic
    const categories = [
        { value: "all", label: "📋 Tất cả" },
        { value: "yaourt", label: "🍦 Yaourt" },
        { value: "milkTea", label: "🧋 Trà sữa" },
        { value: "soda", label: "🥤 Nước ngọt" },
        { value: "fruitTea", label: "🍑 Trà trái cây" },
        { value: "topping", label: "🍡 Topping" },
        { value: "latte", label: "🥛 Latte" },
        { value: "food", label: "🍟 Ăn vặt" },
        { value: "coffee", label: "☕ Cà phê" },
        { value: "milo-cacao", label: "🍫 Milo/Cacao" },
        { value: "juice", label: "🍊 Nước ép" },
        { value: "bottleDrink", label: "🍼 Nước chai" },
        { value: "other", label: "✨ Khác" },
    ];

    const getCategoryLabel = (category) => {
        const found = categories.find((cat) => cat.value === category);
        return found ? found.label : "🍽️ Khác";
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setShowCategoryMenu(false);
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span className="btn-text">Về trang chủ</span>
                    </button>

                    <div className="header-center">
                        <h1 className="page-title">
                            <i className="fas fa-coffee"></i>
                            Danh sách Menu
                        </h1>
                    </div>

                    <button
                        className="header-action-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        <i className="fas fa-plus"></i>
                        <span className="btn-text">Thêm món</span>
                    </button>
                </div>
            </div>

            <div className="page-content">
                {/* Search and Category Filter */}
                <div className="search-container">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm món..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="category-dropdown">
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="category-select input-field"
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </option>
                            ))}
                        </select>

                        <button
                            className="category-toggle"
                            onClick={() =>
                                setShowCategoryMenu(!showCategoryMenu)
                            }
                        >
                            <i className="fas fa-bars"></i>
                        </button>

                        <div
                            className={`category-menu ${
                                showCategoryMenu ? "open" : ""
                            }`}
                        >
                            {categories.map((category) => (
                                <div
                                    key={category.value}
                                    className={`category-option ${
                                        selectedCategory === category.value
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategorySelect(category.value)
                                    }
                                >
                                    {category.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="close-error"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                {/* Add/Edit Form Modal */}
                {showAddForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>
                                    {editingItem
                                        ? "Chỉnh sửa món"
                                        : "Thêm món mới"}
                                </h2>
                                <button
                                    onClick={cancelForm}
                                    className="close-modal"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="menu-form">
                                <div className="form-group">
                                    <label>Tên món *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Nhập tên món..."
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Giá *</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: e.target.value,
                                                })
                                            }
                                            placeholder="0"
                                            min="0"
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Danh mục *</label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    category: e.target.value,
                                                })
                                            }
                                            className="input-field"
                                        >
                                            <option value="coffee">
                                                ☕ Cà phê
                                            </option>
                                            <option value="tea">🍃 Trà</option>
                                            <option value="juice">
                                                🥤 Nước ép & Sinh tố
                                            </option>
                                            <option value="food">
                                                🍞 Đồ ăn
                                            </option>
                                            <option value="other">
                                                🍽️ Khác
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>URL hình ảnh</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                image_url: e.target.value,
                                            })
                                        }
                                        placeholder="https://example.com/image.jpg"
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={cancelForm}
                                        className="btn-secondary"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        {editingItem ? "Cập nhật" : "Thêm món"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Menu Items Grid */}
                {filteredItems.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-coffee"></i>
                        <h3>Chưa có món nào trong menu</h3>
                        <p>Hãy thêm món đầu tiên vào menu của bạn!</p>
                        <button
                            className="btn-primary"
                            onClick={() => setShowAddForm(true)}
                        >
                            <i className="fas fa-plus"></i>
                            Thêm món đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="menu-grid">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="menu-item-card glass-effect"
                            >
                                <div className="item-image">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.parentNode.querySelector(
                                                    ".image-placeholder"
                                                ).style.display = "flex";
                                            }}
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            <i className="fas fa-coffee"></i>
                                        </div>
                                    )}
                                    {item.image_url && (
                                        <div
                                            className="image-placeholder"
                                            style={{ display: "none" }}
                                        >
                                            <i className="fas fa-coffee"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="item-content">
                                    <div className="item-header">
                                        <h3 className="item-name">
                                            {item.name}
                                        </h3>
                                        <span className="item-price">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>
                                    <div className="item-details">
                                        {item.category && (
                                            <span className="item-category">
                                                {getCategoryLabel(
                                                    item.category
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="item-actions">
                                    <button
                                        className="btn-secondary edit-btn"
                                        onClick={() => startEdit(item)}
                                        title="Chỉnh sửa"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                        title="Xóa"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
