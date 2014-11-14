

$.FollowToggle = function (el) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id");
  this.followState = this.$el.data("initial-follow-state");
   console.log(this.followState);
  this.render();
  this.handleClick();
};

$.FollowToggle.prototype.toggleFollowState = function () {
  if(this.followState === "followed") {
    this.followState = "unfollowed";
  } else {
    this.followState = "followed";
  }
};

$.FollowToggle.prototype.handleClick = function () {
  var that = this;
  this.$el.on("click", function(event){
    event.preventDefault();
    if(that.followState === "unfollowed"){
      that.followState = "following"
      that.render();
      $.ajax({
        url: "/users/" + that.userId + "/follow",
        dataType: 'json',  
        type: "POST",
        success: function(){
          that.followState = "followed";
          that.render();
        }
      })
    } else {
      that.followState = "following";
      that.render();
      $.ajax({
        url: "/users/" + that.userId + "/follow",
        dataType: 'json',  
        type: "DELETE",
        success: function(){
          that.followState = "unfollowed"
          that.render();
        }
    })
  }
});
};

$.fn.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};


$.FollowToggle.prototype.render = function(){
  if(this.followState === "following"){
    this.$el.attr("disabled", "disabled");
  } else {
    this.$el.removeAttr("disabled", "disabled");
  }
  var followString = this.followState === "followed" ? "Unfollow!" : "Follow!";
  this.$el.html(followString)
}
$(function () {
  $("button.follow-toggle").followToggle();
});