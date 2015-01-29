describe('A single Tinyscrollbar', function() {
    before(function () {
        document.head.innerHTML = __html__['test/fixtures/tinyscrollbar-css.html'];
    });

    beforeEach(function () {
        document.body.innerHTML = __html__['test/fixtures/tinyscrollbar.html'];
    });

    afterEach(function () {
        document.body.innerHTML = '';
    });

    it('should have a chainable constructor', function() {
        $('#scrollbar1').tinyscrollbar().addClass('testing');

        expect($('#scrollbar1').hasClass('testing')).to.equal(true);
    });

    it('should have a accessible instance', function() {
        var instance = $('#scrollbar1').tinyscrollbar().data('plugin_tinyscrollbar');

        expect(instance).to.be.a('object');
        expect(instance._name).to.equal('tinyscrollbar');
    });

    it('should have a chainable update method', function() {
        var instance = $('#scrollbar1').tinyscrollbar().data('plugin_tinyscrollbar');

        expect(instance.update()._name).to.equal('tinyscrollbar');
    });


});
