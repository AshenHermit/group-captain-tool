import {PersonItem} from './PersonItem'
import React from "react"
import App from '../App'
import { ScreenScaffold } from './Screens'
import { DayData, Person } from '../client/GroupLibrary'
import { addFixedChars } from '../client/Utils'
import { localization, translate } from '../client/Localization'

export class PersonCheckState{
    /**
     * 
     * @param {Person} person 
     * @param {Boolean} checked 
     */
    constructor(person, checked=false){
        this.person = person
        this.checked = checked
    }
}

export class PeopleCheckerScreen extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App}} */
        this.props = this.props
        /**@type {DayData} */
        this.dayData = this.props.app.dayEditorState.dayData
        /**@type {Array<PersonCheckState>} */
        this.peopleCheckList = null
        this.builCheckList()
        this.onCheckListChanged = this.onCheckListChanged.bind(this)
        this.onGroupDataChanged = this.onGroupDataChanged.bind(this)

        this.showCheckedPeople = this.showCheckedPeople.bind(this)
        this.showUncheckedPeople = this.showUncheckedPeople.bind(this)

        this.state = {
            error: null
        }
    }
    builCheckList(){
        this.peopleCheckList = this.createPeopleCheckList()
    }
    createPeopleCheckList(){
        var checkList = []
        this.props.app.groupEditorState.groupData.people.forEach(person=>{
            checkList.push(new PersonCheckState(person, this.dayData.checkedPeopleUids.indexOf(person.uid)!=-1))
        })
        return checkList
    }
    updateDayData(){
        var peopleUids = []
        this.peopleCheckList.forEach(personCheckState=>{
            if(personCheckState.checked) peopleUids.push(personCheckState.person.uid)
        })
        this.dayData.checkedPeopleUids = peopleUids
    }
    componentDidMount(){
        this.props.app.groupEditorState.onGroupDataChanged.subscribe(this.onGroupDataChanged)
        this.props.app.dayEditorState.onDayDataChanged.subscribe(this.onGroupDataChanged)
    }
    componentWillUnmount(){
        this.props.app.groupEditorState.onGroupDataChanged.unsubscribe(this.onGroupDataChanged)
        this.props.app.dayEditorState.onDayDataChanged.unsubscribe(this.onGroupDataChanged)
    }
    onGroupDataChanged(){
        this.dayData = this.props.app.dayEditorState.dayData
        this.builCheckList()
        this.forceUpdate()
    }
    onCheckListChanged(){
        this.updateDayData()
        this.props.app.dayEditorState.save(
            this.props.app.groupEditorState.currentGroupName, 
            (success)=>{
                if(!success){
                    this.setState({
                        error: translate("save_error")
                    })
                }
            })
        this.forceUpdate()
    }
    showCheckedPeople(){
        var list = this.peopleCheckList.filter(x=>x.checked)
        list = list.map(x=>x.person.name)
        list = list.join("\n")
        list = translate("list_of_present")+":\n\n" + list
        this.props.app.showClipboardWithText(list)
    }
    showUncheckedPeople(){
        var list = this.peopleCheckList.filter(x=>!x.checked)
        list = list.map(x=>x.person.name)
        list = list.join("\n")
        list = translate("list_of_absent")+":\n\n" + list
        this.props.app.showClipboardWithText(list)
    }
    render(){
        let date = this.props.app.dayEditorState.currentDayDate
        let dateText = `${addFixedChars(date.getDate().toString(), "0", 2)}.${addFixedChars((date.getMonth()+1).toString(), "0", 2)}.${date.getFullYear()}`
        let dateVerboseText = localization.translateDay(date, false)
        let titleDate = localization.translateDay(date, true)
        let groupName = this.props.app.groupEditorState.currentGroupName

        return (
            <ScreenScaffold 
            headerItems={
                [
                    <div className="title">{titleDate} {translate("people_checker.title")} {groupName}</div>,
                ]
            }
            body={
                <div className="people-items-container">
                    <div className="body-section">
                        <div className="label">{dateText}<br/>{translate("people_checker.head_label")} {dateVerboseText}</div>
                    </div>
                    <div className="body-section">
                        {/* TODO: localize */}
                        <div className="title">Аналитика</div>
                        <div className="space"></div>
                        <div className="label">в этот день пришли: {this.dayData.checkedPeopleUids.length} из {this.props.app.groupEditorState.groupData.people.length} человек</div>
                        <div className="space"></div>
                        <div className="label">{translate("show")}:</div>
                        <div onClick={this.showCheckedPeople} className="button small">{translate("list_of_present")}</div>
                        <div onClick={this.showUncheckedPeople} className="button small error">{translate("list_of_absent")}</div>
                    </div>

                    {this.state.error ? <div className="error">{this.state.error}</div> : ""}

                    {
                        this.peopleCheckList.map(personCheckState=>{
                            return <PersonCheckItem personCheckState={personCheckState} onChange={this.onCheckListChanged}/>
                        })
                    }
                </div>
            }/>
        )
    }
}

export class PersonCheckItem extends React.Component{
    constructor(props){
        super(props)
        /**@type {{personCheckState: PersonCheckState, onChange: Function}} */
        this.props = this.props
        this.toggleCheck = this.toggleCheck.bind(this)
    }
    renderLinks(links){
        return Object.keys(links).map(siteId=>{
            return links[siteId]=="" ? "" : <a className="link" target="_blank" href={links[siteId]}>{siteId}</a>
        })
    }
    toggleCheck(){
        this.props.personCheckState.checked = !this.props.personCheckState.checked
        this.forceUpdate()
        this.props.onChange()
    }
    render(){
        let avatar = this.props.personCheckState.person.avatar
        let name = this.props.personCheckState.person.name
        let links = this.props.personCheckState.person.links

        let itemActiveClassName = this.props.personCheckState.checked ? "" : "inactive"
        let checkButtonActiveClassName = this.props.personCheckState.checked ? "" : "inactive"

        return (
            <div className={"person-item "+itemActiveClassName}>
                <div className="avatar">
                    {avatar!="" ? <img src={avatar}></img> : ""}
                </div>
                <div className="info">
                    <div className="name">{name}</div>
                    <div className="links">{this.renderLinks(links)}</div>
                </div>
                <div>
                    <div onClick={this.toggleCheck} className={"button check-button " + checkButtonActiveClassName}></div>
                </div>
            </div>
        )
    }
}