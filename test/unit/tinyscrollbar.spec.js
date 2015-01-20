jasmine.getFixtures().fixturesPath = "test/fixtures";

describe("tinyscrollbar", function ()
{
    var $container  = null
    ,   $container1 = null
    ,   $container2 = null
    ;

    beforeEach(function()
    {
        loadFixtures("containers.html");

        $container  = $(".container");
        $container1 = $("#container1");
        $container2 = $("#container2");
    });

    it("should be chainable.", function()
    {
        $container1.tinyscrollbar().addClass("test");

        expect($container1).toHaveClass("test");
    });

    it("should work on more then one container simultaneously.", function()
    {
        $containers.tinyscrollbar();

        expect($("#container").data("plugin_tinyscrollbar")).toBeTruthy();
        expect($("#container2").data("plugin_tinyscrollbar")).toBeTruthy();
    });

    it("should be able to handle (async) content updates.", function()
    {
        $container1.tinyscrollbar();


        $container1.data("plugin_tinyscrollbar")

        expect($container1).toHaveClass("test");
    });

});