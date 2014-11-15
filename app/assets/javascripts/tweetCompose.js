$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$inputs = this.$el.find("textarea");
  this.$option = this.$el.find("select > option:first-child");
  this.charsRemaining();
  this.submit();
  this.addMentionedUser();
};

$.fn.tweetCompose = function () {
  return this.each(function() {
    new $.TweetCompose(this);
  });
};

$.TweetCompose.prototype.charsRemaining = function () {
  var that = this
  this.$inputs.on('keyup', function(event) {
    var numChars = that.$inputs.val().length;
    var remaining = 140 - numChars;
    that.$el.find('.chars-remaining').html(remaining + " characters left.");
  })
};

$.TweetCompose.prototype.submit = function() {
  var that = this;
  this.$el.on('submit', function(event){
    event.preventDefault();
    var formData = $(event.currentTarget).serializeJSON();
    console.log(formData)
    that.blockInput();
    $.ajax({
      url: "/tweets",
      type: "POST",
      data: formData,
      dataType: 'json',
      success: function(tweet){
        that.handleSuccess(tweet);
      }
    })
  })
}

$.TweetCompose.prototype.addMentionedUser = function(){
  var that = this;
  this.$el.find('.add-mentioned-user').on('click', function(event) {
    var scriptTag = that.$el.find('script');
    that.$el.find('.mentioned-users').append(scriptTag.html())
    that.removeMentionedUser();
  })

  
}

$.TweetCompose.prototype.removeMentionedUser = function(){ 
  var that = this;
  this.$el.find('.select-div').on('click', 'a.remove-mentioned-user', function(event) {
    var $clickedAnchor = $(event.currentTarget);
    $clickedAnchor.parent("div.select-div").remove();
  });
};

$.TweetCompose.prototype.blockInput = function(){
  this.$el.find(":input").attr("disabled", "disabled")
}

$.TweetCompose.prototype.clearInput = function(){
  this.$el.find(":input").removeAttr("disabled", "disabled")
  this.$inputs.val('');
  this.$option.attr("selected", "selected");
  this.$el.find('.chars-remaining').html("140 characters left.");
  this.$el.find("div.mentioned-users").empty();
}

$.TweetCompose.prototype.handleSuccess = function(tweet){
  this.clearInput();
  var $ul = $(this.$el.data("tweets-ul"));
  $ul.trigger("insert-tweet", tweet);
  // var tweetHtml = "<li>" + tweet.content + " -- ";
//   tweetHtml += "<a href=\"/users/" + tweet.user_id + "\">" + tweet.user.username + "</a>--";
//   tweetHtml += tweet.created_at + "<br>";
//   if (tweet.mentions.length > 0){
//     tweetHtml += "<ul>";
//     _.each(tweet.mentions, function(mention){
//       tweetHtml+="<li>"
//       tweetHtml+="<a href=\"/users/" + mention.user_id + "\">" + mention.user.username +"</a>"
//       tweetHtml+="</li>"
//     })
//     tweetHtml += "</ul>"
//   }
//   tweetHtml += "</li>";
//   $(ulSelector).prepend(tweetHtml);
}

$(function(){
  $('.tweet-compose').tweetCompose();
})