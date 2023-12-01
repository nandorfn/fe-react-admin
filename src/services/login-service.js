import axios from "axios";
import Cookies from "js-cookie";
import { validateFormLogin } from "../utils/validation";
import { handleLoginError } from "../utils/response-handler";

export const handleLogin = async (formData, setErrors, setFormData, setLoading) => {
  const url = import.meta.env.VITE_BASEURL;
  if (validateFormLogin(formData, setErrors)) {
    try {
      const res = await axios.post(`${url}/admins/login`, formData);
      if (res.status === 200) {
        const { token } = res.data.results;
        Cookies.set('token', token);
        window.location.href = '/';
      }
    } catch (error) {
      handleLoginError(error, setErrors);
    } finally {
      setLoading(false);
      setFormData({
        email: '',
        password: '',
      })
    }
  }
}