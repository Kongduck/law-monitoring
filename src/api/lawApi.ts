import axios from 'axios';
import { Law, LawAmendment } from '../types/law';

const API_BASE_URL = 'http://localhost:4000/api';

export const getLaws = async (): Promise<Law[]> => {
  const response = await axios.get(`${API_BASE_URL}/laws`);
  return response.data;
};

export const getLawById = async (id: string): Promise<Law> => {
  const response = await axios.get(`${API_BASE_URL}/laws/${id}`);
  return response.data;
};

export const updateLaw = async (law: Law): Promise<Law> => {
  const response = await axios.put(`${API_BASE_URL}/laws/${law.id}`, law);
  return response.data;
};

export const createLawAmendment = async (amendment: Omit<LawAmendment, 'id'>): Promise<LawAmendment> => {
  const response = await axios.post(`${API_BASE_URL}/amendments`, amendment);
  return response.data;
};

export const updateLawAmendment = async (amendment: LawAmendment): Promise<LawAmendment> => {
  const response = await axios.put(`${API_BASE_URL}/law-amendments/${amendment.id}`, amendment);
  return response.data;
}; 