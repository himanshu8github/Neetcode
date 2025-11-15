import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';
import toast from 'react-hot-toast';

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Login Failed',
        status: error.response?.status,
      });
    }
  }
);

// Check auth (public then protected)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/user/check-public');
      return response.data.user;
    } catch {
      try {
        const response = await axiosClient.get('/user/check');
        return response.data.user;
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Not authenticated',
          status: error.response?.status,
        });
      }
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');

      sessionStorage.removeItem('loginToastShown');
      sessionStorage.removeItem('signupToastShown');

      toast.success('Logged out successfully! ', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid #0ea5e9',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '600',
        },
      });
      return null;
    } catch (error) {
      toast.error('Logout failed. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid #ef4444',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '600',
        },
      });
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Logout failed',
        status: error.response?.status,
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
     loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || null;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;



// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axiosClient from './utils/axiosClient'
// import toast from 'react-hot-toast';

// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       console.log('Sending data:', userData);
//     const response =  await axiosClient.post('/user/register', userData);
//     return response.data.user;
//     } catch (error) {
//        console.log('Error response:', error.response?.data);
//       return rejectWithValue({
//      message: error.response?.data?.message || error.message,
//      status: error.response?.status
//    });
//     }
//   }
// );


// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
    
//       const response = await axiosClient.post('/user/login', credentials);
      
//       return response.data.user;
//     } catch (error) {

//         console.log("LOGIN ERROR:", error.response ? error.response.data : error.message);  // <-- ADD THIS LINE
//    return rejectWithValue(error.response?.data || "Login Failed")

//     }
//   }
// );

// // export const checkAuth = createAsyncThunk(
// //   'auth/check',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const { data } = await axiosClient.get('/user/check');
// //       return data.user;
// //     } catch (error) {
// //       if (error.response?.status === 401) {
// //         return rejectWithValue(null); // Special case for no session
// //       }
// //       return rejectWithValue(error);
// //     }
// //   }
// // );


// // Around checkAuth function:

// export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
//   try {
//     const response = await axiosClient.get('/user/check-public');
//     return response.data.user;
//   } catch (error) {
//     // If public check fails, try the protected one
//     try {
//       const response = await axiosClient.get('/user/check');
//       return response.data.user;
//     } catch (err) {
//       throw new Error('Not authenticated');
//     }
//   }
// });
// export const logoutUser = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await axiosClient.post('/user/logout');

//      sessionStorage.removeItem('loginToastShown');
//       sessionStorage.removeItem('signupToastShown');

//        toast.success('Logged out successfully! ', {
//         duration: 3000,
//         position: 'top-center',
//         style: {
//           background: '#0f172a',
//           color: '#fff',
//           border: '1px solid #0ea5e9',
//           padding: '16px 24px',
//           fontSize: '16px',
//           fontWeight: '600',
//         },
//       });
//       return null;
//     } catch (error) {
//          toast.error('Logout failed. Please try again.', {
//         duration: 3000,
//         position: 'top-center',
//         style: {
//           background: '#0f172a',
//           color: '#fff',
//           border: '1px solid #ef4444',
//           padding: '16px 24px',
//           fontSize: '16px',
//           fontWeight: '600',
//         },
//       });

//       return rejectWithValue(error);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null
//   },
//   reducers: {
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register User Cases
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = !!action.payload;
//         state.user = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       })
  
//       // Login User Cases
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = !!action.payload;
//         state.user = action.payload;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       })
  
//       // Check Auth Cases
//       .addCase(checkAuth.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = !!action.payload;
//         state.user = action.payload;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       })
  
//       // Logout User Cases
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//         state.error = null;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Something went wrong';
//         state.isAuthenticated = false;
//         state.user = null;
//       });
//   }
// });

// export default authSlice.reducer;