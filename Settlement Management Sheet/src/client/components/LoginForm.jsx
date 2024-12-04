import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div>
      <form>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Login</button>
      </form>
      <p>
        Don&apos;t have an account? <Link to="/register">Register Here!</Link>
      </p>
    </div>
  );
};

export default LoginForm;
