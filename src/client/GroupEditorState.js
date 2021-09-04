import { GroupData } from "./GroupLibrary"
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
}