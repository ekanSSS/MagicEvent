describe('Event Handler basics', function() {


    let testVal = {};
    let count = 0;
    let testFunc = function (ev) {
        testVal[ev.type] = count++;
    }

    beforeEach(function() {
        var fixture = '<div id="fixture">' +
                            '<div class="test">' +
                                '<span class="text">this is text</span>' +
                                '<span class="text">this is text2</span>' +
                            '</div>' +
                        '</div>';

        testVal = {};
        count = 0;

        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
        MagicEvent.offAll();
    });

    it('Event Handler should be loaded', function() {
        expect(MagicEvent).toBeDefined();
    });

    it('you should add a working event listerner', function(){
        MagicEvent.on("click", ".test", testFunc);
        const div = document.querySelector('.test');
        div.click();

        expect(testVal.click).toBe(0);
        expect(testVal.keypress).toBe(undefined);
    });

    it('you should add a working event listerner with delegate', function(){
        MagicEvent.on("click", ".test", testFunc);
        const span = document.querySelector('.text');
        span.click();

        expect(testVal.click).toBe(0);
    });

    it('you should add a working event listerner working once per element', function(){
        MagicEvent.on("click", ".test", testFunc)
            .one("click", ".text", testFunc);

        const span = document.querySelector('.text');

        // trigger on span and div
        span.click();
        expect(testVal.click).toBe(1);

        // trigger only on div span was already trigger
        span.click();
        expect(testVal.click).toBe(2);

        //trigger on span and div because this is another span
        span.nextSibling.click();
        expect(testVal.click).toBe(4);

        // trigger only on div because the second span was already trigger
        span.nextSibling.click();
        expect(testVal.click).toBe(5);
    });

    it('you should emit an event', function(){
        MagicEvent.on("click", ".test", testFunc)
            .emit("click", ".test");

        expect(testVal.click).toBe(0);
    });

    it('you should remove an event Listener', function(){
        MagicEvent.on("click", ".test", testFunc)
            .off("click", ".test", testFunc)
            .emit("click", ".test");

        expect(testVal.click).toBe(undefined);
    });

    it('you should add an event Listener on scroll', function(){
        MagicEvent.on("scroll", ".test", testFunc)
            .emit("scroll", ".test");

        expect(testVal.scroll).toBe(0);
    });

    it('Event should not be catch when emitted on  parent or siblings', function(){
        MagicEvent.on("click", ".text:first-of-type", testFunc)
            .emit("click", ".text:last-of-type")
            .emit("click", ".test");

        expect(testVal.scroll).toBe(undefined);
    });

});