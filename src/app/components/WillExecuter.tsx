"use client";
import { useState } from "react";
import {
  useSendTransaction,
  useReadContract,
  useContractEvents,
} from "thirdweb/react";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
  prepareEvent,
} from "thirdweb";
import axios from "axios";
import { toast } from "react-hot-toast";const client = createThirdwebClient({
  clientId: "2bc481f5bc384daebe0b0c185227e1f7",
});
const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0xA58C6f72c2C171a99688A27917bF501a0810de8d",
});
const WillExecuter = () => {
    const { data: owner } = useReadContract({
        contract,
        method: "function owner() view returns (address)",
        params: [],
      });
      console.log(owner);
      const { data:tokens } = useReadContract({
        contract,
        method:
          "function tokensOfOwnerIn(address owner, uint256 start, uint256 stop) view returns (uint256[])",
        params: [owner || "", BigInt(0), BigInt(9)],
      });
  return (
    <div>
      
    </div>
  )
}

export default WillExecuter
