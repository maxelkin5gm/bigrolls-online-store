const ejs = require("ejs")

module.exports = class TemplateEngine {
    render(path, options) {
        return ejs.renderFile(path,  options)
    }
}


