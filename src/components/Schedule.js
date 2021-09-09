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

        var lessons = this.props.app.groupEditorState.schedule
            .getDayLessons(this.props.app.dayEditorState.currentDayTimestamp)

        console.log(lessons)

        return(
            <div className="schedule cards-container">
                {lessons.length>0 ? this.renderLessons(lessons) : <div className="label">{translate("no_lessons")}</div>}
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
        if(this.state.copied) return <div className="room">{translate("copied")}</div>
        return rooms.map(room=>{
            if(room.toLowerCase()=="д") room=translate("online_place_state")
            return <div className="room">{room}</div>
        })
    }
    render(){
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
                    <div onClick={this.onCopyRoomClick} className="small button rooms">
                        {this.renderRooms(this.props.lesson.rooms)}
                    </div>
                </div>
                <div className="types">
                    <div className="error">{this.props.lesson.types}</div>
                </div>
            </div>
        )
    }
}