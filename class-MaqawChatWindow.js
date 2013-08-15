function ChatWindow() {
  this.el = document.getElementById('testing');

  this.template = VisitorTemplate; 

  var doc = this.template.render(); 

  this.el.appendChild(doc);  
}
