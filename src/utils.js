const getWidth = () => window.innerWidth;

function once(fn, context) { 
    var result;
    return function() { 
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
}

function getCoordsFromEvent(evt) {
    var coords = {};

    if(evt.targetTouches) {
      // Prefer Touch Events
      coords.clientX = evt.targetTouches[0].clientX;
      coords.clientY = evt.targetTouches[0].clientY;
      coords.pageX = evt.targetTouches[0].pageX;
    } else {
      // Either Mouse event or Pointer Event
      coords.clientX = evt.clientX;
      coords.clientY = evt.clientY;
      coords.pageX = evt.pageX;
    }

    return coords;
  }
export  {getWidth, once, getCoordsFromEvent}
