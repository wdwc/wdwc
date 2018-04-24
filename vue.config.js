module.exports = {
  // eslint-disable-next-line
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
      console.log('Compiling for Production');
    } else {
      console.log('Compiling for Development');
      // mutate for development...
    }
    return {
      output: {
        library: 'wdwc'
      }
    };
  }
};
