import { config, DEBUG } from "./Config"
import { DayData, DocumentData, GroupData as GroupData, Person, Schedule } from "./GroupLibrary"

export const testScheduleData = {"1":{"lessons":[[],[],[{"name":"Французский язык","weeks":[2,4,6,8,10,12,14,16],"time_start":"12:40","time_end":"14:10","types":"пр","teachers":["Иванова Е.А."],"rooms":[]}],[{"name":"Французский язык","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"14:20","time_end":"15:50","types":"пр","teachers":["Иванова Е.А."],"rooms":[]},{"name":"История (история России, всеобщая история)","weeks":[2,4,6,8,10,12,14,16],"time_start":"14:20","time_end":"15:50","types":"пр","teachers":["Мельтюхов М.И."],"rooms":["А-204"]}],[{"name":"Линейная алгебра и аналитическая геометрия","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"16:20","time_end":"17:50","types":"пр","teachers":["Немировская-Дутчак О.Э."],"rooms":["А-407"]},{"name":"Линейная алгебра и аналитическая геометрия","weeks":[2,4,6,8,10,12,14,16],"time_start":"16:20","time_end":"17:50","types":"пр","teachers":["Немировская-Дутчак О.Э."],"rooms":["А-407"]}],[{"name":"Математический анализ","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"18:00","time_end":"19:30","types":"пр","teachers":["Немировская-Дутчак О.Э."],"rooms":["А-407"]},{"name":"Математический анализ","weeks":[2,4,6,8,10,12,14,16],"time_start":"18:00","time_end":"19:30","types":"пр","teachers":["Немировская-Дутчак О.Э."],"rooms":["А-407"]}]]},"2":{"lessons":[[],[],[{"name":"Физика (1 п/г)","weeks":[3,7,11,15],"time_start":"12:40","time_end":"14:10","types":"лаб\nлаб","teachers":[],"rooms":["В-327"]},{"name":"Физика (2 п/г)","weeks":[3,7,11,15],"time_start":"12:40","time_end":"14:10","types":"лаб\nлаб","teachers":[],"rooms":["В-327"]}],[{"name":"Физика (1 п/г)","weeks":[3,7,11,15],"time_start":"14:20","time_end":"15:50","types":"лаб\nлаб","teachers":[],"rooms":["В-327"]},{"name":"Физика (2 п/г)","weeks":[3,7,11,15],"time_start":"14:20","time_end":"15:50","types":"лаб\nлаб","teachers":[],"rooms":["В-327"]}],[{"name":"Процедурное программирование","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"16:20","time_end":"17:50","types":"пр","teachers":[],"rooms":["ивц-107"]},{"name":"Процедурное программирование","weeks":[2,4,6,8,10,12,14,16],"time_start":"16:20","time_end":"17:50","types":"пр","teachers":[],"rooms":["ивц-107"]}],[{"name":"Процедурное программирование","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"18:00","time_end":"19:30","types":"пр","teachers":[],"rooms":["ивц-107"]},{"name":"Процедурное программирование","weeks":[2,4,6,8,10,12,14,16],"time_start":"18:00","time_end":"19:30","types":"пр","teachers":[],"rooms":["ивц-107"]}]]},"3":{"lessons":[[],[{"name":"Линейная алгебра и аналитическая геометрия","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"10:40","time_end":"12:10","types":"лк","teachers":["Пихтилькова О.А."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=261210"]},{"name":"Линейная алгебра и аналитическая геометрия","weeks":[2,4,6,8,10,12,14,16],"time_start":"10:40","time_end":"12:10","types":"лк","teachers":["Пихтилькова О.А."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=261210"]}],[],[{"name":"Процедурное программирование","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"14:20","time_end":"15:50","types":"лк","teachers":["Каширская Е.Н."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/course/view.php?id=3994"]},{"name":"История (история России, всеобщая история)","weeks":[2,4,6,8,10,12,14,16],"time_start":"14:20","time_end":"15:50","types":"лк","teachers":["Мельтюхов М.И."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=265868"]}],[{"name":"Введение в профессиональную деятельность","weeks":[2,4,6,8,10,12,14,16],"time_start":"16:20","time_end":"17:50","types":"лк","teachers":["Бергер Е.К."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/course/view.php?id=3683"]}],[]]},"4":{"lessons":[[{"name":"ин.яз 1,2 подгр","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"9:00","time_end":"10:30","types":"пр","teachers":["Рыбакова Е.Е Гаврилова Е.А"],"rooms":["и-304 А-324"]},{"name":"ин.яз 1,2 подгр","weeks":[2,4,6,8,10,12,14,16],"time_start":"9:00","time_end":"10:30","types":"пр","teachers":["Рыбакова Е.Е Гаврилова Е.А"],"rooms":["и-304 А-324"]}],[{"name":"Информатика","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"10:40","time_end":"12:10","types":"пр","teachers":["Норица В.М."],"rooms":["А-424-1"]},{"name":"Информатика","weeks":[2,4,6,8,10,12,14,16],"time_start":"10:40","time_end":"12:10","types":"пр","teachers":["Норица В.М."],"rooms":["А-424-1"]}],[{"name":"Физика","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"12:40","time_end":"14:10","types":"пр","teachers":[],"rooms":["В-408"]},{"name":"Физика","weeks":[2,4,6,8,10,12,14,16],"time_start":"12:40","time_end":"14:10","types":"пр","teachers":[],"rooms":["В-408"]}],[{"name":"Физическая культура и спорт","weeks":[1,3,5,7,9,11,13,15,17],"time_start":"14:20","time_end":"15:50","types":"пр","teachers":[],"rooms":[]},{"name":"Физическая культура и спорт","weeks":[2,4,6,8,10,12,14,16],"time_start":"14:20","time_end":"15:50","types":"пр","teachers":[],"rooms":[]}],[],[]]},"5":{"lessons":[[],[],[],[{"name":"Физика","weeks":[3,5,7,9,11,13,15,17],"time_start":"14:20","time_end":"15:50","types":"лк","teachers":["Давыдов В.А."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=266061"]},{"name":"Физика","weeks":[2,4,6,8,10,12,14,16],"time_start":"14:20","time_end":"15:50","types":"лк","teachers":["Давыдов В.А."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=266061"]}],[{"name":"Математический анализ","weeks":[3,5,7,9,11,13,15,17],"time_start":"16:20","time_end":"17:50","types":"лк","teachers":["Шульман И.Л."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=266889"]},{"name":"Математический анализ","weeks":[2,4,6,8,10,12,14,16],"time_start":"16:20","time_end":"17:50","types":"лк","teachers":["Шульман И.Л."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=266889"]}],[{"name":"Информатика","weeks":[3,5,7,9,11,13,15,17],"time_start":"18:00","time_end":"19:30","types":"лк","teachers":["Смирнов С.С."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=262227"]},{"name":"Информатика","weeks":[2,4,6,8,10,12,14,16],"time_start":"18:00","time_end":"19:30","types":"лк","teachers":["Смирнов С.С."],"rooms":["Д"],"links":["https://online-edu.mirea.ru/mod/webinars/view.php?id=262227"]}]]},"6":{"lessons":[[],[],[],[],[],[]]}}

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
        if(DEBUG){
            if(Math.random()<0.2){
                day.documentsLibrary.addDocument(new DocumentData("title", "desc", "some link"))
            }
            if(Math.random()<0.2){
                day.documentsLibrary.addDocument(new DocumentData("title", "desc", "some link"))
            }
        }
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
    clean_json(json_text){
        json_text = json_text.replaceAll("\t", "\\t")
        json_text = json_text.replaceAll("\r", "\\r")
        json_text = json_text.replaceAll("\n", "\\n")
        return json_text
    }
    makeGetDataRequest(apiRequestUrl, exportableClass, defaultValue, callback){
        try{
            fetch(config.localApiUrl+apiRequestUrl).then(req=>req.text()).then(json_text=>{
                json_text = this.clean_json(json_text)
                var data = JSON.parse(json_text)
                if("error" in data) throw data
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
    makeExternalGetRequest(apiRequestUrl, defaultValue, callback){
        try{
            fetch(apiRequestUrl).then(req=>{
                if(!req.ok) throw req.statusText
                return req.json()
            }).then(data=>{
                callback(data)
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

    getFullSchedule(groupName, callback){
        this.makeExternalGetRequest(`http://schedule.mirea.ninja:5000/api/schedule/${groupName}/full_schedule`, testScheduleData, data=>{
            if(Object.keys(data)==0) return
            var schedule = new Schedule().importData(data)
            if(callback!=null) callback(schedule)
        })
    }
}