// Dynamic Routing Mapping with Next.js
const routes = require("next-routes")();

routes
  .add("/campaigns/new", "campaigns/new") // Fix broken mapping
  .add("/campaigns/:address", "campaigns/show") // (route, component)
  .add("/campaigns/:address/requests", "campaigns/requests/index")
  .add("/campaigns/:address/requests/new", "campaigns/requests/new");
module.exports = routes;

//: wildcard/variable url
