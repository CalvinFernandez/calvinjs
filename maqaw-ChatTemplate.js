var ChatTemplate = new qTemplate();

ChatTemplate.template = 
  [ "<div class='maqaw-chat-display'>", 
      "[[message]]",
      "<p qrepeat='chat in chats' class='maqaw-chat-paragraph'>",
        "[[chat]]",
      "</p>",
      "<textarea qenter ='sendChat' qmodel='newChat' class='maqaw-chat-entry'>",
      "</textarea>",
    "</div>"
  ]
          
