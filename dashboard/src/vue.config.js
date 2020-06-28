module.exports = {
  css: {
    // https://dev.to/justaashir/bulma-vue-easy-setup-2b3
    // https://headsigned.com/posts/importing-and-using-css-frameworks-with-vue/
    extract: false,
    loaderOptions: {
      scss: {
        prependData: `@import "~/../node_modules/bulma"`
      }
    }
  }
}