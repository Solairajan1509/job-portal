const getApiUrl = () => {
    let url = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    url = url.trim().replace(/\/+$/, "");
    if (!url.endsWith("/api/v1")) {
        url = `${url}/api/v1`;
    }
    return url;
};

export const API_URL = getApiUrl();

