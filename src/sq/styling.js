function styling() {
  
  addPage("page_OFraMP_2_2", "OFraMP/s evaluation: grading", "questionnaire_s");
  
  
  addNote("      Please rate the following statements on a scale of 1 (strongly disagree)      to 5 (strongly agree).    ", "page_OFraMP_2_2");
  
  addQuestion("sus1Block", "page_OFraMP_2_2");
  
  addQuestion("sus3Block", "page_OFraMP_2_2");
  
  addQuestion("sus4Block", "page_OFraMP_2_2");
  
  addQuestion("sus5Block", "page_OFraMP_2_2");
  
  addQuestion("sus6Block", "page_OFraMP_2_2");
  
  addQuestion("sus7Block", "page_OFraMP_2_2");
  
  addQuestion("sus8Block", "page_OFraMP_2_2");
  
  addQuestion("sus9Block", "page_OFraMP_2_2");
  
  addQuestion("sus10Block", "page_OFraMP_2_2");
  
  addQuestion("umux1Block", "page_OFraMP_2_2");
  
  
  
  addPage("page_OFraMP_24_2", "OFraMP/s evaluation: assessing", "questionnaire_s");
  
  
  addNote("      Please take some time to write a few short assessments of the system.    ", "page_OFraMP_24_2");
  
  addQuestion("chem_posBlock", "page_OFraMP_24_2");
  
  addQuestion("chem_negBlock", "page_OFraMP_24_2");
  
  addQuestion("ui_posBlock", "page_OFraMP_24_2");
  
  addQuestion("ui_negBlock", "page_OFraMP_24_2");
  
  addQuestion("had_errorsBlock", "page_OFraMP_24_2");
  
  addQuestion("errorsBlock", "page_OFraMP_24_2");
  
  addQuestion("has_commentsBlock", "page_OFraMP_24_2");
  
  addQuestion("commentsBlock", "page_OFraMP_24_2");
  
  
  

  
  // Question ui_pos
  
  addTextarea("ui_pos");
  
  
  // Question sus9
  
  addRangeRadio("sus9", 1., 5.);
  
  
  // Question errors
  
  addTextarea("errors");
  
  
  // Question sus1
  
  addRangeRadio("sus1", 1., 5.);
  
  
  // Question sus4
  
  addRangeRadio("sus4", 1., 5.);
  
  
  // Question chem_pos
  
  addTextarea("chem_pos");
  
  
  // Question sus3
  
  addRangeRadio("sus3", 1., 5.);
  
  
  // Question ui_neg
  
  addTextarea("ui_neg");
  
  
  // Question sus6
  
  addRangeRadio("sus6", 1., 5.);
  
  
  // Question sus5
  
  addRangeRadio("sus5", 1., 5.);
  
  
  // Question sus8
  
  addRangeRadio("sus8", 1., 5.);
  
  
  // Question sus7
  
  addRangeRadio("sus7", 1., 5.);
  
  
  // Question has_comments
  
  addRadio("has_comments");
  
  
  // Question had_errors
  
  addRadio("had_errors");
  
  
  // Question chem_neg
  
  addTextarea("chem_neg");
  
  
  // Question sus10
  
  addRangeRadio("sus10", 1., 5.);
  
  
  // Question comments
  
  addTextarea("comments");
  
  
  // Question umux1
  
  addRangeRadio("umux1", 1., 5.);
  
  
  

  paginate();

  $("fieldset").trigger("check");
}
