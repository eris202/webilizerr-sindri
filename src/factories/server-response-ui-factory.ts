import { Service } from "typedi";

@Service()
export class ResponseUiFactory {

    readonly GREEN = "#16fa62";
    readonly YELLOW = "#fae316";
    readonly RED = "#ff5f68";

    decorateResponseUiSection = (json: any) => {
        const responseTime = json.serverResponseTime.data.responseTime;
        const loadTime = json.serverResponseTime.data.loadTime;
        const completeTime = json.serverResponseTime.data.completeTime;

        const { responseTimeColor, responsegood, responseTimeLeft } = {
            responseTimeLeft: 0,
            ...this.createResponseTimeElements(loadTime)
        }

        const { loadTimeColor, loadgood, loadTimeLeft } = {
            loadTimeLeft: 0,
            ...this.createLoadTimeElements(loadTime)
        }

        const { completeTimeColor, completegood, completeTimeLeft } = {
            completeTimeLeft: 0,
            ...this.createCompleteTimeElements(loadTime)
        }

        json.serverResponseTime.data.responsegood = responsegood
        json.serverResponseTime.data.loadgood = responsegood
        json.serverResponseTime.data.completegood = completegood

        json.serverResponseTime.data.responseTime = responseTime;
        json.serverResponseTime.data.loadTime = loadTime;
        json.serverResponseTime.data.completeTime = completeTime;
        json.serverResponseTime.data.responseTimeColor = responseTimeColor;
        json.serverResponseTime.data.loadTimeColor = loadTimeColor;
        json.serverResponseTime.data.completeTimeColor = completeTimeColor;
        json.serverResponseTime.data.responseTimeLeft = responseTimeLeft;
        json.serverResponseTime.data.loadTimeLeft = loadTimeLeft;
        json.serverResponseTime.data.completeTimeLeft = completeTimeLeft;
    }

    private createResponseTimeElements(responseTime: number) {
        if (responseTime <= 10) {
            return {
                responseTimeColor: this.GREEN,
                responsegood: 'Very good',
            }
        } else if (responseTime > 10 && responseTime < 20) {
            return {
                responseTimeColor: this.YELLOW,
                responsegood: 'You need to do better',
            }
        } else if (responseTime >= 20) {
            const reponseTimeResult = {
                responseTimeColor: this.RED,
                responsegood: 'Very slow, must fix!',
            }

            if (responseTime < 60) {
                return {
                    ...reponseTimeResult,
                    responseTimeLeft: 60 - responseTime
                }
            } else {
                return {
                    responseTimeLeft: Math.round(responseTime * 0.3),
                    ...reponseTimeResult,
                }
            }
        }

        throw new Error('Response time is undefined')
    }

    private createLoadTimeElements(loadTime: number) {
        if (loadTime <= 10) {
            return {
                loadTimeColor: this.GREEN,
                loadgood: 'Very good'
            }
        } else if (loadTime > 10 && loadTime < 20) {
            return {
                loadTimeColor: this.YELLOW,
                loadgood: 'You need to do better'
            }
        } else if (loadTime >= 20) {
            const loadTimeResult = {
                loadTimeColor: this.RED,
                loadgood: 'Very slow, must fix!'
            }

            if (loadTime < 60) {
                return {
                    ...loadTimeResult,
                    loadTimeLeft: 60 - loadTime
                }
            } else {
                return {
                    loadTimeLeft: Math.round(loadTime * 0.3),
                    ...loadTimeResult,
                }
            }
        }

        throw new Error('Response time is undefined')
    }

    private createCompleteTimeElements(completeTime: number) {
        if (completeTime <= 10) {
            return {
                completeTimeColor: this.GREEN,
                completegood: 'Very good'
            }
        } else if (completeTime > 10 && completeTime < 20) {
            return {
                completeTimeColor: this.YELLOW,
                completegood: 'You need to do better'
            }
        } else if (completeTime >= 20) {
            const completeTimeResult = {
                completeTimeColor: this.RED,
                completegood: 'Very slow, must fix!'
            }

            if (completeTime < 60) {
                return {
                    ...completeTimeResult,
                    completeTimeLeft: 60 - completeTime
                }
            } else {
                return {
                    completeTimeLeft: Math.round(completeTime * 0.3),
                    ...completeTimeResult,
                }
            }
        }

        throw new Error('Response time is undefined')
    }
}