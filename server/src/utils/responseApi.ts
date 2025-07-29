export const responseApi = (statusCode: number = 200, data: any = [], message: string = '') => {
    return {
        statusCode,
        message,
        data
    }
}