var OMG_GITHUB_REPO = "omg-cli"
var PLUGINS_GITHUB_REPO = "omg-product-bundle"

jQuery(function($) {
  //setDownloadLinksToLatestVersion();
  getLatestGithubRelease(OMG_GITHUB_REPO);
  getLatestGithubRelease(PLUGINS_GITHUB_REPO);
});

// A slightly modified version of:
// https://stackoverflow.com/questions/24987542/is-there-a-link-to-github-for-downloading-a-file-in-the-latest-release-of-a-repo
function getLatestGithubRelease(repo) {
    var url = "https://api.github.com/repos/c0-ops/" + repo + "/releases/latest"
    $.getJSON(url).done(function (release) {

      var totalDownloads = 0;

      // update individual download links
      for (var j = 0; j < release.assets.length; j++) {
        var asset = release.assets[j];
        totalDownloads += asset.download_count;

        // compute time since last update
        var oneHour = 60 * 60 * 1000
        var oneDay = 24 * oneHour
        var dateDiff = new Date() - new Date(asset.updated_at)
        var timeAgo;
        if (dateDiff < oneDay) {
          timeAgo = (dateDiff / oneHour).toFixed(0) + "h ago";
        } else {
          timeAgo = (dateDiff / oneDay).toFixed(0) + "d ago";
        }

        var sel = "#" + asset.name

        // update download link
        $(sel + " > a").text(asset.name)
        $(sel + " > a").attr("href", asset.browser_download_url)

        // add release info
        var releaseInfo = timeAgo;
        $(sel + " .badge").text(releaseInfo);
      }

      sel = "#" + repo
      $(sel + " .rel").text("Latest Release " + release.tag_name);
      $(sel + " .dlcount").text("(" + totalDownloads + " downloads)");
    })
}
