export interface ReportCreateResponse {
    success: boolean
    data: ResponseData
}

interface ResponseData {
    url: string,
    pdf: boolean,
    callback: boolean,
    template: boolean,
    id: number
}