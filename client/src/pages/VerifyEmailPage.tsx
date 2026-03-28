import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/http";

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    api
      .get(`/auth/verify-email?token=${token}`)
      .then(({ data }) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed.");
      });
  }, [searchParams]);

  return (
    <section className="editorial-shell mx-auto max-w-3xl p-10">
      <div className="text-xs uppercase tracking-[0.34em] text-[var(--accent-deep)]">Email Verification</div>
      <h1 className="mt-3 font-serif text-5xl">
        {status === "loading" ? "Checking your link" : status === "success" ? "Verified" : "Verification failed"}
      </h1>
      <p className="mt-6 text-base leading-7 text-[var(--text-soft)]">{message}</p>
      <Link
        to="/login"
        className="accent-button mt-8 inline-flex rounded-full px-6 py-3 text-sm font-medium"
      >
        Go to login
      </Link>
    </section>
  );
};
