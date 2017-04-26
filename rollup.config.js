import npm from "rollup-plugin-node-resolve";

export default {
  entry: "assets/js/build.js",
  format: "umd",
  moduleName: "d3",
  plugins: [npm({jsnext: true})],
  dest: "assets/js/lib.js"
};
