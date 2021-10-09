import ejs from "ejs"


export default new class TemplateEngine {
    render(path: string, options?: {[name: string]: any}) {
        return ejs.renderFile(path, options)
    }
}


