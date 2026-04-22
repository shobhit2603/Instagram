const useGoogleAuth = () => {
  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  return { handleGoogleAuth };
};

export default useGoogleAuth;
