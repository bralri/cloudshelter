const { DateTime } = require("luxon");
const pluginRSS = require("@11ty/eleventy-plugin-rss");

module.exports = (eleventyConfig) => {

    eleventyConfig.addPlugin(pluginRSS);
    eleventyConfig.addLiquidFilter("dateToRfc822", pluginRSS.dateToRfc822);

    eleventyConfig.addPassthroughCopy('./src/js');
    eleventyConfig.addPassthroughCopy('./src/assets');
    eleventyConfig.addPassthroughCopy('./src/favicon.ico')
    

    eleventyConfig.addWatchTarget('./src/scss');
    eleventyConfig.addPassthroughCopy('./src/css');

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    })

    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
}