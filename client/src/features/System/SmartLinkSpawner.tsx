import { useRelayChannel } from '@/hooks/global/useRelay.js';
import useSmartLink from '@/hooks/global/useSmartLink.js';
import { useEffect, useState } from 'react';

const SmartLinkSpawner = () => {
  const [eId, setEId] = useState<string | null>(null);
  const [glossaryId, setGlossaryId] = useState<string | null>(null);

  useRelayChannel({
    id: 'smart-link-spawner',
    onComplete: ({ data }: { data: any }) => {
      if (data.entryId) setEId(data.entryId);
      if (data.glossaryId) setGlossaryId(data.glossaryId);
    },
    removeAfterConsume: true, // immediately nuke the relay after consuming
  });

  const { runSmartLinkSync } = useSmartLink({
    glossaryId: glossaryId || '',
    entryId: eId || '',
  });

  useEffect(() => {
    console.log(eId, glossaryId);
    if (eId && glossaryId) {
      runSmartLinkSync();
      // reset state
      setEId(null);
      setGlossaryId(null);
    }
  }, [eId, glossaryId]);

  return <></>;
};

export default SmartLinkSpawner;
