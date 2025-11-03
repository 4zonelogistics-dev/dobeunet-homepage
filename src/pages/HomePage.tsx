import { useState } from 'react';
import Hero from '../components/Hero';
import Problems from '../components/Problems';
import Solutions from '../components/Solutions';
import SocialProof from '../components/SocialProof';
import CTA from '../components/CTA';
import ContactModal from '../components/ContactModal';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'strategy' | 'pilot'>('strategy');

  const handleOpenModal = (type: 'strategy' | 'pilot') => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <>
      <Hero onCTAClick={() => handleOpenModal('strategy')} />
      <Problems />
      <Solutions />
      <SocialProof />
      <CTA
        onStrategyClick={() => handleOpenModal('strategy')}
        onPilotClick={() => handleOpenModal('pilot')}
      />

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </>
  );
}
