Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) 
{

  Template.body.events(
  {
  "submit .new-task": function (event) 
    {
      
      // Prevent default browser submit
      event.preventDefault();
      
      // get form value
      var text = event.target.text.value;
      console.log(text);
      
      //Insert task into the collection
      Meteor.call("addTask", text);
      
      
      //Clear the form
      event.target.text.value = "";
      
    },
    
    "change .hide-completed input": function (event)
    {
      Session.set("hideCompleted", event.target.checked);
    }
  }
  );
  
  
  Template.body.helpers({
  tasks: function ()
  {
  if (Session.get("hideCompleted"))
  {
     return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
  }
  else
  {
    return Tasks.find({}, {sort: {createdAt: -1}});
  }
  },
  hideCompleted: function ()
  {
    return Session.get("hideCompleted");
  },
  
  incompleteCount: function ()
  {
    return Tasks.find({checked: {$ne: true}}).count();
  }
    
  });
  
  Template.task.events
  (
    {
     "click .toggle-checked": function ()
      {
        // Reset checked to opposite of its current value
        Meteor.call("setChecked", this._id, ! this.checked);
      },
        
         "click .delete": function()
    {
    Meteor.call("deleteTask", this. _id);
    }
    }
    
    
   
  );
  
  Accounts.ui.config(
    {
    passwordSignupFields: "USERNAME_ONLY"
    }
    );
    }
  Meteor.methods
  (
     {
       addTask: function (text)
       {
          if ( ! Meteor.userId())
          { throw new Meteor.Error("Not authorised"); }
          
          console.log("before insert");
          
          Tasks.insert( {
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
            }
          );
       },
       
       deleteTask: function(taskId) {
         Tasks.remove(taskId);
       },
       
       setChecked: function (taskId, setChecked) {
         Tasks.update( taskId, { $set: { checked: setChecked } } );
       }
     }
  );
    
    
