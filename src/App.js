import './App.css';
import React from 'react';
import {Client} from './client/Client'
import {DayEditorState} from './client/DayEditorState'
import { GroupEditorState } from './client/GroupEditorState';
import {LogInScreen, WaitingScreen, FloatingScreen} from './components/Screens'
import {PeopleCheckerScreen} from './components/PeopleChecker'
import {Calendar} from './components/Calendar'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { searchParams } from './client/SearchParams';
import { translate } from './client/Localization';
import Cookies from 'js-cookie';
import { config } from './client/Config';
import { GroupEditorScreen } from './components/GroupEditor';
import { HomepageScreen } from './components/HomepageScreen';

export default class App extends React.Component{
  static ScreenEnum = Object.freeze({
                      "Waiting": 0, "LogIn": 1, "Homepage": 2, "PeopleChecker": 3, "PeopleEditor": 4, "Calendar": 5})
  static ScreenRoutes = ["/waiting", "/login", "/home", "/people-checker", "/people-editor", "/calendar"]
  constructor(props){
    super(props)
    this.currentScreen = App.ScreenEnum.LogIn
    this.client = new Client()
    this.dayEditorState = new DayEditorState(this.client.api)
    this.groupEditorState = new GroupEditorState(this.client.api)
    this.currentRoute = window.location.pathname

    window.app = this

    this.routerRef = React.createRef()
    this.onDataChanged = this.onDataChanged.bind(this)

    this.clipboardRef = React.createRef()

    this.theme = config.themes[0]
    if(Cookies.get("theme") && Cookies.get("theme")!="undefined"){
      this.theme = Cookies.get("theme")
    }else{
      Cookies.set(this.theme)
    }
  }

  onDataChanged(){
    this.forceUpdate()
  }
  readSearchData(){
    searchParams.updateParams()
    this.groupEditorState.setCurrentGroup(searchParams.group_name, this.onDataChanged)
    this.dayEditorState.setCurrentDayTimestamp(
      this.groupEditorState.currentGroupName, 
      searchParams.current_day_timestamp-0, this.onDataChanged)
  }

  tryToLogInWithRedirect(){
    var canAutoLogIn = this.client.tryLoginWithCookies(success=>{
      this.groupEditorState.setCurrentGroup(this.client.api.userCaptainGroup)
      if(success){
        this.goToScreen(App.ScreenEnum.Homepage)
      }
      else{
        if(this.currentScreen == App.ScreenEnum.Waiting){
          this.goToScreen(App.ScreenEnum.LogIn)
        }
      }
    })
  }
  tryToLogInInBackground(){
    var canAutoLogIn = this.client.tryLoginWithCookies(success=>{
      this.forceUpdate()
    })
  }
  tryToLogin(){
    if(this.currentScreen==App.ScreenEnum.LogIn){
      this.tryToLogInWithRedirect()
    }else{
      this.tryToLogInInBackground()
    }
  }
  logOut(){
    this.client.logOut()
    this.goToScreen(App.ScreenEnum.LogIn)
  }
  componentDidMount(){
    this.currentScreen = this.getScreenFromRoute(window.location.pathname)
    this.readSearchData()
    this.tryToLogin()
    searchParams.updateParams()
  }
  
  getScreenFromRoute(route){
    var route = route.substring(route.lastIndexOf("/"))
    return App.ScreenRoutes.indexOf(route)
  }
  getScreenRoute(screen){
    var route = "/"+config.sitename+App.ScreenRoutes[screen]
    return route
  }
  goToScreen(screen){
    var route = this.getScreenRoute(screen)
    this.currentScreen = screen
    this.currentRoute = route
    this.goToRoute(route)
  }
  goToRoute(routeId, pushToHistory=true){
    if(pushToHistory) {
      this.routerRef.current.history.push(routeId);
    }
    else {
      window.location.replace(routeId);
    }
    searchParams.replaceParams()
    document.title = translate("app.title") + " - " + routeId
  }

  showClipboardWithText(text){
    this.clipboardRef.current.show(text)
  }

  toggleTheme(){
    this.theme = config.themes[(config.themes.indexOf(this.theme)+1)%(config.themes.length)]
    Cookies.set("theme", this.theme)
    this.forceUpdate()
  }

  render(){
    return (
      <div className={"app theme "+this.theme}>
        <Router ref={this.routerRef}>
          <Switch>
            <Route path={this.getScreenRoute(App.ScreenEnum.Waiting)}>
              <WaitingScreen app={this}/>
            </Route>
            <Route path={this.getScreenRoute(App.ScreenEnum.Homepage)}>
              <HomepageScreen app={this}/>
            </Route>
            <Route path={this.getScreenRoute(App.ScreenEnum.PeopleChecker)}>
              <PeopleCheckerScreen app={this}/>
            </Route>
            <Route path={this.getScreenRoute(App.ScreenEnum.PeopleEditor)}>
              <GroupEditorScreen app={this}/>
            </Route>
            <Route path={"/"}>
              <LogInScreen app={this}/>
            </Route>
          </Switch>
        </Router>

        <ClipboardPanel app={this} ref={this.clipboardRef}/>
      </div>
    )
  }
}


export class ClipboardPanel extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      text: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.floatingScreenRef = React.createRef()
  }
  show(text){
    this.setState({
      text: text,
    })
    this.floatingScreenRef.current.show()
  }
  hide(){
    this.floatingScreenRef.current.hide()
  }
  handleChange(event) {
    this.setState({ text: event.target.value });
  }
  render(){
    return (
      <FloatingScreen className="clipboard-panel" ref={this.floatingScreenRef}>
        <textarea value={this.state.text} onChange={this.handleChange}>
        </textarea>
      </FloatingScreen>
    )
  }
}