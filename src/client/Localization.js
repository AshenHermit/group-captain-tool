import * as CSV from "csv-string"
import { config } from "./Config"

var translationCSV = `message, "ru", "en"
continue_without_authorization, "Продолжить без авторизации", ""

change_theme, "Сменить палитру", ""
log_out, "Выйти", ""
settings, "Настройки", ""
home.title, "Group Captain's Tool", "Group Captain's Tool"
home.head_label, "Инструмент для главарей университетских банд.", ""
home.section.0.title, "Дневные записи", ""
home.section.0.label, "Информация относящаяся к определенному дню.", ""
check_people_button, "Отметить посещаемость", ""
documents_history_button, "История документов", ""

app.title, "Group Captain's Tool", "Group Captain's Tool"

login_error, "Не получилось войти, либо введенные данные не корректны, либо вас нет в базе.", ""

home.section.1.title, "Редактирование", ""
home.section.1.label, "", ""

close, "Закрыть",""
analytics, "Аналитика", ""
people_checker.title, "Посещаемость", ""
people_checker.head_label, "Можно отметить людей присутствовавших в вузе", ""

documents_history.title, "История документов", ""
documents_history.head_label, "Список документов прикрепленных до", ""

show, "показать", ""
list_of_present, "Список присутствующих", ""
list_of_absent, "Список отсутствующих", ""
list_of_documents, "Текстовый список документов", ""

edit_group_button, "Редактировать группу", ""
group_editor.title, "Редактирование группы", ""
group_editor.head_label, "", ""
list_of_names, "Список имен", ""
group_data_json, "Json объект группы", ""
edit_person, "edit", "edit"
editing, "Редактирование", ""
delete, "удалить", ""
save, "сохранить", ""
add_person, "Добавить", ""
add, "Добавить", ""
save_error, "Не получилось сохранить данные, похоже у вас не достаточно для этого прав.", ""

show_documents, "Прикрепленные документы", ""
show_schedule, "Расписание", ""
edit, "edit", "edit"
no_lessons, "пар нет", ""

home.section.global_documents.title, "Глобальные документы", ""
home.section.global_documents.lable, "ссылки на полезные страницы", ""

invert, "Инвертировать выбор", ""
pare, "пара", ""

online_place_state, "Дистанционно", ""
loading, "загрузка...", ""
no_documents, "документов нет", ""
copied, "Скопировано", ""
go_to_lesson, "Перейти к лекциям", ""
go_to_lesson_лк, "Перейти к лекциям", ""
go_to_lesson_пр, "Перейти к семинарам", ""

month.0.genitive,"января",""
month.1.genitive,"февраля",""
month.2.genitive,"марта",""
month.3.genitive,"апреля",""
month.4.genitive,"мая",""
month.5.genitive,"июня",""
month.6.genitive,"июля",""
month.7.genitive,"августа",""
month.8.genitive,"сентября",""
month.9.genitive,"октября",""
month.10.genitive,"ноября",""
month.11.genitive,"декабря",""
`


class Localization{
    constructor(){
        this.translationTable = {}
        this.currentLocale = config.locale
    }

    parseTranslationTable(csvText){
        var translationMatrix = CSV.parse(csvText)
        var translationTable = {}
        var locales = translationMatrix[0].slice(1)
        for (let i = 1; i < translationMatrix.length; i++) {
            if(translationMatrix[i].length<1+locales.length) continue

            let message = translationMatrix[i][0]
            translationTable[message] = {}

            locales.forEach((locale, localeIndex)=>{
                translationTable[message][locale] = translationMatrix[i][1+localeIndex]
            })
        }
        return translationTable
    }
    loadTranslationFromCSV(csvText){
        this.translationTable = this.parseTranslationTable(csvText)
    }
    translate(message){
        if(message in this.translationTable){
            return this.translationTable[message][this.currentLocale]
        }
        return message
    }
    translateDay(date, includeYear=true){
        var text = date.getDate().toString() + " " + translate("month."+date.getMonth()+".genitive")
        if(includeYear) text += " " + date.getFullYear().toString()
        return text
    }
    setLocale(locale){
        this.currentLocale = locale
    }
}

var localization = new Localization()
localization.loadTranslationFromCSV(translationCSV)
window.localization = localization
export {localization}
export function translate(message){
    return localization.translate(message)
}