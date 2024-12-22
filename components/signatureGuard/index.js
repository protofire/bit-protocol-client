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
            that provides intelligent privacy features.
            <br />
            Access to your individual data is secured through your personal
            signature. To streamline the process and enhance your experience,
            you are required to sign in using EIP-712 once per day.
            <br />
            We require two signatures from you: one to access your bitUSD
            balance and another for your Trove data. Please confirm these
            requests in your wallet's pop-up windows.
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
