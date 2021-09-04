import React from "react"
import App from "../App"
import { translate } from "../client/Localization"
import { CalendarComponent } from "./Calendar"

export class ScreenChangeButton extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app:App, text:String, className:String, screen:Number}} */
        this.props = this.props
        this.onClick = this.onClick.bind(this)
    }
    onClick(){
        this.props.app.goToScreen(this.props.screen)
    }
    render(){
        return (
        <div className={"button " + this.props.className} onClick={this.onClick}>
            {this.props.text}
        </div>
        )
    }
}

export class ScreenScaffold extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="screen scaffold">
                <div className="header">
                    {this.props.headerItems}
                </div>
                <div className="body">
                    {this.props.body}
                </div>
            </div>
        )
    }
}

export class BodySection extends React.Component{
    constructor(props){
        super(props)
        /**@type {{label:String}} */
        this.props = this.props
    }
    render(){
        return (
            <div className="body-section">
                <div className="label">{this.props.label}</div>
                {this.props.children}
            </div>
        )
    }
}

export class WaitingScreen extends React.Component{
    render(){
        return (
            <div className="screen">
                <div className="center">
                    <div>
                        please wait...
                    </div>
                </div>
            </div>
        )
    }
}

export class LogInScreen extends React.Component{
    constructor(props){
        super(props)
        /**@type {{app: App}} */
        this.props = this.props
        this.usernameInputRef = React.createRef()
        this.passwordInputRef = React.createRef()
        this.onLogInClicked = this.onLogInClicked.bind(this)
        this.state = {
            error: null
        }
    }
    onLogInClicked(){
        var username = this.usernameInputRef.current.value
        var password = this.passwordInputRef.current.value
        if(username!="" && password!=""){
            this.props.app.client.logInWithFields(username, password, success=>{
                if(!success){
                    this.setState({
                        error: translate("login_error")
                    })
                }else{
                    this.props.app.goToScreen(App.ScreenEnum.Homepage)
                }
            })
        }
    }
    render(){
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
                        {/* TODO: localize */}
                        <div className="title">Вход в систему</div>
                        <div className="space"></div>
                        <div className="label">Лишь у некоторых пользователей есть доступ к редактированию всяких ништяков.</div>
                        <div className="space"></div>

                        {this.state.error ? <div className="label error">{this.state.error}</div> : ""}

                        <div className="label">username:</div>
                        <input ref={this.usernameInputRef} className="input" type="text" name="ashen-hermit-site-username" placeholder="username" required/>
                        <div className="space"></div>
                        <div className="label">password:</div>
                        <input ref={this.passwordInputRef} className="input" type="password" name="ashen-hermit-site-username" placeholder="password" required/>
                        <div className="space"></div>
                        <div className="button" onClick={this.onLogInClicked}>Войти</div>
                    </div>
                    <div className="body-section">
                        <ScreenChangeButton text={translate("continue_without_authorization")} app={this.props.app} screen={App.ScreenEnum.Homepage} className=""/>
                    </div>
                </div>
            }/>
        )
    }
}

export class HomepageScreen extends React.Component{
    render(){
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



export class FloatingScreen extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        isHidden: true,
      }
      this.hide = this.hide.bind(this)
    }
    show(){
      this.setState({
        isHidden: false,
      })
    }
    hide(){
      this.setState({
        isHidden: true,
      })
    }
    render(){
      let hiddenClass = this.state.isHidden ? "hidden" : ""
  
      return (
        <div className={"floating-screen " + this.props.className + " " + hiddenClass}>
          <div className="button" onClick={this.hide}>{translate("close")}</div>
          {this.props.children}
        </div>
      )
    }
  }