function ChatWindow() {
  this.el = document.getElementById('testing');

  this.template = new VisitorTemplate(); 
  this.template.chat = "hello";

  var doc = this.template.render(); 

  this.el.appendChild(doc);  
}
