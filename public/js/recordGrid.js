 
window.recordGrid = (function ($, Backbone , Backgrid){
 
return function(selector){
var api = {}
var hits, hitsModel, hitsCollection, columns, grid;

        $(function(){ 

        hitsModel = Backbone.Model.extend({});
        columns = [{
            name: "id", // The key of the model attribute
            label: "ID", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
            cell: Backgrid.IntegerCell.extend({
              orderSeparator: ''
            })
          }, {
            name: "time",
            label: "Time",
            // The Cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
          }, {
            name: "hits",
            label: "Hits",
            cell: "integer"
          }];
         

        hitsCollection = Backbone.Collection.extend({
          model: hitsModel  });
         
        hits = new hitsCollection();
        // Initialize a new Grid instance
        grid = new Backgrid.Grid({
          columns: columns,
          collection: hits
        });


        // Render the grid and attach the root to your HTML document
        var gridEl = $(selector);
      
        gridEl.append(grid.render().el);
          // Fetch some countries from the url
        var i = 0;
        //territories.fetch({reset: true});

   

        $("#addData").click(function(){
          
          function add(){
          var item = {"time" : Date.now()
            , hits: Math.floor(Math.random()*10)};
           i++;
           hits.unshift({"id": i, "time" :  (new Date).getMinutes() + ":" +(new Date).getSeconds(), "hits" : 20} );
         }
         add();
        });
        });
 api.start = function(controller)
 {
      var i = 0;
      return  setInterval(function(){
        
           i++;
           hits.unshift({"id": i, "time" :  (new Date).getMinutes() + ":" +(new Date).getSeconds(), 
            "hits" : controller.getValue()} );
         }, 1000);
 }
 api.stop = function(id)
 {
    clearInterval(id);
 }
 api.add = function(item)
 {
   hits.push(item);
 }
 return api;
}
})($, Backbone, Backgrid)