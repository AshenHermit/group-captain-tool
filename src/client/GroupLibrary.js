import {Exportable} from './Exportable'
import { testScheduleData } from './RemoteApi'
import { getCurrentWeek as getWeekNumber } from './Utils'

export class Person extends Exportable{
    /**
     * @param {String} name person's name
     * @param {Dict<String>} links dict of sites ids as keys and urls as values 
     * @param {Number} uid dict of sites ids as keys and urls as values 
     */
    constructor(name="", links={}, avatar="", uid=0){
        super()
        this.name = name
        this.avatar = avatar
        this.uid = uid
        /**dict of sites ids as keys and urls as values 
         * @type {Dict<String>} */
        this.links = links
    }
}

export class DocumentData extends Exportable{
    constructor(title="", description="", link=""){
        super()
        this.registerClasses(null, null)
        this.title = title
        this.description = description
        this.link = link
    }
}
export class DocumentsLibrary extends Exportable{
    constructor(){
        super()
        this.registerClasses({documents: DocumentData}, null, null, ["isLoaded"])
        /**@type {Array<DocumentData>}*/
        this.documents = []
        this.isLoaded = true
    }

    addDocument(document){
        this.documents.push(document)
    }
    removeDocument(document){
        this.documents.splice(
            this.documents.indexOf(document), 1)
    }
}
export class DayData extends Exportable{
    constructor(){
        super()
        this.registerClasses(
            {documents: DocumentData}, 
            null, 
            {documentsLibrary: DocumentsLibrary})
        /**@type {Array<Number>}*/
        this.checkedPeopleUids = []
        /**@type {DocumentsLibrary}*/
        this.documentsLibrary = new DocumentsLibrary()
    }
}

//not in use
export class CalendarData extends Exportable{
    constructor(){
        super()
        this.registerClasses(null, {daysRegistry: DayData})

        /**@type {Dict<DayData>}*/
        this.daysRegistry = {}
    }
}

export class GroupData extends Exportable{
    constructor(){
        super()
        this.registerClasses({people: Person}, null, {documentsLibrary: DocumentsLibrary, schedule: Schedule}, ["nextPersonUID"])
        
        /**@type {Array<Person>} */
        this.people = []
        this.nextPersonUID = 0
        this.documentsLibrary = new DocumentsLibrary()

        this.schedule = new Schedule()
    }

    addPerson(person){
        this.updateNextPersonUID()
        person.uid = this.nextPersonUID
        this.nextPersonUID+=1
        this.people.push(person)
    }
    removePerson(person){
        this.people.splice(
            this.people.indexOf(person), 1)
        this.updateNextPersonUID()
    }
    updateNextPersonUID(){
        this.nextPersonUID = 0
        this.people.forEach(person=>{
            if(person.uid>this.nextPersonUID){
                this.nextPersonUID = person.uid
            }
        })
        this.nextPersonUID+=1
    }
    importData(dict){
        super.importData(dict)
        this.people.sort(function(a, b){
            var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
            if (nameA < nameB)
                return -1
            if (nameA > nameB)
                return 1
            return 0
        })
        this.updateNextPersonUID()
        return this
    }
}

//not in use
export class GroupLibrary extends Exportable{
    constructor(){
        super()
        this.registerClasses(null, {groups: GroupData})
        
        /**@type {Dict<GroupData>} */
        this.groups = {}
    }
}

export class Lesson{
    constructor(number, name, rooms, teachers, time_end, time_start, types, links){
        this.number = number
        this.name = name
        this.rooms = rooms
        this.teachers = teachers
        this.time_end = time_end
        this.time_start = time_start
        this.types = types
        this.replacement_type = ""
        this.links = links
    }
}

//not in use
export class Schedule extends Exportable{
    constructor(){
        super()
        this.registerClasses(null, null, null, null)
        
        this.scheduleData = testScheduleData
    }
    getDayLessons(dayTimestamp){
        var date = new Date(dayTimestamp)
        var weekNumber = getWeekNumber(dayTimestamp)
        var isWeekEven = weekNumber%2==0

        /**@type {Array<Lesson>} */
        var lessons = []

        var dayKey = date.getDay()
        if(!(dayKey in this.scheduleData)){
            return lessons
        }
        this.scheduleData[dayKey].lessons.forEach((lessonContainer, number)=>{
            if(lessonContainer.length==0) return
            lessonContainer.forEach(lesson=>{
                if(lesson.weeks.indexOf(weekNumber)!=-1){
                    var lessonData = new Lesson(number+1, 
                        lesson.name, lesson.rooms, lesson.teachers, 
                        lesson.time_end, lesson.time_start, lesson.types, lesson.links)
                    lessons.push(lessonData)
                }
            })
        })
        return lessons
    }
}
