import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./components/Home";
import Login from "./components/authentication/Login";
import Registration from "./components/authentication/Registration";
import Profile from "./components/profile/Profile";
import RootLayout from "./layouts/RootLayout";
import PrivateRoute from "./components/authentication/PrivateRoute";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import EmailVerify from "./components/authentication/EmailVerify";
import DeleteAccount from "./components/profile/DeleteAccount";
import ResetPassword from "./components/pwd-recovery/ResetPassword";
import ForgotPassword from "./components/pwd-recovery/ForgotPassword";
import AddProduct from "./components/products/AddProduct";
import ShowProducts from "./components/products/ShowProducts";
import { CategoriesProvider } from "./context/CategoriesContext";
import LineChart from "./components/products/LineChart";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/add-expenses"
          element={
            <CategoriesProvider>
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            </CategoriesProvider>
          }
        />
        <Route
          path="/profile/expenses"
          element={
            <CategoriesProvider>
              <PrivateRoute>
                <ShowProducts />
              </PrivateRoute>
            </CategoriesProvider>
          }
        />
        <Route
          path="/profile/expenses/graph"
          element={
            <CategoriesProvider>
              <PrivateRoute>
                <LineChart />
              </PrivateRoute>
            </CategoriesProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/verify/:id/:verifyTkn" element={<EmailVerify />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
