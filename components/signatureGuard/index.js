import styles from "../header/index.module.scss";
import { useRouter } from "next/router";
import { useSignatureCheck } from "../../hook/useSignatureCheck";

const PROTECTED_ROUTES = ["/Vault", "/Redeem", "/Earn", "/Vote", "/Lock"];

export function SignatureGuard({ children }) {
  const router = useRouter();
  const { needsSignature, isChecking, requestNewSignature } =
    useSignatureCheck();

  const isProtectedRoute = PROTECTED_ROUTES.includes(router.pathname);

  // If it's not a protected route, just render children
  if (!isProtectedRoute) {
    return <>{children}</>;
  }

  if (isChecking) {
    return <div>Checking signature...</div>;
  }

  if (needsSignature) {
    return (
      <div className="promptSign">
        <div className="firstBox">
          <div className="infoBox">
            Bit Protocol is the first and only encrypted DeFi protocol for Web3
            that provides intelligent privacy features. Only your personal
            signature grants access to individual data. To streamline the
            signing process and enhance user experience, you are required to use
            EIP-712 to "sign in" once per day.
          </div>
          <div className="button" onClick={requestNewSignature}>
            Sign in
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
