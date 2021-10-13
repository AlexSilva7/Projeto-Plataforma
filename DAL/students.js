
//const contactDal = require('./contacts')
//const documentDal = require('./documents')
//const contactModel = require('./contacts')
const studentModel = require('../domain/students')
const db = require('./dbConnection')

class student {
    
    static async create(nome, sobrenome, endereco, data, naturalidade, escolaridade, estadoCivil, parentes, situacaoEmprego, renda, rendaFamiliar, rg, cpf, telefone, email){

        let insertStudent = await db.query("INSERT INTO students(name, surname, adress, birthdate, place_of_birth, scholarity, marital_status, relatives, employment_status, income, familyinconme) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
        [nome,sobrenome,endereco,data,naturalidade,escolaridade,estadoCivil,parentes,situacaoEmprego,renda,rendaFamiliar])

        var studentId = await db.query("SELECT student_id FROM Students where name = $1 and surname = $2 and adress = $3 and birthdate = $4 and income = $5 and familyinconme = $6 and cast(created_at as varchar(10)) = cast(current_date as varchar(10))", 
        [nome, sobrenome, endereco, data, renda, rendaFamiliar])

        var id = studentId.rows[0].student_id

        if(telefone !== ''){
            await db.query("INSERT INTO studentcontacts(student_id, contact_type, contact_description, contact_value) VALUES($1, $2, $3, $4)", 
            [id, 1, 'Phone', telefone])
        }

        if(email !== ''){
            await db.query("INSERT INTO studentcontacts(student_id, contact_type, contact_description, contact_value) VALUES($1, $2, $3, $4)", 
            [id, 2, 'Email', email])
        }

        if(rg !== ''){
            await db.query("INSERT INTO studentdocuments(student_id, document_type, document_description, document_value) VALUES($1, $2, $3, $4)", 
            [id, 1, 'RG', rg])
        }

        if(cpf !== ''){
            await db.query("INSERT INTO studentdocuments(student_id, document_type, document_description, document_value) VALUES($1, $2, $3, $4)", 
            [id, 2, 'CPF', cpf])
        }

     }
     
    static async load(studentId) {
        /*
        var students = await db.query("SELECT student_id, name, surname, adress, birthdate, place_of_birth, scholarity, marital_status, relatives, employment_status, income, familyInconme FROM Students where student_id = $1", [studentId])
        */
        var students = await db.query("SELECT student_id, name, surname, adress, CAST(birthdate as CHAR(10)), place_of_birth, scholarity, marital_status, relatives, employment_status, income, familyInconme FROM Students where student_id = $1", [studentId])
            // console.table(students.rows)
        var contacts = await db.query("SELECT contact_type, contact_value FROM StudentContacts where student_id = $1", [studentId])
        
        var documents = await db.query("SELECT document_type, document_value FROM StudentDocuments where student_id = $1", [studentId])
        
        var ret = []
        
        students.rows.forEach(element => {
        
            let id = element.student_id
        
                /*
                let contact = async id => {
                    contactDal.load(id).then(value => {
                        return value
                    }, err => {
                        console.log(err)
                    })
        
                };
                */
        
                // let document = documentDal.load(id)
            let item = new studentModel(element.name, element.surname, element.adress, element.birthdate, element.place_of_birth,
            element.scholarity, element.marital_status, element.familyinconme, element.relatives, element.employment_status,
            element.income, contacts.rows, documents.rows)
        
            ret.push(item)
        });
        
        return(ret)
    }

     static loadAll() {
     }

}

module.exports = student


