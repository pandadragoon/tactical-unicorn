export default {
  template: `
    <div>
      <h2 class='testme' u-click='changeData'>Tacocat spelled backwards is tacocaT</h2>
      <h3>{{props.mouse}} {{merp}}</h3>
      <h4>{{props.topping}}</h4>
    </div>
  `,
  name: 'taco-cat',
  data: {
    merp: 'Howdy'
  },
  methods: {
    changeData: function(event) {
      console.log(event);
      this.update({merp: 'Hiya'});
     
    }
  }
}