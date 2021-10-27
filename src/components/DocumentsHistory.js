import {PersonItem} from './PersonItem'
import React from "react"
import App from '../App'
import { Screen, ScreenScaffold } from './Screens'
import { DayData, DocumentsLibrary, Person } from '../client/GroupLibrary'
import { addFixedChars } from '../client/Utils'
import { localization, translate } from '../client/Localization'
import { DayPost } from '../client/DayEditorState'
import { DocumentsContainer } from './HomepageScreen'
import { searchParams } from '../client/SearchParams'


export class DocumentsHistoryScreen extends Screen{
    constructor(props){
        super(props)
        /**@type {{app: App}} */
        this.props = this.props

        this.showTextListOfDocuments = this.showTextListOfDocuments.bind(this)
        this.onScrolledToBottom = this.onScrolledToBottom.bind(this)
        this.onHistoryChanged = this.onHistoryChanged.bind(this)

        this.checkInterval = 0
        this.days = []
        this.daysWithDocsCount = 0
        this.docsCount = 0
    }
    componentDidMount(){
        this.props.app.dayEditorState.daysHistory.setScanTimestampOffset(this.props.app.dayEditorState.currentDayTimestamp)
        this.props.app.dayEditorState.daysHistory.onHistoryChanged.subscribe(this.onHistoryChanged)
        this.checkInterval = setInterval(()=>{
            if(this.daysWithDocsCount<6){
                this.props.app.dayEditorState.daysHistory.loadMore(7*2)
            }
        }, 100)
    }
    componentWillUnmount(){
        clearInterval(this.checkInterval)
    }
    onHistoryChanged(){
        this.forceUpdate()
    }
    onScrolledToBottom(){
        this.props.app.dayEditorState.daysHistory.loadMore(7*2)
    }
    showTextListOfDocuments(){
        var list = this.days.filter(day=>day.dayData.documentsLibrary.documents.length>0)
        var separator = "============"
        list = list.map(day=>{
            var date = new Date(day.dayTimestamp)
            var documents = day.dayData.documentsLibrary.documents.map(doc=>{
                var tdoc = separator+"\n"
                if(doc.title) tdoc+=doc.title+"\n"
                if(doc.description) tdoc+=doc.description+"\n"
                if(doc.link) tdoc+=doc.link
                return tdoc
            }).join("\n")
            documents+="\n"+separator
            return `## ${localization.translateDay(date, true)}\n${documents}`
        })
        list = list.join("\n\n\n")
        list = translate("list_of_documents")+":\n\n" + list
        this.props.app.showClipboardWithText(list)
    }
    render(){
        this.days = this.props.app.dayEditorState.daysHistory.getSortedDaysBefore(this.props.app.dayEditorState.currentDayDate)
        var dateVerboseText = localization.translateDay(this.props.app.dayEditorState.currentDayDate, false)
        this.docsCount = this.props.app.dayEditorState.daysHistory.countDocuments(this.days)
        this.daysWithDocsCount = this.props.app.dayEditorState.daysHistory.countDaysWithDocuments(this.days)

        return (
            <ScreenScaffold
            onScrolledToBottomCallback={this.onScrolledToBottom}
            headerItems={
                [
                    <div className="title">{translate("documents_history.title")}</div>,
                ]
            }
            body={
                <div className="people-items-container">
                    <div className="body-section">
                        <div className="label">{translate("documents_history.head_label")} {dateVerboseText}</div>
                    </div>
                    <div className="body-section">
                        {/* TODO: localize */}
                        <div className="title">{translate("analytics")}</div>
                        <div className="space"></div>
                        <div className="label">найдено документов: {this.docsCount}</div>
                        <div className="space"></div>
                        <div className="label">{translate("show")}:</div>
                        <button onClick={this.showTextListOfDocuments} className="button small">{translate("list_of_documents")}</button>
                    </div>

                    {
                        this.days.map(dayPost=>{
                            dayPost.dayData.documentsLibrary.isLoaded = true
                            if(dayPost.dayData.documentsLibrary.documents.length==0) return ""
                            return <DayDocumentsBlock app={this.props.app} dayPost={dayPost}/>
                        })
                    }
                </div>
            }/>
        )
    }
}

export class DayDocumentsBlock extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App, dayPost:DayPost, onChange:Function}} */
        this.props = this.props
        this.onChange = this.onChange.bind(this)
        this.goToDay = this.goToDay.bind(this)
    }
    onChange(){
        // this.props.onChange()
    }
    goToDay(){
        searchParams.current_day_timestamp = this.props.dayPost.dayTimestamp
        searchParams.replaceParams()
        this.props.app.goToScreen(App.ScreenEnum.Homepage, true)
    }
    render(){
        var dateText = localization.translateDay(new Date(this.props.dayPost.dayTimestamp), true)
        return (
            <div className="body-section document-history-post">
                <button onClick={this.goToDay} className="small button day-button">{dateText}</button>
                <DocumentsContainer
                    documentsLibrary={this.props.dayPost.dayData.documentsLibrary} 
                    shown={true}
                    onChange={this.onChange}/>
            </div>
            
        )
    }
}