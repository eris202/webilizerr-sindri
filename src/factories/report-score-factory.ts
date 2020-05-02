import { Service } from "typedi";

@Service()
export class ReportScoreFactory {

    getScore = (sectionName: string, hasPassed): ReportScore => {
        if (sectionName === "performance") {
            if (hasPassed === true) {
                return {
                    perC: 1
                }
            } else if (hasPassed === false) {
                return {
                    perW: 1
                }
            }
        } else if (sectionName === "seo") {
            if (hasPassed === true) {
                return {
                    seoC: 1
                }
            } else if (hasPassed === false) {
                return {
                    seoW: 1
                }
            }
        } else if (sectionName == "social") {
            if (hasPassed == true) {
                return {
                    socialC: 1
                }
            } else if (hasPassed == false) {
                return {
                    socialW: 1
                }
            }
        } else if (sectionName === "ui") {
            if (hasPassed === true) {
                return {
                    uiC: 1
                }
            } else if (hasPassed === false) {
                return {
                    uiW: 1
                }
            }
        } else if (sectionName === "security") {
            if (hasPassed === true) {
                return {
                    secC: 1
                }
            } else if (hasPassed === false) {
                return {
                    secW: 1
                }
            }
        }
    }
}

export class ReportScore {
    perC?: number = 0
    perW?: number = 0
    seoC?: number = 0
    seoW?: number = 0
    socialC?: number = 0
    socialW?: number = 0
    uiC?: number = 0
    uiW?: number = 0
    secC?: number = 0
    secW?: number = 0

    sum?= (otherScore: ReportScore) => {
        this.perC += otherScore.perC
        this.perW += otherScore.perW
        this.seoC += otherScore.seoC
        this.seoW += otherScore.seoW
        this.socialC += otherScore.socialC
        this.socialW += otherScore.socialW
        this.uiC += otherScore.uiC
        this.uiW += otherScore.uiW
        this.secC += otherScore.secC
        this.secW += otherScore.secW
    }

    createGrade?= (): ReportGrade => {
        const performanceGrade = Math.round(100 * (this.perC / (this.perC + this.perW)))
        const seoGrade = Math.round(100 * (this.seoC / (this.seoC + this.seoW)))
        const uiGrade = Math.round(100 * (this.uiC / (this.uiC + this.uiW)))
        const securityGrade = Math.round(100 * (this.secC / (this.secC + this.secW)))
        const socialGrade = Math.round(100 * (this.socialC / (this.socialC + this.socialW)))

        const sumOfAllGrades = (performanceGrade + seoGrade + uiGrade
            + securityGrade + socialGrade)

        const overallGrade = Math.round(sumOfAllGrades / 5)

        return new ReportGrade(
            performanceGrade,
            seoGrade,
            uiGrade,
            securityGrade,
            socialGrade,
        )
    }
}

export class ReportGrade {
    overallGrade: number

    constructor(public performanceGrade: number,
        public seoGrade: number,
        public uiGrade: number,
        public securityGrade: number,
        public socialGrade: number,
    ) {
        const sumOfAllGrades = (this.performanceGrade + this.seoGrade + this.uiGrade
            + this.securityGrade + this.socialGrade)
        
        this.overallGrade = Math.round(sumOfAllGrades / 5)
    }

    decorateJsonWithGrades(uiModel: any) {
        uiModel.scores.performance.newGrade = this.performanceGrade;
        uiModel.scores.seo.newGrade = this.seoGrade;
        uiModel.scores.ui.newGrade = this.uiGrade;
        uiModel.scores.security.newGrade = this.securityGrade;
        uiModel.scores.social.newGrade = this.socialGrade;
        uiModel.scores.overall.newGrade = this.overallGrade;
    }
}