export const apiUrl = import.meta.env.VITE_API_URL;
export const getToken = () => {
    const userInfo = localStorage.getItem('userInfoLms');
    return userInfo ? JSON.parse(userInfo).token : null;
}

export const token = {
    toString() {
        return getToken() || '';
    }
}

export function convertMinutesToHours(minutes) {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    if (hours > 0) {
        let hString = hours === 1 ? "hr" : "hrs";
        let mString = remainingMinutes === 1 ? "min" : "mins";

        if (remainingMinutes > 0) {
            return `${hours} ${hString} ${remainingMinutes} ${mString}`;
        } else {
            return `${hours} ${hString}`;
        }
    } else {
        if (remainingMinutes > 0) {
            let mString = remainingMinutes === 1 ? "min" : "mins";
            return `${remainingMinutes} ${mString}`;
        }
    }

    return "0 min";
}