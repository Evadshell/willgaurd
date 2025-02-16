"use client";

import { useState, useEffect } from "react";
import {
  useSendTransaction,
  useReadContract,
  ConnectButton,
} from "thirdweb/react";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
} from "thirdweb";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Shield, FileText } from "lucide-react";

// ThirdWeb Configuration
const client = createThirdwebClient({
  clientId: "2bc481f5bc384daebe0b0c185227e1f7",
});

const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x9818d61b9d35B4B250a3377ab79b6fcbb1077ba6",
});

// Pinata Configuration
const pinataConfig = {
  apiKey: "8c537f91861c1d7180b3",
  secret: "e07390cc6ba89fca9cc408858cb9be6f3bc97e9bb3954e1c118c2a1878bab019",
  endpoint: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
};

export default function DigitalWillManager() {
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState({
    beneficiary: "",
    name: "",
    assetHash: "",
    description: "",
    trusted_contact: "",
    assetURI: "",
    tokenId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  interface Will {
    id: number;
    name: string;
    status: string;
  }

  const [willList, setWillList] = useState<Will[]>([]);

  const { mutate: sendTransaction } = useSendTransaction();
  const { data: willDetails } = useReadContract({
    contract,
    method:
      "function getWillDetails(uint256 tokenId) view returns ((address beneficiary, uint256 creationDate, uint256 executionDate, bool isExecuted, string[] assetURIs))",
    params: [BigInt(formData.tokenId)],
  });

  useEffect(() => {
    // Simulating fetching will list from blockchain
    setWillList([
      { id: 1, name: "Primary Assets Will", status: "Active" },
      { id: 2, name: "Digital Currency Will", status: "Pending" },
      { id: 3, name: "Intellectual Property Will", status: "Executed" },
    ]);
  }, []);

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
          "function createWill(address _beneficiary, string _tokenURI, string _assetHash, address _trustedContact) returns (uint256)",
        params: [
          formData.beneficiary,
          formData.assetURI,
          formData.assetHash,
          formData.trusted_contact,
        ],
      });
      sendTransaction(transaction);
      toast.success("Will created successfully!");
    } catch (error) {
      toast.error("Error creating will");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWillActionProof = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function provideProofOfLife(uint256 tokenId)",
      params: [BigInt(formData.tokenId)],
    });
    sendTransaction(transaction);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Digital Will Manager
          </h1>
          <ConnectButton client={client} />
          <p className="text-xl text-gray-600">
            Secure your digital legacy with blockchain technology
          </p>
        </header>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex gap-4 mb-8 border-b">
            {["create", "manage", "overview"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "create" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Create New Digital Will
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiary Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.beneficiary}
                    onChange={(e) =>
                      setFormData({ ...formData, beneficiary: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trusted Contact
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.trusted_contact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trusted_contact: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Will Name
                  </label>
                  <input
                    type="text"
                    placeholder="My Digital Will"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset IPFS URI
                  </label>
                  <input
                    type="text"
                    placeholder="ipfs://..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.assetURI}
                    onChange={(e) =>
                      setFormData({ ...formData, assetURI: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Hash
                </label>
                <textarea
                  placeholder="Enter asset hash..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.assetHash}
                  onChange={(e) =>
                    setFormData({ ...formData, assetHash: e.target.value })
                  }
                />
              </div>
              <button
                onClick={handleCreateWill}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2" /> Create Digital Will
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Manage Existing Will
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Will Token ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter token ID"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tokenId}
                    onChange={(e) =>
                      setFormData({ ...formData, tokenId: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleWillActionProof}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
                >
                  <Shield className="mr-2" /> Provide Proof of Life
                </button>
                {willDetails && (
                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Will Details
                    </h3>
                    <pre className="whitespace-pre-wrap text-sm text-gray-600 overflow-x-auto">
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

          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Your Digital Wills
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {willList.map((will) => (
                      <tr key={will.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {will.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {will.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              will.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : will.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {will.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
