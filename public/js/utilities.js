const jwtName = "so-token";

export function getUserTokenFromStorage() {
    const jwt = localStorage.getItem(jwtName);
    return jwt;
}
