import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SignIn from './components/SignIn/SignIn';
import PersonalInformation from './components/PersonInfo/PersonInfo';
function App() {

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const storedUser = localStorage.getItem('user');
  //   if (token && storedUser) {
  //     const parsedUser = JSON.parse(storedUser);
  //     dispatch(setCurrentUser(parsedUser));
  //     dispatch(fetchCart(parsedUser._id));
  //   }
  //   setIsLoaded(true)
  // }, [dispatch]);

  // useEffect(() => {
  //   if (user) {
  //     dispatch(fetchCart(user._id));
  //   }
  // }, [user, dispatch]);

  return (
    //  isLoaded ? (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/person-info" element={<PersonalInformation />} />
          <Route path="/" element={<SignIn />} />
          {/* <Route path='/email-sent' element={<EmailSent />} /> */}

          {/* <Route element={<ProtectedRoute />}>

          </Route> */}
        </Route>
      </Routes>
    // ) : (
    //   <div>Loading...</div>
    // )
  );
}

export default App;
