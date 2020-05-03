import { Service } from "typedi";

@Service()
export class HeaderUiFactory {

    decorateHeaderSection = (json: any) => {
        json.headers.h1count = json.headers.data.h1.length
        json.headers.h2count = json.headers.data.h2.length
        json.headers.h3count = json.headers.data.h3.length
        json.headers.h4count = json.headers.data.h4.length
        json.headers.h5count = json.headers.data.h5.length
        json.headers.h6count = json.headers.data.h6.length
    }
}