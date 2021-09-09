import React from "react"
import App from "../App"
import { DayEditorState } from "../client/DayEditorState"
import { GroupEditorState } from "../client/GroupEditorState"
import { DocumentData, DocumentsLibrary } from "../client/GroupLibrary"
import { translate } from "../client/Localization"
import { CalendarComponent } from "./Calendar"
import { DataEditorComponent, PropertyInput } from "./Editing"
import { ScheduleComponent } from "./Schedule"
import { FloatingScreen, ScreenChangeButton, ScreenScaffold } from "./Screens"

export class HomepageScreen extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App}} */
        this.props = this.props

        this.documentsContainerRef = React.createRef()
        this.scheduleRef = React.createRef()

        this.dayDataChanged = this.dayDataChanged.bind(this)
        this.showDocuments = this.showDocuments.bind(this)
        this.showSchedule = this.showSchedule.bind(this)
        this.onError = this.onError.bind(this)
        this.saveDayData = this.saveDayData.bind(this)
        this.saveGroupData = this.saveGroupData.bind(this)

        this.state = {
            error: "",
        }
    }

    componentDidMount(){
        this.props.app.dayEditorState.onDayDataChanged.subscribe(this.dayDataChanged)
    }
    componentWillUnmount(){
        this.props.app.dayEditorState.onDayDataChanged.unsubscribe(this.dayDataChanged)
    }

    dayDataChanged(){
        this.forceUpdate()
    }

    showDocuments(){
        this.documentsContainerRef.current.toggleVisibility()
    }
    showSchedule(){
        this.scheduleRef.current.toggleVisibility()
    }

    onError(){

    }
    saveDayData(){
        this.props.app.dayEditorState.save(
            this.props.app.groupEditorState.currentGroupName, 
            success=>{
                if(!success) this.setState({error: translate("save_error")})
        })
        this.forceUpdate()
    }
    saveGroupData(){
        this.props.app.groupEditorState.save(
            success=>{
                if(!success) this.setState({error: translate("save_error")})
        })
        this.forceUpdate()
    }

    render(){
        var documentsCount = this.props.app.dayEditorState.dayData.documentsLibrary.documents.length
        var documentsCountPostfix = documentsCount > 0 ? ` [${documentsCount}]` : ''
        if(!this.props.app.dayEditorState.dayData.documentsLibrary.isLoaded) documentsCountPostfix = ""
        var globalDocumentsCount = this.props.app.groupEditorState.groupData.documentsLibrary.documents.length
        var globalDocumentsCountPostfix = globalDocumentsCount > 0 ? ` [${globalDocumentsCount}]` : ''

        return (
            <ScreenScaffold
            headerItems={
                [
                    <div className="column">
                        <div className="title">{translate("home.title")}</div>
                        <div className="label">{translate("home.head_label")}</div>
                    </div>
                ]
            }
            body={
                <div>
                    <div className="body-section">
                        <div className="title">{translate("home.section.1.title")}</div>
                        <div className="space"></div>
                        <div className="label">{translate("home.section.1.label")}</div>
                        <div className="space"></div>
                        <ScreenChangeButton 
                            text={translate("edit_group_button") + " ("+this.props.app.groupEditorState.currentGroupName+")"} 
                            app={this.props.app} 
                            screen={App.ScreenEnum.PeopleEditor} 
                            className=""/>
                    </div>

                    <div className="body-section">
                        <div className="title">{translate("home.section.0.title")}</div>
                        <div className="space"></div>
                        <div className="label">{translate("home.section.0.label")}</div>
                        <div className="space"></div>

                        <CalendarComponent app={this.props.app} onChange={this.dayDataChanged}/>

                        <ScreenChangeButton text={translate("check_people_button")} app={this.props.app} screen={App.ScreenEnum.PeopleChecker} className=""/>

                        <div onClick={this.showDocuments} className="button">{translate("show_documents")}{documentsCountPostfix}</div>
                        <DocumentsContainer 
                            documentsLibrary={this.props.app.dayEditorState.dayData.documentsLibrary} 
                            ref={this.documentsContainerRef} 
                            onChange={this.saveDayData}/>

                        <div onClick={this.showSchedule} className="button">{translate("show_schedule")}</div>
                        <ScheduleComponent app={this.props.app} ref={this.scheduleRef} visible={false}/>
                    </div>

                    {this.state.error ? [<div className="error">{this.state.error}</div>,<br/>] : ""}
                    
                    <div className="body-section">
                        <div className="title">{translate("home.section.global_documents.title")}{globalDocumentsCountPostfix}</div>
                        <div className="space"></div>
                        {/* <div className="label">{translate("home.section.global_documents.label")}</div>
                        <div className="space"></div> */}

                        <DocumentsContainer 
                            documentsLibrary={this.props.app.groupEditorState.groupData.documentsLibrary} 
                            shown={true}
                            onChange={this.saveGroupData}/>
                    </div>

                    <div className="body-section">
                        <div className="title">{translate("settings")}</div>
                        <div className="space"></div>
                        <div onClick={(()=>{this.props.app.toggleTheme()}).bind(this)} className="button">{translate("change_theme")}</div>

                        { this.props.app.client.loggedIn ? 
                            <div onClick={(()=>{this.props.app.logOut()}).bind(this)} className="button error">{translate("log_out")}</div>
                            : ""
                        }
                    </div>
                </div>
            }/>
        )
    }
}

class DocumentsContainer extends React.Component{
    constructor(props){
        super(props)
        /**@type {{documentsLibrary: DocumentsLibrary, onChange: Function, shown: Boolean}} */
        this.props = this.props

        this.startEditingDocument = this.startEditingDocument.bind(this)
        this.documentEditorRef = React.createRef()

        this.addDocument = this.addDocument.bind(this)
        this.onEdited = this.onEdited.bind(this)

        this.state = {
            visible: this.props.shown,
        }
    }

    toggleVisibility(){
        this.setState({
            visible: !this.state.visible
        })
    }

    addDocument(){
        var document = new DocumentData("title", "desc")
        this.props.documentsLibrary.addDocument(document)
        this.startEditingDocument(document)
        if(this.props.onChange) this.props.onChange()
        this.forceUpdate()
    }
    startEditingDocument(document){
        this.documentEditorRef.current.startEditing(document)
    }
    onEdited(){
        if(this.props.onChange) this.props.onChange()
        this.forceUpdate()
    }
    renderUnloadedLibrary(){
        return (
            <div>
                <div className={"documents-container cards-container"}>
                    {
                        <div className="document">{translate("loading")}</div>
                    }
                    <div onClick={this.addDocument} className={"button"}>{translate("add")}</div>
                </div>
            </div>
        )
    }
    render(){
        if(!this.state.visible) return ""
        if(!this.props.documentsLibrary.isLoaded) return this.renderUnloadedLibrary()
        return [
            <div>
                <div className={"documents-container cards-container"}>
                    {
                        this.props.documentsLibrary.documents.map((documentData, i)=>{
                            return <DocumentComponent 
                                    key={documentData.title+documentData.description+i.toString()} 
                                    document={documentData} 
                                    startEditingDocument={this.startEditingDocument}/>
                        })
                    }
                    <div onClick={this.addDocument} className={"button"}>{translate("add")}</div>
                </div>

                <DocumentEditorComponent 
                    ref={this.documentEditorRef} 
                    onChange={this.onEdited} 
                    documentsLibrary={this.props.documentsLibrary}
                    onError={this.props.onError}/>
            </div>,
            this.state.visible ? <br/> : ""
        ]
    }
}
class DocumentComponent extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App, document: DocumentData, startEditingDocument: Function}} */
        this.props = this.props

        this.startEditing = this.startEditing.bind(this)
    }

    startEditing(){
        this.props.startEditingDocument(this.props.document)
    }

    render(){
        return (
            <div>
                <div className="document">
                    <a className="link" href={this.props.document.link} target="_blank">
                        <div className="info">
                            <div className="title">{this.props.document.title}</div>
                            <div className="description">{this.props.document.description}</div>
                        </div>
                    </a>
                    <div>
                        <div onClick={this.startEditing} className={"button edit-button"}>{translate("edit")}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export class DocumentEditorComponent extends DataEditorComponent{
    constructor(props){
        super(props)
        /**@type {{onChange: Function, dataClass: Object, deleteFunction:Function, documentsLibrary: DocumentsLibrary, onError: Function}} */
        this.props = this.props
        this.dataClass = DocumentData
        this.deleteFunction = null

        /**@type {DocumentData} */
        this.state.dataCopy = this.state.dataCopy

        this.floatingScreenRef = React.createRef()
    }
    startEditing(data){
        this.deleteFunction = this.props.documentsLibrary.removeDocument.bind(this.props.documentsLibrary)
        super.startEditing(data)
        this.floatingScreenRef.current.show()
    }
    deleteData(){
        super.deleteData()
        this.floatingScreenRef.current.hide()
    }
    saveData(){
        super.saveData()
        this.floatingScreenRef.current.hide()
    }

    renderContent(){
        return (
            <div className="document-editor editor">
                <div className="title">{translate("editing")}</div>
                <br/>

                <div className="label">title</div>
                <PropertyInput obj={this.state.dataCopy} propKey={"title"}/>
                <div className="space"></div><div className="space"></div>
                
                <div className="label">description</div>
                <PropertyInput obj={this.state.dataCopy} propKey={"description"}/>
                <div className="space"></div><div className="space"></div>
                
                <div className="label">link</div>
                <PropertyInput obj={this.state.dataCopy} propKey={"link"}/>
                <div className="space"></div><div className="space"></div>
                
                <div className="bottom-buttons">
                    <div onClick={this.deleteData} className="button error">{translate("delete")}</div>
                    <div onClick={this.saveData} className="button">{translate("save")}</div>
                </div>
            </div>
        )
    }
    render(){
        return (
            <FloatingScreen ref={this.floatingScreenRef}>
                {this.canRender() ? this.renderContent() : ""}
                
            </FloatingScreen>
        )
    }
}