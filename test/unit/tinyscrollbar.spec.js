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

    it('should have a accessible instance', function() {
        var instance = tinyscrollbar(document.getElementById("scrollbar1"));

        expect(instance).to.be.a('object');
        expect(instance._name).to.equal('tinyscrollbar');
    });

});
