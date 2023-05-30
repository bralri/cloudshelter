const { DateTime } = require("luxon");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const {minify} = require("terser");

module.exports = (eleventyConfig) => {

    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
        code,
        callback
    ){
        try {
            const minified = await minify(code);
            callback(null, minified.code);
        } catch (err) {
            console.log("Terser error: ", err);
            // Fail gracefully
            callback(null, code);
        }
    });

    eleventyConfig.addPlugin(pluginRSS);
    eleventyConfig.addLiquidFilter("dateToRfc822", pluginRSS.dateToRfc822);

    eleventyConfig.addPassthroughCopy('./src/js/');

    eleventyConfig.addPassthroughCopy('./src/assets/fonts');
    eleventyConfig.addPassthroughCopy('./src/assets/images');
    eleventyConfig.addPassthroughCopy('./src/assets/models');
    eleventyConfig.addPassthroughCopy('./src/assets/sounds');
    eleventyConfig.addPassthroughCopy('./src/assets/videos');


    eleventyConfig.addPassthroughCopy('./src/favicon.ico');
    

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