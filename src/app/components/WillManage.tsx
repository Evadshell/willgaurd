"use client"
import { useState } from 'react';
import { prepareContractCall,readContract } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';
import { createThirdwebClient, getContract, defineChain } from 'thirdweb';
import axios from 'axios';

const pinataApiKey = '8c537f91861c1d7180b3';
const pinataSecretApiKey = 'e07390cc6ba89fca9cc408858cb9be6f3bc97e9bb3954e1c118c2a1878bab019';
const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

const uploadMetadataToIPFS = async (metadata) => {
  try {
    const response = await axios.post(
      pinataEndpoint,
      metadata,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw new Error('Error uploading metadata to IPFS');
  }
};

export default function WillManager() {
    const { mutate: sendTransaction } = useSendTransaction();
    const client = createThirdwebClient({
        clientId: '2bc481f5bc384daebe0b0c185227e1f7',
    });
    
    
  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: '0xA58C6f72c2C171a99688A27917bF501a0810de8d',
  });

  const [tokenURI, setTokenURI] = useState('');
  const [assetURIs, setAssetURIs] = useState(['']);
  const [beneficiary, setBeneficiary] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onClickExecute = (tokenId) => {
    const transaction = prepareContractCall({
      contract,
      method: 'function executeWill(uint256 tokenId)',
      params: async () => [BigInt(tokenId)] as const,
    });
    sendTransaction(transaction);
  };

  const onClickCreateWill = async () => {
    try {
      // Create metadata for the token
      const metadata = createMetadata(name, description, assetURIs[0]);

      // Upload metadata to IPFS
      const ipfsHash = await uploadMetadataToIPFS(metadata);
      const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;

      // Create the will
      const transaction = prepareContractCall({
        contract,
        method: 'function createWill(address _beneficiary, string _tokenURI, string[] _assetURIs) returns (uint256)',
        params: [beneficiary, tokenURI, assetURIs],
      });

      sendTransaction(transaction);
    } catch (error) {
      console.error('Error creating will:', error);
    }
  };

  return (
    <>
      <h1>Create a Will</h1>
      <input
        type="text"
        placeholder="Beneficiary Address"
        value={beneficiary}
        onChange={(e) => setBeneficiary(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Asset URI"
        value={assetURIs[0]}
        onChange={(e) => setAssetURIs([e.target.value])}
      />
      <button onClick={onClickCreateWill}>Create Will</button>

      {/* Replace this with a dynamic tokenId when necessary */}
      <button onClick={() => onClickExecute(0)}>Execute Will (Token ID: 0)</button>
    </>
  );
}

const createMetadata = (name, description, imageUrl) => {
  return {
    name: name,
    description: description,
    image: imageUrl,  // Image URL or IPFS URL of the image
    attributes: [
      {
        trait_type: 'Category',
        value: 'Digital Art',
      },
    ],
  };
};
