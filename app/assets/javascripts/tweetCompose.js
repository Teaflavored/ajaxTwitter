$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$inputs = this.$el.find("textarea");
  this.$option = this.$el.find("select > option:first-child");
  this.charsRemaining();
  this.submit();
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
    var formData = $(event.currentTarget).serialize();
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
$.TweetCompose.prototype.blockInput = function(){
  this.$el.find(":input").attr("disabled", "disabled")
}

$.TweetCompose.prototype.clearInput = function(){
  this.$el.find(":input").removeAttr("disabled", "disabled")
  this.$inputs.val('');
  this.$option.attr("selected", "selected");
  this.$el.find('.chars-remaining').html("140 characters left.");
}

$.TweetCompose.prototype.handleSuccess = function(tweet){
  this.clearInput();
  var ulSelector = this.$el.data("tweets-ul");
  var tweetHtml = "<li>" + tweet.content + " -- ";
  tweetHtml += "<a href=\"/users/" + tweet.user_id + "\">" + tweet.user.username + "</a>--";
  tweetHtml += tweet.created_at + "<br>";
  if (tweet.mentions.length > 0){
    tweetHtml += "<ul><li><a href=\"/users/" + tweet.mentions[0].user_id + "\">" + tweet.mentions[0].user.username +"</a></li></ul>" 
  } 
  tweetHtml += "</li>";
  console.log(tweetHtml)
  $(ulSelector).prepend(tweetHtml);
}

$(function(){
  $('.tweet-compose').tweetCompose();
})

//
// <%= tweet.content %>
// -- <%= link_to tweet.user.username, user_url(tweet.user.id) %>
// -- <%= tweet.created_at %>
//
// <% if tweet.mentioned_users.length > 0 %>
//   <ul>
//     <% tweet.mentioned_users.each do |mentioned_user| %>
//       <li><%= link_to mentioned_user.username, user_url(mentioned_user) %></li>
//     <% end %>
//   </ul>
// <% end %>
