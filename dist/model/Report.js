const mongoose = (require = require("mongoose"));
const Schema = mongoose.Schema;
//Create Schema
const ReportSchema = new Schema({
    "success": Boolean,
    "data": {
        "id": Number,
        "input": {
            "url": String,
            "pdf": Boolean,
            "callback": Boolean
        },
        "output": {
            "success": Boolean,
            "callback": Boolean,
            "pdf": String,
            "recommendation_count": Number,
            "screenshot": String,
            "report_generation_time": String,
            "request_completion_time": String,
            "scores": {
                "overall": {
                    "grade": String,
                    "newGrade": Number,
                    "colorGrade": String,
                    "title": String,
                    "description": String
                },
                "seo": {
                    "grade": String,
                    "newGrade": Number,
                    "colorGrade": String,
                    "title": String,
                    "description": String
                },
                "social": {
                    "grade": String,
                    "newGrade": Number,
                    "colorGrade": String,
                    "title": String,
                    "description": String
                },
                "performance": {
                    "grade": String,
                    "title": String,
                    "newGrade": Number,
                    "colorGrade": String,
                    "description": String
                },
                "ui": {
                    "grade": String,
                    "newGrade": Number,
                    "title": String,
                    "colorGrade": String,
                    "description": String
                },
                "security": {
                    "grade": String,
                    "newGrade": Number,
                    "colorGrade": String,
                    "title": String,
                    "description": String
                }
            },
            "keywords": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "keywords": [
                        {
                            "word": String,
                            "count": Number,
                            "title": Boolean,
                            "description": Boolean,
                            "headers": Boolean,
                            "titleColor": String,
                            "descriptionColor": String,
                            "headersColor": String,
                            "titleCheck": String,
                            "descriptionCheck": String,
                            "headersCheck": String
                        }
                    ],
                }
            },
            "title": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "value": String,
                "data": String
            },
            "description": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "value": String,
                "data": String
            },
            "headers": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "h1count": Number,
                "h2count": Number,
                "h3count": Number,
                "h4count": Number,
                "h5count": Number,
                "h6count": Number,
                "data": {
                    "h1": [],
                    "h2": {
                        "type": Array,
                        "items": {
                            "type": String
                        }
                    },
                    "h3": {
                        "type": Array,
                        "items": {
                            "type": String
                        }
                    },
                    "h4": {
                        "type": Array,
                        "items": {
                            "type": String
                        }
                    },
                    "h5": {
                        "type": Array,
                        "items": {
                            "type": String
                        }
                    },
                    "h6": {
                        "type": Array,
                        "items": {
                            "type": String
                        }
                    },
                }
            },
            "contentLength": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "value": String
            },
            "imageAlt": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "total": Number,
                    "altCount": Number,
                    "noAltCount": Number
                }
            },
            "backlinks": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "backlinks": Number,
                    "allbacklinks": Number,
                    "mozda": Number
                }
            },
            "onPageLinks": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "total": Number,
                    "filesCount": Number,
                    "externalCount": Number,
                    "nofollowCount": Number,
                    "externalPercentage": Number,
                    "nofollowPercentage": Number
                }
            },
            "brokenLinks": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "type": Array,
                    "items": {
                        "type": String
                    },
                }
            },
            "friendlyUrls": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "noindexTags": {
                "section": String,
                "passed": Boolean,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "noindexHeaders": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "robotsTxt": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": Boolean,
                "data": String
            },
            "sitemap": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "found": Number,
                    "tested": Number,
                    "urls": Array
                }
            },
            "analytics": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": [{
                        "id": String,
                        "name": String
                    }]
            },
            "schemaOrg": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "deviceRendering": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "mobile": String,
                    "tablet": String
                }
            },
            "mobileViewport": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "flash": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "iframe": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "favicon": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "legibleFonts": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "tapTargetSizing": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "serverResponseTime": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "responseTime": Number,
                    "loadTime": Number,
                    "completeTime": Number,
                    "responseTimeLeft": Number,
                    "loadTimeLeft": Number,
                    "completeTimeLeft": Number,
                    "responseTimeColor": String,
                    "completeTimeColor": String,
                    "loadTimeColor": String,
                    "loadgood": String,
                    "loadbad": String,
                    "loadmedium": String,
                    "completegood": String,
                    "completebad": String,
                    "completemedium": String,
                    "responsegood": String,
                    "responsebad": String,
                    "responsemedium": String
                }
            },
            "pageSize": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "totalSize": Number,
                    "htmlSize": Number,
                    "cssSize": Number,
                    "jsSize": Number,
                    "imageSize": Number,
                    "otherSize": Number,
                    "mbSize": String
                }
            },
            "numberOfResources": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "total": Number,
                    "images": Number,
                    "css": Number,
                    "js": Number,
                    "html": Number,
                    "other": Number
                }
            },
            "javascriptErrors": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "gzip": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": Object
            },
            "optimizedImages": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "minified": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "deprecated": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "inlineCss": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "facebookLink": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "facebookPixel": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "twitterLink": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "twitterTags": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    'twitter:card': String,
                    'twitter:description': String,
                    'twitter:title': String,
                    'twitter:image': String
                }
            },
            "twitterActivity": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "followers": Number
                }
            },
            "instagramLink": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "youtubeLink": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "youtubeActivity": Boolean,
            "linkedInLink": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": Object
            },
            "openGraphTags": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    'og:locale': String,
                    'og:locale:alternate': String,
                    'og:type': String,
                    'og:title': String,
                    'og:description': String,
                    'og:url': String,
                    'og:site_name': String,
                    'og:image': String
                }
            },
            "socialActivity": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "facebook_share": Number,
                    "pinterest_share": Number,
                    "gplus": Number,
                    "linkedin": Number,
                    "stumbledupon": String
                }
            },
            "sslEnabled": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "httpsRedirect": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "malware": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "googleVerified": String,
                "mcafeeVerified": String,
                "nortonVerified": String,
                "avgVerified": String,
                "googleColor": String,
                "mcafeeColor": String,
                "nortonColord": String,
                "avgColor": String,
                "data": {
                    "google": String,
                    "mcafee": String,
                    "norton": String,
                    "avg": String
                }
            },
            "outdatedApps": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String
            },
            "email": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
            },
            "technologies": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": Array
            },
            "ip": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "dns": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "webServer": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "charset": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": String
            },
            "backlinksList": {
                "section": String,
                "passed": Boolean,
                "color": String,
                "darkColor": String,
                "warning": String,
                "shortAnswer": String,
                "recommendation": String,
                "data": {
                    "allbacklinks": Number,
                    "allbacklinks_root": Number,
                    "mozda": Number,
                    "mozda_root": Number,
                    "backlinks": Number,
                    "backlinks_root": Number,
                    "list": [
                        {
                            "anchor_text": String,
                            "title": String,
                            "url": String,
                            "page_authority": Number,
                            "domain_authority": Number
                        }
                    ]
                }
            },
            "recommendations": [
                {
                    "priority": String,
                    "section": String,
                    "recommendation": String
                }
            ],
            "created_at": Date,
            "completed_at": Date
        }
    }
});
//module.exports = Report
//module.exports = Report = mongoose.model('report', ReportSchema);
// Create report model
const Report = mongoose.model("report", ReportSchema);
// Export model to use in other files
module.exports = Report;
/*
@jaydeverett jaydeverett typo
4bf1c4b on 25 Oct 2017
114 lines (103 sloc)  2.8 KB

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates.'
    }],
    address: {
      type: String,
      required: 'You must supply an address'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
*/
//# sourceMappingURL=Report.js.map