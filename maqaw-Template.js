function MaqawTemplate() {
  qLink.call(this);   

  this.dom = '';
  this.qData = {};
} 

MaqawTemplate.prototype = new qLink();

MaqawTemplate.prototype.render = function() {
 
  var templateStr = this.template.join('\n'); 
  this.dom = qCompile.toDOM(templateStr); 
  this.qData = qCompile.compile(this.dom); 

  this.link();  
  this.digest();

  return this.dom;
}
