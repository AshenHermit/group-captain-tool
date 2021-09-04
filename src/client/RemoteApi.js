import { config } from "./Config"
import { DayData, GroupData as GroupData, Person } from "./GroupLibrary"

function createDefaultGroup(){ 
    var group = new GroupData()
    if(config.createTestData){
        group.addPerson(new Person("Морозов Егор", {"vk": "https://vk.com/namelessvoice"}, "https://sun9-83.userapi.com/impg/Q4OJDXd6Mi_31d1jbc7mzISzaOtcCVOucMih2A/8JnV7gQjF9o.jpg?size=894x894&quality=96&sign=ce14e6c952ac472e41438a0794049745&type=album"))
        group.addPerson(new Person("another", {}))
        group.addPerson(new Person("second", {"vk": "https://vk.com/ubercentrist"}, "https://sun9-81.userapi.com/impg/mIIQPvjJk5zWaAtxsTBqfjBLwcH-dNbzZvZYNg/6vzRcijCHKI.jpg?size=320x244&quality=96&sign=b115da6b77d29553c40012f788142b2d&type=album"))
        group.addPerson(new Person("second", {"vk": "https://vk.com/ubercentrist"}, "https://sun9-81.userapi.com/impg/mIIQPvjJk5zWaAtxsTBqfjBLwcH-dNbzZvZYNg/6vzRcijCHKI.jpg?size=320x244&quality=96&sign=b115da6b77d29553c40012f788142b2d&type=album"))
        group.addPerson(new Person("second", {"vk": "https://vk.com/ubercentrist"}, "https://sun9-81.userapi.com/impg/mIIQPvjJk5zWaAtxsTBqfjBLwcH-dNbzZvZYNg/6vzRcijCHKI.jpg?size=320x244&quality=96&sign=b115da6b77d29553c40012f788142b2d&type=album"))
    }
    return group
}
function createDefaultDay(){
    var day = new DayData()
    if(config.createTestData){
        
    }
    return day
}

export class RemoteApi{
    constructor(){
        this.username=""
        this.password=""
        this.userCaptainGroup=""
    }

    logIn(username, password, callback){
        try{
            var apiRequestUrl = `login.php?username=${username}&password=${password}`
            fetch(config.rootApiUrl+apiRequestUrl)
            .then(req=>req.json()).then(data=>{
                if(!(data instanceof Array) && ("error" in data)) throw data
                this.username = username
                this.password = password
                this.userCaptainGroup = data[5]
                callback(true)
            }).catch((reason)=>{
                console.log("cant log in")
                console.error(reason)
                callback(false)
            })
        }catch(e){
            console.error(e)
            callback(false)
        }
    }

    makeWriteRequest(apiRequestUrl, exportableData, postData, callback){
        var rawData = exportableData.exportData()
        var mainPostData = {
            data: JSON.stringify(rawData),
            username: this.username,
            password: this.password,
        }
        Object.assign(mainPostData, postData)
        var formData = new FormData()
        Object.keys(mainPostData).forEach(key=>{
            formData.append(key, mainPostData[key])
        })

        try{
            fetch(config.localApiUrl+apiRequestUrl, {
                method: 'POST',
                body: formData
            }).then(req=>req.json()).then(data=>{
                if("error" in data) throw data
                callback(true)
            }).catch((reason)=>{
                console.error(reason)
                callback(false)
            })
        }catch(e){
            console.error(e)
            callback(false)
        }
    }
    makeGetDataRequest(apiRequestUrl, exportableClass, defaultValue, callback){
        try{
            fetch(config.localApiUrl+apiRequestUrl).then(req=>req.json()).then(data=>{
                var exportable = new exportableClass()
                exportable.importData(data)
                callback(exportable)
            }).catch((reason)=>{
                console.error(reason)
                callback(defaultValue)
            })
        }
        catch(e){
            console.error(e)
            callback(defaultValue)
        }
    }
    
    getGroup(groupName, callback){
        this.makeGetDataRequest(
            `get_group.php?group_name=${groupName}`, 
            GroupData, createDefaultGroup(), group=>{
                callback(group)
        })
    }
    writeGroup(groupName, groupData, callback){
        this.makeWriteRequest(
            "write_group.php", groupData, {group_name: groupName}, success=>{
            callback(success)
        })
    }

    getDayData(groupName, dayTimestamp, callback){
        this.makeGetDataRequest(
            `get_day.php?group_name=${groupName}&day_timestamp=${dayTimestamp}`, 
            DayData, createDefaultDay(), day=>{
                callback(day)
        })
    }
    writeDayData(groupName, dayTimestamp, dayData, callback){
        this.makeWriteRequest(
            "write_day.php", dayData,
            {group_name: groupName, day_timestamp: dayTimestamp}, 
            success=>{
                callback(success)
            }
        )
    }
}