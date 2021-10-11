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

app.get('/', async(req, res) => {
    res.render("home/index")
})


app.post('/admin', async(req, res) => {
    let {login, senha} = req.body
    let pass = await dbconnection.query('SELECT pass FROM admins WHERE login = $1', [login])
    let nameUser = await dbconnection.query('SELECT name FROM admins WHERE login = $1', [login])
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
        /*
        res.redirect('/contact')
        */
        res.render("home/principal", {name:completeName})
    }else{
        res.redirect('/')
    }
})

app.post('/cadastro', async(req, res) => {
    res.render("home/cadastro", {name:completeName})
})

app.post('/salvar-estudante', async(req, res) => {
    let {nome, sobrenome, endereco, data, naturalidade, escolaridade, estadoCivil, parentes, situacaoEmprego,renda, rendaFamiliar, rg, cpf, telefone, email} = req.body

     dbconnection.query('INSERT INTO students(name, surname, adress, birthdate, place_of_birth, scholarity, marital_status, relatives, employment_status, income, familyinconme) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    [nome],[sobrenome],[endereco],[data],[naturalidade],[escolaridade],[estadoCivil],[parentes],[situacaoEmprego],[renda],[rendaFamiliar])

    console.log(nome)

    res.redirect('/')

})

app.get('/contact', async(req, res) => {
    let ret = await contactDal.load(1)
    res.send(ret)
})

app.get('/document', async(req, res) => {
    let ret = await documentDal.load(1)
    res.send(ret)
})

/*
app.get('/', async(req, res) => {
    let ret = await studentDal.load(1)
    res.send(ret)
})
*/

app.get('/create-contact', async(req, res) => {
    let ret = await contactDal.create(1, 3, 'instagram', 'alexsilva7')
    res.send(ret)
})

app.listen(3000, () => {
    console.log('Escutando na porta 3000')
    console.log('Pressione CRTL+C para encerrar o servidor')
})