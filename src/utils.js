export default {
  compileStringTemplate: function compileStringTemplate(template, replacementText){
    return template.replace('{{}}', replacementText);
  }
}