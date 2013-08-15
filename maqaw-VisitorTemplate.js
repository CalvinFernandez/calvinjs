var VisitorTemplate = new qTemplate();

VisitorTemplate.template = 
  [ "<div class='maqaw-default-client-header'>",
      "<div class='maqaw-chat-header-text'>",
        "Send us an email!",
      "</div>",  
    "</div>",
    "<div id='maqaw-no-rep-window' class='maqaw-client-chat-window'>",
      "<div class='maqaw-chat-display'>", 
        "<ul style='color:black;'>",
          "<li qrepeat='cat in cats'>",
            "[[cat.name]]",  
          "</li>",
        "</ul>",
        "<input qmodel='chat.visitorSpeak'>",
        "<p style='color:black;'> [[chat.repSpeak]] </p>",
        "<p style='color:black;'> [[chat.visitorSpeak]] </p>",
      "</div>",
      "<div id='maqaw-chat-footer'>",
        "<div id='maqaw-login-button'>Login</div>",
        "<div  id='maqaw-link'>",
          "POWERED BY <button qclick='send'>MAQAW</button>",
        "</div>",
      "</div>",
    "</div>"];

VisitorTemplate.chat = { visitorSpeak: 'hello', repSpeak: 'howareyou' };
VisitorTemplate.cats = [{name: 'meow1'}, {name: 'meow2'}, {name: 'meow3'}];

VisitorTemplate.send = function() {
  console.log(this.chat);
};
