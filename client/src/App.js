import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Login from "./components/authentication/Login";
import Registration from "./components/authentication/Registration";
import Profile from "./components/profie/Profile";
import RootLayout from "./layouts/RootLayout";
import PrivateRoute from "./components/authentication/PrivateRoute";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import EmailVerify from "./components/authentication/EmailVerify";
import DeleteAccount from "./components/profie/DeleteAccount";
import ResetPassword from "./components/pwd-recovery/ResetPassword";
import ForgotPassword from "./components/pwd-recovery/ForgotPassword";
import AddExpenses from "./components/profie/AddExpenses";

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
            <PrivateRoute>
              <AddExpenses />
            </PrivateRoute>
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
