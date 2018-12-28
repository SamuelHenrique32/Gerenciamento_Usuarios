var name = document.querySelector("#exampleInputName");                                 //referencia para HTML, elemento (# do CSS3)
var gender = document.querySelectorAll("#form-user-create [name=gender]:checked");      //traz o marcado
var birth = document.querySelector("#exampleInputBirth");
var country = document.querySelector("#exampleInputCountry");
var email = document.querySelector("#exampleInputEmail");
var password = document.querySelector("#exampleInputPassword");
var photo = document.querySelector("#exampleInputFile");
var admin = document.querySelector("#exampleInputAdmin");

var fields = document.querySelectorAll("#form-user-create [name]");                     //tras os que tem name

fields.forEach(function (field, index) {                                                //para cada campo do formulario

    console.log(field.id, field.name, field.value, field.checked, index);

});