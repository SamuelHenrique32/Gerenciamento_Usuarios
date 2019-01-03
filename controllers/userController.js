class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
    }

    onEdit(){

        //recupera botao de cancelar
        //'e' eh a variavel do evento
        //de inicio nao muda nada pois formulario de edicao esta oculto
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            //recupera botao
            let btn = this.formUpdateEl.querySelector("[type=submit]");

            //desabilita botao
            btn.disabled = true;

            //retornou usuario com todos os dados
            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            //combinacao de objetos
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                (content)=> {

                    //manter foto antiga
                    if(!values.photo){
                        result._photo = userOld._photo;
                    } else{
                        //possui nova foto
                        result._photo = content;
                    }

                    //retorna tr a ser alterada
                    tr.dataset.user = JSON.stringify(result);

                    //atualiza linha
                    tr.innerHTML = `
                         <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                         <td>${result._name}</td>
                         <td>${result._email}</td>
                         <td>${(result._admin) ? 'Sim' : 'Não'}</td>
                         <td>${Utils.dateFormat(result._register)}</td>
                         <td>
                             <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                             <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                         </td>
                    `;

                    this.addEventsTr(tr);

                    this.updateCount();

                    //limpa formulario de edicao
                    this.formUpdateEl.reset();

                    btn.disabled = false;

                    this.showPanelCreate();
                },
                (e)=> {
                    console.error(e);
                });

        });
    }

    onSubmit(){

        //arrow function para evitar conflito de escopo
        this.formEl.addEventListener("submit", event =>{
            //cancela comportamento padrao, nao manda mais via get
            event.preventDefault();

            //recupera botao
            let btn = this.formEl.querySelector("[type=submit]");

            //desabilita botao
            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if(!values) return false;

            //se der certo, se der errado
            this.getPhoto(this.formEl).then(
                (content)=> {

                values.photo = content;

                //foto esta ok, add linha
                this.addLine(values);

                //limpa formulario
                this.formEl.reset();

                btn.disabled = false;
            },
            (e)=> {
                console.error(e);
            });

        });
    }

    getPhoto(formEl){

        //se der certo, executa um, senao o outro
        //alterado para arrow function pois o ...this muda de contexto
        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            //gera novo array com dados filtrados
            let elements = [...formEl.elements].filter(item=>{

                if (item.name === 'photo'){
                    return item;
                }
            });

            //um arquivo da colecao
            let file = elements[0].files[0];

            //quando foto terminar, acontece em paralelo, funcao de callback
            fileReader.onload = ()=>{

                //base 64, consegue colocar na tag img (forma compactada, codigo serializado)
                //deu certo
                resolve(fileReader.result);
            };

            fileReader.onerror = (e)=>{

                reject(e);
            };

            //se der retorno, executa. Upload de foto nao obrigatorio
            if (file){
                fileReader.readAsDataURL(file);
            } else{
                //se nao selecionar imagem, coloca padrao
                resolve("dist/img/boxed-bg.jpg");
            }

        });
    }

    getValues(formEl){

        //var de escopo, somente no getValues
        let user = {};
        let isValid = true;

        //spread
        [...formEl.elements].forEach(function (field, index) {                                                //para cada campo do formulario

            //e nao vazio
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){

                //add classe css
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == "gender"){

                if(field.checked){                                                               //true
                    user[field.name] = field.value;
                }
            } else if(field.name == "admin") {
                //guarda true ou false do admin
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }

        });

        if(!isValid){
            return false;
        }

        //Json -> classe User
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    //template
    addLine(dataUser){

        let tr = document.createElement('tr');

        //.user e nome que escolhemos, funciona como variavel
        //converte objeto para String em JSON
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
                 <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                 <td>${dataUser.name}</td>
                 <td>${dataUser.email}</td>
                 <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
                 <td>${Utils.dateFormat(dataUser.register)}</td>
                 <td>
                     <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                     <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                 </td>
        `;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    addEventsTr(tr){
        //add escuta, e poderia ser qualquer palavra
        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user);

            //ao contrario de rowIndex, comeca no 0
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            //para cada campo que passar, preenche
            for (let name in json){

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "]");

                //verificar se campo existe
                if(field){

                    switch (field.type) {

                        case 'file':
                            //passa para proxima iteracao
                            continue;
                            break;

                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "][value=" + json[name] +"]");
                            field.checked = true;
                            break;

                        case 'checkbox':
                            field.checked = json[name];
                            break;

                        default:
                            field.value = json[name];
                    }
                }
            }

            //altera a foto
            this.formUpdateEl.querySelector(".photo").src = json._photo;

            //exibe formulario
            this.showPanelUpdate();
        });
    }

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        //transforma em array para realizar foreach
        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;

            //de JSON volta a ser objeto
            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++;
        });

        //busca elemento e atualiza valor
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
}