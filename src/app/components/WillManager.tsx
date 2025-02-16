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

// 2. Pinata Configuration
const pinataConfig = {
  apiKey: "8c537f91861c1d7180b3",
  secret: "e07390cc6ba89fca9cc408858cb9be6f3bc97e9bb3954e1c118c2a1878bab019",
  endpoint: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
};

export default function WillManager() {
  const { data: owner, isPending } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });
  //   console.log(owner);
  // 3. State Management
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState({
    beneficiary: "",
    name: "",
    description: "",
    assetURI: "",
    tokenId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // 4. Web3 Hooks
  const { mutate: sendTransaction } = useSendTransaction();
  const { data: willDetails } = useReadContract({
    contract,
    method:
      "function getWillDetails(uint256 tokenId) view returns ((address beneficiary, uint256 creationDate, uint256 executionDate, bool isExecuted, string[] assetURIs))",
    params: [BigInt(formData.tokenId)],
  });

  // 5. IPFS Upload Handler
  const uploadMetadata = async (metadata: any) => {
    try {
      const response = await axios.post(pinataConfig.endpoint, metadata, {
        headers: {
          pinata_api_key: pinataConfig.apiKey,
          pinata_secret_api_key: pinataConfig.secret,
        },
      });
      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      toast.error("IPFS upload failed");
      throw error;
    }
  };

  // 6. Create Will Handler
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
        method:
          "function createWill(address _beneficiary, string _tokenURI, string[] _assetURIs) returns (uint256)",
        params: [formData.beneficiary, tokenURI, [formData.assetURI]],
      });

      await sendTransaction(transaction);
      toast.success("Will created successfully!");
    } catch (error) {
      toast.error("Error creating will");
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Will Actions
  //   const handleWillActionExecute = () => {
  //     const transaction = prepareContractCall({
  //       contract,
  //       method: "function executeWill(uint256 tokenId)",
  //       params: [BigInt(formData.tokenId)],
  //     });
  //     sendTransaction(transaction);
  //   };
  const handleWillActionUpdate = () => {
    const transaction = prepareContractCall({
      contract,
      method:
        "function updateBeneficiary(uint256 tokenId, address newBeneficiary)",
      params: [BigInt(formData.tokenId), formData.beneficiary],
    });
    sendTransaction(transaction);
  };
  const handleWillActionProof = () => {
    console.log(formData);
    const transaction = prepareContractCall({
      contract,
      method: "function provideProofOfLife(uint256 tokenId)",
      params: [BigInt(formData.tokenId)],
    });
    sendTransaction(transaction);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🧾 Digital Will Manager
        </h1>

        {/* Navigation */}
        <div className="flex gap-4 mb-8 justify-center">
          {["create", "manage"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Create Will Section */}
        {activeTab === "create" && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Will</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Beneficiary Address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.beneficiary}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiary: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Will Name"
                className="w-full p-3 border rounded-lg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <textarea
                placeholder="Will Description"
                className="w-full p-3 border rounded-lg"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Asset IPFS URI"
                className="w-full p-3 border rounded-lg"
                value={formData.assetURI}
                onChange={(e) =>
                  setFormData({ ...formData, assetURI: e.target.value })
                }
              />
              <button
                onClick={handleCreateWill}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? "Creating..." : "Create Digital Will"}
              </button>
            </div>
          </div>
        )}

        {/* Manage Will Section */}
        {activeTab === "manage" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              Manage Existing Will
            </h2>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Will Token ID"
                className="w-full p-3 border rounded-lg"
                value={formData.tokenId}
                onChange={(e) =>
                  setFormData({ ...formData, tokenId: e.target.value })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <button
                  onClick={() => handleWillActionProof()}
                  className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ❤️ Proof of Life
                </button>
              </div>

              {willDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Will Details</h3>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(
                      willDetails,
                      (_, v) => (typeof v === "bigint" ? v.toString() : v),
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event Logs */}
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Event History</h2>
          <div className="h-64 overflow-y-auto space-y-2">
            {/* Event logs would be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
}
