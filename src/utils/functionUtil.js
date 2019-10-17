import { dataStorage } from '../storage';
import { NativeModules } from 'react-native';
import { pushSingleScreen } from '../navigation';
import _ from 'lodash'
import { compareDateTime, getDateStringWithFormat } from './dateTime';

export function isToday(time) {
    try {
        const today = getDateStringWithFormat(new Date().getTime(), 'YYY-MM-DD');
        // console.log(today)
        const thatDay = getDateStringWithFormat(time, 'YYY-MM-DD');
        // console.log(thatDay);
        return compareDateTime(today, thatDay) === 0

    } catch (e) {
        console.log(e);
        return false
    }
}

export function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    const params = {};
    let tokens;
    const re = /[?&]?([^=]+)=([^&]*)/g;

    while ((tokens = re.exec(qs)) !== null) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

export function pareUrl(link) {
    const Url = parse(link);
    const { pathname, query } = Url;
    Url.pathname = pathname.replace('.html', '').substr(1);
    Url.params = getQueryParams(query);
    console.log(Url);
    return Url
}

export function isLink(url) {
    try {
        const regex = new RegExp('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$', 'gm');
        return regex.test(url)
    } catch (e) {
        console.log(e);
        return false
    }
}

/**
 * check if a string contain any value from array
 * @param string
 * @param values
 * @returns {boolean}
 * @private
 */
export function _includesOne(string, values) {
    try {
        const regex = new RegExp('(' + values.join('|') + ')', 'gm');
        return regex.test(string)
    } catch (e) {
        console.log(e);
        return false
    }
}

export function getUrlObjectId(url, from = '/') {
    try {
        const id = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'));
        return parseInt(id) || 0;
    } catch (e) {
    }
    return 0
}

export function isPhoneNumber(phone) {
    const regexPhone = /((\+84|0)9[0|1|2|3|4|6|7|8|9]|(\+84|0)8[1|2|3|4|5|6|8|9]|(\+84|0)3[2|3|4|5|6|7|8|9]|(\+84|0)7[0|6|7|8|9]|(\+84|0)5[6|8|9])+([0-9]{7})\b/;
    return regexPhone.test(phone)
}

export function isEmail(email) {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email.toLowerCase())
}

export function getChildInfo(user) {
    try {
        if (user.pregnancy !== '') {
            return user.pregnancy;
        }
        if (isNullOrEmpty(user.babies)) {
            return null
        }
        return user.babies[0].genderAge || null;
    } catch (e) {
        return null
    }
}

/**
 * merge 2 object map
 * create new one
 * @param map1
 * @param map2
 * @returns {Map}
 */
export function mapMerger(map1, map2) {
    return new Map(function * () {
        yield * map1;
        yield * map2;
    }());
}

/**
 * get all url part between slash/
 * get all url params ? and &
 * return object key => value param
 * @param url
 */
export function getUrlParams(url) {

    // get query string from url (optional) or window
    let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    const obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        const arr = queryString.split('&');

        for (let i = 0; i < arr.length; i++) {
            // separate the keys and the values
            const a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            let paramName = a[0];
            let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                const key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    const index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}

/**
 * check user is login app
 * @returns {boolean}
 */
export function isLogin() {
    return dataStorage.isLogin && !_.isEmpty(dataStorage.user)
}

/**
 * show login screen in any screen
 */
export function showLogin() {
    // console.log('open: ', {stack: dataStorage.currentScreenStackId});
    pushSingleScreen(dataStorage.currentScreenStackId, LOG_IN, '', {}, false, LOG_IN)
}

/**
 * use for functional required authentication
 * check if user is login?
 * if user log in execute callback func
 * if not open login screen
 * @param callback
 */
export function requireLogin(callback) {
    if (isLogin()) {
        callback()
    } else {
        showLogin();
    }
}

/**
 * sort array by key
 * @param array
 * @param keySort
 * @param DESC
 * @returns {this|Array}
 */
export function sortArray(array = [], keySort, DESC = true) {
    try {
        if (array.length === 0) {
            return [];
        }
        if (DESC) {
            array = array.sort(function (a, b) {
                return b[keySort] - a[keySort];
            });
        } else {
            array = array.sort(function (a, b) {
                return a[keySort] - b[keySort];
            });
        }
        return array;
    } catch (e) {
        console.log(e);
    }
}

export function getPostLink(postId, title = '') {
    return `${dataStorage.baseUrl}/question/show/${slugify(title)}/${postId}.html`;
}

export function unicode(unicode) {
    // Đổi ký tự có dấu thành không dấu
    unicode = unicode.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    unicode = unicode.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    unicode = unicode.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    unicode = unicode.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    unicode = unicode.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    unicode = unicode.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    unicode = unicode.replace(/đ/gi, 'd');
    return unicode;
}

export function slugify(string) {
    string = unicode(string);
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz______';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '_') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '_and_') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '_') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export function isNullOrEmpty(data) {
    if (!data) {
        return true;
    }
    if (typeof data === 'undefined') {
        return true;
    }
    if (typeof data === 'object') {
        return Object.keys(data).length === 0;
    }
    let output = data;
    if (typeof output === 'string') {
    } else {
        output = output.toString();
    }
    output = output.trim();

    return output.length <= 0;
}

export function checkShouldComponentUpdate(nextProps, nextState, listProps, listState, curProps, curState) {
    try {
        for (let i = 0; i < listProps.length; i++) {
            const item = listProps[i];
            if (typeof (item) === 'string') {
                if (nextProps[item] !== curProps[item]) {
                    return true;
                }
            } else {
                const key1 = Object.keys(item)
                    .pop();
                const listData = item[key1];
                for (let j = 0; j < listData.length; j++) {
                    const item1 = listData[j];
                    if (nextProps[key1][item1] !== curProps[key1][item1]) {
                        return true;
                    }
                }
            }
        }
        for (let i = 0; i < listState.length; i++) {
            const item2 = listState[i];
            if (typeof (item2) === 'string') {
                if (nextState[item2] !== curState[item2]) {
                    return true;
                }
            } else {
                const key2 = Object.keys(item2)
                    .pop();
                const listData1 = item2[key2];
                for (let j = 0; j < listData1.length; j++) {
                    const item3 = listData1[j];
                    if (nextState[key2][item3] !== curState[key2][item3]) {
                        return true;
                    }
                }
            }
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export function htmlClean(str) {
    str = str.replace(/<\/?[^>]+(>|$)/g, ''); // remove html tag
    str = str.replace(/^\s+|\s+$/g, ''); // remove break line
    str = str.trim();
    return str.replace(/&nbsp;/g, '');
}

export function nativeNavigator(screen, params = {}) {
    try {
        console.log(screen);
        if (screen.substring(0, 1) === '/') {
            if (dataStorage.baseUrl.endsWith('/')) {
                NativeModules.Bibabo.command('handleUrl', dataStorage.baseUrl + screen.substring(1));
            } else {
                NativeModules.Bibabo.command('handleUrl', dataStorage.baseUrl + screen);
            }
        } else {
            NativeModules.Bibabo.command('handleUrl', screen);
        }
    } catch (e) {
        console.log(e);
    }
}

let imageUploadCallback = null;

export function nativeImageUploader(url, fieldName, callback) {
    imageUploadCallback = callback;
    const data = JSON.stringify({
        requestId: Date.now(),
        url: url,
        fieldName: fieldName
    });
    NativeModules.Bibabo.command('uploadImage', data);
}

export function onNativeImageUploaderCallback(result) {
    if (imageUploadCallback != null) {
        imageUploadCallback(result);
    }
    imageUploadCallback = null;
}

export function formatNumber(input, decimal, split = ',') {
    try {
        if (input == null) {
            return input;
        }
        if (input === '') {
            input = '0';
        }
        if (isNaN(input)) {
            return input;
        }
        if (typeof input === 'string') {
            input = convertFormatToNumber(input);
        }
        if (decimal == null) {
            if (input <= 2) {
                decimal = 3;
            } else {
                decimal = 2;
            }
        } // TODO hash code fix decimal = 0
        if (typeof decimal !== 'undefined') {
            input = roundFloat(input, decimal);
        }
        input = input
            .toString()
            .split('.');
        input[0] = input[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        return changeFixed(input.join(','));
    } catch (ex) {
        console.error(ex);
    }
    return changeFixed(input);
}

export function formatNumberV2(input) {
    try {
        if (input == null) {
            return input;
        }
        if (input === '') {
            input = '0';
        }
        if (isNaN(input)) {
            return input;
        }
        if (typeof input === 'string') {
            input = convertFormatToNumber(input);
        }
        if (input > 1000000) {
            const million = Math.round(input / 1000000);
            return million + 'triêu';
        } else if (input > 1000) {
            const thousand = Math.round(input / 1000);
            return thousand + 'K';
        } else {
            return input;
        }
    } catch (ex) {
        console.error(ex);
    }
    return changeFixed(input);
}

/**
 * Format numbers using single letter notation (1K, 1M, 1B, 1T...)
 * @param input
 * @returns {string}
 */
export function formatNumberInSingleLetterNotation(input) {
    const _suffix = ['', 'K', 'M', 'B', 'T', 'Q'];
    const _index = Math.floor(Math.log(input) / Math.log(1000));

    if (input === 0) {
        return '0';
    }

    return (Math.floor(input / Math.pow(1000, _index) * 10) / 10).toString() + _suffix[_index];
}

export function convertFormatToNumber(stringNumberInput) {
    if (isNullOrEmpty(stringNumberInput)) {
        return stringNumberInput;
    }

    let stringNumber = stringNumberInput;

    if (typeof stringNumberInput !== 'string') {
        stringNumber = stringNumberInput.toString();
    }

    stringNumber = stringNumber.replace('$', '');
    stringNumber = stringNumber.replace('%', '');
    try {
        if (isNullOrEmpty(stringNumber)) {
            return 0;
        }
        if (isNaN(stringNumber)) {
            if (typeof stringNumber !== 'string') {
                stringNumber = stringNumber.toString();
            }
            let stringNumberTemp = stringNumber.replace(/,/gi, '');
            if (isNaN(stringNumberTemp)) {
                stringNumberTemp = stringNumberTemp.replace(/\(/gi, ''); // truong hop nay khi string duoc format thanh dang () se la so am nen se cong them dau -
                stringNumberTemp = stringNumberTemp.replace(/\)/gi, '');
                stringNumberTemp = '-' + stringNumberTemp;
                return parseFloat(stringNumberTemp);
            }
            return parseFloat(stringNumberTemp);
        }
        return parseFloat(stringNumber);
    } catch (e) {
        console.error(e);
    }
    return 0;
}

export function roundFloat(numberFloat, lenght) {
    try {
        if (typeof numberFloat === 'string') {
            try {
                numberFloat = parseFloat(numberFloat);
            } catch (error) {
                console.log('can not parse value: ', numberFloat);
            }
        }
        if (numberFloat == null || lenght == null) {
            return 0;
        }
        let itenDivison = '1';
        for (let i = 0; i < lenght; i++) {
            itenDivison += '0';
        }
        const division = Number(itenDivison);
        return (Math.round(numberFloat * division) / division).toFixed(lenght);
    } catch (e) {
        console.error(e);
    }
    return 0;
}

export function changeFixed(strInput) {
    try {
        if (strInput == null) {
            return strInput;
        }
        if (!isNaN(strInput)) {
            strInput = strInput.toString();
        }
        if (isNullOrEmpty(strInput)) {
            return '';
        }
        if (strInput.endsWith(',000000')) {
            return strInput.replace(',000000', '');
        }
        if (strInput.endsWith(',000000)')) {
            return strInput.replace(',000000', ')');
        }
        if (strInput.endsWith(',00000')) {
            return strInput.replace(',00000', '');
        }
        if (strInput.endsWith(',00000)')) {
            return strInput.replace(',00000', ')');
        }
        if (strInput.endsWith(',0000')) {
            return strInput.replace(',0000', '');
        }
        if (strInput.endsWith(',0000)')) {
            return strInput.replace(',0000', ')');
        }
        if (strInput.endsWith(',000')) {
            return strInput.replace(',000', '');
        }
        if (strInput.endsWith(',000)')) {
            return strInput.replace(',000', ')');
        }
        if (strInput.endsWith(',00')) {
            return strInput.replace(',00', '');
        }
        if (strInput.endsWith(',00)')) {
            return strInput.replace(',00', ')');
        }
        if (strInput.endsWith(',0')) {
            return strInput.replace(',0', '');
        }
        if (strInput.endsWith(',0)')) {
            return strInput.replace(',0', ')');
        }
        return strInput;
    } catch (e) {
        console.error(e);
    }
    return strInput;
}

export function shareContent(title, message, url, subject) {
    try {
        // title default is 'Bibabo', subject default is 'Share Link'
        const shareOptions = {
            title: title,
            message: message,
            url: url,
            subject: subject //  for email
        };
        Share.open(shareOptions);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export function handleUrl(url) {
    try {
        NativeModules.Bibabo.command('handleUrl', url);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export function getUrlNativeChatAds() {
    return dataStorage.baseUrl + 'care/u/help?ref=ad_post&new_ticket=1&medium=chat';
}
