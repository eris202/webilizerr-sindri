const mongoose = require = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const WeatherSchema = new Schema({
    /* one option
    name: string {
        name, ble, ble
    }
    */
    /* multiple options
    name:  {
        type: String,
        required: [true, 'Name field is required!]
        default: true
    }
    */
    sessionId: { type: String, required: true },
});
//module.exports = Report
//module.exports = Report = mongoose.model('report', ReportSchema);
// Create report model
const Weather = mongoose.model('weather', WeatherSchema);
// Export model to use in other files
module.exports = Weather;
//# sourceMappingURL=Weather.js.map