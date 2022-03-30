import { get } from 'lodash'
import { ElMessage } from 'element-plus'
import axios, { AxiosRequestConfig, Canceler } from 'axios'

// 请求标识
function createAjaxKey(config: AxiosRequestConfig) {
    return `${config.method}${config.url}${JSON.stringify(config.params)}${JSON.stringify(config.data)}`
}

// 添加请求到缓存
function insertPendingAjax(config: AxiosRequestConfig) {
    const key = createAjaxKey(config)
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel: Canceler) => {
            // 不存在当前请求，添加进去
            if (key && !window.$axiosCache.has(key)) {
                window.$axiosCache.set(key, cancel)
            }
        })
}

// 从缓存中移除请求
function deletePendingAjax(config: AxiosRequestConfig) {
    const key = createAjaxKey(config)
    const cancel = window.$axiosCache.get(key)
    // 存在当前请求，取消并将删除
    if (cancel) {
        cancel(key)
        window.$axiosCache.delete(key)
    }
}

// 创建请求实例
function createService() {
    // 创建一个 axios 实例
    const service = axios.create()

    // 请求拦截
    service.interceptors.request.use(
        (config) => {
            // deletePendingAjax(config)
            // insertPendingAjax(config)
            console.log('request', config)
            return config
        },
        (error) => {
            // 发送失败
            return Promise.reject(error)
        }
    )

    // 响应拦截
    service.interceptors.response.use(
        (response) => {
            // deletePendingAjax(response.config)
            const data = response.data
            const code = data.code // 这个状态码是和后端约定的
            if (code === 0 || code === 200) {
                return data
            }
            return Promise.reject(data)
        },
        (error) => {
            console.log('response', error)
            // const config = error.config || {}
            // deletePendingAjax(config)
            // // 类型是否为重复请求
            // // 取消请求会报错，但不应该返回给用户
            // let isDuplicatedType: boolean
            // try {
            //     const errorType = (JSON.parse(error.message) || {}).type
            //     isDuplicatedType = errorType === 'DUPLICATED_REQUEST'
            // } catch (error) {
            //     isDuplicatedType = false
            // }
            // if (isDuplicatedType) return

            const status = get(error, 'response.status')
            switch (status) {
                case 400:
                    error.message = '请求错误'
                    break
                case 401:
                    // useStore().dispatch(UserActionTypes.ACTION_LOGIN_OUT, undefined); location.reload()
                    error.message = '未授权，请登录'
                    break
                case 403:
                    // useStore().dispatch(UserActionTypes.ACTION_LOGIN_OUT, undefined); location.reload()
                    error.message = '拒绝访问'
                    break
                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`
                    break
                case 408:
                    error.message = '请求超时'
                    break
                case 500:
                    error.message = '服务器内部错误'
                    break
                case 501:
                    error.message = '服务未实现'
                    break
                case 502:
                    error.message = '网关错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网关超时'
                    break
                case 505:
                    error.message = 'HTTP版本不受支持'
                    break
                default:
                    break
            }
            ElMessage.error(error.message)
            return Promise.reject(error)
        }
    )
    return service
}

//
export const service = createService()

// 创建请求方法
function createRequest() {
    return function (config: AxiosRequestConfig) {
        //   const token = useStore().state.user.token
        const configDefault = {
            headers: {
                //   Authorization: 'Bearer ' + token,
                'Content-Type': get(config, 'headers.Content-Type', 'application/json')
            },
            timeout: 30000,
            // baseURL: '/api/v1/',
            baseURL: 'http://172.23.26.65:20002/',
            data: {}
        }
        return service(Object.assign(configDefault, config))
    }
}

export const request = createRequest()
