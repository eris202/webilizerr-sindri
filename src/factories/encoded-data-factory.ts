import { Service } from "typedi";

@Service()
export class EncodedDataFactory {

    decorateEncodedData = (json: any) => {
        json.pageSize.data.mbSize = this.formatBytes(json.pageSize.data.totalSize)

        var string = json.dns.data;

        string = string.replace(/[<BR>]/g, " ");
        string = string.replace(/[br]/g, " ");
        json.dns.data = string;

        var string = json.dns.data;
        string = string.replace(/[<BR>]/g, " ");
        string = string.replace(/[br]/g, " ");
        json.dns.data = string;
    }

    private formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
    }
}