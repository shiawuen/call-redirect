define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {


  /**
   * Cache for local use
   **/

  var toJSON = Backbone.Model.prototype.toJSON;


  var Call = app.module();


  Call.Model = Backbone.Model.extend({

    url: '/api/call',

    defaults: function () {
      return {
        to: ''
      }
    },

    placeholders: {
      to: 'Number to call'
    }

  });


  var Views = Call.Views = {};


  Views.DialBox = Backbone.View.extend({
    tagName: 'form',

    template: 'call/dial-box',

    events: {
      'keyup #to': 'callOnEnter',
      'submit': 'save'
    },

    callOnEnter: function (event) {
      if ( event.keyCode !== 13 ) { return ; }

      this.save();
    },

    save: function (event) {
      event && event.preventDefault();

      this.model.save({
        to: this.$('#to').val()
      });

      this.clear();
    },

    clear: function () {
      this.$('#to').val('');
    },

    render: function (manage) {
      var data = _.extend( this.model.toJSON(), {
        placeholders: this.model.placeholders
      });

      return manage( this ).render( data );
    }
  });


  return Call;

});
