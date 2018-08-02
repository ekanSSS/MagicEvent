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
    * @param {string} event event name
    **/
    const addEvent = function(event, addListener){
        //initiate event for emit
        const evt = new Event(event, {cancelable: true, bubbles: true});
        
        events[event] = [];
        customs[event] = evt;
        
        //register event to document
        if(addListener)
            document.addEventListener(event, handler);
    }

    /**
    * add scroll listener
    *
    * @param {mixed} selector css selector or html element
    * @param {function} func css selector
    **/
    const addScroll = function(selector, func){
       let elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.addEventListener('scroll', func);
        })

    }

    /**
    * get number of ancestor between designated ancestor and element
    *
    * @param {Node} el the element to begin with
    * @param {Node} parent parent to reach
    * @return {int} node of element beetween el and parent
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
                    // define delegate target for better use
                    Object.defineProperty(ev, 'delegateTarget', {writable: true, value: index[i].el[0]});
                    index[i].func.bind(index[i].el[0])(ev);
                    if(index[i].unique){
                        if(!index[i].el[0].uniqueId)
                            index[i].el[0].uniqueId = idCount++;
                        
                        index[i].unique[index[i].el[0].uniqueId] = true;
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
    * @param {string} event : event name
    * @param {mixed} selector css selector or html element
    * @param {function} function to call on event
    * @param {bool} unique does we need to execute function only once per element ?
    */
    const add = function(event, selector, func, unique = false){
        if(
            event
            && func
            && selector
            && typeof event === 'string'
            && (
                typeof selector === 'string' 
                || typeof selector === 'object' 
            )
            && typeof func === 'function'
        ){

            event.split(' ').forEach(function(event){
                const custom = {selector:selector,func:func};
                if(typeof selector === 'object') {
                    if(!selector.id) {
                        selector.id = `event-${idCount++}`;
                    }
                    custom.selector = `#${selector.id}`;
                }
                let setListener = true
                if(event === "scroll"){
                    addScroll(custom.selector, custom.func)
                    setListener = false;
                }
                if(!customs[event])
                    addEvent(event, setListener);

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
    * @param {function} a first function to compare
    * @param {function} b second function to compare
    * @return {bool} does function are the same
    **/
    const matchFunction = function(a, b){
        a = ''+a;
        b = ''+b;
        return a === b
    }

    /**
    * trigger designated element
    *
    * @param {string} event : event name
    * @param {mixed} element css selector or html element
    * @param {mixed} data : data to send with element
    * @return {Object} eventHandler for chaining
    **/
    self.emit = function(event, element, data){
        if(event && element) {
            let customEvent;
            if(customs[event] && !data)
                customEvent = customs[event]
            else customEvent =  new CustomEvent(event,{cancelable: true, bubbles: true, detail: data});

            if(typeof element === "string") {
                const elements = document.querySelectorAll(element);
                elements.forEach(el => {
                    el.dispatchEvent(customEvent);
                });
            } else element.dispatchEvent(customEvent);
        }
        return this;
    }

    /**
    * register handler see add
    *
    * @param {string} events : event name
    * @param {mixed} selector css selector or html element
    * @param {function} func function to call on event
    * @return {Object} eventHandler for chaining
    **/
    self.on = function(events, selector, func){
        add(events, selector, func);
        return this
    }

    /**
    * register handler which execute only once per element see add
    *
    * @param {string} events : event name
    * @param {mixed} selector css selector or html element
    * @param {function} func function to call on event
    * @return {Object} eventHandler for chaining
    **/
    self.one = function(events, selector, func){
        add(events, selector, func, true);
        return this;
    }

    /**
    * remove an entry from current listener function
    *
    * @param {string} event : events name
    * @param {mixed} selector css selector or html element
    * @param {function} func function to call on event
    * @return {Object} eventHandler for chaining
    **/
    self.off = function(event, selector, func){
        if(typeof event === "string") {
            event.split(' ').forEach(function(event){
                if(events[event]){
                    const newIndex = events[event].filter(function(val){
                        return !(val.selector === selector || val.selector === `#${selector.id}`) || !matchFunction(func, val.func); 
                    });

                    events[event] = newIndex;
                }
            })
        }
        return this;
    }

    /**
    * remove all event listener registered
    *
    * @return {Object} eventHandler for chaining
    **/
    self.offAll = function(){
        for (event in events)
            events[event] = [];
        return this;
    }

    init();
    return self;
})();