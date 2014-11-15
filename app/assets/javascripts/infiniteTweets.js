$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.maxCreatedAt = null;
  this.fetchTweets();
  this.insertTweet();
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
                     // need to fix so it doesn't insert the one that was just inserted
                   }
                 }

   if (that.maxCreatedAt !== null){
     options.data = {'max_created_at': that.maxCreatedAt }
   }

   $.ajax(options);
  })
};

$.InfiniteTweets.prototype.insertTweet = function(){
  var that = this;
  that.$el.find('ul#feed').on("insert-tweet", function(event, tweet){
    var liString = that.$el.find('script').html();
    var templateFn = _.template(liString)
    var template = templateFn({tweets: [tweet]})
    that.$el.find('ul#feed').prepend(template);
  })
}

$.InfiniteTweets.prototype.insertTweets = function (tweets) {
  var allTweetsLength = tweets.length;

  var $ulFeed = this.$el.find('ul#feed');
  //get all tweet ids of existing li
  var $li = $ulFeed.find("li");
  var tweetIds = $li.map(function(){
    return $(this).data("tweet-id")
  }).get();
  //select those tweets that haven't been shown yet.
  tweets = _.select(tweets, function(tweet){
    return tweetIds.indexOf(tweet.id) === -1
  })

  console.log(tweets)

  var liString = this.$el.find('script').html();
  var templateFn = _.template(liString)
  var template = templateFn({tweets: tweets})
  $ulFeed.append(template);

  this.maxCreatedAt = tweets[tweets.length - 1 ].created_at;

  if (allTweetsLength < 20) {
    this.$el.find('a.fetch-more').remove();
  }
}


$(function() {
  $("div.infinite-tweets").infiniteTweets();
})
