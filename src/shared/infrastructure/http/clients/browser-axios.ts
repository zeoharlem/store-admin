
import axios from 'axios'

import { normalizeAxiosError } from '../interceptors/error.interceptor'

export const browserAxios = axios.create(
    {
        baseURL: '',
        timeout: 20_000,
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
)

browserAxios.interceptors.response.use(
    response => response,
    error => Promise.reject(normalizeAxiosError(error))
)
