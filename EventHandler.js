/**
* Event handler functionality to simply create and trigger event
* @author Jr BERETTA <jeanrobert.beretta@gmail.com>
**/
var EventHandler = EventHandler || (function(){
    const self = {};
    const events = {};        // list of listener
    const customs = {};       // list of event
    let matchesFunc = '';   // name of node.matches function (compatibilty for old browser)
    let idCount = 0;        // define id for .one event

    /**
    * if event is not already listen, add listener on dom and create a custom event to trigger it
    *
    * @param string event event name
    **/
    const addEvent = function(event){
        //initiate event for emit
        const evt = document.createEvent('Event');
        evt.initEvent(event, true, true);
        
        events[event] = [];
        customs[event] = evt;
        
        //register event to document
        document.addEventListener(event, handler);
    }

    /**
    * get number of ancestor between designated ancestor and element
    *
    * @param Node el the element to begin with
    * @param Node parent parent to reach
    * @return int node of element beetween el and parent
    **/
    const getParentPos = function(el, parent){
        let i = 0;
        while(el != parent){
            el = el.parentNode;
            i++;
        }
        return i;
    }

    /**
    * basic event handler function
    */
    const handler = function(ev){
        if(events[ev.type].length != 0){
            event = events[ev.type];

            // get all function to execute
            let index = event.filter(function(val){
                let el = ev.srcElement[matchesFunc](val.selector) || ev.srcElement.closest(val.selector);
                if(el){
                    if(el === true)
                        el = ev.srcElement;

                    //does function is register by one and have already executed on this element .
                    if(val.unique && val.unique[el.uniqueId])
                        return false;

                    val.el = [el,getParentPos(ev.srcElement,el)];
                    return true;
                } else return false;
            })
            //sort it by bubbling order
            .sort(function(a,b){return a.el[1] - b.el[1]});

            for(let i = 0; i < index.length; i++){
                //event is cancelby handler ?
                if(!ev.cancelBubble){
                    index[i].func.bind(index[i].el[0])(ev);
                    if(index[i].unique){
                        if(!index[i].el[0].uniqueId)
                            index[i].el[0].uniqueId = idCount;
                        
                        index[i].unique[idCount++] = true;
                    }
                    index[i].el = null;
                }else break;
            }
        }
    }

    /**
    * init function of event handler
    **/
    const init = function(){
        if(document.body.matches)
            matchesFunc = 'matches';
        else if(document.body.webkitMatchesSelector)
            matchesFunc = 'webkitMatchesSelector';
        else if(document.body.oMatchesSelector)
            matchesFunc = 'oMatchesSelector';
        else if(document.body.mozMatchesSelector)
            matchesFunc = 'mozMatchesSelector';
        else if(document.body.msMatchesSelector)
            matchesFunc = 'msMatchesSelector';
    }

    /**
    * add a function to target selector and event
    *
    * @param string event : event name
    * @param string selector : selector to match on handler
    * @param callable func function to call on event
    * @param bool unique does we need to execute function only once per element ?
    */
    const add = function(event, selector, func, unique = false){
        if(
            event && 
            func && 
            selector && 
            typeof event === 'string' && 
            typeof selector === 'string' && 
            typeof func === 'function'
        ){

            event.split(' ').forEach(function(event){
                if(!customs[event])
                    addEvent(event);

                const custom = {selector:selector,func:func};

                if(unique)
                    custom.unique = {};
                
                events[event].push(custom);
            })
        }
        return this;
    }

    /**
    * compare two function to see if they are exactly the same
    *
    * @param callable a first function to compare
    * @param callable b second function to compare
    * @return bool does function are the same
    **/
    const matchFunction = function(a, b){
        a = ''+a;
        b = ''+b;
        return a === b
    }

    /**
    * trigger designated element
    *
    * @param string event : event name
    * @param mixed data : data to send with element
    * @return Object eventHandler for chaining
    **/
    self.emit = function(event, element, data){
        if(customs[event])
            element.dispatchEvent(customs[event], data);
        else console.log('event : ' + event + ' doesn\'t exist');
        return this;
    }

    /**
    * register handler see add
    *
    * @param string event : event name
    * @param string selector : selector to match on handler
    * @param callable func function to call on event
    * @return Object eventHandler for chaining
    **/
    self.on = function(event, selector, func){
        add(event, selector, func);
        return this
    }

    /**
    * register handler which execute only once per element see add
    *
    * @param string event : event name
    * @param string selector : selector to match on handler
    * @param callable func function to call on event
    * @return Object eventHandler for chaining
    **/
    self.one = function( event, selector, func){
        add(event, selector, func, true);
        return this;
    }

    /**
    * remove an entry from current listener function
    *
    * @param string event : event name
    * @param string selector : selector to match on handler
    * @param callable func function to call on event
    * @return Object eventHandler for chaining
    **/
    self.off = function(event, selector, func){
        event.split(' ').forEach(function(event){
            const newIndex = events[event].filter(function(val){
                return val.selector !== selector || !matchFunction(func, val.func); 
            });

            events[event] = newIndex;
        })
        return this;
    }

    init();
    return self;
})();
