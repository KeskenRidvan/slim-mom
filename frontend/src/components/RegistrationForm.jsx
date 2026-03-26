import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const schema = yup
  .object({
    name: yup.string().required("Isim alani zorunludur").min(3, "Isim en az 3 karakter olmali"),
    email: yup.string().email("Gecerli bir e-posta giriniz").required("E-posta zorunludur"),
    password: yup.string().required("Sifre zorunludur").min(6, "Sifre en az 6 karakter olmali"),
  })
  .required();

export function RegistrationForm() {
  const { register: registerAction } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await registerAction(data);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Kayit islemi basarisiz.");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          autoComplete="name"
          className="auth-input"
          {...register("name")}
          placeholder="Name *"
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <input
          type="email"
          autoComplete="email"
          className="auth-input"
          {...register("email")}
          placeholder="Email *"
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <input
          type="password"
          autoComplete="new-password"
          className="auth-input"
          {...register("password")}
          placeholder="Password *"
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      <div className="button-group">
        <button type="submit" className="btn-orange-solid">
          Register
        </button>
        <button
          type="button"
          className="btn-orange-outline"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </div>
    </form>
  );
}
