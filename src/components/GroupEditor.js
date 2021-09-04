import React from "react"
import App from '../App'
import { FloatingScreen, ScreenScaffold } from './Screens'
import { translate } from '../client/Localization'
import { Person } from '../client/GroupLibrary'
import { GroupEditorState } from "../client/GroupEditorState"
import { config } from "../client/Config"

export class GroupEditorScreen extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App}} */
        this.props = this.props
        this.state = {
            error: null
        }

        this.onGroupDataChanged = this.onGroupDataChanged.bind(this)
        this.onPersonChanged = this.onPersonChanged.bind(this)

        this.showPeopleNamesList = this.showPeopleNamesList.bind(this)
        this.showPeopleDataJson = this.showPeopleDataJson.bind(this)

        this.startEditingPerson = this.startEditingPerson.bind(this)
        this.addPerson = this.addPerson.bind(this)

        this.personEditorRef = React.createRef()
        this.floatingScreenRef = React.createRef()
    }
    componentDidMount(){
        this.props.app.groupEditorState.onGroupDataChanged.subscribe(this.onGroupDataChanged)
    }
    componentWillUnmount(){
        this.props.app.groupEditorState.onGroupDataChanged.unsubscribe(this.onGroupDataChanged)
    }
    onGroupDataChanged(){
        this.forceUpdate()
    }
    onPersonChanged(){
        this.props.app.groupEditorState.save((success)=>{
            if(!success){
                this.setState({
                    error: translate("save_error")
                })
            }
        })
        this.forceUpdate()
    }

    addPerson(){
        var newPerson = new Person("Person")
        this.props.app.groupEditorState.groupData.addPerson(newPerson)
        this.startEditingPerson(newPerson)
        this.forceUpdate()
    }

    showPeopleNamesList(){
        var list = this.props.app.groupEditorState.groupData.people.map(x=>x.name)
        list = list.join("\n")
        list = this.props.app.groupEditorState.currentGroupName+"\n"+translate("list_of_names")+":\n\n" + list
        this.props.app.showClipboardWithText(list)
    }
    showPeopleDataJson(){
        var data = this.props.app.groupEditorState.groupData.exportData()
        this.props.app.showClipboardWithText(JSON.stringify(data, null, 2))
    }

    startEditingPerson(person){
        this.floatingScreenRef.current.show()
        this.personEditorRef.current.startEditing(person)
    }

    render(){
        let groupName = this.props.app.groupEditorState.currentGroupName

        return (
            <ScreenScaffold 
            headerItems={
                [
                    <div className="title">{translate("group_editor.title")} {groupName}</div>,
                    <div className="label">{translate("group_editor.head_label")}</div>
                ]
            }
            body={
                <div>
                    <div className="people-items-container">
                        <div className="body-section">
                            {/* TODO: localize */}
                            <div className="title">Аналитика</div>
                            <div className="space"></div>
                            <div className="label">всего людей: {this.props.app.groupEditorState.groupData.people.length}</div>
                            <div className="space"></div>
                            <div className="label">{translate("show")}:</div>
                            <div onClick={this.showPeopleNamesList} className="button small">{translate("list_of_names")}</div>
                            <div onClick={this.showPeopleDataJson} className="button small">{translate("group_data_json")}</div>
                        </div>

                        {this.state.error ? <div className="error">{this.state.error}</div> : ""}

                        {
                            this.props.app.groupEditorState.groupData.people.map(person=>{
                                return <PersonItem person={person} onChange={this.onPersonChanged} startEditing={this.startEditingPerson}/>
                            })
                        }
                        <div onClick={this.addPerson} className="add button">
                            {translate("add_person")}
                        </div>
                    </div>
                    <FloatingScreen className="" ref={this.floatingScreenRef}>
                        <PersonEditorScreen 
                            groupEditorState={this.props.app.groupEditorState} 
                            onChange={this.onPersonChanged} 
                            ref={this.personEditorRef} 
                            floatingScreen={this.floatingScreenRef}/>
                    </FloatingScreen>
                </div>
            }/>
        )
    }
}

class PropertyInput extends React.Component{
    constructor(props){
        super(props)
        /**@type {{obj: Object, propKey: String, onChange: Function}} */
        this.props = this.props
        this.onChange = this.onChange.bind(this)
    }
    onChange(event){
        this.props.obj[this.props.propKey] = event.target.value
        this.forceUpdate()
        if(this.props.onChange) this.props.onChange(event.target.value)
    }
    render(){
        return (
            <input type="text" value={this.props.obj[this.props.propKey]} onChange={this.onChange} className="input" name={"ashen-hermit-"+this.props.propKey+"-input"} autoComplete="off"></input>
        )
    }
}

export class PersonEditorScreen extends React.Component{
    constructor(props){
        super(props)
        /**@type {{groupEditorState: GroupEditorState, floatingScreen: import("react").Ref}} */
        this.props = this.props
        /**@type {{personCopy: Person}} */
        this.state = {
            personCopy: null
        }
        this.realPerson = null
        this.onChangedAvatar = this.onChangedAvatar.bind(this)
        this.onDeletePressed = this.onDeletePressed.bind(this)
        this.onSavePressed = this.onSavePressed.bind(this)
        this.onAvatarError = this.onAvatarError.bind(this)

        this.avatarRef = React.createRef()
    }

    onChangedAvatar(){
        this.forceUpdate()
    }
    startEditing(person){
        this.realPerson = person
        this.setState({
            personCopy: new Person().importData(this.realPerson.exportData())
        })
    }

    onDeletePressed(){
        this.props.groupEditorState.groupData.removePerson(this.realPerson)
        this.props.floatingScreen.current.hide()
        this.props.onChange()
    }
    onSavePressed(){
        this.realPerson.importData(this.state.personCopy.exportData())
        this.props.floatingScreen.current.hide()
        this.props.onChange()
    }

    onAvatarError(){
        this.avatarRef.current.src = config.blankImage
    }
    
    render(){
        if(this.state.personCopy == null) return ""
        
        if(!("vk" in this.state.personCopy.links)) this.state.personCopy.links["vk"] = ""
        
        return (
            <div className="person-editor">
                <div className="title">{translate("editing")}</div>
                <br/>
                <div className="avatar">
                    <img src={this.state.personCopy.avatar} onError={this.onAvatarError} ref={this.avatarRef}/>
                </div>
                <div className="label">avatar url</div>
                <PropertyInput obj={this.state.personCopy} propKey={"avatar"} onChange={this.onChangedAvatar}/>
                <div className="space"></div><div className="space"></div>
                <div className="label">name</div>
                <PropertyInput obj={this.state.personCopy} propKey={"name"}/>
                <div className="space"></div><div className="space"></div>
                <div className="label">vk url</div>
                <PropertyInput obj={this.state.personCopy.links} propKey={"vk"}/>
                
                <div className="bottom-buttons">
                    <div onClick={this.onDeletePressed} className="button error">{translate("delete")}</div>
                    <div onClick={this.onSavePressed} className="button">{translate("save")}</div>
                </div>

                {/* <PropertyInput obj={this.state.person} key={"name"}/> */}
            </div>
        )
    }
}


export class PersonItem extends React.Component{
    constructor(props){
        super(props)
        /**@type {{person: Person, onChange: Function, startEditing: Function}} */
        this.props = this.props

        this.startEditing = this.startEditing.bind(this)
    }
    renderLinks(links){
        return Object.keys(links).map(siteId=>{
            return links[siteId]=="" ? "" : <a className="link" target="_blank" href={links[siteId]}>{siteId}</a>
        })
    }
    startEditing(){
        this.props.startEditing(this.props.person)
    }
    render(){
        let avatar = this.props.person.avatar
        let name = this.props.person.name
        let links = this.props.person.links

        return (
            <div className={"person-item"}>
                <div className="avatar">
                    {avatar!="" ? <img src={avatar}></img> : ""}
                </div>
                <div className="info">
                    <div className="name">{name}</div>
                    <div className="links">{this.renderLinks(links)}</div>
                </div>
                <div>
                    <div onClick={this.startEditing} className={"button edit-button"}>{translate("edit_person")}</div>
                </div>
            </div>
        )
    }
}