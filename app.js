const express = require('express')

const contactDal = require('./DAL/contacts')
const documentDal = require('./DAL/documents')
const studentDal = require('./DAL/students')
const app = express()

const dbconnection = require('./DAL/dbConnection')

//configurando a ejs
app.set('view engine','ejs')

//definindo o caminho da views wjs
app.set('views', './app/views')

//config de arquivos estáticos
app.use(express.static('./app'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

var completeName
var loginADM
var senhaADM
var loginSucess


app.get('/', async(req, res) => {
    res.render("home/index")
})

app.post('/admin', async(req, res) => {

    let {login, senha} = req.body

    loginADM = login
    senhaADM = senha

    let pass = await dbconnection.query('SELECT pass FROM admins WHERE login = $1', [loginADM])
    let nameUser = await dbconnection.query('SELECT name FROM admins WHERE login = $1', [loginADM])
    let password

    completeName

    if(pass.rows.length == 0){
        password = ''
    }
    else{
        password = pass.rows[0].pass
        completeName = nameUser.rows[0].name
    }

    if(senha == password){
        res.render("home/principal", {name:completeName})

    }else{
        //res.redirect('/')
        res.render("home/indexError")
    }
})

app.get('/adm', async(req, res) => {
    
    if(loginADM == undefined){
        res.redirect('/')
    }
    else{
        res.render("home/principal", {name:completeName})
    }
})

app.post('/cadastro', async(req, res) => {
    res.render("home/cadastro", {name:completeName})
})

app.post('/alunos', async(req, res) => {
    res.render("home/alunos", {name:completeName})
})

app.post('/salvarEstudante', async(req, res) => {

    let {nome, sobrenome, endereco, data, naturalidade, escolaridade, estadoCivil, parentes, situacaoEmprego,renda, rendaFamiliar, rg, cpf, telefone, email} = req.body

    await studentDal.create(nome,sobrenome,endereco,data,naturalidade,escolaridade,estadoCivil,parentes,situacaoEmprego,renda,rendaFamiliar, rg, cpf, telefone, email)
    
    res.redirect('/adm')

})


app.get('/contact', async(req, res) => {
    let ret = await contactDal.load(1)
    res.send(ret)
})

app.get('/document', async(req, res) => {
    let ret = await documentDal.load(1)
    res.send(ret)
})


app.get('/create-contact', async(req, res) => {
    let ret = await contactDal.create(1, 3, 'instagram', 'alexsilva7')
    res.send(ret)
})

app.listen(3000, () => {
    console.log('Escutando na porta 3000')
    console.log('Pressione CRTL+C para encerrar o servidor')
})


