'use client';

import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { useState } from 'react';

const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
const WALLET_SECRET = process.env.NEXT_PUBLIC_WALLET_SECRET;
const WALLET_ADDRESS = process.env.NEXT_PUBLIC_WALLET_ADDRESS;

function EASAttest() {
  const [eventId, setEventId] = useState();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState();
  const [userAddr, setUserAddr] = useState('');
  const [userId, setUserId] = useState();
  const [submitUID, setSubmitUID] = useState('');
  const [loading, setLoading] = useState(false);

  const submitAttestation = async () => {
    setSubmitUID('');
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    console.log(WALLET_SECRET);

    const wallet = new ethers.Wallet(WALLET_SECRET);
    console.log('aaa');
    const connectedWallet = wallet.connect(provider);

    const eas = new EAS(EASContractAddress);
    eas.connect(connectedWallet);

    const schemaEncoder = new SchemaEncoder(
      'uint256 eventId, string name, string location, uint256 date, address userAddr, uint256 userId',
    );
    const encodedData = schemaEncoder.encodeData([
      { name: 'eventId', value: eventId, type: 'uint256' },
      { name: 'name', value: name, type: 'string' },
      { name: 'location', value: location, type: 'string' },
      { name: 'date', value: date, type: 'uint256' },
      { name: 'userAddr', value: userAddr, type: 'address' },
      { name: 'userId', value: userId, type: 'uint256' },
    ]);
    
    const schemaUID = '0x9c36743493dcb4de49932a078cde4f2bc52ee9289064cd2e4a8c390f3737051e';

    const delegated = await eas.getDelegated();

    const params = {
      schema: schemaUID,
      recipient: userAddr,
      expirationTime: 0,
      revocable: true,
      refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: encodedData,
      value: 0,
      nonce: await eas.getNonce(WALLET_ADDRESS),
      deadline: 0,
    };

    const result = await delegated.signDelegatedAttestation(params, wallet);

    console.log(result);

    const tx = await eas.attestByDelegation({
      schema: schemaUID,
      data: {
        recipient: userAddr,
        expirationTime: 0,
        revocable: true,
        data: encodedData,
      },
      attester: WALLET_ADDRESS,
      signature: result.signature,
    });

    setLoading(true);

    const newAttestationUID = await tx.wait();

    setLoading(false);

    setSubmitUID(newAttestationUID);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        className="w-72 p-2 mt-12 text-black rounded-md"
        type="text"
        placeholder="Enter eventId..."
        value={eventId}
        onChange={e => setEventId(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="text"
        placeholder="Enter Name..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="text"
        placeholder="Enter location..."
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="text"
        placeholder="Enter date..."
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="text"
        placeholder="Enter userAddr..."
        value={userAddr}
        onChange={e => setUserAddr(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="text"
        placeholder="Enter userId..."
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <button
        onClick={submitAttestation}
        className="w-72 p-2 mt-4 text-black rounded-md bg-slate-400"
      >
        Submit Attestation
      </button>
      {loading && <p className="mt-4">Loading...</p>}
      {submitUID && <div className="mt-4">New Attestation Subbmited with UID: {submitUID}</div>}
    </div>
  );
}

export default EASAttest;
