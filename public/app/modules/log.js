define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {


  var Log = app.module();


  Log.Model = Backbone.Model.extend({

    defaults: function () {
      return {
        from: '',
        to: '',
        date: '',
        duration: ''
      };
    }

  });


  Log.List = Backbone.Collection.extend({

    model: Log.Model,

    url: '/api/logs'

  });


  // Views
  var Views = Log.Views = {};


  Views.List = Backbone.View.extend({
    tagName: 'ul',

    className: 'logs',

    initialize: function () {
      this.collection.on('reset', function () {
        this.render();
      }, this);

      this.collection.on('add', function (item) {
        this.insertView(new Views.ListItem({
          model: item
        })).render();
      });
    },

    render: function (manage) {
      this.collection.each(function (item) {
        this.insertView(new Views.ListItem({
          model: item
        }));
      }, this);

      return manage( this ).render();
    }
  });


  Views.ListItem = Backbone.View.extend({
    tagName: 'li',

    template: 'logs/item',

    render: function (manage) {
      return manage( this ).render( this.model.toJSON() );
    }
  });


  // Return the module for AMD compliance.
  return Log;

});
