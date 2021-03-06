class User{

    constructor(name, gender, birth, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id(){
        return this._id;
    }

    get register(){
        return this._register;
    }

    get name(){
        return this._name;
    }

    get gender(){
        return this._gender;
    }

    get birth(){
        return this._birth;
    }

    get country(){
        return this._country;
    }

    get email(){
        return this._email;
    }

    get password(){
        return this._password;
    }

    get photo(){
        return this._photo;
    }

    get admin(){
        return this._admin;
    }

    set photo(value){
        this._photo = value;
    }

    loadFromJSON(json){

        //for in para percorrer objetos
        for(let name in json){

            switch (name) {

                case '_register':
                    this[name] = new Date(json[name]);
                    break;

                default:
                    this[name] = json[name];
            }
        }
    }

    static getUsersStorage(){

        let users = [];

        if(localStorage.getItem("users")){

            users = JSON.parse(localStorage.getItem("users"));
        }

        return users;
    }

    getNewID(){

        let usersID = parseInt(localStorage.getItem("usersID"));

        //guardar id em local global
        //se nao existir cria com zero
        if(!usersID > 0){
            usersID = 0;
        }

        usersID++;

        localStorage.setItem("usersID", usersID);

        return usersID;
    }

    save(){

        //retorna todos usuarios armazenados e cria um array
        let users = User.getUsersStorage();

        //id para identificar usuarios
        //verifica se existe id
        if(this.id > 0){

            users.map(u=>{

                if(u._id == this.id){

                    Object.assign(u, this);
                }
                return u;
            });
        } else{
            //gerar novo id
            //esta na classe, pode manipular propriedades privadas
            this._id = this.getNewID();

            users.push(this);
        }

        localStorage.setItem("users", JSON.stringify(users));
    }

    remove(){

        let users = User.getUsersStorage();

        users.forEach((userData, index)=>{

            //achou usuario para exclusao
            if(this._id == userData._id){

                // a partir do objeto, exclui 1
                users.splice(index, 1);
            }
        });

        //guarda array novamente
        localStorage.setItem("users", JSON.stringify(users));
    }
}