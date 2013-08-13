var ContainerTemplate = {
  template: ["<div class='maqaw-chat-container'>",
                "<div></div>",
                "<div style='display:block;'></div>",
             "</div>"],

  render: function(data) {
    return template.join('\n');  
  }
};
