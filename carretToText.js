    // go over all nodes until reaching the right number of characters
    function getCaretNode(startPos, endPos) {

      function getCaretTextNode(caretPosInText) {

        if (caretPosInText === cd.textContent.length) {
          
          function getLastNode(parentNode) {
            
            // if parent has child nodes
            if (parentNode.childNodes.length > 0) {
              
              const lastNode = parentNode.childNodes[parentNode.childNodes.length-1];

              // if found a text node
              if (lastNode.nodeType === 3) {

                // return
                return lastNode;

              } else { // continue recursive call

                return getLastNode(lastNode);

              }
              
            } else {
              
              // return
              return parentNode;
              
            }
            
          }
          
          // get end node
          const endNode = getLastNode(cd);
          const endOffset = (endNode.nodeValue || endNode.textContent).length;
          
          return [endNode, endOffset];
          
        }
        
        
        let overallLength = 0,
            lastNode;

        function getTextNodes(node) {

          // if not reached the target text
          if (overallLength <= caretPosInText) {

            // if node type is text
            if (node.nodeType == 3) {

              overallLength += node.nodeValue.length;

              lastNode = node;

            } else { // if it's an empty node, this means there's more nodes underneath

              // go over his brother leaves
              for (var i = 0, len = node.childNodes.length; i < len; ++i) {

                // call recursive call on node's children
                getTextNodes(node.childNodes[i]);

              }
            }
          }
        }

        // init recursive call
        getTextNodes(cd);

        // if text node exists
        if (lastNode && lastNode.nodeValue) {

          const lastNodeLength = lastNode.nodeValue.length;

          return [
            lastNode,
            (lastNodeLength - (overallLength - caretPosInText))
          ];

        } else if (caretPosInText !== cd.textContent.length) {

          // if caret is in the middle of text,
          // start looking for adjacent nodes
          if (caretPosInText > 0) {

            return getCaretTextNode(startPos-1);

          } else {

            // if caret is at start of text,
            // return first node
            
            if (cd.childNodes[1]) {
            
              return [cd.childNodes[1], 0];
              
            } else if (cd.childNodes[0] && cd.childNodes[0].ariaHidden !== 'true') {
              
              return [cd.childNodes[0], 0];
                 
            } else {
              
              return [cd, 0];
              
            }

          }

        }

      }

      // if start and end pos exist
      if (endPos && startPos !== endPos) {

        // get start and end nodes
        const [startNode, startOffset] = getCaretTextNode(startPos);
        const [endNode, endOffset] = getCaretTextNode(endPos);

        return {
          startNode: startNode,
          startOffset: startOffset,
          endNode: endNode,
          endOffset: endOffset
        };

      } else {

        // get start nodes
        const [startNode, startOffset] = getCaretTextNode(startPos);

        return {
          startNode: startNode,
          startOffset: startOffset,
          endNode: startNode,
          endOffset: startOffset
        };

      }

    }
