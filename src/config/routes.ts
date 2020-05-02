import controller from '../controllers/webDataController'
import reportController from '../controllers/reportController'
import loginController from '../controllers/authController'
import registerController from '../controllers/registerController'
import forgotpsController from '../controllers/forgotpsController'


const authMiddleWare = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/index");
}

export interface RouteMapper {
    [key: string]: RouteDefinition[]
}

export interface RouteDefinition {
    method: 'post' | 'get' | 'put' | 'delete',
    handler: (req, res) => void
}

export const routes: RouteMapper[] = [
    {
        '/': [
            {
                method: 'post',
                handler: controller.postReport,
            },
            {
                method: 'get',
                handler: controller.renderHomePage,
            }
        ]
    },
    {
        '/index/report': [
            {
                method: 'post',
                handler: controller.getReport
            }
        ]
    },
    {
        '/report/:reportId': [
            {
                method: 'get',
                handler: reportController.renderReportPage
            }
        ]
    },
    {
        '/report': [
            {
                method: 'post',
                handler: reportController.getReport
            }
        ]
    },
    {
        '/check/report': [
            {
                method: 'post',
                handler: controller.getReport
            }
        ]
    },
    {
        '/login': [
            {
                method: 'get',
                handler: loginController.renderLoginPage
            },
            {
                method: 'post',
                handler: loginController.postLogin
            }
        ]
    },
    {
        '/forgotpassword': [
            {
                method: 'get',
                handler: forgotpsController.renderForgotpasswordPage
            },
            {
                method: 'post',
                handler: forgotpsController.postForgotPassword
            }
        ]
    },
    {
        '/register': [
            {
                method: 'get',
                handler: registerController.renderRegisterPage
            },
            {
                method: 'post',
                handler: registerController.postRegister
            }
        ]
    },
    {
        '/callback': [
            {
                method: 'post',
                handler: reportController.getCallback
            }
        ]
    },
    {
        '/features': [
            {
                method: 'get',
                handler: (req, res) => res.render('features')
            }
        ]
    },
    {
        '/about-us': [
            {
                method: 'get',
                handler: (req, res) => res.render('about-us')
            }
        ]
    },
    {
        '/appointment': [
            {
                method: 'get',
                handler: (req, res) => res.render('appointment')
            }
        ]
    },
    {
        '/get-in-touch': [
            {
                method: 'get',
                handler: (req, res) => res.render('get-in-touch')
            }
        ]
    },
    {
        '/thank-you': [
            {
                method: 'get',
                handler: (req, res) => res.render('thank-you')
            }
        ]
    },
]
