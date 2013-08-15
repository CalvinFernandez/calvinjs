function MaqawWindow() {

  var el = document.getElementById('testing');

  this.maqawWindowTemplate = ContainerTemplate; 
  this.maqawWindowTemplate.welcome = 'Welcome';

  var html = this.maqawWindowTemplate.render(); 

  el.appendChild(html);  

  this.ChatDisplay();
}

MaqawWindow.prototype.ChatDisplay = function() {
  var el = document.getElementById('body'); 

  ChatTemplate.message = "Questions or feedback? We're online and ready to help you!";      
  ChatTemplate.newChat = '';
  ChatTemplate.chats = ['hello', 'anyone home?'];

  ChatTemplate.sendChat = function() { 
    ChatTemplate.chats.push(ChatTemplate.newChat);  
    ChatTemplate.qApply('chats'); 
  }

  var html = ChatTemplate.render();

  el.appendChild(html);

}
