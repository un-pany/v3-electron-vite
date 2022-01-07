import dayjs from 'dayjs'

// 格式化时间
export function dateFormat(time: any) {
    if (time == null || time === '') {
        return 'N/A'
    }
    const date = new Date(time)
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
