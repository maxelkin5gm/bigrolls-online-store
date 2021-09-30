const ejs = require("ejs")

module.exports = new class TemplateEngine {
    render(path, options) {
        return ejs.renderFile(path,  options)
    }
}


