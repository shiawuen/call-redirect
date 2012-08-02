define([
  // Application.
  "app",

  "modules/call",
  "modules/log"

],

function(app, Call, Log) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {

      var logs = new Log.List();

      var call = new Call.Model();

      app.useLayout( 'main' );

      app.layout.setViews({

        '#dial-box': new Call.Views.DialBox({
          model: call
        }),

        '#logs': new Log.Views.List({
          collection: logs
        })

      }).render();

      logs.fetch();

    }
  });

  return Router;

});
