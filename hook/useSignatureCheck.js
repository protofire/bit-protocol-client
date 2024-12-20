"use client";

import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { SignatureManager } from "../utils/signatureManager";

export function useSignatureCheck() {
  const account = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [needsSignature, setNeedsSignature] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkSignature() {
      if (!account.address) {
        setIsChecking(false);
        return;
      }

      try {
        const { dataTrove, dataDebt } =
          await SignatureManager.getStoredSignature(account.address);

        setNeedsSignature(!dataTrove || !dataDebt);
      } catch (error) {
        console.error("Error checking signature:", error);
        setNeedsSignature(true);
      } finally {
        setIsChecking(false);
      }
    }

    checkSignature();
  }, [account.address]);

  const getSignatures = () => {
    return SignatureManager.getStoredSignature(account.address);
  };

  const requestNewSignature = async () => {
    if (!account.address) return;

    try {
      const { authTrove, authDebt } = await SignatureManager.requestSignature(
        signTypedDataAsync,
        account
      );

      await SignatureManager.storeSignature(
        authTrove,
        authDebt,
        account.address
      );
      setNeedsSignature(false);
    } catch (error) {
      console.error("Error requesting signature:", error);
      throw error;
    }
  };

  return { needsSignature, isChecking, requestNewSignature, getSignatures };
}
