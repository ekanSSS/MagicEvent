
# MagicEvent

MagicEvent is one easy and fast event handler in vanillaJS, it natively handle dynamically created Element ! Be the magician !

## How it work

It is easy, just call MagicEvent.js in your page then start the fun

```html
<script type="text/javascript" src="pathtoassets/MagicEvent.js"></script>
<script type="text/javascript">
  //here start the fun
<script>
```

### What can we do ?

#### Listen to an event
To register an event listener just use on method
```javascript
  //place an event listener for click on a tag
  MagicEvent.on("click", "a", myLinkClickFunc);
```

#### Multiple event at once
It handle mutiple event binding in one go
```javascript
  //place an event listener for click, hover and touch on a tag
  MagicEvent.on("click hover touch", "a", myLinkClickFunc);
```
  
#### CSS Selector
You can select your elements directly by CSS Selector
```javascript
  //place an event listener for click on all element with class .clickme, event if they were created dynamically
  MagicEvent.on("click", ".clickme", myClickFunc);
```

#### Chainning
All method return MagicEvent object to chain all your call
```javascript
  //you can chain all your call
  MagicEvent.on("click", "a", myLinkClickFunc)
    .on("click", ".clickme", myClickFunc);
  ```

#### Delegate
Delegate is automatic for all elements, so it's easy to make it !(not available for scroll event)
```javascript
  //register event listener with delegate
  MagicEvent.on("click", "a", myLinkClickFunc)
  ```

#### currentElement
Due to delegate, event.currentTarget is always document, but you can use event.delegateTarget (except for scroll)
```javascript
  function(event){
    //get <a> element that was click 
    const el = event.delegateTarget;
    //magic here
  }
  
  MagicEvent.on("click", "a", myLinkClickFunc)
  ```

#### Execute only once
If you want a listener to be executed only once, use one method 
```javascript
  //place an event listener that will execute only once per HTML element
  MagicEvent.one("click", "a", myOnceLinkClickFunc);
``` 

#### Remove listener
You can remove an event listener with off method
```javascript
  //remove existing listener
  MagicEvent.on("click", "a", myLinkClickFunc)
    .off("click", "a", myLinkClickFunc);
``` 

#### Emit an event
Do you want to emit an event on precise element just use emit method
```javascript
  // emit an event with bubbling on (event must be in listen by MagicEvent)
  // emit click on all 'a' tag
  MagicEvent.emit("click", a);
  // emit event with custom data
  MagicEvent.emit("click", a, {simulatedClick: true})
``` 
  
#### Custom events
Event Handler handle custom event like it's nothing, just use it on normal way
```javascript
  // place event listenner on custom event
  MagicEvent.on("supercustom", "a", funcForSuperCustom);
``` 
