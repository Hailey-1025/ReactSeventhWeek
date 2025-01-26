import { useEffect, useState } from "react";
import axios from "axios";

const { VITE_BASE_URL } = import.meta.env;

function LoginPage({ setIsAuth }) {
  // 確認是否登入
  // const checkLogin = async () => {
  //   await axios.post(`${VITE_BASE_URL}/v2/api/user/check`);
  //   try {
  //     getProducts();
  //     setIsAuth(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   const token = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)haileyToken\s*\=\s*([^;]*).*$)|^.*$/,
  //     "$1"
  //   );
  //   axios.defaults.headers.common["Authorization"] = token;
  //   checkLogin();
  // }, []);

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  // 組登入資料
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  // 登入 & 取得資料
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${VITE_BASE_URL}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `haileyToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;
      // getProducts();
      setIsAuth(true);
    } catch (error) {
      alert("登入失敗，請重新輸入帳號密碼");
      console.log(error.message);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-4">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column g-3">
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            value={account.username}
            onChange={handleInputChange}
            name="username"
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={account.password}
            onChange={handleInputChange}
            name="password"
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary mt-3 mb-4">登入</button>
      </form>
      <p className="mb-3 text-muted">2024~∞ - 六角學院</p>
    </div>
  );
}

export default LoginPage;
