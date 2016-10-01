var templateRegEx = /{{(([^{}]+)?)}}/g;

let template = `
    <div>
      <h2>Tacocat spelled backwards is tacocaT {{merp}}</h2>
      <h3>{{props.mouse}} {{merp}}</h3>
      <h4>{{props.topping}}</h4>
    </div>
  `

let data = {
  merp: 'Howdy',
  props: {
    mouse: 'Mickey',
    topping: 'Hot Sauce'
  }
}

console.log(templateEngine(template, data));


function templateEngine(template, data){
    let match;
    let newTemplate = template;
    
    while(match = templateRegEx.exec(template)) {
      console.log('match', match[0]);
      console.log('match1', match[1]);
      console.log('match2', match[2]);
      console.log('data', data.merp);
      console.log('obj by string', ObjectByString(data, match[1]));
      
      newTemplate = newTemplate.replace(match[0], ObjectByString(data, match[1]));
      console.log(newTemplate);
      console.log('===========================================================')
    }

    return newTemplate;
  }

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