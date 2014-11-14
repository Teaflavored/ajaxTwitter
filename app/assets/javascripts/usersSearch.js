$.UsersSearch = function(el){
  this.$el = $(el);
  this.$ul = this.$el.children("ul");
  this.$input = this.$el.children("input")
  this.handleInput();
}

$.UsersSearch.prototype.renderResults = function(users){
  var that = this;
  this.$ul.html("");
  _.each(users, function(user) {
    var userString = "<li><a href=";
    userString += "/users/" + user.id + ">" + user.username +"</a>";
    userString += "<button class=\"follow-toggle\" data-user-id=\"" + user.id;
    userString += "\" data-initial-follow-state=\""
    userString += user.followed ? "followed" : "unfollowed"
    userString += "\"></button></li>"
    that.$ul.append(userString);
  })
  
  $(".follow-toggle").followToggle();
}

$.UsersSearch.prototype.handleInput = function(){
  var that = this;
  this.$input.on("keyup", function(event){
    $.ajax({
      url: "/users/search",
      type: "GET",
      data: {"query": that.$input.val()},
      dataType: 'json',
      success: function (users) {
        that.renderResults(users)
      }
    })
  })
  
}



$.fn.usersSearch = function(){
  return this.each(function(){
    new $.UsersSearch(this);
  })
}



$(function(){
  $(".users-search").usersSearch();
})