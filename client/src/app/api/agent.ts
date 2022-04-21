import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

/** Base url to my API */
axios.defaults.baseURL = "http://localhost:5000/api/";

/** Create a delay that's going to pause the application in one second before it loads a new component. */
/** Promise represents an operation that hasn't completed yet. */
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

/** Helper method that takes in 'axios response' and return response.data */
const responseBody = (response: AxiosResponse) => response.data;

/** This is equvalent as saying next */
/* function responseBodyEx(response: AxiosResponse){
    return response.data;
} */


/** This interceptor will chech for the response code */

axios.interceptors.response.use(async response => {
    
    /** Call sleep method and pause loading of new component for 0.5 second. */
    await sleep();

    /** If the response code is in range 200 it will return the response */
    return response;

    /** Parameter type will be AxiosError */
}, (error: AxiosError) => {

    /** This is going to happend if I get response code in range 400... or 500... */
    /** from error.response, I'm interested in 'data' and 'status' fields. */
    /** '!' at the end of sentence is to override TypeScripts feature named TypeSafety and remove that error for 'data' and 'status'. */
    const {data, status} = error.response!;
    switch (status) {


        case 400:
            /** Validation error will return an aray of errors (...error1 and ...error2 in my case), while bad-request will not 
            return errors in an array. But both will return 400 status code. I have to determin which error is going back. */
            if (data.errors){
                /** declare an empty string where those errors will be stored */
                const modelStateErrors: string[] = []
                
                for(const key in data.errors){
                    /** I'm not sure why I'm doing this kind of check. He sad something about 'Undefined'? */
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }
                /** creates a new array with all sub-array elements concatenated into it recursively */
                throw modelStateErrors.flat();
            }
            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        case 500:
            history.push('/server-error');
            history.push({
                /** So I'm parsing an object that will contain pathname and the error itself. */
                pathname: '/server-error',
                state: {error: data}
            });
            toast.error(data.title)
            break;
        default:
            break;
    }

    /** Even when i cought the error, I have to return it back */
    return Promise.reject(error.response);
})

/** HelperMethods: This is an object that contains different type of request in form of functions */

const requests = {
    /** it will send axios.get request and forward  */
    get: (url: string) => axios.get(url).then(responseBody), 
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody), 
    update: (url: string, body: {}) => axios.put(url).then(responseBody), 
    delete: (url: string) => axios.get(url).then(responseBody), 
}

/** Here will be centralised all request that has with Catalog component to do. */
const Catalog = {
    /** I will get back list. I'm not parsing any paramater url is basUrl+'products' */
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}


/** Here will be centralised all request that has with Test errors to do. */
const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}


/** I think that I making my objects public so I can access them outside the funciion */
const agent = {
    Catalog,
    TestErrors
}


export default agent;