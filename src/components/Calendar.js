import React from "react"
import App from '../App'
import { ScreenScaffold } from './Screens'
import Calendar from 'react-calendar'
import './CustomCalendarStyles.css';
import { config } from "../client/Config";
import { searchParams } from "../client/SearchParams";


export class CalendarComponent extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App, onChange: Function}} */
        this.props = this.props

        this.selectedDate = 0

        this.onDateChange = this.onDateChange.bind(this)
    }

    onDateChange(date){
        this.props.app.dayEditorState.setCurrentDayTimestamp(
            this.props.app.groupEditorState.currentGroupName,
            date.getTime(), 
            ()=>{
                searchParams.current_day_timestamp = this.props.app.dayEditorState.currentDayTimestamp
                searchParams.replaceParams()
                console.log(searchParams.current_day_timestamp)
            }
        )
        this.setState({selectedDate: date})
    }

    render(){
        this.selectedDate = new Date(this.props.app.dayEditorState.getCurrentDayTimestamp())

        return (
            <div className="calendar-container">
                <Calendar value={this.selectedDate} onChange={this.onDateChange} locale={config.locale}/>
            </div>
        )
    }
}