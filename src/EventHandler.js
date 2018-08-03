/**
* Event handler functionality to simply create and trigger event
* @author Jr BERETTA <jeanrobert.beretta@gmail.com>
* */
let EventHandler = window.EventHandler || (function () { //eslint-disable-line
  const self = {};
  const eventList = {}; // list of listener
  const customs = {}; // list of event
  let idCount = 0; // define id for .one event

  /**
    * get number of ancestor between designated ancestor and element
    *
    * @param {Node} el the element to begin with
    * @param {Node} parent parent to reach
    * @return {int} node of element beetween el and parent
    * */
  const getParentPos = function (el, parent) {
    let i = 0;
    let element = el;
    while (element !== parent) {
      element = element.parentNode;
      i++;
    }
    return i;
  };

  /**
    * basic event handler function
    */
  const handler = function (ev) {
    if (eventList[ev.type].length !== 0) {
      const event = eventList[ev.type];

      // get all function to execute
      const index = event.filter((val) => {
        let el = ev.target.matches(val.selector) || ev.target.closest(val.selector);
        if (el) {
          if (el === true) el = ev.target;

          // does function is register by one and have already executed on this element .
          if (val.unique && val.unique[el.uniqueId]) return false;

          val.el = [el, getParentPos(ev.target, el)]; //eslint-disable-line
          return true;
        } return false;
      })
      // sort it by bubbling order
        .sort((a, b) => a.el[1] - b.el[1]);

      for (let i = 0; i < index.length; i++) {
        // event is cancelby handler ?
        if (!ev.cancelBubble) {
          // define delegate target for better use
          Object.defineProperty(ev, 'delegateTarget', { writable: true, value: index[i].el[0] });
          index[i].func.bind(index[i].el[0])(ev);
          if (index[i].unique) {
            if (!index[i].el[0].uniqueId) index[i].el[0].uniqueId = idCount++;

            index[i].unique[index[i].el[0].uniqueId] = true;
          }
          index[i].el = null;
        } else break;
      }
    }
  };

  /**
    * if event is not already listen, add listener on dom and create a custom event to trigger it
    *
    * @param {string} event event name
    * */
  const addEvent = function (event, addListener) {
    // initiate event for emit
    const evt = new Event(event, { cancelable: true, bubbles: true });

    eventList[event] = [];
    customs[event] = evt;

    // register event to document
    if (addListener) document.addEventListener(event, handler);
  };

  /**
    * add scroll listener
    *
    * @param {mixed} selector css selector or html element
    * @param {function} func css selector
    * */
  const addScroll = function (selector, func) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      element.addEventListener('scroll', func);
    });
  };

  /**
    * init function of event handler
    * */
  const init = function () {
    if (Element && !Element.prototype.matches) {
      const proto = Element.prototype;
      proto.matches = proto.matchesSelector
                || proto.mozMatchesSelector
                || proto.msMatchesSelector
                || proto.oMatchesSelector
                || proto.webkitMatchesSelector;
    }
  };

  /**
    * add a function to target selector and event
    *
    * @param {string} event : event name
    * @param {mixed} selector css selector or html element
    * @param {function} function to call on event
    * @param {bool} unique does we need to execute function only once per element ?
    */
  const add = function (event, selector, func, unique = false) {
    if (
      event
            && func
            && selector
            && typeof event === 'string'
            && (
              typeof selector === 'string'
                || typeof selector === 'object'
            )
            && typeof func === 'function'
    ) {
      event.split(' ').forEach((ev) => {
        const custom = { selector, func };
        if (typeof selector === 'object') {
          if (!selector.id) {
            selector.setAttribute('id', `event-${idCount++}`);
          }
          custom.selector = `#${selector.id}`;
        }
        let setListener = true;
        if (ev === 'scroll') {
          addScroll(custom.selector, custom.func);
          setListener = false;
        }
        if (!customs[ev]) addEvent(ev, setListener);

        if (unique) custom.unique = {};
        eventList[ev].push(custom);
      });
    }
    return this;
  };

  /**
    * compare two function to see if they are exactly the same
    *
    * @param {function} a first function to compare
    * @param {function} b second function to compare
    * @return {bool} does function are the same
    * */
  const matchFunction = function (a, b) {
    const aFunc = `${a}`;
    const bFunc = `${b}`;
    return aFunc === bFunc;
  };

  /**
    * trigger designated element
    *
    * @param {string} event : event name
    * @param {mixed} element css selector or html element
    * @param {mixed} data : data to send with element
    * @return {Object} eventHandler for chaining
    * */
  self.emit = function (event, element, data) {
    if (event && element) {
      let customEvent;
      if (customs[event] && !data) customEvent = customs[event];
      else customEvent = new CustomEvent(event, { cancelable: true, bubbles: true, detail: data });

      if (typeof element === 'string') {
        const elements = document.querySelectorAll(element);
        elements.forEach((el) => {
          el.dispatchEvent(customEvent);
        });
      } else element.dispatchEvent(customEvent);
    }
    return this;
  };

  /**
    * register handler see add
    *
    * @param {string} events : event name
    * @param {mixed} selector css selector or html element
    * @param {function} func function to call on event
    * @return {Object} eventHandler for chaining
    * */
  self.on = function (events, selector, func) {
    add(events, selector, func);
    return this;
  };

  /**
    * register handler which execute only once per element see add
    *
    * @param {string} events : event name
    * @param {mixed} selector css selector or html element
    * @param {function} func function to call on event
    * @return {Object} eventHandler for chaining
    * */
  self.one = function (events, selector, func) {
    add(events, selector, func, true);
    return this;
  };

  /**
    * remove an entry from current listener function
    *
    * @param {string} events : events name
    * @param {mixed} selector css selector or html element
    * @param {function} func function to call on event
    * @return {Object} eventHandler for chaining
    * */
  self.off = function (events, selector, func) {
    if (typeof events === 'string') {
      events.split(' ').forEach((event) => {
        if (eventList[event]) {
          const newIndex = eventList[event].filter(val => !(val.selector === selector || val.selector === `#${selector.id}`) || !matchFunction(func, val.func));

          eventList[event] = newIndex;
        }
      });
    }
    return this;
  };

  /**
    * remove all event listener registered
    *
    * @return {Object} eventHandler for chaining
    * */
  self.offAll = function () {
    Object.keys(eventList).forEach((event) => {
      eventList[event] = [];
    });
    return this;
  };

  init();
  return self;
}());
