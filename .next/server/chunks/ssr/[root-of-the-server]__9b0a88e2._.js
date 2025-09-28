module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/src/store/slices/authSlice.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "clearError": ()=>clearError,
    "default": ()=>__TURBOPACK__default__export__,
    "getUserProfile": ()=>getUserProfile,
    "loginUser": ()=>loginUser,
    "logoutUser": ()=>logoutUser,
    "setToken": ()=>setToken
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
;
// Helper function to safely get localStorage value
const getStoredToken = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return null;
};
const loginUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/loginUser', async (credentials, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('https://middaybox-backend.onrender.com/api/admin/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});
const logoutUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/logoutUser', async (_, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('https://middaybox-backend.onrender.com/api/admin/logout');
        return null;
    } catch (error) {
        return rejectWithValue('Logout failed');
    }
});
const getUserProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('auth/getUserProfile', async (_, { rejectWithValue })=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('https://middaybox-backend.onrender.com/api/admin/profile');
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to get user profile');
    }
});
const initialState = {
    user: null,
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    loading: false,
    error: null
};
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state)=>{
            state.error = null;
        },
        setToken: (state, action)=>{
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    },
    extraReducers: (builder)=>{
        builder// Login
        .addCase(loginUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }).addCase(loginUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }).addCase(loginUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        })// Logout
        .addCase(logoutUser.pending, (state)=>{
            state.loading = true;
        }).addCase(logoutUser.fulfilled, (state)=>{
            state.loading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }).addCase(logoutUser.rejected, (state)=>{
            state.loading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        })// Get User Profile
        .addCase(getUserProfile.pending, (state)=>{
            state.loading = true;
        }).addCase(getUserProfile.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
        }).addCase(getUserProfile.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        });
    }
});
const { clearError, setToken } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
}),
"[project]/src/store/slices/apiSlice.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "clearError": ()=>clearError,
    "clearOrdersError": ()=>clearOrdersError,
    "clearUsersError": ()=>clearUsersError,
    "default": ()=>__TURBOPACK__default__export__,
    "setError": ()=>setError,
    "setLoading": ()=>setLoading,
    "setOrders": ()=>setOrders,
    "setOrdersError": ()=>setOrdersError,
    "setOrdersLoading": ()=>setOrdersLoading,
    "setPrices": ()=>setPrices,
    "setStats": ()=>setStats,
    "setUsers": ()=>setUsers,
    "setUsersError": ()=>setUsersError,
    "setUsersLoading": ()=>setUsersLoading
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
;
const initialState = {
    loading: false,
    error: null,
    stats: {
        orders: 0,
        users: 0,
        schools: 0,
        activeOrders: 0,
        completedOrders: 0,
        todayOrders: 0
    },
    users: {
        parents: [],
        deliveryBoys: [],
        totalParents: 0,
        totalDeliveryBoys: 0,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
            totalItems: 0,
            itemsPerPage: 10,
            showingFrom: 1,
            showingTo: 10
        },
        loading: false,
        error: null
    },
    orders: {
        orders: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalOrders: 0,
            hasNextPage: false,
            hasPrevPage: false,
            itemsPerPage: 10,
            showingFrom: 1,
            showingTo: 10
        },
        loading: false,
        error: null
    },
    prices: []
};
const apiSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'api',
    initialState,
    reducers: {
        setLoading: (state, action)=>{
            state.loading = action.payload;
        },
        setError: (state, action)=>{
            state.error = action.payload;
        },
        clearError: (state)=>{
            state.error = null;
        },
        setStats: (state, action)=>{
            state.stats = {
                ...state.stats,
                ...action.payload
            };
        },
        setUsers: (state, action)=>{
            state.users = {
                ...state.users,
                ...action.payload
            };
        },
        setUsersLoading: (state, action)=>{
            state.users.loading = action.payload;
        },
        setUsersError: (state, action)=>{
            state.users.error = action.payload;
        },
        clearUsersError: (state)=>{
            state.users.error = null;
        },
        setOrders: (state, action)=>{
            state.orders = {
                ...state.orders,
                ...action.payload
            };
        },
        setOrdersLoading: (state, action)=>{
            state.orders.loading = action.payload;
        },
        setOrdersError: (state, action)=>{
            state.orders.error = action.payload;
        },
        clearOrdersError: (state)=>{
            state.orders.error = null;
        },
        setPrices: (state, action)=>{
            state.prices = action.payload;
        }
    }
});
const { setLoading, setError, clearError, setStats, setUsers, setUsersLoading, setUsersError, clearUsersError, setOrders, setOrdersLoading, setOrdersError, clearOrdersError, setPrices } = apiSlice.actions;
const __TURBOPACK__default__export__ = apiSlice.reducer;
}),
"[project]/src/store/store.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "store": ()=>store
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/authSlice.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$apiSlice$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/apiSlice.js [app-ssr] (ecmascript)");
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        auth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        api: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$apiSlice$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST'
                ]
            }
        })
});
}),
"[project]/src/store/Providers.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "Providers": ()=>Providers
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/store.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["store"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
                position: "top-right",
                toastOptions: {
                    duration: 3000,
                    style: {
                        fontSize: '14px'
                    },
                    success: {
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: 'white'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: 'white'
                        }
                    }
                }
            }, void 0, false, {
                fileName: "[project]/src/store/Providers.js",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/store/Providers.js",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__9b0a88e2._.js.map