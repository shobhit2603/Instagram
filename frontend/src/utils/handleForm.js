const handleSubmit = (e, cb) => {
  e.preventDefault();
  try {
    let formData = new FormData(e.target);
    let obj = Object.fromEntries(formData);
    cb(obj);
    e.target.reset();
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export default handleSubmit;
