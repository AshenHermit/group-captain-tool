var USEGLOBALAPI = false
var DEBUG = window.location.host.indexOf("localhost:")!=-1

var sitepath = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 1))

var config = {
    defaultGroupName: "ИНБО-12-21",
    locale: "ru",
    localApiUrl: sitepath+"/api/",
    rootApiUrl: "/api/",
    usernameCookieName: "username", 
    passwordCookieName: "password", 
    createTestData: DEBUG,
    themes: ["light", "dark"],
    sitename: "group-captain-tool",
    blankImage: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
}
if(USEGLOBALAPI){
    var hostUrl = "http://ashen-hermit.42web.io"
    config.localApiUrl = hostUrl + config.localApiUrl
    config.rootApiUrl = hostUrl + config.rootApiUrl
}

export { config }