const Handlebars = require('handlebars')
const fs = require('fs')


module.exports = class TemplateEngine {
    render(path, options) {
        const source = fs.readFileSync(path, "utf8");
        const template = Handlebars.compile(source)
        return template(options)
    }
}