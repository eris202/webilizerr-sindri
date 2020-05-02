import { Service } from "typedi"
import axios from "axios"

import seo_API_KEY from '../config/keys'
import seo_API_URL from '../config/keys'

@Service()
export class ReportService {

    postApi = async (websiteUrl: String): Promise<ReportApiResponse> => {
        if (!websiteUrl) {
            return {
                data: "",
                errors: [
                    "Must enter a website url"
                ]
            }
        }

        const apiResponse = await axios.post(seo_API_URL + "create",
            { url: websiteUrl, pdf: 1 },
            {
                headers: {
                    "x-api-key": seo_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })

        return {
            data: apiResponse,
            errors: []
        }
    }

    getApiReport = async (reportId: number): Promise<string> => {
        try {
            const apiResponse = await axios.get(seo_API_URL + "get/" + reportId, {
                headers: {
                    "x-api-key": seo_API_KEY,
                    "Content-Type": "application/json",
                },
            })

            return apiResponse.data.success ? "ok" : "wait"
        } catch (e) {
            console.log(e)

            return e.toString()
        }
    }
}

export interface ReportApiResponse {
    data: any,
    errors: string[]
}