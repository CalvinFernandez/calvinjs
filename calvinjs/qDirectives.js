//
//  Use this to register new qDirectives   
//  Directives must contain a unique name   
//  and a link function. 
//  
//  ---------- Directive Properties ---------
//
//  link: 
//    The link function is used by
//  the linker to connect objects in 
//  the template to objects in the DOM.
//  If you specify <p>[[foo]]</p> in the
//  DOM, and have the variable foo = 'bar'
//  in your template object, you need
//  to tell calvin how to connect the DOM
//  to the model. You can use the link function to
//  register dom event listeners, for example.
//  Additionally, you should use the link function
//  register a qWatch. Registering a model  
//  name with the templates qWatch allows you
//  to update the DOM when changes to the model
//  occur. 
//
//  test:
//    The test function is used by the compiler to 
//  determine if a given node is an instance of the 
//  directive. The default behavior is to search
//  for an attribute matching the directive name
//  but you can specify anything you want.
//
//  compile:
//    The compile function is used by the compiler
//  to turn a DOM element into an object which will
//  later be used by the linker to connect the DOM 
//  to the template. The default behavior is to 
//  simply return { 'node': node }, but the user is
//  allowed to specify anything they want. 
// 
//  after: 
//    The compiler uses the after function to determine
//  what to do after it has processed a node. The 
//  default behavior is to simply return the children
//  of a node. NOTE: If you do decide to define an 
//  after method on your directive and you do NOT return
//  the child nodes the compiler will assume that you 
//  do not wish to analyze the children and will skip 
//  them. 
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
