import { GlobalApiResponse } from "@/app/utils/globalsApiResponse";
import axios from "axios";
import { NextRequest } from "next/server"

export type Role = 'USER' | 'ADMIN' | 'SUPERADMIN'

export const useAuth = async (req: NextRequest) => {
  const accessToken = req.cookies.get('access-token')?.value || ''

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  if (!accessToken) {
    return {
      authenticated: false,
      email: null,
      role: null
    }
  }

  try {
    const checkAuth: {
      data: GlobalApiResponse<{
        email: string,
        role: Role
      }>
    } = await axios.post(`${API_URL}/auth/check-auth`, {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if (checkAuth.data.data && checkAuth.data.success) {
      return {
        authenticated: true,
        email: checkAuth.data.data.email,
        role: checkAuth.data.data.role
      }
    }
  } catch (error) {
    return {
      authenticated: false,
      email: null,
      role: null
    }
  }
  return {
    authenticated: false,
    email: null,
    role: null
  }

}