**Alpha Docs**

<p>Tactical Unicorn is a javascript view library.  It is mostly a project to push my programming abilities.  However, if you notice anything feel free to open an issue or pull request.</p>


<p>Do know that things are in early alpha so there will be breaking changes and the structure of the repo will change a lot as I get things set up more professionally</p>

#### Things To Know

* Only has click events currently
* names of components must be snake case ie mr-button
* components must have a root tag so `<div><span>Hi</span></div>` works but not `<div></div><span></span>`
* there is no life cycle support just yet


#Basics

## Getting Started

<p>You need to import all components you are using besides your rootcomponent (including component children) then you can pass in an array of those components.</p>


```javascript

unicorn.registerComponent([my-list, my-listitem, my-button]);
unicorn.registerRootComponent('.app', rootComponent);
```

### Creating Components

Creating Self Contained Components.

```javascript

export default {
  name: 'mr-button',
  data: {
    text: 'Mr. Button',
  },
  methods: {
    handleClick: function(){
      this.update({text: 'Clicked'});
    }
  },
  components: ['mr-icon'],
  template: `
    <button u-click='handleClick' style="'background-color'={{props.color}}">
      <mr-icon icon="square"></mr-icon> {{text}}
    </button>
  `
};
```

Creating Components In Page

```javascript

// mr-button.js

export default {
 name: 'mr-button',
 data: {
   text: 'Mr. Button',
 },
 methods: {
  handleClick: function(){
    this.update({text: 'Clicked'});
  }
 },
 components: ['mr-icon'],
 el: '.mr-button'
}
```

```html
<!-- index.html -->

<div class='app'></div>
<button u-click='handleClick' style="'background-color'={{props.color}}">
  <mr-icon icon="square"></mr-icon> {{text}}
</button>
```
