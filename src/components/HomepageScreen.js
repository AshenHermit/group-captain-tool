import React from "react"
import App from "../App"
import { DayEditorState } from "../client/DayEditorState"
import { GroupEditorState } from "../client/GroupEditorState"
import { DocumentData } from "../client/GroupLibrary"
import { translate } from "../client/Localization"
import { CalendarComponent } from "./Calendar"
import { DataEditorComponent, PropertyInput } from "./Editing"
import { FloatingScreen, ScreenChangeButton, ScreenScaffold } from "./Screens"

export class HomepageScreen extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App}} */
        this.props = this.props

        this.documentsContainerRef = React.createRef()

        this.dayDataChanged = this.dayDataChanged.bind(this)
        this.onShowDocuments = this.onShowDocuments.bind(this)
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

    onShowDocuments(){
        this.documentsContainerRef.current.toggleVisibility()
    }

    render(){
        var documentsCount = this.props.app.dayEditorState.dayData.documents.length
        var documentsCountPostfix = documentsCount > 0 ? ` (${documentsCount})` : ''

        return (
            <ScreenScaffold
            headerItems={
                [
                    <div className="column">
                        <div className="title">{translate("home.title")}</div>
                        <div className="space"></div>
                        <div className="label">{translate("home.head_label")}</div>
                    </div>
                ]
            }
            body={
                <div>
                    <div className="body-section">
                        <div className="title">{translate("home.section.0.title")}</div>
                        <div className="space"></div>
                        <div className="label">{translate("home.section.0.label")}</div>
                        <div className="space"></div>

                        <CalendarComponent app={this.props.app}/>

                        <ScreenChangeButton text={translate("check_people_button")} app={this.props.app} screen={App.ScreenEnum.PeopleChecker} className=""/>
                        <div onClick={this.onShowDocuments} className="button">{translate("show_documents")}{documentsCountPostfix}</div>
                        <DocumentsContainer app={this.props.app} ref={this.documentsContainerRef} onChange={this.dayDataChanged}/>
                    </div>

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
        /**@type {{app: App, onChange: Function}} */
        this.props = this.props

        this.startEditingDocument = this.startEditingDocument.bind(this)
        this.documentEditorRef = React.createRef()

        this.addDocument = this.addDocument.bind(this)
        this.onEdited = this.onEdited.bind(this)
        this.onError = this.onError.bind(this)

        this.state = {
            error: "",
            visible: false,
        }
    }

    toggleVisibility(){
        this.setState({
            visible: !this.state.visible
        })
    }

    addDocument(){
        var document = new DocumentData("title", "desc")
        this.props.app.dayEditorState.dayData.addDocument(document)
        this.startEditingDocument(document)
        if(this.props.onChange) this.props.onChange()
        this.forceUpdate()
    }
    startEditingDocument(document){
        this.documentEditorRef.current.startEditing(document)
    }
    onEdited(){
        this.props.app.dayEditorState.save(this.props.app.groupEditorState.currentGroupName, success=>{
            if(!success) this.onError()
        })
        if(this.props.onChange) this.props.onChange()
        this.forceUpdate()
    }

    onError(){
        this.setState({
            error: translate("save_error")
        })
    }

    render(){
        let visibleClassName = this.state.visible ? "" : "invisible"
        return (
            <div>
                {this.state.error ? <div className="error">{this.state.error}</div> : ""}
                <div className={"documents-container " + visibleClassName}>
                    {
                        this.props.app.dayEditorState.dayData.documents.map((documentData, i)=>{
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
                    groupEditorState={this.props.app.groupEditorState}
                    dayEditorState={this.props.app.dayEditorState}
                    onError={this.onError}/>
            </div>
        )
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
        /**@type {{onChange: Function, dataClass: Object, deleteFunction:Function, groupEditorState: GroupEditorState, dayEditorState: DayEditorState, onError: Function}} */
        this.props = this.props
        this.dataClass = DocumentData
        this.deleteFunction = this.props.dayEditorState.dayData.removeDocument.bind(this.props.dayEditorState.dayData)

        /**@type {DocumentData} */
        this.state.dataCopy = this.state.dataCopy

        this.floatingScreenRef = React.createRef()
    }
    startEditing(data){
        this.deleteFunction = this.props.dayEditorState.dayData.removeDocument.bind(this.props.dayEditorState.dayData)
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