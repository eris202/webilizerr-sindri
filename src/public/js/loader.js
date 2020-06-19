$(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyDRcX1FjyUXnRYzzf2Zmo13j8yQbSb77Ss",
        authDomain: "webilizerr.firebaseapp.com",
        databaseURL: "https://webilizerr.firebaseio.com",
        projectId: "webilizerr",
        storageBucket: "webilizerr.appspot.com",
        messagingSenderId: "1053974931679",
        appId: "1:1053974931679:web:1e503a60232ecc6494216a",
        measurementId: "G-FCER0W6S5N"
    }

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
    firebase.analytics()

    // Get a reference to the database service
    var database = firebase.database()
    var param = getParameterByName('reportId')

    var ref = database.ref('reports/' + param)

    ref.once('child_added', function (snap) {
        if(!snap.val()) {
            return
        }

        var origin = window.origin
        var modifiedUrl = origin + "/report/" + param
        
        window.location = modifiedUrl
    })

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
})