"use client";
import { useState, useEffect } from "react";
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
} from "thirdweb";
import axios from "axios";
import { toast } from "react-hot-toast";

// 1. ThirdWeb Configuration
const client = createThirdwebClient({
  clientId: "2bc481f5bc384daebe0b0c185227e1f7",
});
const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x8E0D32fBde92A4F40060153DA471Ea3b3b2EBCDb",
});

// 2. Constants
const PROOF_OF_LIFE_INTERVAL = 20000; // 20 seconds
const CONTEST_PERIOD = 10000; // 10 seconds

export default function WillManager() {
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState({
    beneficiary: "",
    name: "",
    description: "",
    assetURI: "",
    tokenId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastProofTimestamp, setLastProofTimestamp] = useState<number | null>(null);
  
  const { mutate: sendTransaction } = useSendTransaction();

  const { data: willDetails } = useReadContract({
    contract,
    method:
      "function getWillDetails(uint256 tokenId) view returns ((address beneficiary, uint256 creationDate, uint256 executionDate, bool isExecuted, string assetHash))",
    params: [BigInt(formData.tokenId)],
  });

  const { data: response } = useReadContract({
    contract,
    method:
      "function getWillDetails(uint256 tokenId) view returns ((address beneficiary, uint256 creationDate, uint256 executionDate, bool isExecuted, string assetHash))",
    params: [BigInt(formData.tokenId)],
  });
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (response) {
          setLastProofTimestamp(Number(response.creationDate) * 1000);
        }
      } catch (error) {
        console.error("Error fetching will details:", error);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [formData.tokenId]);

  // Auto-Execute Will if Proof of Life Expires
  useEffect(() => {
    if (!lastProofTimestamp) return;
    const now = Date.now();
    if (now - lastProofTimestamp > PROOF_OF_LIFE_INTERVAL) {
      handleExecuteWill();
    }
  }, [lastProofTimestamp]);

  // Upload Metadata to IPFS
  const uploadMetadata = async (metadata) => {
    try {
      const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
        headers: {
          pinata_api_key: "8c537f91861c1d7180b3",
          pinata_secret_api_key: "e07390cc6ba89fca9cc408858cb9be6f3bc97e9bb3954e1c118c2a1878bab019",
        },
      });
      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      toast.error("IPFS upload failed");
      throw error;
    }
  };

  // Create Will
  const handleCreateWill = async () => {
    setIsLoading(true);
    try {
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: formData.assetURI,
        attributes: [{ trait_type: "Category", value: "Digital Will" }],
      };
      const tokenURI = await uploadMetadata(metadata);

      const transaction = prepareContractCall({
        contract,
        method: "function createWill(address _beneficiary, string _tokenURI, string _assetHash, address _trustedContact) returns (uint256)",
        params: [formData.beneficiary, tokenURI, formData.assetURI, "0x0000000000000000000000000000000000000000"],
      });

      await sendTransaction(transaction);
      toast.success("Will created successfully!");
    } catch (error) {
      toast.error("Error creating will");
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Will (Triggered if inactive)
  const handleExecuteWill = async () => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: "function executeWill(uint256 tokenId)",
        params: [BigInt(formData.tokenId)],
      });
      await sendTransaction(transaction);
      toast.success("Will executed!");
    } catch (error) {
      toast.error("Error executing will");
    }
  };

  // Provide Proof of Life
  const handleProofOfLife = async () => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: "function provideProofOfLife(uint256 tokenId)",
        params: [BigInt(formData.tokenId)],
      });
      await sendTransaction(transaction);
      setLastProofTimestamp(Date.now());
      toast.success("Proof of Life updated!");
    } catch (error) {
      toast.error("Error updating Proof of Life");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">🧾 Digital Will Manager</h1>
        <div className="flex gap-4 mb-8 justify-center">
          {["create", "manage"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "create" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Create New Will</h2>
            <input type="text" placeholder="Beneficiary Address" value={formData.beneficiary} onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })} />
            <button onClick={handleCreateWill} disabled={isLoading}>Create Digital Will</button>
          </div>
        )}
      </div>
    </div>
  );
}
