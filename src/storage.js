import AsyncStorage from '@react-native-community/async-storage';

export const dataStorage = {
    token: '',
    get: (key) => {
        AsyncStorage.getItem(key)
            .then((res) => {
                const data = JSON.parse(res);
                this[key] = data
            })
            .catch((e) => {
                console.log(e)
            })
    },
    set: (key, args) => {
        AsyncStorage.setItem(key, JSON.stringify(args))
            .then(() => {
                this[key] = args;
            })
            .catch((e) => {
                console.log(e)
            })
    },
    delete: (key) => {
        AsyncStorage.removeItem(key)
            .then((data) => {
                return data
            })
            .catch((e) => {
                console.log(e)
            })
    }
};
