import {Routes, Route ,Navigate} from "react-router";
import AuthPage from './pages/AuthPage'
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminUpdate from "./components/AdminUpdate";
import AdminDelete from "./components/AdminDelete"


function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);
 

useEffect(() => {
  dispatch(checkAuth());
}, [dispatch]);

  
 if (loading) {
  return <div className="min-h-screen flex items-center justify-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>;
}


  return(
  <>
    <Routes>
     <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/auth" />}></Route>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
    </Routes>
  </>
  )
}

export default App;