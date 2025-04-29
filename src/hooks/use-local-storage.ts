import {useEffect, useState} from "react";

export const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState(initialValue);

    useEffect(() => {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
            setStoredValue(JSON.parse(item));
        } else {
            setValue(initialValue);
        }
    }, [key]);

    const setValue = (value: T) => {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValue, setValue];
};
