'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AiTwotoneCalendar } from 'react-icons/ai';
import CustomButton from './Button';
import { RiCalendar2Fill } from 'react-icons/ri';
import { HiLocationMarker } from 'react-icons/hi';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import Modal from './Modal';

type Props = {
  id: number;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  pricing: number;
  path: string;
  eventDescription: string;
  helpLine: string;
};

const Card = ({
  id,
  eventName,
  eventLocation,
  eventDate,
  pricing,
  path,
  eventDescription,
  helpLine,
}: Props) => {
  // MODAL STATES
  const [isModalOpen, setOpenModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  //
  const [name, setName] = useState('');
  const [userAddr, setUserAddr] = useState('');
  const [userId, setUserId] = useState('');
  const [submitUID, setSubmitUID] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const paymentHandler = async e => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessingPayment(true);

    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: pricing * 100 }),
    }).then(res => res.json());

    const {
      paymentIntent: { client_secret },
    } = response;

    const paymentResult = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'John',
        },
      },
    });

    setIsProcessingPayment(false);

    if (paymentResult.error) {
      alert(paymentResult.error);
    } else {
      if (paymentResult.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
      }
    }

    switchInterface('ticket');
  };

  const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
  const WALLET_SECRET = process.env.REACT_APP_WALLET_SECRET;
  const WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;

  function convertDateStringToTimestamp(dateString: string): number {
    const parts = dateString.match(/(\w+) (\d+)-\d+, (\d+)/);
    if (!parts || parts.length !== 4) {
      throw new Error('Invalid date string format');
    }
    const [_, month, day, year] = parts;
    const date = new Date(`${month} ${day}, ${year}`);
    return date.getTime();
  }

  // MODAL CONTROLS
  const openModal = name => {
    setActiveModal(name);
    setOpenModal(true);
  };

  const switchInterface = name => {
    setActiveModal(name);
  };

  const submitAttestation = async () => {
    setSubmitUID('');

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const wallet = new ethers.Wallet(WALLET_SECRET);
    const connectedWallet = wallet.connect(provider);

    const eas = new EAS(EASContractAddress);
    eas.connect(connectedWallet);

    const schemaEncoder = new SchemaEncoder(
      'uint256 eventId, string name, string location, uint256 date, address userAddr, uint256 userId',
    );
    const encodedData = schemaEncoder.encodeData([
      { name: 'eventId', value: id, type: 'uint256' },
      { name: 'name', value: eventName, type: 'string' },
      { name: 'location', value: eventLocation, type: 'string' },
      { name: 'date', value: convertDateStringToTimestamp(eventDate), type: 'uint256' },
      { name: 'userAddr', value: userAddr, type: 'address' },
      { name: 'userId', value: userId, type: 'uint256' },
    ]);

    const schemaUID = '0x9c36743493dcb4de49932a078cde4f2bc52ee9289064cd2e4a8c390f3737051e';
    console.log(eas);
    console.log('test');

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

    alert(`New Event Ticket emitted likend to the attestation(UID): ${newAttestationUID}`);
  };

  function handleClick() {
    window.open(
      `https://sepolia.easscan.org/attestation/view/${submitUID}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <div className="p-3 rounded-md" key={id}>
      <img src={path} alt="event banner" className="w-full rounded-md h-[180px]" />
      <h3 className="font-extrabold text-white mt-3">{eventName}</h3>
      <p className="text-[#ddd]">U$ {pricing.toFixed(2)}</p>
      <span className="text-[#707070] flex items-center gap-2 ">
        <AiTwotoneCalendar /> {eventDate}
      </span>
      <button
        className="p-2 text-gray-700 border-[1px] transition duration-300 ease-in-out border-gray-700 w-full mt-3 rounded-md font-bold hover:text-black hover:border-white hover:bg-white"
        onClick={() => openModal('eventDetails')}
      >
        More info
      </button>
      <Modal open={isModalOpen} onClose={() => setOpenModal(false)}>
        {activeModal === 'eventDetails' && (
          <div>
            <p className="hagrid text-2xl text-white">{eventName}</p>
            <p className="text-slate-300 text-sm flex items-center gap-3">
              <HiLocationMarker />
              {eventLocation}
            </p>
            <p className="text-slate-300 text-sm flex items-center gap-3">
              <RiCalendar2Fill />
              {eventDate}
            </p>
            <img src={path} alt="" className="w-full h-[200px] my-3 rounded-md" />
            <div className="flex justify-between items-center text-slate-300">
              <h3 className="text-2xl">U$ {pricing.toFixed(2)}</h3>
              <button
                className="bg-gray-300 px-6 py-2 rounded-md text-black"
                onClick={() => switchInterface('checkout')}
              >
                Pay
              </button>
            </div>
            <p className="uppercase text-sm mt-3 font-bold text-white">Description</p>
            <p className="mt-3 text-slate-300">{eventDescription}</p>
            <p className="text-slate-300 text-sm mt-3">
              For clarifications and information, call: <span className="italic">{helpLine}</span>
            </p>
          </div>
        )}
        {activeModal === 'checkout' && (
          <div>
            <p className="hagrid text-2xl text-white">{eventName}</p>
            <p className="text-slate-300 text-sm flex items-center gap-3">
              <HiLocationMarker />
              {eventLocation}
            </p>
            <p className="text-slate-300 text-sm flex items-center gap-3">
              <RiCalendar2Fill />
              {eventDate}
            </p>
            <img src={path} alt="" className="w-[460px] h-[200px] my-3 rounded-md" />
            <div className="my-5 bg-white">
              <CardElement></CardElement>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <h3 className="text-2xl">U$ {pricing.toFixed(2)}</h3>
              <button
                className="bg-gray-300 px-6 py-2 rounded-md text-black"
                onClick={paymentHandler}
                disabled={isProcessingPayment}
              >
                Pay
              </button>
            </div>
            <p className="text-slate-300 text-sm mt-3">
              For clarifications and information, call: <span className="italic">{helpLine}</span>
            </p>
          </div>
        )}
        {activeModal === 'ticket' && (
          <div className="">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShqD1BwMrXrMOkyfasMWkpS06Mvv6wkLCIaQ&usqp=CAU"
                alt="event banner"
                className="h-[70px] w-[70px] rounded-md"
              />
              <div>
                <p className="hagrid text-xl text-white">{eventName}</p>
                <p className="text-slate-300 text-sm flex items-center gap-3">
                  <HiLocationMarker />
                  {eventLocation}
                </p>
                <p className="text-slate-300 text-sm flex items-center gap-3">
                  <RiCalendar2Fill className="text-slate-300" />
                  {eventDate}
                </p>
              </div>
            </div>

            <label htmlFor="name" className="text-white mt-[20px]">
              Name
            </label>
            <input
              type="text"
              className="w-[450px] p-2 mt-2 mb-4"
              placeholder="Input your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <label htmlFor="userId" className="text-white mt-[20px]">
              Government-Issued ID Number
            </label>
            <input
              type="text"
              className="w-[450px] p-2 mt-2 mb-4"
              placeholder="Input your ID"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <label htmlFor="userId" className="text-white mt-[20px]">
              Wallet address
            </label>
            <input
              type="text"
              className="w-[450px] p-2 mt-2 mb-4"
              placeholder="Input your address"
              value={userAddr}
              onChange={e => setUserAddr(e.target.value)}
            />
            <button
              onClick={submitAttestation}
              disabled={name === '' ? true : false}
              className="bg-gray-300 px-6 py-2 rounded-md text-black float-right mt-4"
            >
              Checkout
            </button>

            {loading && <p className="text-white mt-[20px]">Loading...</p>}
            {submitUID && (
              <button
                onClick={handleClick}
                className="bg-gray-300 px-6 py-2 rounded-md text-black float-right mt-4 mr-4"
              >
                Check you ticket data!
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Card;
