//
//  Use this to register new qDirectives   
//
var qDirectives = {

  directives: [
    //
    // Default directives
    //
    { 
      name: 'qmodel',
      link: function(directiveObject, template) {
        var variableName = directiveObject.node.getAttribute('qmodel'); 
        directiveObject.node.addEventListener('keyup', function(event) {
          template.update(variableName, event.target.value);
        });
      }
    },

    {
      name: 'qclick',
      link: function(directiveObject, template) {
        var fnName = directiveObject.node.getAttribute('qclick');
        directiveObject.node.addEventListener('mouseup', function(event) {
          template.evaluate(fnName)(event);      
        });   
      }    
    }, 

    {
      name: 'qrepeat',

      compile: function(node) {
        var children = node.childNodes;  
        var dummyDiv = document.createElement('div'); 

        for (var i = 0; i < children.length; i ++) {
          //  Shallow copy all nodes to dummyDiv
          //  Must be a shallow copy. Nothing else will work
          dummyDiv.appendChild(children[i]);
        }

        var compiledInnerDOM = qCompile.compile(dummyDiv);         

        children = dummyDiv.childNodes; 
        for (var i = 0; i < children.length; i ++) {
          //
          //  Recopy all children back to original  
          //  node
          //
          node.appendChild(children[i]);  
        }

        return {'node': node, 'innerElements': compiledInnerDOM};  
      },  

      after: function() {
        //
        //  Do not compile inner elements
        //  custom qrepeat compiler will 
        //  deal with those
        //
        return;
      },

      link: function(compiledObject, template) {
        var _this = this;
        var referenceNode = compiledObject.node;    

        var repeaterAttr = referenceNode.getAttribute('qrepeat'); 
        var arrayName = /(?: in )([^$]*)/.exec(repeaterAttr)[1];   
        var variableName = /([^\s]*)/.exec(repeaterAttr)[0];
        
        this.elems = [];    

        template.qWatch(arrayName, function(arr) {

          while(_this.elems.length) {
            //  Clear old array and remove
            //  from DOM
            var node = _this.elems.pop(); 
            node.parentNode.removeChild(node); 
          } 

          for (var i = 0; i < arr.length; i ++) {
            var childTemplate = template.clone();
            var clonedNode = referenceNode.cloneNode(true);
            var clonedCompiledObject = _this.compile(clonedNode); 

            childTemplate[variableName] = arr[i];  
            childTemplate.compiledDOM = clonedCompiledObject.innerElements;  
            childTemplate.dom = clonedNode; 
            childTemplate.linker = new qLink(childTemplate.compiledDOM, childTemplate); 
            childTemplate.linker.link();
            referenceNode.parentNode.insertBefore(clonedNode, referenceNode);

            _this.elems.push(clonedNode);
          }

          referenceNode.style.display = 'none';
        });

        template.qApply.call(template, arrayName);
      } 
    },

    {
      name: 'qinterpolate',
      test: function(node) {
       var value = node.nodeValue;
        if (value) {
          var match = /(?:\[\[)(.*)(?:\]\])/.exec(value); 
          if (match) {
            return true;
          }
        } 
        return false;
      },

      link: function(compiledObject, template) {
        var _this = this;
        this.compiledObject = compiledObject;

        var nodeValue = compiledObject.node.nodeValue;
        var variableName = /(?:\[\[)(.*)(?:\]\])/.exec(nodeValue)[1];          
        
        template.qWatch(variableName, function(newValue) {
          _this.compiledObject.node.nodeValue = newValue;
        });
        template.qApply(variableName);
      }
    } 
  ],

  newDirective: function(object) {
    this.directives.push(object);
  }
};
