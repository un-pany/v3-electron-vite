import { request } from '@/utils/service'

interface CaptchaDto {
    username?: string
    width: number
    height: number
    count: number
    type: string
}
// 获取验证码
export function getCaptchaCode(data: CaptchaDto) {
    return request({
        url: '/user/getCaptchaCode',
        method: 'get',
        params: data
    })
}

interface LoginDto {
    username: string
    password: string
    captcha: string
    codeKey: string
}
// 登录
export function login(data: LoginDto) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}
