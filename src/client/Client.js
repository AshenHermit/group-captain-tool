import { RemoteApi } from "./RemoteApi"
import Cookies from "js-cookie"
import { config } from "./Config"

export class Client{
    constructor(){
        this.api = new RemoteApi()
        this.loggedIn = false
    }
    
    /**
     * Checking cookies and tries to log in with saved fields
     * @param {Function} callback
     * @returns true if needed cookies found, else false
     */
    tryLoginWithCookies(callback){
        var username = Cookies.get(config.usernameCookieName)
        var password = Cookies.get(config.passwordCookieName)
        if(!username || !password) return false;

        this.api.logIn(username, password, callback)
        return true
    }
    saveCookies(username, password){
        Cookies.set(config.usernameCookieName, username)
        Cookies.set(config.passwordCookieName, password)
    }
    logInWithFields(username, password, callback){
        this.api.logIn(username, password, (success)=>{
            if(success){
                this.saveCookies(username, password)
            }
            callback(success)
        })
    }
}