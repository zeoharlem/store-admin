
import 'server-only'

import axios from 'axios'

import { normalizeAxiosError } from '../interceptors/error.interceptor'

const vendorApiUrl = process.env.VENDOR_API_BASE_URL

if (!vendorApiUrl) {
    throw new Error('VENDOR_API_BASE_URL is not configured.')
}

export const serverAxios = axios.create(
    {
        baseURL: `${vendorApiUrl.replace(/\/+$/, '')}/vendors-api/api/v1`,
        timeout: 20_000,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
)

serverAxios.interceptors.response.use(
    response => response,
    error => Promise.reject(normalizeAxiosError(error))
)
