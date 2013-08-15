function qTemplate() {
  this.dom = '';
  this.compiledDOM = {};
  this.linker;
} 

qTemplate.prototype.value = function(string) {

  //
  //  Value takes a string such as 'person.name.firstName' 
  //  and returns the value of object if it exists
  //  in the template. If it doesn't exist, it will 
  //  return undefined;  
  //  
  
  var indirections = string.split('.');   
  var val = this[indirections[0]] 
  for (var i = 1; i < indirections.length; i ++) {
    val = val[indirections[i]]  
  }
  return val;
}

qTemplate.prototype.watched = {},

qTemplate.prototype.qWatch = function(name, fn) {
  this.watched[name] ? this.watched[name].push(fn) : this.watched[name] = [fn]
}

qTemplate.prototype.template = [];

qTemplate.prototype.render = function() {

  var templateStr = this.template.join('\n'); 
  this.dom = qCompile.toDOM(templateStr); 
  this.compiledDOM = qCompile.compile(this.dom); 

  this.linker = new qLink(this.compiledDOM, this);

  this.linker.link();  
  return this.dom;
}

qTemplate.prototype.qApply = function(name) {
  var value = this.value(name);
  var _this = this;   
  
  if (this.watched[name]) {
    //
    //  Some objects (like qmodels) 
    //  don't specify a watch because 
    //  there's no ui update
    //
    this.watched[name].forEach(function(fn) {
      fn.call(_this, value);  
    });  
  }
}

qTemplate.prototype.update = function(variableName, value) {
  var indirections = variableName.split('.');
  var len = indirections.length, variable = this, 
      i = 0;
  for (i; i < len - 1; i ++ ){
    variable = variable[indirections[i]];
  }
  variable[indirections[i]] = value; 

  this.qApply(variableName);
}

qTemplate.prototype.clone = function() {
  var temp = new qTemplate();
  temp.__proto__ = this;
  return temp;
}
