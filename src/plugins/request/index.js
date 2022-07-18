import axios from 'axios';

axios.defaults.withCredentials = true;

const RequestInstance = (url, options) => {
    let baseURL = options && ('baseURL' in options) ? options.baseURL : null;

    // baseURL
    if (!baseURL) {
        if (localStorage.getItem('baseURL') !== null) {
            baseURL = JSON.parse(window.atob(localStorage.getItem('baseURL')));
        } else {
            baseURL = `${ process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_DOMAIN }`;
        }
    }

    let method = options && ('method' in options) ? options.method : null;
    // method
    if (!method) {
        method = 'GET';
    }

    let responseType = options && ('responseType' in options) ? options.responseType : 'json';
    if (!responseType) {
        responseType = 'json';
    }

    // withCredentials
    // let withCredentials = options && ('withCredentials' in options) ? options.withCredentials : true;

    let headers = options && ('headers' in options) ? options.headers : null;
    // header
    if (!headers) {
        headers = {};

        if (responseType === 'json') {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';
        }

        if (method === 'POST' && responseType === 'blob') {
            headers['Content-Type'] = 'multipart/form-data';   
        }
        
        headers['X-Requested-With'] = 'XMLHttpRequest';
        
        if (localStorage.getItem('Authorization') !== null) {
            headers['Authorization'] ='Bearer ' + JSON.parse(window.atob(localStorage.getItem('Authorization')));
        }
    }
    
    let params = options && ('params' in options) ? options.params : null;
    if (params && method === 'DELETE') {
        params = { data: params };
    }

    let request;

    switch (method) {
        case 'DELETE':
            request = axios.delete(url, {
                baseURL: baseURL,
                headers: headers,
                params: params,
                responseType: responseType,
                // withCredentials: withCredentials
            });

            break;

        case 'POST':
            request = axios.post(url, params, {
                baseURL: baseURL,
                headers: headers,
                responseType: responseType,
                // withCredentials: withCredentials
            });

            break;

        case 'PUT':
            request = axios.put(url, params, {
                baseURL: baseURL,
                headers: headers,
                responseType: responseType,
                // withCredentials: withCredentials
            });

            break;

        case 'PATCH':
            request = axios.patch(url, params, {
                baseURL: baseURL,
                headers: headers,
                responseType: responseType,
                // withCredentials: withCredentials
            });

            break;

        default:
            request = axios.get(url, {
                baseURL: baseURL,
                headers: headers,
                params: params,
                responseType: responseType,
                // withCredentials: withCredentials
            });

            break;
    }

    return request.then(response => {
        return response.data;
    }).catch(error => {
        if (error.response) {
            throw {
                status: error.response.status,
                message: error.response.data.message
            };
        } else {
            error = error.toJSON();

            throw {
                status: error.status,
                message: error.message
            };
        }
    });
};

export { RequestInstance };

export default {
    install(Vue) {
        Vue.prototype.$http = RequestInstance;
    }
}