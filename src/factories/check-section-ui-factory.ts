import { Service } from "typedi";

@Service()
export class CheckSectionUiFactory {

    decorateDescriptionSection = (checkSection: any) => {
        switch (checkSection.description) {
            case true:
                checkSection.descriptionColor = "green"
                checkSection.descriptionCheck = "mdi-check"
                break;
            case false:
                checkSection.descriptionColor = "red"
                checkSection.descriptionCheck = "mdi-close"

                break
        }
    }

    decorateTitleSection = (checkSection: any) => {
        switch (checkSection.title) {
            case true:
                checkSection.titleColor = "green"
                checkSection.titleCheck = "mdi-check"
                break;
            case false:
                checkSection.titleColor = "red"
                checkSection.titleCheck = "mdi-close"
                break
        }
    }

    decorateHeaderSection = (checkSection: any) => {
        switch (checkSection.headers) {
            case true:
                checkSection.headersColor = "green"
                checkSection.headersCheck = "mdi-check"
                break
            case false:
                checkSection.headersColor = "red"
                checkSection.headersCheck = "mdi-close"
        }
    }
}