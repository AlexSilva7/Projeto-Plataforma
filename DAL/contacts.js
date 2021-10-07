
const db = require('./dbConnection')
const contactModel = require('../domain/contact')

class contact {
    static async load(studentId) {
        var contacts = await db.query("SELECT student_id, contact_id, contact_type, contact_value FROM StudentContacts where student_id = $1", [studentId])
        var ret = []
        contacts.rows.forEach(element => {
            let item = new contactModel(element.student_id, element.contact_id, element.contact_type, element.contact_value)
            ret.push(item)
        });
        return ret;
    }

    static async create(studentId, type, description, value) {
        await db.query("INSERT INTO StudentContacts (student_id, contact_type, contact_description, contact_value) VALUES($1, $2, $3, $4)", [studentId, type, description, value]
            /*, 
                    (err, result) => {
                
                        if(err) throw err          
                        console.log(result)
                    
                    }*/
        )
    }
}
module.exports = contact