// Base API configuration
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("API Request failed:", error);
        throw error;
    }
};

// API methods
export const api = {
    // GET request
    get: (endpoint) => apiRequest(endpoint),

    // POST request
    post: (endpoint, data) =>
        apiRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // PUT request
    put: (endpoint, data) =>
        apiRequest(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    // DELETE request
    delete: (endpoint) =>
        apiRequest(endpoint, {
            method: "DELETE",
        }),
};

export default api;
