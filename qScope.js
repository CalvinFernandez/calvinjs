function qScope() {

  this.qData = qCompile.compile(
      qCompile.toDOM(
        this.template));

  this.qLink.call(this); 
  this.link();
  
}

qScope.prototype = new qLink();
