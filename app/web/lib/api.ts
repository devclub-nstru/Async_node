import axios from "axios"
import { config } from "@/config/config"

const api = axios.create({
  baseURL: config.backend_URI,
  withCredentials: true,
})

export default api
