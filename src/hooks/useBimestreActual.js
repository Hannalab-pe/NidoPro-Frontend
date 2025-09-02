import { useState, useEffect } from 'react';
import { bimestreService } from '../services/bimestreService';

export const useBimestreActual = () => {
  const [bimestre, setBimestre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBimestre = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bimestreService.getBimestreActual();
      setBimestre(data);
    } catch (err) {
      setError(err.message || 'Error al obtener bimestre actual');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBimestre();
  }, []);

  return { bimestre, loading, error, refetch: fetchBimestre };
};
