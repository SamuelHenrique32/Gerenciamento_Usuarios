class UserController{

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
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

            let values = this.getValues();

            //se der certo, se der errado
            this.getPhoto().then(
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

    getPhoto(){

        //se der certo, executa um, senao o outro
        //alterado para arrow function pois o ...this muda de contexto
        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            //gera novo array com dados filtrados
            let elements = [...this.formEl.elements].filter(item=>{

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

    getValues(){

        //var de escopo, somente no getValues
        let user = {};

        //spread
        [...this.formEl.elements].forEach(function (field, index) {                                                //para cada campo do formulario

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

        tr.innerHTML = `
                 <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                 <td>${dataUser.name}</td>
                 <td>${dataUser.email}</td>
                 <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
                 <td>${dataUser.register}</td>
                 <td>
                     <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                     <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                 </td>
        `;

        this.tableEl.appendChild(tr);
    }
}