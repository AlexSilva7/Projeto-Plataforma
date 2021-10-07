
class Document {
    constructor(documentId, studentId, type, description, value) {
        this.documentId = documentId
        this.studentId = studentId
        this.description = description
        this.type = type
        this.value = value
    }
}

module.exports = Document