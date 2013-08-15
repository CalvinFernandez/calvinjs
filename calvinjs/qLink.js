//
//  Links view with the models available
//  to the user in whatever template they defined
//  Adds keyup event listeners on qmodel objects     
//  and includes a digest function that loops through
//  any changed objects and updates the view
//

function qLink(compiledDOM, template) {
  this.template = template;
  this.compiledDOM = compiledDOM;
}

qLink.prototype.link = function() {
  //
  //  This links models and functions   
  //  to directives. All nodes with a certain
  //  directive label will be called when whatever 
  //  linking function they specify occurs. When
  //  This happens, the model value is updated
  //  and digest is automatically called
  //
  
  var _this = this;

  this.compiledDOM.forEach(function(compiledDOMObject) {
    compiledDOMObject.directive.link(compiledDOMObject.compiledObject, _this.template);    
  });  
}
