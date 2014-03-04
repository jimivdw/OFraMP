function styling() {
  
  addPage("page_OFraMP_2_2", "OFraMP evaluation: final questions", "questionnaire");
  
  
  addNote("Please answer the following questions.", "page_OFraMP_2_2");
  
  addQuestion("preferenceBlock", "page_OFraMP_2_2");
  
  addQuestion("preference_expBlock", "page_OFraMP_2_2");
  
  addQuestion("wants_transferBlock", "page_OFraMP_2_2");
  
  addQuestion("transferBlock", "page_OFraMP_2_2");
  
  addQuestion("wants_additionsBlock", "page_OFraMP_2_2");
  
  addQuestion("additionsBlock", "page_OFraMP_2_2");
  
  addQuestion("has_commentsBlock", "page_OFraMP_2_2");
  
  addQuestion("commentsBlock", "page_OFraMP_2_2");
  
  
  

  
  // Question has_comments
  
  addRadio("has_comments");
  
  
  // Question preference_exp
  
  addTextarea("preference_exp");
  
  
  // Question wants_additions
  
  addRadio("wants_additions");
  
  
  // Question transfer
  
  addTextarea("transfer");
  
  
  // Question preference
  
  addRangeRadio("preference", 1., 2.);
  
  
  // Question comments
  
  addTextarea("comments");
  
  
  // Question additions
  
  addTextarea("additions");
  
  
  // Question wants_transfer
  
  addRadio("wants_transfer");
  
  
  

  paginate();

  $("fieldset").trigger("check");
}
