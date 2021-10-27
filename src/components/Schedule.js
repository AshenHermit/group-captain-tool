import React from "react"
import App from "../App"
import { DayEditorState } from "../client/DayEditorState"
import { GroupEditorState } from "../client/GroupEditorState"
import { DocumentData, DocumentsLibrary, Lesson } from "../client/GroupLibrary"
import { translate } from "../client/Localization"
import { copyToClipboard } from "../client/Utils"
import { CalendarComponent } from "./Calendar"
import { DataEditorComponent, PropertyInput } from "./Editing"
import { FloatingScreen, ScreenChangeButton, ScreenScaffold } from "./Screens"


export class ScheduleComponent extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App}} */
        this.props = this.props

        this.documentsContainerRef = React.createRef()

        this.state = {
            visible: this.props.visible
        }
    }

    toggleVisibility(){
        this.setState({
            visible: !this.state.visible
        })
    }

    renderLessons(lessons){
        return lessons.map(lesson=>{
            return <LessonComponent lesson={lesson}/>
        })
    }

    render(){
        if(!this.state.visible) return ""

        var lessons = this.props.app.groupEditorState.groupData.schedule
            .getDayLessons(this.props.app.dayEditorState.currentDayTimestamp)

        var className = this.props.className ? this.props.className : ""

        return(
            <div className={"schedule cards-container "+className}>
                {lessons.length>0 ? 
                    this.renderLessons(lessons) : 
                    <div className="label">{translate("no_lessons")}</div>}
            </div>
        )
    }
}

class LessonComponent extends React.Component{
    constructor(props){
        super(props)

        /**@type {{lesson: Lesson}} */
        this.props = this.props

        this.onCopyRoomClick = this.onCopyRoomClick.bind(this)
        this.state = {
            copied: false
        }
        this.copyTextTimeout = -1
    }
    onCopyRoomClick(){
        copyToClipboard(this.props.lesson.rooms.join(" "))
        this.setState({copied: true})
        clearTimeout(this.copyTextTimeout)
        this.copyTextTimeout = setTimeout(()=>{
            this.setState({copied: false})
        }, 1000)
    }
    renderRooms(rooms){
        if(!rooms) return ""
        if(rooms.length==0) return ""
        
        var roomEls = rooms.filter(room=>room.toLowerCase()!="д").map(room=>{
            return <div className="room">{room}</div>
        })
        if(roomEls.length==0) return ""

        return <div onClick={this.onCopyRoomClick} className="small button rooms">
            {this.state.copied ? <div className="room">{translate("copied")}</div>
            :
            roomEls}
        </div>
    }
    renderLinks(links, lesson_type){
        if(!links) return ""
        return links.map(link=>{
            return (
            <a href={link} target="_blank">
                <div onClick={this.onCopyRoomClick} className="minor small button rooms">
                    <div className="room">{translate("go_to_lesson_"+lesson_type)}</div>
                </div>
            </a>)
        })
    }
    render(){
        var lesson_type = this.props.lesson.replacement_type || this.props.lesson.types
        return (
            <div className="lesson">
                <div className="time">
                    <div className="time-item">{this.props.lesson.number} {translate("pare")}</div>
                    <div className="time-item">{this.props.lesson.time_start}</div>
                    <div className="time-item">{this.props.lesson.time_end}</div>
                </div>
                <div className="names">
                    <div className="title">{this.props.lesson.name}</div>
                    <div className="teacher">{this.props.lesson.teachers}</div>
                    {this.renderRooms(this.props.lesson.rooms)}
                    {this.renderLinks(this.props.lesson.links, lesson_type)}
                </div>
                <div className="types">
                    <div className="error">{this.props.lesson.types}</div>
                </div>
            </div>
        )
    }
}