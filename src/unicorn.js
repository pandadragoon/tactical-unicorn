import log from './log';
import errors from './error-messages';
import utils from './utils';
import validTags from './valid-tags';
import _ from 'lodash';
import { Observable } from 'rxjs';

 /************************************************************************************************************************************
     * REF for DEV
     object(component) {
      el: string selector,
      template: Template<string>,
      data: obj(any),
      methods: obj(func),
      components: array<string component-name>,
      name: string
    }
  *************************************************************************************************************************************/ 
  

const unicorn = (function(){
  var root;
  var appRoot;

  // Grab var from {{ var }}
  var templateRegEx = /{{(([^}{]+)?)}}/g;

  // Global Store of Components
  var registeredComponents = {};

  /*
    @params: component { object(component) || array<object(component)>}
    @return: Template<HTML>

    Registers a component to be used by the app
  */
  function registerComponent(component){
    // Checks if Component is Single Object or Array of Objects
    
    if(Array.isArray(component)){
      component.forEach(registerComponent);
      return;
    }

    const parsedTemplate = processTemplate(component);
  
    component.update = updateComponent;
    registeredComponents[component.name] = component;

    return parsedTemplate;
  }

  function updateComponent(newData){
    let component = registeredComponents[this.name]
    let oldData = component.data;
    let updatedData = Object.assign(oldData, newData);
    component.data = updatedData;
    const newTree = registerComponent(appRoot);
    root.replaceChild(newTree, root.firstChild);
  }

  /*
    @params: object(component) 
    @return: Template<HTML>

    Determines whether template is an element reference or a string template
    and passes it off accordingly
  */
  function processTemplate(component) {
    let parsedTemplate;

    if('el' in component){
      parsedTemplate = processElTemplate(component);
    }else if('template' in component){
      parsedTemplate = processPlainTemplate(component);
    }else {
      log('No element or template supplied.', 'error', 'register component: ');
      return;
    }

    return parsedTemplate;
  }

   /*
    @params: object(component) 
    @return: Template<HTML>

    Grabs a node in the html, processes it as a template and replaces it
  */
  function processElTemplate(component) {
    const target = document.querySelectorAll(component.el);
    
    if(isValidTarget(target, 'process element template: ', component.el)){
      let validTarget = target[0];
      
      let parsedElTemplate = parseDomToString(validTarget);

      if('components' in component) {
        component.template = parsedElTemplate;
        
        removeSelf(validTarget);

        return parseComponents(component, component.components);
      }
      
      parsedTemplate = parseTemplateUnicorn(parsedElTemplate, component);

      removeSelf(validTarget);

      return parsedTemplate;
    }
    
    return null;
  }

  function removeSelf(element){
    element.parentElement.removeChild(element);
  }

  /*
    @params: array <nodes> 
    @return: boolean

    Checks if a target is unique and exists
  */
  function isValidTarget(target, location, selector){
    if(target.length > 1){
      log(errors.nonUniqueNode.replace('{{}}', selector), 'error', location);
      return false;
    }

    if(target.length <= 0){
      log(errors.invalidSelector.replace('{{}}', selector), 'error', location)
      return false;
    }

    return true;
  }

  /*
    @params: object(component) 
    @return: Template<HTML>

    Takes a component template string and processes it into html
  */
  function processPlainTemplate(component){
    if('components' in component){
      return parseComponents(component, component.components);
    }

    return parseTemplateUnicorn(component.template, component);
  }

  /*
    @params: node, object(component) 
    @return: void

    Appends the root component to the root node
  */
  function registerRootNode(node, rootComponent){
    const target = document.querySelectorAll(node);
    
    if(!isValidTarget(target, 'register root: ', node)){
      return;
    }

    root = target[0];
    appRoot = rootComponent;

    root.appendChild(registerComponent(rootComponent));
  }

  /*
    @params: Template<string>, object(component) 
    @return: Template<HTML>

    Passes a template string through the template engine to get html
    then registers events from the component onto the html
  */
  function parseTemplateUnicorn(template, component){
    component.data = component.data || {};
    const parsedTemplate = templateEngine(template, component.data);
    const parsedHTML = parseTemplateToHTML(parsedTemplate);
    registerEvents(parsedHTML, component);

    return parsedHTML;
  }

  /*
    @params: string html 
    @return: HTML

    Passes string html through DOMParser and returns HTML
  */
  function parseTemplateToHTML(template){

    const parser = new DOMParser();
    const doc = parser.parseFromString(template, "text/html");
    const renderedDoc = doc.querySelector('body').firstChild;

    return renderedDoc;
  }

  /*
    @params: HTML 
    @return: string html

    Passes HTML through XMLSerializer and returns string html
  */
  function parseDomToString(template) {
    console.log('temp', template);
    const serializer = new XMLSerializer();
    
    return serializer.serializeToString(template);
  }

  /*
    @params: Template<string>, array<string> 
    @return: Template<string>

    Passes components into template string
  */
  function parseComponents(parent, components) {
    let templateFinal = parent.template;
    let templates = [];

    let htmlTemplate = parseTemplateUnicorn(parent.template, parent);
    
    components.forEach(function(component){
      if(document.createElement(component).constructor !== HTMLElement){
        document.registerElement(component);
      }
      
      let componentRoot = htmlTemplate.querySelector(component);
      
      if(componentRoot){
        handleProps(componentRoot, component);

        const componentBase = registeredComponents[component];
        const replacementHtml = parseTemplateUnicorn(componentBase.template, componentBase);

        componentRoot.parentElement.replaceChild(replacementHtml, componentRoot);
      }
    });

    return htmlTemplate;
  }

  /*
    @params: Template<string>, object(any) 
    @return: string

    Inserts info from data into {{}} sections of the template
  */
  function templateEngine(template, data){
    let match;
    let newTemplate = template;

    while(match = templateRegEx.exec(template)) {

      newTemplate = newTemplate.replace(match[0], ObjectByString(data, match[1]));
    }

    return newTemplate;
  }

  /*
    @params: object(any), string any 
    @return: string 

    Gets value of deeply nested props in Object ex. 'data.props.something' -> data[props][something]
  */
  function ObjectByString (obj, str) {

    str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    str = str.replace(/^\./, '');           // strip a leading dot
    var arrayStr = str.split('.');

    for (var i = 0; i < arrayStr.length; ++i) {
        var key = arrayStr[i];
        if (key in obj) {
            obj = obj[key];
        } else {
            return;
        }
    }
    return obj;
  }

  /*
    @params: HTML, object(any) 
    @return: void

    Attaches event listeners to html nodes from component methods
    using custom unicorn attributes
    TODO: Need to handle more events not just click events
  */
  function registerEvents(html, component){
    const clicks = html.querySelectorAll('[u-click]');
    
    if(clicks.length <= 0){
      return;
    }

    clicks.forEach((click)=>{
      const methodName = click.getAttribute('u-click');
      //click.addEventListener('click', component.methods[methodName]);
      if(component.methods[methodName]){
        click.onclick = component.methods[methodName].bind(component);
      }
    });
  }

  /*
    @params: node, string name
    @return: void

    Passes HTML through XMLSerializer and returns string html
  */
  function handleProps(node, componentName){
    const component = registeredComponents[componentName];
    component.data.props = {};

    if(node.hasAttributes()){
      const attributes = node.attributes;
      for(let i = 0; i < attributes.length; i++){
        component.data.props[attributes[i].name] = attributes[i].value;
      }
      
    }
    
  }

  // Publically available functions and properties TODO: Remove registeredComponents for prod
  return {
    registerComponent: registerComponent,
    registerRootNode: registerRootNode,
    registeredComponents: registeredComponents
  };
}());

export default unicorn;