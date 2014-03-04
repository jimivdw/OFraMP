// THIS IS AN AUTOMATICALLY GENERATED FILE. DO NOT EDIT!

function validatequestionnaire_s() {

  $("#questionnaire_s").validate({
    rules: {
      
      sus1: {
        required: true,
        digits: true
          
      },
      
      sus3: {
        required: true,
        digits: true
          
      },
      
      sus4: {
        required: true,
        digits: true
          
      },
      
      sus5: {
        required: true,
        digits: true
          
      },
      
      sus6: {
        required: true,
        digits: true
          
      },
      
      sus7: {
        required: true,
        digits: true
          
      },
      
      sus8: {
        required: true,
        digits: true
          
      },
      
      sus9: {
        required: true,
        digits: true
          
      },
      
      sus10: {
        required: true,
        digits: true
          
      },
      
      umux1: {
        required: true,
        digits: true
          
      },
      
      chem_pos: {
        required: true,
          
      },
      
      chem_neg: {
        required: true,
          
      },
      
      ui_pos: {
        required: true,
          
      },
      
      ui_neg: {
        required: true,
          
      },
      
      had_errors: {
        required: true
          
      },
      
      errors: {
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

  $("#questionnaire_s").on("input change", function(evt) {
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
  
  hide($("#errorsBlock"));
  
  hide($("#commentsBlock"));
  
      
  
  $("*[name=had_errors]").on("input change", callback_0);
      
  function callback_0(e) {
    
    var had_errors = getFormValue("#had_errors");
    
    
    hide($("#errorsBlock"));
    
    if(had_errors) { 
    
      show($("#errorsBlock"));
    
    
    
    
    
    }
  }
    
  
  
  $("*[name=has_comments]").on("input change", callback_1);
      
  function callback_1(e) {
    
    var has_comments = getFormValue("#has_comments");
    
    
    hide($("#commentsBlock"));
    
    if(has_comments) { 
    
      show($("#commentsBlock"));
    
    
    
    
    
    }
  }
    
  
}
  