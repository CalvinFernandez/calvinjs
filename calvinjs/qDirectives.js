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
      name: 'qenter',
      link: function(directiveObject, template) {
        var fnName = directiveObject.node.getAttribute('qenter');
        directiveObject.node.addEventListener('keyup', function(event) {
          if (event.keyCode === 13) {
            template.value(fnName)(event);     
          }
        });
      }
    },

    {
      name: 'qclick',
      link: function(directiveObject, template) {
        var fnName = directiveObject.node.getAttribute('qclick');
        directiveObject.node.addEventListener('mouseup', function(event) {
          template.value(fnName)(event);
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
            referenceNode.style.display = 'block';

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
      INTERP_REGEX: /(?:\[\[)(.*)(?:\]\])/,

      contains: function(str) {
        var match = this.INTERP_REGEX.exec(str);    
        if (match) {
          return true;
        } 
        return false;
      },

      test: function(node) {
        var value = node.nodeValue;
        var attrs = node.attributes;
        if (value) {
          if (this.contains(value)) {
            return true;
          }
        } else if (attrs) {
          for (var i = 0; i < attrs.length; i ++ ) {
            var attr = attrs[i];  
            if (this.contains(attr.value)) {
              return true;
            }
          }    
        } 
        return false;
      },
      
      compile: function(node) {
        if (node.nodeName === '#text') {
          return { 'node': node }; 
        } else {
          var attrs = node.attributes;  
          for (var i = 0; i < attrs.length; i ++) {
            var attr = attrs[i]; 
            if (this.contains(attr.value)) {
              return { 'node': node, 'attr': attr };
            }
          } 
        }
      },

      link: function(compiledObject, template) {
        var _this = this;
        this.compiledObject = compiledObject;
        var nodeValue = '';

        if (compiledObject.attr) {
          nodeValue = compiledObject.attr.value;    
        } else { 
          nodeValue = compiledObject.node.nodeValue;
        }

        var variableName = /(?:\[\[)(.*)(?:\]\])/.exec(nodeValue)[1];          

        this.oldValue = "[[" + variableName + "]]";  //  Old value will be used to update the id later on
        
        template.qWatch(variableName, function(newValue) {
          if (_this.compiledObject.attr) {
            //
            //  We can have multiple strings for an attribute 
            //  so we don't want to replace the entire attribute
            //  just the old string
            //
            _this.compiledObject.attr.value = 
              _this.compiledObject.attr.value.replace(_this.oldValue, newValue);  
            _this.oldValue = newValue;

          } else {
            _this.compiledObject.node.nodeValue = newValue;
          }
        });

        template.qApply(variableName);
      }
    } 
  ],

  newDirective: function(object) {
    this.directives.push(object);
  }
};
