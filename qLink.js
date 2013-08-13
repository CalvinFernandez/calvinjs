//
//  Links view with the models available
//  to the user in whatever template they defined
//  Adds keyup event listeners on qmodel objects     
//  and includes a digest function that loops through
//  any changed objects and updates the view
//

function qLink() {}

qLink.prototype.link = function() {
  var keys = Object.keys(this.qData.models);    
  var _this = this;

  keys.forEach(function(key) {
    _this.qData.models[key].addEventListener('keyup', function(event) {
      _this[key] = event.target.value;     
      _this.digest();
    }); 
  });  
}

qLink.prototype.digest = function() {
  var keys = Object.keys(this.qData.bindings);      
  var _this = this;

  keys.forEach(function(key) {
    if (_this[key] && 
      ( _this[key] !== 
        _this.qData.bindings[key].nodeValue ) ) {

      _this.qData.bindings[key].nodeValue = _this[key]; 
    }
  }); 
}
