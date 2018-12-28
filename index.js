var fields = document.querySelectorAll("#form-user-create [name]");                     //tras os que tem name
var user = {};

function addLine(dataUser){

    console.log(dataUser);

    //comando HTML
    document.getElementById("table-users").innerHTML = `
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

document.getElementById("form-user-create").addEventListener("submit", function (event) {
    //cancela comportamento padrao, nao manda mais via get
    event.preventDefault();

    fields.forEach(function (field, index) {                                                //para cada campo do formulario

        if(field.name == "gender"){

            if(field.checked){                                                               //true
                user[field.name] = field.value;
            }
        } else{
            user[field.name] = field.value;
        }

    });

    //Json -> classe User
    var objectUser = new User(
        user.name,
        user.gender,
        user.birth,
        user.country,
        user.email,
        user.password,
        user.photo,
        user.admin);

    addLine(objectUser);
});