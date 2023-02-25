import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import NavBar from "./NavBar";
import React from "react";
import Login from "./Login";
import Dashboard from "./Authorized/Dashboard";
import SideBarNavigation from "./Authorized/SideBarNavigation";
import Products from "./Authorized/Products";
import AddProducts from "./Authorized/Products/AddProducts";
import BillForm from "./Authorized/Billing/Billing";

const routes = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/login",
    component: Login,
    exact: true,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "/products",
    component: Products,
    exact: true,
  },
  {
    path: "/products/add",
    component: AddProducts,
    exact: true,
  },
  {
    path: "/billing",
    component: BillForm,
    exact: true,
  },
];

function AppRoutes() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className={`${token && "flex"}`}>
        {!token ? (
          <NavBar />
        ) : (
          <div className="sm:min-h-screen sm:flex sm:w-64 flex-col">
            <SideBarNavigation />
          </div>
        )}
        <div className="w-full">
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route?.exact}
                component={route.component}
              />
            ))}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default AppRoutes;
