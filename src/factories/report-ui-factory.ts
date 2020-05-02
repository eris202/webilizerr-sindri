import { Service } from "typedi";

@Service()
export class ReportUiFactory {
    
    getUiAttributes = (hasPassed) => {
        if (hasPassed) {
            return {
                color: 'panel-success',
                warning: 'Good'
            }
        } else if (hasPassed) {
            return {
                color: 'panel-danger',
                warning: 'Warning'
            }
        }

        return {
            color: 'panel-warning',
            warning: 'Info'
        }
    }
}