// Exemplo de como consumir a API no Frontend (Vite/React)

// 1. Crie um arquivo: src/services/api.ts

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface Distro {
  id: string;
  name: string;
  description: string;
  family: string;
  desktopEnvironments: string[];
  releaseDate: string;
  website: string;
}

export const distroService = {
  // Listar todas as distros
  async getAllDistros(): Promise<Distro[]> {
    const response = await fetch(`${API_URL}/distros`);
    if (!response.ok) {
      throw new Error('Failed to fetch distros');
    }
    return response.json();
  },

  // Obter uma distro específica
  async getDistroById(id: string): Promise<Distro> {
    const response = await fetch(`${API_URL}/distros/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch distro ${id}`);
    }
    return response.json();
  },

  // Pesquisar distros
  async searchDistros(query: string): Promise<Distro[]> {
    const response = await fetch(`${API_URL}/distros?search=${query}`);
    if (!response.ok) {
      throw new Error('Failed to search distros');
    }
    return response.json();
  },

  // Filtrar por família
  async getByFamily(family: string): Promise<Distro[]> {
    const response = await fetch(`${API_URL}/distros?family=${family}`);
    if (!response.ok) {
      throw new Error('Failed to filter distros');
    }
    return response.json();
  }
};

// 2. No seu componente React:

import { useEffect, useState } from 'react';
import { distroService, Distro } from '@/services/api';

export function DistroList() {
  const [distros, setDistros] = useState<Distro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    distroService
      .getAllDistros()
      .then(setDistros)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {distros.map(distro => (
        <div key={distro.id}>
          <h3>{distro.name}</h3>
          <p>{distro.description}</p>
        </div>
      ))}
    </div>
  );
}

// 3. Em .env.local (desenvolvimento):
// VITE_API_URL=http://localhost:8000/api

// 4. Em .env.production (vercel):
// VITE_API_URL=https://seu-projeto.vercel.app/api
