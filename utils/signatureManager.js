import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { ethers } from "ethers";
import { addresses } from "./addresses";

const SIGNATURE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const COOKIE_NAME_TROVE = "trove_signature";
const COOKIE_NAME_DEBT = "debt_signature";

export class SignatureManager {
  static async getStoredSignature(address) {
    try {
      const storedDataTrove = getCookie(COOKIE_NAME_TROVE);
      const storedDataDebt = getCookie(COOKIE_NAME_DEBT);

      if (!storedDataTrove || !storedDataDebt) return null;

      const dataTrove = JSON.parse(storedDataTrove);
      const dataDebt = JSON.parse(storedDataDebt);

      // Verify address matches
      if (
        dataTrove.address.toLowerCase() !== address.toLowerCase() ||
        dataDebt.address.toLowerCase() !== address.toLowerCase()
      ) {
        return null;
      }

      // Check if signature is expired
      if (
        Date.now() - dataTrove.timestamp > SIGNATURE_EXPIRY ||
        Date.now() - dataDebt.timestamp > SIGNATURE_EXPIRY
      ) {
        return null;
      }

      return { dataTrove, dataDebt };
    } catch (error) {
      console.error("Error getting stored signature:", error);
      return null;
    }
  }

  static async storeSignature(signatureTrove, signatureDebt, address) {
    const signatureDataTrove = {
      ...signatureTrove,
      timestamp: Date.now(),
      address,
    };

    const signatureDataDebt = {
      ...signatureDebt,
      timestamp: Date.now(),
      address,
    };

    // Store in HTTP-only cookie that expires in 24 hours
    setCookie(COOKIE_NAME_TROVE, JSON.stringify(signatureDataTrove), {
      maxAge: SIGNATURE_EXPIRY / 1000, // Convert to seconds
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    setCookie(COOKIE_NAME_DEBT, JSON.stringify(signatureDataDebt), {
      maxAge: SIGNATURE_EXPIRY / 1000, // Convert to seconds
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  }

  static async requestSignature(signTypedDataAsync, account) {
    const user = account.address;
    const time = Math.floor(new Date().getTime() / 1000);
    const signatureTrove = await signTypedDataAsync({
      types: {
        SignIn: [
          { name: "user", type: "address" },
          { name: "time", type: "uint32" },
        ],
      },
      primaryType: "SignIn",
      message: {
        time,
        user,
      },
      domain: {
        name: "BitSignature.SignIn",
        version: "1",
        chainId: account.chainId,
        verifyingContract: addresses.troveManagerGetter[account.chainId],
      },
    });

    const signatureDebt = await signTypedDataAsync({
      types: {
        SignIn: [
          { name: "user", type: "address" },
          { name: "time", type: "uint32" },
        ],
      },
      primaryType: "SignIn",
      message: {
        time,
        user,
      },
      domain: {
        name: "BitSignature.SignIn",
        version: "1",
        chainId: account.chainId,
        verifyingContract: addresses.debtToken[account.chainId],
      },
    });

    const rsvTrove = ethers.utils.splitSignature(signatureTrove);
    const rsvDebt = ethers.utils.splitSignature(signatureDebt);

    const authTrove = { user, time, rsv: rsvTrove };
    const authDebt = { user, time, rsv: rsvDebt };

    return { authTrove, authDebt };
  }
}
