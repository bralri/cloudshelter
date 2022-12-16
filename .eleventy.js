module.exports = (eleventyConfig) => {

    eleventyConfig.addPassthroughCopy('./src/js');

    eleventyConfig.addPassthroughCopy('./src/assets/videos/alex');
    eleventyConfig.addPassthroughCopy('./src/assets/videos/christoph/Christoph.m4v');

    eleventyConfig.addPassthroughCopy('./src/assets/sounds/alex');
    eleventyConfig.addPassthroughCopy('./src/assets/sounds/christoph/christoph.mp3');
    eleventyConfig.addPassthroughCopy('./src/assets/sounds/leifang');

    eleventyConfig.addPassthroughCopy('./src/assets/models/environment');
    eleventyConfig.addPassthroughCopy('./src/assets/models/leifang');
    eleventyConfig.addPassthroughCopy('./src/assets/models/molly');
    eleventyConfig.addPassthroughCopy('./src/assets/models/speculative_geologies');
    
    eleventyConfig.addPassthroughCopy('./src/assets/images');
    eleventyConfig.addPassthroughCopy('./src/assets/fonts');

    eleventyConfig.addPassthroughCopy('./src/assets/models/cloud.glb');
    eleventyConfig.addPassthroughCopy('./src/favicon.ico')
    

    eleventyConfig.addWatchTarget('./src/scss');
    eleventyConfig.addPassthroughCopy('./src/css');

    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
}