import { EventHandler } from "event-js"
import { DayData } from "./GroupLibrary"
import { RemoteApi } from "./RemoteApi"

export class DayEditorState{
    static createTodayTimestamp(){
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    }
    constructor(api){
        /**@type {RemoteApi} */
        this.api = api 
        this.currentDayTimestamp = DayEditorState.createTodayTimestamp()
        this.currentDayDate = new Date(this.currentDayTimestamp)
        this.dayData = new DayData()

        this.onDayDataChanged = new EventHandler(this)
    }

    setCurrentDayTimestamp(groupName, dayTimestamp, callback){
        this.currentDayTimestamp = dayTimestamp
        this.currentDayDate = new Date(this.currentDayTimestamp)
        this.api.getDayData(groupName, this.getCurrentDayTimestamp(), ((dayData)=>{
            this.dayData = dayData
            if(callback!=null) callback()
            this.onDayDataChanged.publish()
        }).bind(this))
    }
    getCurrentDayTimestamp(){
        return this.currentDayTimestamp
    }

    save(groupName, callback=null){
        this.api.writeDayData(groupName, this.currentDayTimestamp, this.dayData, (success)=>{
            if(!success) console.error("cant write current day data")
            if(callback) callback(success)
        })
    }
}