import qs from 'qs';
import { message } from 'antd';
import storage from "@/common/storage";

const { stringify, parse } = qs;

// 判断是否在 Web Worker 中
const isWorker = ():boolean => {
  return typeof self !== 'undefined' && self.constructor.name === 'DedicatedWorkerGlobalScope';
}

const h_error = (msg) => {
  if(isWorker()){
    self.postMessage({ type: 'error', message: msg });
  } else {
    throw new Error(msg);
  }
}

const checkStatus = (res: Response): Response => {
  if (res.status === 200) {
    return res;
  } else if(res.status === 401){
    !isWorker() && window.location.replace('/login');
    h_error(res.statusText)
  } else {
    h_error(res.statusText)
  }
};

/**
 * 捕获成功登录过期状态码等
 * @param res
 * @returns {*}
 */
const judgeOkState = async (res: Response): Promise<Response> => {
  const cloneRes = await res.clone().json();
  if (cloneRes.code === undefined) {
    h_error(res.statusText)
  }
  if (cloneRes.code !== 0) {
    !isWorker() && message.error(`${cloneRes.msg}${cloneRes.code}`);
  } 
  return res;
};

/**
 * 捕获失败
 * @param error
 */
const handleError = (error: any): { code: number; data: any } => {
  !isWorker() && message.error(`请求失败啦！${error.message}`);
  h_error(error.message)
};

interface Options extends RequestInit {
  type?: 'FormData';
}

class http {

  /**
   * 静态的fetch请求通用方法
   * @param url
   * @param options
   * @returns {Promise<unknown>}
   */
  static async bashFetch(url = '', options: Options = {}): Promise<any> {
    const headers = new Headers();
    if(!options['Authorization']){
      const token = storage.getStorage('token');
      if(token){
        headers.append('Authorization', 'Bearer '+token);
      }
    }
    
    const defaultOptions: RequestInit = {
      /*允许携带cookies*/
      credentials: 'include',
      /*允许跨域**/
      mode: 'cors',
      headers: headers,
    };

    if(options.type !== 'FormData'){
      if (options.method === 'POST' || options.method === 'PUT') {
        headers.append('Content-Type', 'application/json; charset=utf-8');
      }
    }
   

    const newOptions: RequestInit = { ...defaultOptions, ...options, headers };
    return fetch(url, newOptions)
      .then(checkStatus)
      .then(judgeOkState)
      .then(res => res.json())
      .catch(handleError);
  }

  /**
   * post请求方式
   * @param url
   * @returns {Promise<unknown>}
   */
  post(url: string, params: Record<string, any> = {}, option: Options = {}): Promise<any> {
    const options = Object.assign({ method: 'POST' }, option);
    //可以是上传键值对形式，也可以是文件，使用append创造键值对数据
    if (options.type === 'FormData' && options.body !== 'undefined') {
      const formData = new FormData();
      // const body = JSON.parse(options.body as string);
      for (const key of Object.keys(params)) {
        formData.append(key, params[key]);
      }
      options.body = formData;
    } else {
      //一般我们常用场景用的是json，所以需要在headers加Content-Type类型
      options.body = JSON.stringify(params);
    }
    return http.bashFetch(url, options); //类的静态方法只能通过类本身调用
  }

  /**
   * put方法
   * @param url
   * @returns {Promise<unknown>}
   */
  put(url: string, params: Record<string, any> = {}, option: Options = {}): Promise<any> {
    const options = Object.assign({ method: 'PUT' }, option);
    options.body = JSON.stringify(params);
    return http.bashFetch(url, options); //类的静态方法只能通过类本身调用
  }

  /**
   * get请求方式
   * @param url
   * @param option
   */
  get(url: string, params: Record<string, any> = {}, option: Options = {}): Promise<any> {
    const options = Object.assign({ method: 'GET' }, option);
    let urlParam = ''
    if(Object.keys(params).length !== 0){
       urlParam = '?'+stringify(params)
    }
    return http.bashFetch(url+urlParam, options);
  }
}

const requestFun = new http(); //new生成实例
export const { post, get, put } = requestFun;
export default requestFun;