export class Exportable{
    constructor(){
        this.arrayItemsClasses={}
        this.dictItemsClasses={}
        this.propertyExceptions=["arrayItemsClasses", "dictItemsClasses", "propertyExceptions"]
    }
    /**
     * 
     * @param {Dict<Exportable>} arrayItemsClasses
     * @param {Dict<Exportable>} dictItemsClasses
     * @param {Array<String>} propertyExceptions
     * @returns this
     */
     registerClasses(arrayItemsClasses=null, dictItemsClasses=null, propertyExceptions=null){
        this.arrayItemsClasses = arrayItemsClasses
        this.dictItemsClasses = dictItemsClasses
        if(propertyExceptions!=null) this.propertyExceptions = this.propertyExceptions.concat(propertyExceptions)
    }

    static exportArray(arrayOfExportables){
        var rawArray = Array.from(arrayOfExportables)
        rawArray = rawArray.map(x=>x.exportData())
        return rawArray
    }
    static importArray(rawDataArray, exportableItemClass){
        var array = Array.from(rawDataArray)
        array = array.map(rawData=>new exportableItemClass().importData(rawData))
        return array
    }
    static exportDict(dict){
        var rawDict = Object.assign({}, dict)
        Object.keys(dict).forEach(key => {
            dict[key] = dict[key].exportData()
        })
        return rawDict
    }
    static importDict(rawDictData, exportableItemClass){
        var dict = Object.assign({}, rawDictData)
        Object.keys(dict).forEach(key => {
            dict[key] = new exportableItemClass().importData(dict[key])
        })
        return dict
    }
    

    assignDict(dict){
        Object.assign(this, dict)
        return this
    }
    convertToDict(){
        return JSON.parse(JSON.stringify(this))
    }

    exportData(){
        return this.smartExport(this.arrayItemsClasses, this.dictItemsClasses, this.propertyExceptions)
    }
    /**
     * Should return this object.
     * @param {Dict} dict 
     */
    importData(dict){
        return this.smartImport(dict, this.arrayItemsClasses, this.dictItemsClasses, this.propertyExceptions)
    }


    /**
     * 
     * @param {Dict} data 
     * @param {Dict<Exportable>} arrayItemsClasses
     * @param {Dict<Exportable>} dictItemsClasses
     * @returns this
     */
    smartImport(data, arrayItemsClasses=null, dictItemsClasses=null, propertyExceptions=null){
        data = Object.assign({}, data)
        if(propertyExceptions!=null){
            propertyExceptions.forEach(propertyKey=>{
                if(propertyKey!=null) delete data[propertyKey]
            })
        }
        
        this.assignDict(data)

        if(arrayItemsClasses!=null)
        Object.keys(arrayItemsClasses).forEach(arrayKey=>{
            if(arrayKey in data)
                this[arrayKey] = Exportable.importArray(data[arrayKey], arrayItemsClasses[arrayKey])
        })

        if(dictItemsClasses!=null)
        Object.keys(dictItemsClasses).forEach(dictKey=>{
            if(dictKey in data)
                this[dictKey] = Exportable.importDict(data[dictKey], dictItemsClasses[dictKey])
        })
        return this
    }
    /**
     *  
     * @param {Dict<Exportable>} arrayItemsClasses
     * @param {Dict<Exportable>} dictItemsClasses
     * @returns this
     */
    smartExport(arrayItemsClasses=null, dictItemsClasses=null, propertyExceptions=null){
        var rawData = this.convertToDict()

        if(arrayItemsClasses!=null)
        Object.keys(arrayItemsClasses).forEach(arrayKey=>{
            if(arrayKey in this)
                rawData[arrayKey] = Exportable.exportArray(this[arrayKey])
        })
        
        if(dictItemsClasses!=null)
        Object.keys(dictItemsClasses).forEach(dictKey=>{
            if(dictKey in this)
                rawData[dictKey] = Exportable.exportDict(this[dictKey])
        })

        if(propertyExceptions!=null){
            propertyExceptions.forEach(propertyKey=>{
                if(propertyKey!=null){
                    delete rawData[propertyKey]
                }
            })
        }

        return rawData
    }
}