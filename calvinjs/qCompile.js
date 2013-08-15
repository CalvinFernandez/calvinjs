var qCompile = {

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

  testNode: function(node, directiveName) {
    return node.hasAttribute && node.hasAttribute(directiveName); 
  },

  compileNode: function(node) {
    return { 'node': node };    
  },

  processNode: function(node, compiledDOM) {
    //         
    //  Processes an individual node. Attempts to match
    //  the node to registered directives. If the node 
    //  is successfully matched to one of the registered
    //  directives, processNode attempts to call a predefined
    //  compile function, if it exists. If compile function
    //  hasn't been defined, qCompile uses it's default
    //  compile function. qCompile then stores the compiled
    //  node object in compiledDOM. After, processNode
    //  attempts to call a matched directive's after function
    //  if it exists. If not, process node simply returns 
    //  the node's child nodes. 
    //  
    var returnObject = node.childNodes 

    qDirectives.directives.forEach(function(directive) {

      var nodeIsDirective = directive.test ? directive.test(node) : qCompile.testNode(node, directive.name); 

      if (nodeIsDirective) {
        var compiledObject = directive.compile ? directive.compile(node) : qCompile.compileNode(node);
        compiledDOM.push({ 'directive': directive, 'compiledObject': compiledObject });          
        returnObject = directive.after ? directive.after(node, compiledDOM) : node.childNodes;
        return returnObject;
      }
    });
    return returnObject;
  },

  compileNodes: function(node, compiledDOM) {

    // 
    //  Recursively looks through nodes of the DOM for directives
    //  It returns a compiled set of directives
    //
    
    if (!node) {
      // node is null return
      return;
    } 

    var children = qCompile.processNode(node, compiledDOM);

    if (children) { 
      var len = children.length;
      for (var i = 0; i < len; i ++) {
        qCompile.compileNodes(children[i], compiledDOM); 
      }
    }
  }, 

  compile: function(html) {
    //
    // Compiler returns node object with model as key and 
    // node as value see compileRecurse for more information
    // 
    
    var compiledDOM = []; 

    qCompile.compileNodes(html, compiledDOM);

    return compiledDOM;
  }
}
