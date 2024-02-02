const form = document.querySelector('#form');
const nome = document.querySelector('#nome');
const cpf = document.querySelector('#cpf');
const email = document.querySelector('#email');
const cep = document.querySelector('#cep');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const uf = document.getElementById('uf');
const rua = document.getElementById('rua');
const mensagem = document.querySelector('#mensagem');
const notNull = document.getElementsByClassName('not-null');
let msg = ''


function isEmpty(elem) {
    return elem.value.length < 1 
    ? ` O campo <strong>${elem.name}</strong> não pode ser vazio.`
    : '';
}

function validaEmail(elem) {
    return elem.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        ? ''
        : `Digite um <strong>email</strong> válido`;
}

function validaNome(params) {
    return params.value.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        ? ''
        : `Digite um <strong> nome</strong> Válido`;
}

function validaCpf(params) {
    return params.value.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
        ? ''
        : `Digite um <strong>cpf</strong> Válido`;
}

function validaCep(params) {
    console.log(params.value);
    return params.value.match(/^[0-9]{5}-?[0-9]{3}$/)
        ? ''
        : `Digite um <strong>cep</strong> Válido`;

}
function updateAdress(data) {
  
  
    if (!('erro' in data)) {
        rua.value = (data.logradouro);
        bairro.value = (data.bairro);
        cidade.value = (data.localidade);
        uf.value = (data.uf);
        // mensagem.innerHTML = ''
    } else {
        console.log('erro');
        rua.value = ''
        bairro.value = ''
        cidade.value = ''
        uf.value = '';
        markup += `<p>CEP não encontrado</p>`
    }
}



form.addEventListener('submit', function (event) {
    event.preventDefault();

    let msg = [];
    let markup = '';

    Array.from(notNull).forEach(field => {
        let fieldState = isEmpty(field);
        if (fieldState)
            msg.push(fieldState)
    });


    const isEmail = validaEmail(email);
    if (isEmail) msg.push(isEmail);

    const isNome = validaNome(nome);
    if (isNome) msg.push(isNome);

    const isCpf = validaCpf(cpf);
    if (isCpf) msg.push(isCpf);

    const isCep = validaCep(cep);


    if (isCep) {
        msg.push(isCep);

    } else {
        fetch('https://viacep.com.br/ws/' + cep.value + '/json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                updateAdress(data)
            })
            .catch((error)=> {
                markup += `<p>${error.message}</p>`
            }); 

        // const script=document.createElement('script');
        // script.src='https//viacep.com.br/ws/'+cep.value+'/json?callback=updateAdress';
        // document.body.appendChild(script);
        // mensagem.innerHTML = markup;
    }

    msg.forEach(item => {
        markup += `<p>${item}</p>`
    });

    mensagem.innerHTML = markup;

    if (msg.length < 1) {
        alert('Formulário enviado com sucesso');
    }

});


