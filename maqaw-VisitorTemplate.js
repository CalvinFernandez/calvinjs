function VisitorTemplate() {

  MaqawTemplate.call(this);

  this.template = ["<div class='maqaw-default-client-header'>",
                "<div class='maqaw-chat-header-text'>",
                "Send us an email!",
                "</div>",  
             "</div>",
             "<div id='maqaw-no-rep-window' class='maqaw-client-chat-window'>",
               "<div class='maqaw-chat-display'>", 
               "<input qmodel='chat'>",
                "<p style='color:black;'> [[chat]] </p>",
                "</div>",
               "<div id='maqaw-chat-footer'>",
                 "<div id='maqaw-login-button'>Login</div>",
                 "<div id='maqaw-link'>",
                    "POWERED BY <a href='http://maqaw.com'>MAQAW</a>",
                 "</div>",
               "</div>",
             "</div>"];
} 

VisitorTemplate.prototype = new MaqawTemplate();
