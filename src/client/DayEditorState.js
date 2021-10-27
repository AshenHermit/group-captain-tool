import { EventHandler } from "event-js"
import { DayData } from "./GroupLibrary"
import { RemoteApi } from "./RemoteApi"
import { createTodayTimestamp, dayTsStep } from "./Utils"

export class DayPost{
    constructor(dayTimestamp, dayData){
        /** @type {Number} */
        this.dayTimestamp = dayTimestamp
        /** @type {DayData} */
        this.dayData = dayData
    }
}

export class DaysHistory{
    constructor(groupName, api){
        this.groupName = groupName
        this.api = api
        /**@type {Dict<DayPost>} */
        this.days = {}
        this.dayTimestamps = {}
        
        this.setViewTimestamp(createTodayTimestamp())
        this.minDayTimestamp = this.viewDayTimestamp
        this.onHistoryChanged = new EventHandler(this)
    }
    setViewTimestamp(dayTimestamp){
        this.viewDayTimestamp = dayTimestamp
        this.viewDayDate = new Date(this.viewDayTimestamp)
    }
    clearDayTimestamp(){
        this.dayTimestamps = {}
        this.days = {}
    }
    setGroup(groupName){
        if(this.groupName!=groupName){
            this.clearDayTimestamp()
        }
        this.groupName = groupName
    }
    setDayData(dayTimestamp, dayData){
        this.dayTimestamps[dayTimestamp] = dayTimestamp
        this.days[dayTimestamp] = new DayPost(dayTimestamp, dayData)

        this.minDayTimestamp = Math.min(this.minDayTimestamp, dayTimestamp)
    }
    setScanTimestampOffset(dayTimestamp){
        this.minDayTimestamp = dayTimestamp
    }
    getSortedDays(){
        return Object.values(this.dayTimestamps).sort().reverse().map(ts=>this.days[ts])
    }
    getSortedDaysBefore(timestamp){
        return Object.values(this.dayTimestamps).filter(x=> x<=timestamp ).sort().reverse().map(ts=>this.days[ts])
    }
    getDayData(dayTimestamps){
        return this.days[dayTimestamps]
    }
    loadAtLeast(scanAmount){
        // if(this.minDayTimestamp == )
        this.loadMore(scanAmount)
    }
    loadDayData(timestamp){
        this.api.getDayData(this.groupName, timestamp, ((dayData)=>{
            this.setDayData(timestamp, dayData)

            if(dayData.documentsLibrary.documents.length>0)
                this.onHistoryChanged.publish()
        }).bind(this))
    }
    loadMore(scanAmount){
        var startMinTS = this.minDayTimestamp
        //scan month
        for(var i=0; i<scanAmount; i++){
            var timestamp = startMinTS - (i+1)*dayTsStep
            // if date not exists
            if(!(timestamp in this.days)){
                this.loadDayData(timestamp)
            }
        }
    }
    countDocuments(list){
        var count = 0
        list.forEach(day => count+=day.dayData.documentsLibrary.documents.length)
        return count
    }
    countDaysWithDocuments(list){
        var count = 0
        list.forEach(day => {
            if(day.dayData.documentsLibrary.documents.length>0){
                count+=1
            }
        })
        return count
    }
}

export class DayEditorState{
    constructor(api){
        /**@type {RemoteApi} */
        this.api = api
        this.currentDayTimestamp = createTodayTimestamp()
        this.currentDayDate = new Date(this.currentDayTimestamp)
        this.dayData = new DayData()

        this.onDayDataChanged = new EventHandler(this)
        this.daysHistory = new DaysHistory("", api)
    }
    setCurrentDayTimestamp(groupName, dayTimestamp, callback){
        this.daysHistory.setGroup(groupName)
        
        this.currentDayTimestamp = dayTimestamp
        this.currentDayDate = new Date(this.currentDayTimestamp)
        
        var historyDay = this.daysHistory.getDayData(dayTimestamp)
        this.dayData.documentsLibrary.isLoaded = false
        if(historyDay){
            this.dayData = historyDay.dayData
            if(callback!=null) callback()
            this.onDayDataChanged.publish()
            this.dayData.documentsLibrary.isLoaded = true
        }else{
            this.api.getDayData(groupName, this.getCurrentDayTimestamp(), ((dayData)=>{
                this.dayData = dayData
    
                this.daysHistory.setDayData(
                    this.getCurrentDayTimestamp(), this.dayData)
                
                if(callback!=null) callback()
                this.onDayDataChanged.publish()
                this.dayData.documentsLibrary.isLoaded = true
            }).bind(this))
        }
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