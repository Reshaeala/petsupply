import axios from 'axios'; import { auth } from '@/lib/firebase'
const base=import.meta.env.VITE_API_BASE||'/api'
export const http=axios.create({baseURL: base, timeout:15000})
http.interceptors.request.use(async c=>{const u=auth.currentUser;const t=u?await u.getIdToken():null;if(t)(c.headers||={}).Authorization=`Bearer ${t}`;return c})