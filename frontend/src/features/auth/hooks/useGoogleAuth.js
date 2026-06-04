const useGoogleAuth = () => {
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/google`;
  };

  return { handleGoogleAuth };
};

export default useGoogleAuth;
