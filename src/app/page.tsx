"use client";

import Image from "next/image";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import WillManager from "./components/WillManager";

export default function Home() {
  const account = useActiveAccount(); // Get active account information

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
          />
        </div>

        {/* Conditionally render the account address */}
        {account?.address && (
          <>
            <div className="flex justify-center">
              <p>Connected Account: {account.address}</p>
            </div>
            <WillManager />
          </>
        )}
      </div>
    </main>
  );
}
