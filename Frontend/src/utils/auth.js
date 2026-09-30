export const getToken = () =>
    localStorage.getItem("token");

export const getRole = () =>
    localStorage.getItem("role");

export const getUserId = () =>
    localStorage.getItem("userId");

export const getAccountId = () =>
    localStorage.getItem("accountId");

export const isAuthenticated = () => {

    const token = getToken();

    return token !== null;

};

export const logout = () => {

    localStorage.clear();

    window.location.href = "/";

};

/* Idle-timeout auto-logout - no backend/paid service required. */
export const startIdleTimer = (timeoutMinutes = 15) => {

    let idleTimer;

    const resetIdleTimer = () => {

        clearTimeout(idleTimer);

        idleTimer = setTimeout(() => {

            if (isAuthenticated()) {
                logout();
            }

        }, timeoutMinutes * 60 * 1000);

    };

    ["click", "keydown", "mousemove", "scroll", "touchstart"].forEach(
        eventName => window.addEventListener(eventName, resetIdleTimer)
    );

    resetIdleTimer();

};