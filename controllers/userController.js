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

            this.addLine(this.getValues());

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
            } else{
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

    addLine(dataUser){

        //comando HTML
        this.tableEl.innerHTML = `
                    <tr>
                        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${dataUser.admin}</td>
                        <td>${dataUser.birth}</td>
                        <td>
                          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                  </tr>
    `;

    }
}