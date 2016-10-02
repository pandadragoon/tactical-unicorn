import unicorn from './unicorn';
import tacocat from './tacocat';
import happyTree from './happyTree';

let component = {
  template: `
    <div>
      <h3 u-click='monsterMash'>{{title}}</h3>
      <taco-cat mouse='mickey' topping='hot sauce'></taco-cat>
      <happy-tree></happy-tree>
    </div>
  `,
  name: 'card',
  data: {
    title: 'Gachigasm'
  },
  components: [
    'happy-tree',
    'taco-cat'
  ],
  methods: {
    monsterMash: function(){
      alert('Rawr!!!!!');
    }
  }
}

// let component = {
//   el: `.card`,
//   name: 'card',
//   data: {
//     title: 'Gachigasm'
//   },
//   components: [
//     'happy-tree',
//     'taco-cat'
//   ],
//   methods: {
//     monsterMash: function(){
//       alert('Rawr!!!!!');
//     }
//   }
// }

window.unicorn = unicorn;
unicorn.registerComponent([happyTree, tacocat]);
unicorn.registerRootNode('.app', component);

