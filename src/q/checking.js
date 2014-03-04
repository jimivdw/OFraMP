// THIS IS AN AUTOMATICALLY GENERATED FILE. DO NOT EDIT!

function validatequestionnaire() {

  $("#questionnaire").validate({
    rules: {
      
      preference: {
        required: true,
        digits: true
          
      },
      
      preference_exp: {
        required: true,
          
      },
      
      wants_transfer: {
        required: true
          
      },
      
      transfer: {
        required: true,
          
      },
      
      wants_additions: {
        required: true
          
      },
      
      additions: {
        required: true,
          
      },
      
      has_comments: {
        required: true
          
      },
      
      comments: {
        required: true,
          
      },
      
    }
  });

  $("#questionnaire").on("input change", function(evt) {
    if($(evt.target).attr("type") !== "date") {
      $(evt.target).valid();
    }
    if(evt.type === "change") {
      $(evt.target).attr("touched", "touched");
    }
  });

  // Make sure all elements are properly styled before registering events
  styling();

  // The code to automatically generate calculated fields 
  

  // End with control flow functionality for branches etc. 
  
  // Hide all elements in a conditional branch on page load 
  
  hide($("#transferBlock"));
  
  hide($("#additionsBlock"));
  
  hide($("#commentsBlock"));
  
      
  
  $("*[name=wants_transfer]").on("input change", callback_0);
      
  function callback_0(e) {
    
    var wants_transfer = getFormValue("#wants_transfer");
    
    
    hide($("#transferBlock"));
    
    if(wants_transfer) { 
    
      show($("#transferBlock"));
    
    
    
    
    
    }
  }
    
  
  
  $("*[name=wants_additions]").on("input change", callback_1);
      
  function callback_1(e) {
    
    var wants_additions = getFormValue("#wants_additions");
    
    
    hide($("#additionsBlock"));
    
    if(wants_additions) { 
    
      show($("#additionsBlock"));
    
    
    
    
    
    }
  }
    
  
  
  $("*[name=has_comments]").on("input change", callback_2);
      
  function callback_2(e) {
    
    var has_comments = getFormValue("#has_comments");
    
    
    hide($("#commentsBlock"));
    
    if(has_comments) { 
    
      show($("#commentsBlock"));
    
    
    
    
    
    }
  }
    
  
}
  