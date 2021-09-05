import React from "react"

export class PropertyInput extends React.Component{
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


export class DataEditorComponent extends React.Component{
    constructor(props){
        super(props)
        /**@type {{onChange: Function}} */
        this.props = this.props

        /**@type {Object} */
        this.dataClass = null
        /**@type {Function} */
        this.deleteFunction = null

        this.state = {
            dataCopy: null
        }
        this.realData = null

        this.deleteData = this.deleteData.bind(this)
        this.saveData = this.saveData.bind(this)
    }

    startEditing(data){
        if(!this.dataClass) return
        this.realData = data
        this.setState({
            dataCopy: new this.dataClass().importData(this.realData.exportData())
        })
    }

    deleteData(){
        if(this.deleteFunction) this.deleteFunction(this.realData)
        this.props.onChange()
    }
    saveData(){
        this.realData.importData(this.state.dataCopy.exportData())
        this.props.onChange()
    }

    canRender(){
        return this.state.dataCopy!=null
    }
    
    render(){
        return "";
    }
}