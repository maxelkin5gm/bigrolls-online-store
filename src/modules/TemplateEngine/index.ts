import ejs from 'ejs';

export default new class TemplateEngine {
  renderFile(path: string, options?: { [name: string]: any }) {
    return ejs.renderFile(path, options);
  }

  renderString(html: string, options?: { [name: string]: any }) {
    return ejs.render(html, options);
  }
}();
