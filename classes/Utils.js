class Utils{

    //nao sera instanciado
    static dateFormat(date){

        return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

    }
}