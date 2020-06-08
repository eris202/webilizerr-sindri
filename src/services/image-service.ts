import { Service } from "typedi"
import axios from "axios"
import firebaseAdmin from '../config/firebase-setup'

@Service()
export class ImageService {

    storeImage = async (reportImageUrl: string, reportId: number) => {
        const response = await axios.get(reportImageUrl, {
            responseType: 'stream',
        })

        const bucket = firebaseAdmin.storage().bucket('webilizerr.appspot.com')
        const imageName = reportImageUrl.replace('https://seoptimer.com/screenshots/', '')
        const storageUrl = `report-${reportId}-${imageName}`

        const file = bucket.file(storageUrl)
        const stream = file.createWriteStream({
            contentType: 'image/jpeg',
            metadata: {
                custom: 'metadata'
            }
        })

        const promisedPipe = new Promise((resolve, error) => {
            response
                .data
                .pipe(stream)
                .on('error', function(err) {
                    console.log('errored')
                    error(err)
                })
                .on('finish', function() {
                    console.log('finished')
                    resolve()
                });
        })

        await promisedPipe
        await file.makePublic()

        return `https://firebasestorage.googleapis.com/v0/b/webilizerr.appspot.com/o/${storageUrl}?alt=media`
    }
}