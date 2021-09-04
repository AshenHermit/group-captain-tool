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
        /**@type {{app: App}} */
        this.props = this.props

        this.state = {
            selectedDate: new Date(this.props.app.dayEditorState.getCurrentDayTimestamp())
        }

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
        return (
            <div className="calendar-container">
                <Calendar value={this.state.selectedDate} onChange={this.onDateChange} locale={config.locale}/>
            </div>
        )
    }
}