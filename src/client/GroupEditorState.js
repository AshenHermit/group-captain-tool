import { GroupData, Schedule } from "./GroupLibrary"
import { RemoteApi } from "./RemoteApi"
import { EventHandler } from "event-js"



export class GroupEditorState{
    constructor(api){
        /**@type {RemoteApi} */
        this.api = api
        this.currentGroupName = ""
        this.groupData = new GroupData()

        this.onGroupDataChanged = new EventHandler(this)
    }

    setCurrentGroup(groupName, callback){
        this.currentGroupName = groupName
        this.api.getGroup(this.currentGroupName, ((data)=>{
            this.groupData = data
            
            if(callback!=null) callback()
            this.onGroupDataChanged.publish()
        }).bind(this))
    }

    save(callback=null){
        this.api.writeGroup(this.currentGroupName, this.groupData, (success)=>{
            if(!success) console.error("cant write group data")
            if(callback) callback(success)
        })
    }

    applyNewSchedule(newSchedule){
        var oldData = this.groupData.schedule.scheduleData
        var newData = newSchedule

        var lessonsLinks = {}
        Object.keys(oldData).forEach(day=>{
            oldData[day].lessons.forEach((lessonsList, llst)=>{
                lessonsList.forEach((lesson, l)=>{
                    if(lesson.links) lessonsLinks[lesson.types + lesson.name] = lesson.links
                })
            })
        })
        Object.keys(newData).forEach(day=>{
            newData[day].lessons.forEach((lessonsList, llst)=>{
                lessonsList.forEach((lesson, l)=>{
                    var links = lessonsLinks[lesson.types + lesson.name]
                    if(links) lesson.links = links
                })
            })
        })
        this.groupData.schedule.scheduleData = newData
        this.onGroupDataChanged.publish()

        console.log("schedule data updated, but not saved. save it by yourself")
    }
}