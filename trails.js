
// put this on the web page, and set trail = true

var doc_id = "aata";

var topsection = document.getElementsByTagName('section')[0];
var thefocus = topsection.id;

var recenthistory = '';

var onpage = false;
var timecounter = 0;
var dataurlbase = "https://track.aimath.org/" + doc_id + "/u3au3a?";
dataurlbase = dataurlbase.concat(doc_id).concat("&");
dataurlbase = dataurlbase.concat("per").concat("=").concat(aa_id).concat("&");
dataurlbase = dataurlbase.concat("ut_id").concat("=").concat(ut_id).concat("&");



function timeTracker() {
  if (onpage) {
    timecounter++;
    recenthistory = recenthistory.concat(thefocus).concat('.');
    if (timecounter % 10 == 0) {
        dataurl = dataurlbase.concat(recenthistory.slice(0, -1));  //trailing "."
        $.get(dataurl);
        recenthistory = '';
    }
  }
}

theTimer = setInterval(timeTracker, 1000);

$('body').focusout(function() {
    onpage = false;
    if (recenthistory != '') {
      dataurl = dataurlbase.concat(recenthistory.slice(0, -1));  //trailing "."
      $.get(dataurl);
      recenthistory = '';
    }
    timecounter = 0;
});
$('body').focusin(function() {
    onpage = true;
});

// the hidden proof knowls have knowl="", which is like the a does not have knowl as an attribute
$('a').on('click', function() {
    if(this.classList.contains('active')) {
      thefocus = this.closest('section').id;
    } else if ($(this).attr("knowl")) {
        if($(this).attr("id")) {
             thefocus = this.id
        }
// ***** maybe this case is obsolete?
        else if (kid = this.getAttribute('knowl-id')) {
             thefocus = kid
        }
// ***** check on the knowl="" case, and probably rearrange these options
        else if (kid = this.getAttribute('knowl')) {
             full_kid = kid
             trimmed_kid = full_kid.replace(/.*\//, "");
             trimmed_kid = trimmed_kid.replace(/\..*/, "");
// ****** add intormation about parents, because this might not be the
// only instance of this knowl on that page
             closest_p = this.closest('[id]');
             console.log("was clicked", this);
             console.log("closest('p')", closest_p);
             parent_pid = closest_p.id;
             thefocus = parent_pid + "_" + trimmed_kid
        }
        else if (kid = this.getAttribute('refid')) {
// ***** check.  want hk-proof-80 --> proof-80
// ***** also check that closing it goes back to the correct focus.
// ***** (currenty, closing an know return focus to the enclosing section.  Is that always correct?)
             thefocus = kid.slice(3, 0)
        }
        else {
                  thefocus = 'Unknown'
        }
    } else if ($(this).attr("id")) {
// ***** shouldn't this come earlier, and not recheck for id inside of knowl?
             thefocus = this.id;
    };

// ***** is it good that we put "click-"+section when closing a knowl
    recenthistory = recenthistory.concat('click-').concat(thefocus).concat('.');

});


setTimeout(function(){
    $('body').attr('tabindex',-1).focus()},
100);

// instead of waiting 2 seconds, it would be better to trigger on sage cell completing setup
setTimeout(function(){
  var allbuttons = document.getElementsByTagName('button');
  $('button.sagecell_evalButton').on('click', function() {
     article_id = this.closest('div.sagecell-sage').id;
     thefocus = article_id;
     recenthistory = recenthistory.concat('click-').concat(article_id).concat('.');
     });
},
2000);


