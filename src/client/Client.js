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

        this.api.logIn(username, password, success=>{
            if(success) this.loggedIn = true
            callback(success)
        })
        return true
    }
    saveCookies(username, password){
        Cookies.set(config.usernameCookieName, username, { expires: 365 })
        Cookies.set(config.passwordCookieName, password, { expires: 365 })
    }
    logInWithFields(username, password, callback){
        this.api.logIn(username, password, (success)=>{
            if(success){
                this.loggedIn = true
                this.saveCookies(username, password)
            }
            callback(success)
        })
    }
    logOut(callback=null){
        Cookies.remove(config.usernameCookieName)
        Cookies.remove(config.passwordCookieName)
        this.loggedIn = false
        if(callback) callback()
    }
}