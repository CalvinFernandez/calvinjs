var qCompile = {

  qRegex: /(?:\[\[)(.*)(?:\]\])/, 

  toDOM: function(html) {
    //
    //  Converts html STRING into html DOM element
    //  Strings with mutliple children ie <p></p><p></p>
    //  will be returned with a wrapping div
    //
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    if (wrapper.childNodes.length > 1) {
      //  More than one child return whole wrapper
      return wrapper;  
    }  
    //  Only one child, okay to return first child  
    return wrapper.firstChild;
  }, 

  isQObject: function(node) {
    if (node && node.nodeValue) {
      var match = qCompile.qRegex.exec(node.nodeValue)
      if (match) { 
        return match[1];
      }
    }
    return false;
  },     
  
  qBindElement: function(node) {
    node.setAttribute('q-binding', true);    
  },
  
  compileQNodes: function(node, nodeObjects) {

    // 
    //  Recursively looks through 
    //  nodes of the DOM for #text objects
    //  if these are qObjects it tags the parent
    //
    
    if (!node) {
      // node is null return
      return;
    } 

    if (node.nodeName === '#text') {
      //
      //  Text node, test if it's a qObject
      //
      var match;

      if (match = qCompile.isQObject(node)) {
        if (!nodeObjects.bindings) {
          nodeObjects.bindings = {};
        }

        nodeObjects.bindings[match] = node;     
      }   
    }

    var attr;

    if ( node.getAttribute !== undefined ) {
      if (attr = node.getAttribute('qmodel')) {
        if (!nodeObjects.models) {
          nodeObjects.models = {};
        }
        nodeObjects.models[attr] = node; 
      }
    }

    var children = node.childNodes; 
    var len = children.length;
    for (var i = 0; i < len; i ++) {
      qCompile.compileQNodes(children[i], nodeObjects); 
    }
  }, 

  compile: function(html) {
    //
    // Compiler returns node object with model as key and 
    // node as value 
    // 
    
    var nodeObjects = {}; 

    qCompile.compileQNodes(html, nodeObjects);

    return nodeObjects;
  }
}
