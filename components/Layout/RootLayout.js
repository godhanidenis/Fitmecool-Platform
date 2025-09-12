import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserTypeProvider } from "../../contexts/usertypecontext";
import AuthCommonLayout from "./AuthCommonLayout";
import CustomerCommonLayout from "./CustomerCommonLayout";
import Footer from "./Footer";
import Header from "./Header";
import VendorCommonLayout from "./VendorCommonLayout";
import { useDispatch } from "react-redux";
import { loadUserProfileStart } from "../../redux/ducks/userProfile";

const RootLayout = ({ children }) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === null) {
        router.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, router]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    dispatch(loadUserProfileStart());
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <UserTypeProvider>
        {!router.pathname.includes("/auth/") && <Header />}
        <div>
          {router.pathname.includes("/vendor/") &&
          router.pathname !== "/vendor/shop-setup" ? (
            <VendorCommonLayout>{children}</VendorCommonLayout>
          ) : router.pathname === "/auth/signup" ||
            router.pathname === "/auth/signin" ? (
            <AuthCommonLayout>{children}</AuthCommonLayout>
          ) : (
            <CustomerCommonLayout>{children}</CustomerCommonLayout>
          )}
        </div>
        {!router.pathname.includes("/auth/") &&
          !router.pathname.includes("/vendor/") && <Footer />}
      </UserTypeProvider>
    </>
  );
};

export default RootLayout;
