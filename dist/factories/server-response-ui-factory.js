"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let ResponseUiFactory = class ResponseUiFactory {
    constructor() {
        this.GREEN = "#16fa62";
        this.YELLOW = "#fae316";
        this.RED = "#ff5f68";
        this.decorateResponseUiSection = (json) => {
            const responseTime = json.serverResponseTime.data.responseTime;
            const loadTime = json.serverResponseTime.data.loadTime;
            const completeTime = json.serverResponseTime.data.completeTime;
            const { responseTimeColor, responsegood, responseTimeLeft } = Object.assign({ responseTimeLeft: 0 }, this.createResponseTimeElements(loadTime));
            const { loadTimeColor, loadgood, loadTimeLeft } = Object.assign({ loadTimeLeft: 0 }, this.createLoadTimeElements(loadTime));
            const { completeTimeColor, completegood, completeTimeLeft } = Object.assign({ completeTimeLeft: 0 }, this.createCompleteTimeElements(loadTime));
            json.serverResponseTime.data.responsegood = responsegood;
            json.serverResponseTime.data.loadgood = responsegood;
            json.serverResponseTime.data.completegood = completegood;
            json.serverResponseTime.data.responseTime = responseTime;
            json.serverResponseTime.data.loadTime = loadTime;
            json.serverResponseTime.data.completeTime = completeTime;
            json.serverResponseTime.data.responseTimeColor = responseTimeColor;
            json.serverResponseTime.data.loadTimeColor = loadTimeColor;
            json.serverResponseTime.data.completeTimeColor = completeTimeColor;
            json.serverResponseTime.data.responseTimeLeft = responseTimeLeft;
            json.serverResponseTime.data.loadTimeLeft = loadTimeLeft;
            json.serverResponseTime.data.completeTimeLeft = completeTimeLeft;
        };
    }
    createResponseTimeElements(responseTime) {
        if (responseTime <= 10) {
            return {
                responseTimeColor: this.GREEN,
                responsegood: 'Very good',
            };
        }
        else if (responseTime > 10 && responseTime < 20) {
            return {
                responseTimeColor: this.YELLOW,
                responsegood: 'You need to do better',
            };
        }
        else if (responseTime >= 20) {
            const reponseTimeResult = {
                responseTimeColor: this.RED,
                responsegood: 'Very slow, must fix!',
            };
            if (responseTime < 60) {
                return Object.assign(Object.assign({}, reponseTimeResult), { responseTimeLeft: 60 - responseTime });
            }
            else {
                return Object.assign({ responseTimeLeft: Math.round(responseTime * 0.3) }, reponseTimeResult);
            }
        }
        throw new Error('Response time is undefined');
    }
    createLoadTimeElements(loadTime) {
        if (loadTime <= 10) {
            return {
                loadTimeColor: this.GREEN,
                loadgood: 'Very good'
            };
        }
        else if (loadTime > 10 && loadTime < 20) {
            return {
                loadTimeColor: this.YELLOW,
                loadgood: 'You need to do better'
            };
        }
        else if (loadTime >= 20) {
            const loadTimeResult = {
                loadTimeColor: this.RED,
                loadgood: 'Very slow, must fix!'
            };
            if (loadTime < 60) {
                return Object.assign(Object.assign({}, loadTimeResult), { loadTimeLeft: 60 - loadTime });
            }
            else {
                return Object.assign({ loadTimeLeft: Math.round(loadTime * 0.3) }, loadTimeResult);
            }
        }
        throw new Error('Response time is undefined');
    }
    createCompleteTimeElements(completeTime) {
        if (completeTime <= 10) {
            return {
                completeTimeColor: this.GREEN,
                completegood: 'Very good'
            };
        }
        else if (completeTime > 10 && completeTime < 20) {
            return {
                completeTimeColor: this.YELLOW,
                completegood: 'You need to do better'
            };
        }
        else if (completeTime >= 20) {
            const completeTimeResult = {
                completeTimeColor: this.RED,
                completegood: 'Very slow, must fix!'
            };
            if (completeTime < 60) {
                return Object.assign(Object.assign({}, completeTimeResult), { completeTimeLeft: 60 - completeTime });
            }
            else {
                return Object.assign({ completeTimeLeft: Math.round(completeTime * 0.3) }, completeTimeResult);
            }
        }
        throw new Error('Response time is undefined');
    }
};
ResponseUiFactory = __decorate([
    typedi_1.Service()
], ResponseUiFactory);
exports.ResponseUiFactory = ResponseUiFactory;
//# sourceMappingURL=server-response-ui-factory.js.map