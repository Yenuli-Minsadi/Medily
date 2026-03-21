  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

   const handleLogout = () => { localStorage.removeItem("user"); localStorage.removeItem("rememberMe"); navigate("/login"); };
   const handleMenuClick = (id: MenuItem) => setActiveMenu(id);
   const handleGoToPrescriptions = (patientId: string, patientName: string) => {
    setRxPrefill({ patientId, patientName });
    setActiveMenu("prescriptions");
  };

    localStorage.setItem("user", JSON.stringify(userData));
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      navigate("/doctordashboard");
    } else if (
      email === PATIENT_CREDENTIALS.email &&
      password === PATIENT_CREDENTIALS.password
    ) {
      const userData = {
        email: PATIENT_CREDENTIALS.email,
        role: PATIENT_CREDENTIALS.role,
        name: PATIENT_CREDENTIALS.name,
        isAuthenticated: true,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      navigate("/patientdashboard");
    } else if (
      email === PHARMACIST_CREDENTIALS.email &&
      password === PHARMACIST_CREDENTIALS.password
    ) {
      const userData = {
        email: PHARMACIST_CREDENTIALS.email,
        role: PHARMACIST_CREDENTIALS.role,
        name: PHARMACIST_CREDENTIALS.name,
        isAuthenticated: true,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      navigate("/pharmacydashboard");
    } else {
      setError("Invalid email or password. Use the demo credentials below.");
      setIsLoading(false);
    }