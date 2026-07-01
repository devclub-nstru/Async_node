import api from "@/lib/api"

export default async function refreshToken() {
  try {
    const res = await api.post("/v1/auth/token/refresh");
    console.log(res.data.status)
    return res.data.status;
  } catch (err) {
    console.log(err);
    return null;
  }
}