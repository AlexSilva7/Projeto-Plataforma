const db = require('./dbConnection')
const documentModel = require('../domain/document')

module.exports = class document {
    static async load(studentId) {
        var documents = await db.query("SELECT document_id, document_type, document_value FROM StudentDocuments where student_id = $1", [studentId])
        var ret = []
        documents.rows.forEach(element => {
            let item = new documentModel(element.student_id, element.document_id, element.document_type, element.document_value)
            ret.push(item)
        });
        return ret;
    }
    static async create(studentId, type, description, value) {
        await db.query("INSERT INTO StudentDocuments (student_id, document_type, document_description, document_value) VALUES($1, $2, $3, $4)", [studentId, type, description, value],
            (err, result) => {

                if (err) throw err
                console.log(result)
                return 'Inserido com sucesso!'

            })
    }
}