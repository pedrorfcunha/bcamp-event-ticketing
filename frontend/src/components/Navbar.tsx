import React, { useState } from 'react';
import Modal from './Modal';

const Navbar = () => {
  const [isModalOpen, setOpenModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = name => {
    setActiveModal(name);
    setOpenModal(true);
  };

  return (
    <nav className="flex items-center justify-between space-between p-4 text-white border-b-[1px] border-gray-700">
      <img
        src="https://pliant.io/wp-content/uploads/2022/08/jira-logo.png"
        alt="event banner"
        className="h-[50px]  rounded-md"
      />
      <span className="flex gap-5">
        <button>Create Event</button>
        <button
          onClick={() => openModal(true)}
          className="bg-white px-4 py-3 text-black rounded-md font-bold"
        >
          Connect Wallet
        </button>
      </span>
      <Modal open={isModalOpen} onClose={() => setOpenModal(false)}>
        {activeModal === 'eventDetails' && (
          <div>
            <p className="hagrid text-2xl">TESTING</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt perspiciatis
              voluptate natus quibusdam quod quos voluptates nemo. Accusamus ab, perspiciatis autem
              veritatis accusantium, iure provident debitis repudiandae voluptas, ipsum quod! Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Incidunt perspiciatis voluptate
              natus quibusdam quod quos voluptates nemo. Accusamus ab, perspiciatis autem veritatis
              accusantium, iure provident debitis repudiandae voluptas, ipsum quod! Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Incidunt perspiciatis voluptate natus
              quibusdam quod quos voluptates nemo. Accusamus ab, perspiciatis autem veritatis
              accusantium, iure provident debitis repudiandae voluptas, ipsum quod! Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Incidunt perspiciatis voluptate natus
              quibusdam quod quos voluptates nemo. Accusamus ab, perspiciatis autem veritatis
              accusantium, iure provident debitis repudiandae voluptas, ipsum quod! Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Incidunt perspiciatis voluptate natus
              quibusdam quod quos voluptates nemo. Accusamus ab, perspiciatis autem veritatis
              accusantium, iure provident debitis repudiandae voluptas, ipsum quod!
            </p>
          </div>
        )}
      </Modal>
    </nav>
  );
};

export default Navbar;
