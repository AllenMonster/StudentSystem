const routes = [
  {
    path: "/",
    component: "../layouts/index",
    routes: [{ path: "/", component: "../pages/list" }]
  }
];

export default routes;
