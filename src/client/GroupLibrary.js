import {Exportable} from './Exportable'

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
export class DayData extends Exportable{
    constructor(){
        super()
        this.registerClasses({documents: DocumentData}, null)
        /**@type {Array<Number>}*/
        this.checkedPeopleUids = []
        /**@type {Array<DocumentData>}*/
        this.documents = []
    }

    addDocument(document){
        this.documents.push(document)
    }
    removeDocument(document){
        this.documents.splice(
            this.documents.indexOf(document), 1)
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
        this.registerClasses({people: Person}, null, ["nextPersonUID"])
        
        /**@type {Array<Person>} */
        this.people = []
        this.nextPersonUID = 0
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
