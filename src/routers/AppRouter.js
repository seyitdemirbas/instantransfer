import {BrowserRouter,Routes,Route} from "react-router-dom"
import HomePage from "../components/HomePage"
import MainPage from "../components/Main"
import About from "../components/About"
import RecentFiles from "../components/RecentFiles"
import FilePage from "../components/FilePage"
import Register from "../components/Register"
import Login from "../components/Login"
import PrivateRoutes from "../components/PrivateRoutes"
import PublicRoutes from "../components/PublicRoutes"
import Settings from "../components/Settings"
import ForgotPassword from "../components/ForgotPassword"
import ContactUs from "../components/ContactUs"
import NotFound from "../components/NotFound"



const AppRouter = () => {
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<MainPage/>}>
              <Route path="*" element={<NotFound title='404'/>} />
                  <Route path="/" element={<HomePage/>}></Route>
                  <Route path=":RouterName" element={<FilePage/>}></Route>
                  <Route path="static/about" element={<About/>}></Route>
                  <Route path="static/recentfiles" element={<RecentFiles/>}></Route>
                  <Route path="static/contact" element={<ContactUs/>}></Route>
                  <Route element={<PrivateRoutes />}>
                    <Route path="static/settings" element={<Settings/>}></Route>
                  </Route>
                  <Route element={<PublicRoutes />}>
                    <Route path="static/register" element={<Register/>}></Route>
                    <Route path="static/login" element={<Login/>}></Route>
                    <Route path="static/forgotpassword" element={<ForgotPassword/>}></Route>
                  </Route>
              </Route>
          </Routes>
      </BrowserRouter>
    )
  }
  
  export default AppRouter