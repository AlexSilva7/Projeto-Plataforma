
const db = require('./dbConnection')

const ct = require('../domain/courses')


module.exports = class contact {
    static async load(courseId) {
        var contacts = await db.query("SELECT student_id, contact_id, contact_type, contact_value FROM StudentContacts where student_id = $1", [studentId])
        var ret = []
        contacts.rows.forEach(element => {
            let item = new ct(element.student_id, element.contact_id, element.contact_type, element.contact_value)
            ret.push(item)
        });
        return ret;
    }
    create() {}
}