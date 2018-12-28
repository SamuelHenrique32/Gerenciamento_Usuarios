var fields = document.querySelectorAll("#form-user-create [name]");                     //tras os que tem name
var user = {};

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

    console.log(user);
});