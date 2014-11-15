$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.maxCreatedAt = null;
  this.fetchTweets();
}

$.fn.infiniteTweets = function() {
  return this.each(function(){
    new $.InfiniteTweets(this);
  })
}

$.InfiniteTweets.prototype.fetchTweets = function () {
  var that = this;
  this.$el.find('a.fetch-more').on('click', function(event) {
    console.log('hi')
    var options = { url: "/feed",
                   dataType: 'json',
                   type: "GET",
                   success: function(tweets){
                     that.insertTweets(tweets);
                   }
                 }
                   
   if (that.maxCreatedAt !== null){
     options.data = {'max_created_at': that.maxCreatedAt }
   }
   
   console.log(options)
   $.ajax(options);
  })
};

$.InfiniteTweets.prototype.insertTweets = function (tweets) {
  var that = this;
  var liString = that.$el.find('script').html();
  var templateFn = _.template(liString)
  var template = templateFn({tweets: tweets})
  that.$el.find('ul#feed').append(template);

  this.maxCreatedAt = tweets[tweets.length - 1 ].created_at;
  if (tweets.length < 20) {
    this.$el.find('a.fetch-more').remove();
  }
}
$(function() {
  $("div.infinite-tweets").infiniteTweets(); 
})