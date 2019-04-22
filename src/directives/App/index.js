import template from './app.html';

class App {
  constructor() {
    this.template = template;
    this.restrict = 'E';
    this.scope = {}
  }
  controller($scope) {}
}

export default App;
