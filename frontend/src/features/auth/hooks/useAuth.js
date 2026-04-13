import { register, login, getMe, logout } from "../service/auth.api";
import { setUser, setAuthChecked } from "../auth.slice";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, fullname, password }) {
    const data = await register({
      username,
      email,
      fullname,
      password,
    });
    dispatch(setUser(data.user));
    return data;
  }

  async function handleLogin({ usernameOrEmail, password }) {
    const data = await login({ usernameOrEmail, password });
    dispatch(setUser(data.user));
    return data;
  }

  async function handleGetMe() {
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setAuthChecked(true));
    }
  }

  async function handleLogout() {
    await logout();
    dispatch(setUser(null));
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};